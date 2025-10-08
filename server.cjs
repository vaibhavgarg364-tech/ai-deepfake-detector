const express = require('express');
const multer = require('multer');
const fs = require('fs');
const axios = require('axios');
const FormData = require('form-data');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Multer setup for file uploads
const upload = multer({ 
  dest: 'uploads/',
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
  // Removed fileFilter to allow more flexibility - let Python handle format validation
});

// Environment variables
const USE_LOCAL_DETECTION = String(process.env.USE_LOCAL_DETECTION || 'true').toLowerCase() === 'true';
const DETECTOR_MOCK = String(process.env.DETECTOR_MOCK || 'false').toLowerCase() === 'true';

// Determine detection mode
if (DETECTOR_MOCK) {
  console.warn('[DeepGuard] Mock mode enabled. No analysis will be performed.');
} else if (USE_LOCAL_DETECTION) {
  console.info('[DeepGuard] Local detection mode enabled. Using open-source models.');
} else {
  console.info('[DeepGuard] External API mode enabled.');
}

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    ok: true, 
    mock: DETECTOR_MOCK,
    local_detection: USE_LOCAL_DETECTION,
    mode: DETECTOR_MOCK ? 'mock' : (USE_LOCAL_DETECTION ? 'local' : 'external_api')
  });
});

// API route
app.post('/api/detect', (req, res) => {
  upload.single('file')(req, res, async (err) => {
    if (err) {
      console.error('Multer error:', err);
      return res.status(400).json({ error: err.message });
    }
    
    await handleDetection(req, res);
  });
});

