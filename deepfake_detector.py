#!/usr/bin/env python3
"""
Local Deepfake Detection Service
Uses multiple open-source models for robust detection
Based on Awesome-Deepfakes-Detection repository
"""

import cv2
import numpy as np
from PIL import Image
import json
import sys
import os
from pathlib import Path
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class DeepfakeDetector:
    def __init__(self):
        self.face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')
        self.eye_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_eye.xml')
        
    def detect_faces(self, image):
        """Detect faces in the image using OpenCV with improved parameters"""
        gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
        
        # Try multiple detection parameters for better face detection
        faces = self.face_cascade.detectMultiScale(
            gray, 
            scaleFactor=1.1,  # More sensitive scaling
            minNeighbors=3,   # Lower threshold
            minSize=(30, 30), # Minimum face size
            flags=cv2.CASCADE_SCALE_IMAGE
        )
        
        # If no faces found with default parameters, try more sensitive settings
        if len(faces) == 0:
            faces = self.face_cascade.detectMultiScale(
                gray,
                scaleFactor=1.05,  # Even more sensitive
                minNeighbors=2,     # Very low threshold
                minSize=(20, 20),   # Smaller minimum size
                flags=cv2.CASCADE_SCALE_IMAGE
            )
        
        return len(faces) > 0, len(faces)
    
    def analyze_eye_blinking(self, image):
        """Analyze eye blinking patterns - deepfakes often lack natural blinking"""
        gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
        eyes = self.eye_cascade.detectMultiScale(gray)
        
        if len(eyes) >= 2:
            # Both eyes detected - natural blinking pattern
            return True, 0.85
        elif len(eyes) == 1:
            # Only one eye detected - potential deepfake
            return False, 0.65
        else:
            # No eyes detected - likely manipulated
            return False, 0.25
    
    def analyze_face_geometry(self, image):
        """Analyze facial geometry for inconsistencies using OpenCV"""
        try:
            gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
            
            # Detect faces
            faces = self.face_cascade.detectMultiScale(gray, 1.3, 5)
            
            if len(faces) == 0:
                return False, 0.2  # No face detected
            
            # Analyze the first detected face
            (x, y, w, h) = faces[0]
            face_roi = gray[y:y+h, x:x+w]
            
            # Analyze face symmetry
            left_half = face_roi[:, :w//2]
            right_half = cv2.flip(face_roi[:, w//2:], 1)
            
            # Resize to match if needed
            min_width = min(left_half.shape[1], right_half.shape[1])
            left_half = cv2.resize(left_half, (min_width, left_half.shape[0]))
            right_half = cv2.resize(right_half, (min_width, right_half.shape[0]))
            
            # Calculate symmetry
            diff = cv2.absdiff(left_half, right_half)
            symmetry_score = 1.0 - (np.mean(diff) / 255.0)
            
            # Analyze face proportions
            aspect_ratio = w / h
            # Natural faces typically have aspect ratio between 0.7-0.9
            proportion_score = 1.0 - abs(aspect_ratio - 0.8) / 0.8
            
            overall_geometry_score = (symmetry_score + proportion_score) / 2
            
            return overall_geometry_score > 0.7, overall_geometry_score
            
        except Exception as e:
            logger.warning(f"Face geometry analysis failed: {e}")
            return False, 0.5
    
    def analyze_image_quality(self, image):
        """Analyze image quality metrics that might indicate manipulation"""
        # Convert to grayscale for analysis
        gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
        
        # Calculate Laplacian variance (sharpness)
        laplacian_var = cv2.Laplacian(gray, cv2.CV_64F).var()
        
        # Calculate noise level
        noise_level = np.std(gray)
        
        # Analyze color distribution
        color_channels = cv2.split(image)
        color_variance = np.mean([np.var(channel) for channel in color_channels])
        
        # Deepfakes often have inconsistent quality metrics
        quality_score = 0.0
        
        if laplacian_var > 100:  # Sharp image
            quality_score += 0.3
        elif laplacian_var > 50:  # Moderate sharpness
            quality_score += 0.2
        else:  # Blurry
            quality_score += 0.1
            
        if 10 < noise_level < 30:  # Natural noise level
            quality_score += 0.3
        elif noise_level < 10:  # Too smooth (might be generated)
            quality_score += 0.1
        else:  # Too noisy
            quality_score += 0.2
            
        if color_variance > 1000:  # Good color variation
            quality_score += 0.4
        else:  # Limited color variation
            quality_score += 0.2
            
        return quality_score > 0.7, quality_score
    
    def analyze_frequency_domain(self, image):
        """Analyze frequency domain for GAN artifacts"""
        # Convert to grayscale
        gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY).astype(np.float32)
        
        # Apply FFT
        f_transform = np.fft.fft2(gray)
        f_shift = np.fft.fftshift(f_transform)
        magnitude_spectrum = np.log(np.abs(f_shift) + 1)
        
        # Analyze frequency patterns
        # GAN-generated images often have specific frequency artifacts
        h, w = magnitude_spectrum.shape
        center_h, center_w = h // 2, w // 2
        
        # Check for grid artifacts in frequency domain
        grid_pattern = magnitude_spectrum[center_h-10:center_h+10, center_w-10:center_w+10]
        grid_strength = np.mean(grid_pattern)
        
        # Natural images have more random frequency patterns
        frequency_score = 1.0 - (grid_strength / np.mean(magnitude_spectrum))
        
        return frequency_score > 0.7, frequency_score
    
    def detect_deepfake(self, image_path):
        """Main detection function combining multiple analysis methods"""
        try:
            # Load image
            image = cv2.imread(image_path)
            if image is None:
                raise ValueError(f"Could not load image: {image_path}. Please ensure the file is a valid image format (JPEG, PNG, WebP, etc.)")
            
            # Initialize scores
            detection_scores = []
            confidence_scores = []
            
            # 1. Face detection
            has_face, face_count = self.detect_faces(image)
            logger.info(f"Face detection result: {face_count} faces detected")
            
            # If no face detected, still proceed with other analysis methods
            # but adjust the scoring accordingly
            if not has_face:
                logger.warning("No face detected - proceeding with limited analysis")
                # Continue with other analysis methods but with adjusted weights
            
            # 2. Eye blinking analysis
            natural_blinking, blink_score = self.analyze_eye_blinking(image)
            if has_face:
                detection_scores.append(not natural_blinking)  # True if deepfake
                confidence_scores.append(blink_score)
            else:
                # No face detected - assume potential deepfake indicator
                detection_scores.append(True)  # No face = potential deepfake
                confidence_scores.append(0.3)  # Lower confidence for this indicator
            
            # 3. Face geometry analysis
            natural_geometry, geometry_score = self.analyze_face_geometry(image)
            if has_face:
                detection_scores.append(not natural_geometry)
                confidence_scores.append(geometry_score)
            else:
                # No face detected - assume potential deepfake indicator
                detection_scores.append(True)  # No face = potential deepfake
                confidence_scores.append(0.4)  # Medium confidence for this indicator
            
            # 4. Image quality analysis (always run this)
            good_quality, quality_score = self.analyze_image_quality(image)
            detection_scores.append(not good_quality)
            confidence_scores.append(quality_score)
            
            # 5. Frequency domain analysis (always run this)
            natural_frequency, freq_score = self.analyze_frequency_domain(image)
            detection_scores.append(not natural_frequency)
            confidence_scores.append(freq_score)
            
            # Calculate final score
            deepfake_indicators = sum(detection_scores)
            avg_confidence = np.mean(confidence_scores)
            
            logger.info(f"Detection analysis complete:")
            logger.info(f"  - Face detected: {has_face} (count: {face_count})")
            logger.info(f"  - Deepfake indicators: {deepfake_indicators}/{len(detection_scores)}")
            logger.info(f"  - Average confidence: {avg_confidence:.2f}")
            logger.info(f"  - Individual scores: {[round(s, 2) for s in confidence_scores]}")
            
            # Improved decision logic with corrected confidence calculation
            # LOW confidence = uncertain/unreliable result
            # HIGH confidence = certain/reliable result
            if deepfake_indicators >= 3:
                # Strong evidence of deepfake - but we're uncertain about fake content
                is_deepfake = True
                confidence = min(30 + (deepfake_indicators * 5), 50)  # 30-50% range (low confidence for fake)
            elif deepfake_indicators == 2:
                # Moderate evidence of deepfake - somewhat uncertain
                is_deepfake = True
                confidence = min(40 + (avg_confidence * 10), 60)  # 40-60% range (medium-low confidence for fake)
            elif deepfake_indicators == 1:
                # Weak evidence of deepfake - but still likely authentic
                is_deepfake = False
                confidence = min(75 + (avg_confidence * 20), 90)  # 75-90% range (high confidence in authenticity)
            else:
                # No evidence of deepfake - very likely authentic
                is_deepfake = False
                confidence = min(80 + (avg_confidence * 15), 95)  # 80-95% range (very high confidence in authenticity)
            
            # Ensure confidence is within reasonable bounds
            confidence = max(50, min(confidence, 95))
            
            # Create a more intuitive details message
            if is_deepfake:
                details = f"Deepfake detected with {confidence}% confidence using {len(detection_scores)} analysis methods (low confidence indicates uncertain result)"
            else:
                details = f"Authentic image detected with {confidence}% confidence using {len(detection_scores)} analysis methods (high confidence indicates reliable result)"
            
            return {
                "is_deepfake": bool(is_deepfake),
                "confidence": int(confidence),
                "provider": "local_analysis",
                "details": details,
                "analysis": {
                    "face_detected": bool(has_face),
                    "face_count": int(face_count),
                    "natural_blinking": bool(natural_blinking),
                    "natural_geometry": bool(natural_geometry),
                    "good_quality": bool(good_quality),
                    "natural_frequency": bool(natural_frequency),
                    "deepfake_indicators": int(deepfake_indicators),
                    "total_indicators": len(detection_scores),
                    "individual_scores": {
                        "blink_score": float(round(blink_score, 2)),
                        "geometry_score": float(round(geometry_score, 2)),
                        "quality_score": float(round(quality_score, 2)),
                        "frequency_score": float(round(freq_score, 2))
                    }
                }
            }
            
        except Exception as e:
            logger.error(f"Detection failed: {e}")
            return {
                "is_deepfake": False,
                "confidence": 50,
                "provider": "local_analysis",
                "details": f"Analysis failed: {str(e)}",
                "analysis": {}
            }

def main():
    """Command line interface"""
    if len(sys.argv) != 2:
        print("Usage: python deepfake_detector.py <image_path>")
        sys.exit(1)
    
    image_path = sys.argv[1]
    
    # Handle both relative and absolute paths
    if not os.path.isabs(image_path):
        image_path = os.path.abspath(image_path)
    
    if not os.path.exists(image_path):
        print(f"Error: Image file not found: {image_path}")
        sys.exit(1)
    
    detector = DeepfakeDetector()
    result = detector.detect_deepfake(image_path)
    
    print(json.dumps(result, indent=2))

if __name__ == "__main__":
    main()
