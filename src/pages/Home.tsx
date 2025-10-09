import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, Eye, Zap, Code, ArrowRight, Upload, FileImage, Video, Loader2 } from 'lucide-react';
import AccuracyMeter from '../components/AccuracyMeter';
import MagnifyingGlass from '../components/MagnifyingGlass';

const Home: React.FC = () => {
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
  const [selectedVideoFile, setSelectedVideoFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [detectionResult, setDetectionResult] = useState<{ result: string | null; confidence: number | null; isDeepfake: boolean | null }>({ result: null, confidence: null, isDeepfake: null });

  // Debug: Log state changes
  console.log("Home component - detectionResult:", detectionResult);
  console.log("Home component - isProcessing:", isProcessing);

  // Handle file selection
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>, type: 'image' | 'video') => {
    const file = event.target.files ? event.target.files[0] : null;
    if (file) {
      if (type === 'image') {
        setSelectedImageFile(file);
        setSelectedVideoFile(null);
      } else {
        setSelectedVideoFile(file);
        setSelectedImageFile(null);
      }
      setDetectionResult({ result: null, confidence: null, isDeepfake: null });
    }
  };

  // Handle detection
  const handleDetection = async () => {
    const file = selectedImageFile || selectedVideoFile;
    if (!file) {
      alert("Please select a file first.");
      return;
    }

    setIsProcessing(true);
    setDetectionResult({ result: null, confidence: null, isDeepfake: null });

    const formData = new FormData();
    formData.append("file", file);

    try {
      console.log("Sending request to API...");
      const response = await fetch("http://localhost:5000/api/detect", {
        method: "POST",
        body: formData,
      });

      console.log("Response status:", response.status);
      console.log("Response ok:", response.ok);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("API error response:", errorText);
        throw new Error("API response was not ok");
      }

      const data = await response.json();
      console.log("API response data:", data);
      
      const isFake = data.is_deepfake;
      const resultText = isFake ? "Fake" : "Authentic";
      const confidence = data.confidence;

      console.log("Setting detection result:", { result: resultText, confidence, isDeepfake: isFake });
      setDetectionResult({ result: resultText, confidence, isDeepfake: isFake });

    } catch (error) {
      console.error("API call failed:", error);
      setDetectionResult({ result: "Error", confidence: null, isDeepfake: null });
      alert("Failed to analyze image. Please check the console for details.");
    } finally {
      setIsProcessing(false);
    }
  };

  // Quick Features Section
  const quickFeatures = [
    { icon: <Zap className="h-6 w-6" />, title: 'Edge-ready', description: 'Optimized for real-time processing' },
    { icon: <Eye className="h-6 w-6" />, title: 'Explainability', description: 'Visual evidence and reasoning' },
    { icon: <Shield className="h-6 w-6" />, title: 'High Accuracy', description: '92%+ detection rate' },
    { icon: <Code className="h-6 w-6" />, title: 'API-first', description: 'Easy integration and scaling' }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-16 pb-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-teal-50 via-white to-blue-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Column */}
            <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }} className="text-center lg:text-left">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-slate-100 leading-tight mb-6">
                Detect Deepfakes — Fast, Accurate & Explainable
              </h1>
              <p className="text-lg md:text-xl text-gray-600 dark:text-slate-300 mb-8 leading-relaxed max-w-2xl">
                Upload an image or video and get an evidence-backed verdict with confidence score and real-time analysis.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link to="/demo" className="inline-flex items-center px-8 py-4 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 group">
                  Try Demo <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link to="/features" className="inline-flex items-center px-8 py-4 bg-white hover:bg-gray-50 dark:bg-slate-800 dark:hover:bg-slate-700 text-teal-600 dark:text-teal-400 font-semibold rounded-lg border-2 border-teal-200 hover:border-teal-300 dark:border-teal-600 dark:hover:border-teal-500 transition-all duration-300">
                  Explore Features
                </Link>
              </div>
            </motion.div>

            {/* Right Column */}
            <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.2 }} className="relative">
              <div className="relative bg-white dark:bg-slate-800 rounded-2xl shadow-2xl p-6 max-w-md mx-auto">
                <div className="text-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-slate-100">Live Preview</h3>
                  <p className="text-sm text-gray-500 dark:text-slate-400">Real-time detection analysis</p>
                </div>

                <AccuracyMeter value={detectionResult.confidence} isDeepfake={detectionResult.isDeepfake} />

                <div className="mt-4 space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 dark:text-slate-400">Status:</span>
                    <span className={`px-2 py-1 rounded-full font-medium ${isProcessing ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'}`}>
                      {isProcessing ? 'Processing' : 'Active'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 dark:text-slate-400">Processing Speed:</span>
                    <span className="font-medium dark:text-slate-200">24ms</span>
                  </div>
                </div>
              </div>

              <MagnifyingGlass />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Quick Features */}
      <section className="py-16 bg-white dark:bg-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {quickFeatures.map((feature, index) => (
              <motion.div key={index} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: index * 0.1 }} viewport={{ once: true }} className="text-center p-6 rounded-xl bg-gray-50 hover:bg-teal-50 dark:bg-slate-700 dark:hover:bg-slate-600 hover:shadow-md transition-all duration-300">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-teal-100 text-teal-600 dark:bg-teal-900 dark:text-teal-300 rounded-lg mb-4">{feature.icon}</div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-slate-100 mb-2">{feature.title}</h3>
                <p className="text-gray-600 dark:text-slate-300">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Deepfake Analysis Section */}
      <section className="py-16 bg-gray-50 dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} viewport={{ once: true }} className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-slate-100 mb-4">Analyze Your Media</h2>
            <p className="text-xl text-gray-600 dark:text-slate-300 max-w-3xl mx-auto">Upload an image or video to begin the deepfake detection process.</p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Image Upload */}
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.2 }} viewport={{ once: true }} className="flex flex-col items-center justify-center p-8 bg-white dark:bg-slate-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 text-center cursor-pointer">
              <label htmlFor="image-upload" className="flex flex-col items-center justify-center w-full h-full cursor-pointer">
                <FileImage className="h-12 w-12 text-gray-400 dark:text-slate-500 mb-4" />
                <p className="text-lg text-gray-600 dark:text-slate-200 font-semibold mb-2">Upload Image</p>
                <p className="text-sm text-gray-500 dark:text-slate-400">JPG, PNG files</p>
                <input id="image-upload" type="file" accept="image/*" onChange={(e) => handleFileChange(e, 'image')} className="hidden" />
              </label>
            </motion.div>

            {/* Video Upload */}
            <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.4 }} viewport={{ once: true }} className="flex flex-col items-center justify-center p-8 bg-white dark:bg-slate-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 text-center cursor-pointer">
              <label htmlFor="video-upload" className="flex flex-col items-center justify-center w-full h-full cursor-pointer">
                <Video className="h-12 w-12 text-gray-400 dark:text-slate-500 mb-4" />
                <p className="text-lg text-gray-600 dark:text-slate-200 font-semibold mb-2">Upload Video</p>
                <p className="text-sm text-gray-500 dark:text-slate-400">MP4, MOV files</p>
                <input id="video-upload" type="file" accept="video/*" onChange={(e) => handleFileChange(e, 'video')} className="hidden" />
              </label>
            </motion.div>
          </div>

          {/* Analyze Button and Result */}
          {(selectedImageFile || selectedVideoFile) && (
            <div className="mt-8 text-center">
              <p className="text-gray-600 dark:text-slate-300 mb-4">Selected File: <span className="font-semibold">{selectedImageFile?.name || selectedVideoFile?.name}</span></p>
              <button onClick={handleDetection} disabled={isProcessing} className="inline-flex items-center px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed">
                {isProcessing ? <><Loader2 className="animate-spin mr-2 h-5 w-5" />Analyzing...</> : <><Upload className="mr-2 h-5 w-5" />Start Analysis</>}
              </button>

              {/* Debug info */}
              <div className="mt-4 p-4 bg-gray-100 dark:bg-slate-700 rounded-lg text-sm">
                <p className="dark:text-slate-200">Debug Info:</p>
                <p className="dark:text-slate-200">Result: {detectionResult.result || 'null'}</p>
                <p className="dark:text-slate-200">Confidence: {detectionResult.confidence || 'null'}</p>
                <p className="dark:text-slate-200">Is Processing: {isProcessing ? 'true' : 'false'}</p>
              </div>

              {detectionResult.result && (
                <div className="mt-6">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-slate-100 mb-2">Detection Result</h3>
                  <div className={`inline-block px-4 py-2 rounded-lg font-bold text-lg ${detectionResult.result === "Authentic" ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200" : "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200"}`}>
                    {detectionResult.result}
                  </div>
                  {detectionResult.confidence !== null && (
                    <p className="mt-2 text-gray-700 dark:text-slate-300 font-medium">Confidence: {detectionResult.confidence}%</p>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;
