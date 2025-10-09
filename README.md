# DeepGuard - Deepfake Detection Platform

A professional deepfake detection platform with **local open-source models** and advanced features. No external API keys required!

## Features

- **🔬 Local Deepfake Detection**: Uses open-source models based on [Awesome-Deepfakes-Detection](https://github.com/Daisy-Zhang/Awesome-Deepfakes-Detection)
- **🛡️ Multi-Method Analysis**: Face geometry, eye blinking, image quality, frequency domain analysis
- **📱 Multi-page Architecture**: Home, About, Features, Demo, Contact, Login, Signup
- **🎨 Interactive Elements**: Parallax magnifying glass, animated accuracy meter
- **💎 Professional Design**: Teal/white color palette with modern typography
- **📱 Responsive Layout**: Mobile-first design with accessibility features
- **🔍 Demo Functionality**: File upload with detailed analysis results
- **🔐 Authentication**: User login system with localStorage persistence
- **🚀 No API Keys Required**: Everything runs locally using open-source models

## Tech Stack

### Frontend
- React 18 with TypeScript
- React Router for navigation
- Tailwind CSS for styling
- Framer Motion for animations
- Lucide React for icons
- Vite for build tooling

### Backend
- Node.js with Express
- Python-based local detection models
- OpenCV for computer vision
- Face recognition libraries
- Frequency domain analysis

## Getting Started

### Quick Setup (Windows)
1. **Install Python 3.7+** from [python.org](https://python.org) if not already installed
2. **Run the setup script**:
   ```bash
   setup_local_detection.bat
   ```
3. **Start the servers**:
   ```bash
   # Terminal 1: Start backend
   node server.cjs
   
   # Terminal 2: Start frontend
   npm run dev
   ```

### Manual Setup

1. **Install Node.js dependencies**:
   ```bash
   npm install
   ```

2. **Install Python dependencies**:
   ```bash
   python setup_local_detection.py
   ```

3. **Start the servers**:
   ```bash
   # Terminal 1: Backend server
   node server.cjs
   
   # Terminal 2: Frontend development server
   npm run dev
   ```

4. **Access the application**:
   - Frontend: `http://localhost:5175/` (or port shown in terminal)
   - Backend API: `http://localhost:5000/`

## Detection Methods

The local detection system uses multiple analysis methods:

1. **Face Detection**: Verifies presence of faces in the image
2. **Eye Blinking Analysis**: Detects unnatural eye patterns common in deepfakes
3. **Face Geometry Analysis**: Checks for facial symmetry and natural proportions
4. **Image Quality Analysis**: Analyzes sharpness, noise, and color distribution
5. **Frequency Domain Analysis**: Detects GAN-specific artifacts in the frequency spectrum

## Configuration

Environment variables (optional):
- `USE_LOCAL_DETECTION=true` (default) - Use local detection models
- `DETECTOR_MOCK=true` - Use mock mode for testing
- `REALITY_DEFENDER_API_KEY=key` - Use external API (legacy)

## Build for Production

```bash
npm run build
```

## Contact

- Email: rohitrawat8954531718@gmail.com
-LinkedIN: https://www.linkedin.com/in/rohit-rawat-0677aa372?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app 
Available for SIH projects, college demos, and research collaborations.