async function handleDetection(req, res) {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  console.log('File received:', req.file.path);
  console.log('File details:', {
    originalname: req.file.originalname,
    mimetype: req.file.mimetype,
    size: req.file.size,
    path: req.file.path
  });

  const uploadedFilePath = req.file.path;

  try {
    if (DETECTOR_MOCK) {
      // Simple heuristic mock: filenames containing "fake" are treated as deepfakes
      const name = (req.file.originalname || '').toLowerCase();
      const isDeepfake = name.includes('fake');
      // More realistic confidence values with some randomness
      const baseConfidence = isDeepfake ? 87 : 82;
      const randomVariation = Math.floor(Math.random() * 6) - 3; // -3 to +3
      const confidence = Math.max(75, Math.min(95, baseConfidence + randomVariation));
      
      const mockResponse = {
        is_deepfake: isDeepfake,
        confidence,
        provider: 'mock',
        detail: 'Mock mode enabled; no analysis performed.'
      };
      console.log('Mock response:', mockResponse);
      return res.json(mockResponse);
    }

    if (USE_LOCAL_DETECTION) {
      // Use local Python-based detection
      const { spawn } = require('child_process');
      
      return new Promise((resolve, reject) => {
        // Wait a moment for file to be fully written
        setTimeout(() => {
          // Check if file exists and is readable
          if (!fs.existsSync(uploadedFilePath)) {
            console.error('File not found:', uploadedFilePath);
            console.error('Available files in uploads directory:');
            try {
              const uploadsDir = 'uploads';
              if (fs.existsSync(uploadsDir)) {
                const files = fs.readdirSync(uploadsDir);
                console.error('Files in uploads:', files);
              } else {
                console.error('Uploads directory does not exist');
              }
            } catch (e) {
              console.error('Error reading uploads directory:', e.message);
            }
            return reject(new Error('Uploaded file not found'));
          }
          
          // Check file size to ensure it's fully written
          const stats = fs.statSync(uploadedFilePath);
          if (stats.size === 0) {
            console.error('File is empty:', uploadedFilePath);
            return reject(new Error('Uploaded file is empty'));
          }
          
          const python = spawn('python', ['deepfake_detector.py', uploadedFilePath], {
            cwd: process.cwd(),
            stdio: ['ignore', 'pipe', 'pipe']
          });
          
          let output = '';
          let errorOutput = '';
          
          // Set timeout
          const timeout = setTimeout(() => {
            python.kill();
            
            // Clean up the uploaded file on timeout
            try {
              fs.unlinkSync(uploadedFilePath);
              console.log('Uploaded file cleaned up after timeout:', uploadedFilePath);
            } catch (cleanupError) {
              console.warn('Failed to clean up uploaded file after timeout:', cleanupError.message);
            }
            
            reject(new Error('Detection timeout'));
          }, 30000); // 30 seconds timeout
          
          python.stdout.on('data', (data) => {
            output += data.toString();
          });
          
          python.stderr.on('data', (data) => {
            errorOutput += data.toString();
          });
          
          python.on('close', (code) => {
            clearTimeout(timeout);
            
            if (code !== 0) {
              console.error('Python detection failed:');
              console.error('Exit code:', code);
              console.error('Error output:', errorOutput);
              console.error('Standard output:', output);
              
              // Clean up the uploaded file on Python failure
              try {
                fs.unlinkSync(uploadedFilePath);
                console.log('Uploaded file cleaned up after Python failure:', uploadedFilePath);
              } catch (cleanupError) {
                console.warn('Failed to clean up uploaded file after Python failure:', cleanupError.message);
              }
              
              return reject(new Error(`Detection failed with code ${code}: ${errorOutput}`));
            }
            
            try {
              const result = JSON.parse(output);
              console.log('Local detection response:', result);
              
              // Clean up the uploaded file after successful processing
              try {
                fs.unlinkSync(uploadedFilePath);
                console.log('Uploaded file cleaned up:', uploadedFilePath);
              } catch (cleanupError) {
                console.warn('Failed to clean up uploaded file:', cleanupError.message);
              }
              
              resolve(res.json(result));
            } catch (parseError) {
              console.error('Failed to parse detection result:');
              console.error('Parse error:', parseError);
              console.error('Raw output:', output);
              
              // Clean up the uploaded file on parse error
              try {
                fs.unlinkSync(uploadedFilePath);
                console.log('Uploaded file cleaned up after parse error:', uploadedFilePath);
              } catch (cleanupError) {
                console.warn('Failed to clean up uploaded file after parse error:', cleanupError.message);
              }
              
              reject(new Error('Invalid detection result format'));
            }
          });
          
          python.on('error', (error) => {
            clearTimeout(timeout);
            console.error('Python process error:', error);
            
            // Clean up the uploaded file on error
            try {
              fs.unlinkSync(uploadedFilePath);
              console.log('Uploaded file cleaned up after error:', uploadedFilePath);
            } catch (cleanupError) {
              console.warn('Failed to clean up uploaded file after error:', cleanupError.message);
            }
            
            reject(new Error(`Failed to start Python process: ${error.message}`));
          });
        }, 500); // Wait 500ms for file to be fully written
      });
    }

    // External API mode (legacy)
    const REALITY_DEFENDER_API_KEY = process.env.REALITY_DEFENDER_API_KEY;
    const REALITY_DEFENDER_URL = process.env.REALITY_DEFENDER_URL || 'https://api.realitydefender.com/v2/detect';
    
    if (!REALITY_DEFENDER_API_KEY) {
      return res.status(500).json({ error: 'Server misconfiguration: REALITY_DEFENDER_API_KEY missing' });
    }

    const formData = new FormData();
    formData.append('media', fs.createReadStream(uploadedFilePath));

    const response = await axios.post(REALITY_DEFENDER_URL, formData, {
      headers: {
        Authorization: `Bearer ${REALITY_DEFENDER_API_KEY}`,
        ...formData.getHeaders(),
      },
      maxBodyLength: Infinity,
      maxContentLength: Infinity,
      timeout: 120000,
    });

    console.log('Reality Defender API response:', response.data);
    return res.json(response.data);
  } catch (error) {
    const upstream = error.response?.data;
    console.error('Error during deepfake detection:', error.message);
    if (upstream) {
      console.error('Upstream response error:', upstream);
    }
    
    // Clean up the uploaded file on main error
    if (uploadedFilePath) {
      try {
        fs.unlinkSync(uploadedFilePath);
        console.log('Uploaded file cleaned up after main error:', uploadedFilePath);
      } catch (cleanupError) {
        console.warn('Failed to clean up uploaded file after main error:', cleanupError.message);
      }
    }
    
    return res.status(502).json({
      error: 'Deepfake detection failed',
      details: error.message,
      upstream,
    });
  } finally {
    // Note: File cleanup is handled in individual error cases
    // to avoid deleting the file before the Python script can read it
  }
}

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});