import React, { useState, useCallback } from 'react';
import { Upload, AlertCircle } from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';
import AccuracyMeter from '../components/AccuracyMeter';

const Demo: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<{
    isDeepfake: boolean;
    confidence: number;
    regions?: { x: number; y: number; width: number; height: number }[];
  } | null>(null);
  const [error, setError] = useState('');

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.type.startsWith('image/')) {
      setFile(droppedFile);
      setError('');
    } else {
      setError('Please upload an image file');
    }
  }, []);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && selectedFile.type.startsWith('image/')) {
      setFile(selectedFile);
      setError('');
    } else {
      setError('Please select an image file');
    }
  }, []);

  const handleSubmit = async () => {
    if (!file) return;

    setIsProcessing(true);
    setError('');

    try {
      console.log("Demo: Sending request to API...");
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('http://localhost:5000/api/detect', {
        method: 'POST',
        body: formData,
      });

      console.log("Demo: Response status:", response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Demo: API error response:", errorText);
        throw new Error('Failed to analyze image');
      }

      const data = await response.json();
      console.log("Demo: API response data:", data);
      
      setResult({
        isDeepfake: data.is_deepfake,
        confidence: data.confidence,
        regions: data.regions || []
      });
    } catch (err) {
      console.error("Demo: API call failed:", err);
      setError('Failed to process image. Please try again.');
      alert("Failed to analyze image. Please check the console for details.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          Deepfake Detection Demo
        </h1>

        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center ${
            error ? 'border-red-400 bg-red-50' : 'border-gray-300 hover:border-teal-400'
          } transition-colors`}
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          role="button"
          tabIndex={0}
          aria-label="Drop zone for image upload"
        >
          {isProcessing ? (
            <div className="space-y-4">
              <LoadingSpinner size="lg" />
              <p className="text-gray-600">Analyzing image...</p>
            </div>
          ) : (
            <>
              <Upload className="mx-auto h-12 w-12 text-gray-400" />
              <p className="mt-4 text-lg text-gray-600">
                Drag and drop your image here, or{' '}
                <label className="text-teal-600 hover:text-teal-500 cursor-pointer">
                  browse
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleFileSelect}
                  />
                </label>
              </p>
              <p className="mt-2 text-sm text-gray-500">Supports JPG, PNG up to 10MB</p>
            </>
          )}
        </div>

        {error && (
          <div className="mt-4 p-4 bg-red-50 rounded-lg flex items-center text-red-800" role="alert">
            <AlertCircle className="h-5 w-5 mr-2" />
            <span>{error}</span>
          </div>
        )}

        {file && !isProcessing && !result && (
          <div className="mt-4 flex justify-center">
            <button
              onClick={handleSubmit}
              className="btn btn-primary"
              disabled={isProcessing}
            >
              Analyze Image
            </button>
          </div>
        )}

        {result && (
          <div className="mt-8 space-y-6">
            <div className="card p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Analysis Results</h2>
              <div className="space-y-4">
                <AccuracyMeter 
                  value={result.confidence} 
                  isDeepfake={result.isDeepfake}
                />
                {result.regions && result.regions.length > 0 && (
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      Detected Manipulations
                    </h3>
                    <p className="text-gray-600">
                      {result.regions.length} region{result.regions.length !== 1 ? 's' : ''} of 
                      potential manipulation detected
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Demo;