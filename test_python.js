const { spawn } = require('child_process');

console.log('Testing Python integration...');

const python = spawn('python', ['deepfake_detector.py', 'uploads/1759898337476.JPG'], {
  cwd: process.cwd(),
  stdio: ['ignore', 'pipe', 'pipe']
});

let output = '';
let errorOutput = '';

python.stdout.on('data', (data) => {
  output += data.toString();
});

python.stderr.on('data', (data) => {
  errorOutput += data.toString();
});

python.on('close', (code) => {
  console.log('Exit code:', code);
  console.log('Output:', output);
  console.log('Error:', errorOutput);
  
  if (code === 0) {
    try {
      const result = JSON.parse(output);
      console.log('Parsed result:', result);
    } catch (e) {
      console.log('JSON parse error:', e);
    }
  }
});

python.on('error', (error) => {
  console.log('Process error:', error);
});
