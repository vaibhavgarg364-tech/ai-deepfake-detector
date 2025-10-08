import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Shield, 
  Eye, 
  Video, 
  Activity, 
  Database, 
  Code,
  X,
  Check
} from 'lucide-react';
import { FeatureCard } from '../types';

const Features: React.FC = () => {
  const [selectedFeature, setSelectedFeature] = useState<FeatureCard | null>(null);

  const features: FeatureCard[] = [
    {
      id: 'accuracy',
      title: 'Real-time Detection',
      description: 'Instant analysis of uploaded media files',
      icon: 'shield',
      details: [
        'Upload images or videos for immediate analysis',
        'Get results within seconds of submission',
        'Support for multiple file formats and sizes'
      ]
    },
    {
      id: 'explainability',
      title: 'Visual Evidence',
      description: 'Clear explanations with highlighted regions',
      icon: 'eye',
      details: [
        'Heatmap overlays showing suspicious areas',
        'Confidence scores for each detection',
        'Frame-by-frame analysis for video content'
      ]
    },
    {
      id: 'forensics',
      title: 'Multi-format Support',
      description: 'Works with images, videos, and live streams',
      icon: 'video',
      details: [
        'Support for JPG, PNG, MP4, MOV, and more',
        'Batch processing for multiple files',
        'Real-time stream analysis capabilities'
      ]
    },
    {
      id: 'monitoring',
      title: 'API Integration',
      description: 'Easy integration with existing systems',
      icon: 'activity',
      details: [
        'RESTful API with comprehensive documentation',
        'Webhook support for automated workflows',
        'SDKs available for popular programming languages'
      ]
    },
    {
      id: 'batch',
      title: 'Detailed Reports',
      description: 'Comprehensive analysis with exportable data',
      icon: 'database',
      details: [
        'JSON and CSV export formats available',
        'Detailed metadata and analysis results',
        'Historical data tracking and comparison'
      ]
    },
    {
      id: 'api',
      title: 'Enterprise Ready',
      description: 'Scalable solution for business needs',
      icon: 'code',
      details: [
        'High availability with 99.9% uptime',
        'Scalable infrastructure for large volumes',
        'Enterprise security and compliance features'
      ]
    }
  ];

  const getIcon = (iconName: string) => {
    const iconMap: { [key: string]: React.ReactNode } = {
      shield: <Shield className="h-8 w-8" />,
      eye: <Eye className="h-8 w-8" />,
      video: <Video className="h-8 w-8" />,
      activity: <Activity className="h-8 w-8" />,
      database: <Database className="h-8 w-8" />,
      code: <Code className="h-8 w-8" />
    };
    return iconMap[iconName] || <Shield className="h-8 w-8" />;
  };

  return (
    <div className="min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Powerful Features
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Comprehensive deepfake detection capabilities designed for professional use
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-lg p-6 cursor-pointer hover:shadow-xl transition-all duration-300 group"
              onClick={() => setSelectedFeature(feature)}
            >
              <div className="flex items-center justify-center w-16 h-16 bg-teal-100 text-teal-600 rounded-lg mb-6 group-hover:bg-teal-200 transition-colors">
                {getIcon(feature.icon)}
              </div>
              
              <h3 className="text-xl font-semibold text-gray-900 mb-3 group-hover:text-teal-600 transition-colors">
                {feature.title}
              </h3>
              
              <p className="text-gray-600 mb-4">
                {feature.description}
              </p>
              
              <div className="flex items-center text-teal-600 font-medium group-hover:translate-x-2 transition-transform">
                Learn more →
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {selectedFeature && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={() => setSelectedFeature(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="flex items-center justify-center w-12 h-12 bg-teal-100 text-teal-600 rounded-lg">
                    {getIcon(selectedFeature.icon)}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">
                    {selectedFeature.title}
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedFeature(null)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              {/* Description */}
              <p className="text-gray-600 mb-6">
                {selectedFeature.description}
              </p>

              {/* Details */}
              <div className="space-y-3">
                <h4 className="font-semibold text-gray-900">Key Capabilities:</h4>
                {selectedFeature.details.map((detail, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <Check className="h-5 w-5 text-teal-600 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-600">{detail}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Features;