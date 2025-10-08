#!/usr/bin/env python3
"""
Setup script for local deepfake detection
Installs required dependencies and tests the detection system
"""

import subprocess
import sys
import os
import json
from pathlib import Path

def install_requirements():
    """Install required Python packages"""
    print("Installing Python dependencies...")
    try:
        subprocess.check_call([sys.executable, "-m", "pip", "install", "-r", "requirements.txt"])
        print("SUCCESS: Dependencies installed successfully!")
        return True
    except subprocess.CalledProcessError as e:
        print(f"ERROR: Failed to install dependencies: {e}")
        return False

def test_detection():
    """Test the detection system with a sample image"""
    print("\nTesting detection system...")
    
    # Check if deepfake_detector.py exists
    if not os.path.exists("deepfake_detector.py"):
        print("ERROR: deepfake_detector.py not found!")
        return False
    
    # Check if uploads directory has images
    uploads_dir = Path("uploads")
    if not uploads_dir.exists():
        print("ERROR: uploads directory not found!")
        return False
    
    # Find a test image
    test_images = list(uploads_dir.glob("*.JPG")) + list(uploads_dir.glob("*.jpg")) + list(uploads_dir.glob("*.png"))
    if not test_images:
        print("ERROR: No test images found in uploads directory!")
        return False
    
    test_image = test_images[0]
    print(f"Testing with image: {test_image}")
    
    try:
        # Run the detector
        result = subprocess.run([
            sys.executable, "deepfake_detector.py", str(test_image)
        ], capture_output=True, text=True, timeout=30)
        
        if result.returncode == 0:
            # Parse the result
            detection_result = json.loads(result.stdout)
            print("SUCCESS: Detection test successful!")
            print(f"   Result: {'Deepfake' if detection_result['is_deepfake'] else 'Authentic'}")
            print(f"   Confidence: {detection_result['confidence']}%")
            print(f"   Provider: {detection_result['provider']}")
            return True
        else:
            print(f"ERROR: Detection test failed: {result.stderr}")
            return False
            
    except subprocess.TimeoutExpired:
        print("ERROR: Detection test timed out!")
        return False
    except Exception as e:
        print(f"ERROR: Detection test error: {e}")
        return False

def main():
    """Main setup function"""
    print("Setting up local deepfake detection...")
    print("=" * 50)
    
    # Check Python version
    if sys.version_info < (3, 7):
        print("ERROR: Python 3.7 or higher is required!")
        sys.exit(1)
    
    print(f"SUCCESS: Python {sys.version.split()[0]} detected")
    
    # Install dependencies
    if not install_requirements():
        print("\nERROR: Setup failed during dependency installation")
        sys.exit(1)
    
    # Test detection
    if not test_detection():
        print("\nERROR: Setup failed during detection test")
        sys.exit(1)
    
    print("\n" + "=" * 50)
    print("SUCCESS: Local deepfake detection setup completed successfully!")
    print("\nNext steps:")
    print("1. Restart your Node.js server: node server.cjs")
    print("2. The server will automatically use local detection")
    print("3. No API keys required - everything runs locally!")
    print("\nConfiguration options:")
    print("- USE_LOCAL_DETECTION=true (default)")
    print("- DETECTOR_MOCK=true (for testing without analysis)")

if __name__ == "__main__":
    main()
