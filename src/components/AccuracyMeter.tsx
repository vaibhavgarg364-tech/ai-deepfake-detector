import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

// Interface ko update kiya gaya hai: ab yeh 'isDeepfake' boolean bhi lega
interface AccuracyMeterProps {
  value: number | null; // Confidence score (e.g., 91)
  isDeepfake: boolean | null; // Deepfake verdict (True/False)
}

const AccuracyMeter: React.FC<AccuracyMeterProps> = ({ value, isDeepfake }) => {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    if (value !== null) {
      // Confidence ko 0-100 range mein rakho agar zaroori ho
      setDisplayValue(value); 
    }
  }, [value]);

  if (value === null || isDeepfake === null) {
    return (
      <div className="bg-white rounded-lg p-6 shadow-lg">
        <div className="text-center text-gray-500 text-sm">
          No analysis result to display.
        </div>
      </div>
    );
  }

  // --- Logic for dynamic values ---
  const verdictText = isDeepfake ? 'Deepfake' : 'Authentic';
  const confidenceScore = displayValue || 0;
  
  // Color ko verdict ke basis par set karo
  const resultColor = isDeepfake ? '#dc2626' : '#10b981'; // Red for Deepfake, Green for Authentic
  const resultTextColor = isDeepfake ? 'text-red-600' : 'text-green-600';

  let likelihoodText = 'Low';
  if (confidenceScore >= 90) {
    likelihoodText = 'Very High';
  } else if (confidenceScore >= 80) {
    likelihoodText = 'High';
  } else if (confidenceScore >= 70) {
    likelihoodText = 'Medium';
  }
  // ---------------------------------

  return (
    <div className="bg-white rounded-lg p-6 shadow-lg">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Detection Confidence</h3>
      
      {/* Circular Progress */}
      <div className="relative w-32 h-32 mx-auto mb-4">
        <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 120 120">
          {/* Background circle */}
          <circle
            cx="60"
            cy="60"
            r="50"
            fill="none"
            stroke="#e5e7eb"
            strokeWidth="8"
          />
          {/* Progress circle (Stroke color dynamic kiya gaya hai) */}
          <motion.circle
            cx="60"
            cy="60"
            r="50"
            fill="none"
            stroke={resultColor} // <-- Dynamic Color
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={314}
            animate={{ strokeDashoffset: 314 - (confidenceScore / 100) * 314 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
          />
        </svg>
        
        {/* Center text */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <motion.div
              className="text-2xl font-bold"
              style={{ color: resultColor }} // <-- Dynamic Color
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              key={confidenceScore}
            >
              {(confidenceScore || 0).toFixed(2)}%
            </motion.div>
            <div className="text-xs text-gray-500">Confidence</div>
          </div>
        </div>
      </div>

      <div className="space-y-2 text-sm text-gray-600">
        <div className="flex justify-between">
          <span>Result:</span>
          <span className={`font-medium ${resultTextColor}`}>
            {verdictText} {/* <-- Now shows Deepfake or Authentic */}
          </span>
        </div>
        <div className="flex justify-between">
          <span>Likelihood:</span>
          <span className="font-medium">{likelihoodText}</span> {/* <-- Now based on confidence score */}
        </div>
      </div>
    </div>
  );
};

export default AccuracyMeter;