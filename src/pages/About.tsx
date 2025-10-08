import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Users, Microscope } from 'lucide-react';

const About: React.FC = () => {
  return (
    <div className="min-h-screen py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            About DeepGuard
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Protecting digital media integrity with AI-powered detection
          </p>
        </motion.div>

        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="prose prose-lg max-w-none mb-16"
        >
          <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
            <p className="text-gray-700 leading-relaxed mb-6">
              DeepGuard is an advanced deepfake detection platform that helps identify manipulated media content. Using state-of-the-art AI models, we analyze images and videos to detect signs of digital manipulation, providing clear results with visual explanations.
            </p>
            
            <p className="text-gray-700 leading-relaxed">
              Our platform serves journalists verifying news content, researchers studying digital forensics, and content moderators protecting online platforms. With fast processing times and detailed analysis reports, DeepGuard makes deepfake detection accessible and reliable for professional use.
            </p>
          </div>
        </motion.div>

        {/* Target Users */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="grid md:grid-cols-3 gap-8"
        >
          <div className="text-center p-6 bg-white rounded-xl shadow-lg">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 text-blue-600 rounded-full mb-4">
              <Users className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Journalists</h3>
            <p className="text-gray-600">
              Verify news content and maintain editorial integrity with reliable detection results.
            </p>
          </div>

          <div className="text-center p-6 bg-white rounded-xl shadow-lg">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-teal-100 text-teal-600 rounded-full mb-4">
              <Microscope className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Researchers</h3>
            <p className="text-gray-600">
              Study digital media manipulation with advanced analysis tools and detailed reporting.
            </p>
          </div>

          <div className="text-center p-6 bg-white rounded-xl shadow-lg">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 text-green-600 rounded-full mb-4">
              <Shield className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Moderators</h3>
            <p className="text-gray-600">
              Protect online platforms with automated detection and content moderation tools.
            </p>
          </div>
        </motion.div>

        {/* Illustration placeholder */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-16 text-center"
        >
          <div className="bg-gradient-to-br from-teal-50 to-blue-50 rounded-xl p-12 shadow-inner">
            <div className="max-w-2xl mx-auto">
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                Trusted Performance
              </h3>
              <p className="text-gray-600 mb-8">
                Our AI models are trained on diverse datasets to provide reliable detection across different types of media manipulation.
              </p>
              <div className="grid grid-cols-3 gap-8 text-center">
                <div>
                  <div className="text-3xl font-bold text-teal-600 mb-2">92%+</div>
                  <div className="text-sm text-gray-600">Accuracy Rate</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-teal-600 mb-2">24ms</div>
                  <div className="text-sm text-gray-600">Processing Time</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-teal-600 mb-2">99.9%</div>
                  <div className="text-sm text-gray-600">Uptime</div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default About;