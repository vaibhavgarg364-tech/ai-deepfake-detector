import React from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MessageSquare, MapPin } from 'lucide-react';

const Contact: React.FC = () => {
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
            Get In Touch
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Available for SIH projects, college demos, and research collaborations
          </p>
        </motion.div>

        {/* Contact Cards */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {/* Phone Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="bg-white rounded-xl shadow-lg p-8 text-center"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 bg-teal-100 text-teal-600 rounded-full mb-6">
              <Phone className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Phone</h3>
            <p className="text-2xl font-bold text-teal-600 mb-4">+91 63992 25833</p>
            <p className="text-gray-600">
              Available for calls Mon-Fri, 9 AM - 6 PM IST
            </p>
          </motion.div>

          {/* Email Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="bg-white rounded-xl shadow-lg p-8 text-center"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 text-blue-600 rounded-full mb-6">
              <Mail className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Email</h3>
            <p className="text-2xl font-bold text-blue-600 mb-4">vaibhavgarg364@gmail.com</p>
            <p className="text-gray-600">
              Response within 24 hours for project inquiries
            </p>
          </motion.div>
        </div>

        {/* Services Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="bg-gradient-to-br from-teal-50 to-blue-50 rounded-xl p-8 mb-12"
        >
          <h2 className="text-2xl font-semibold text-gray-900 mb-6 text-center">
            Collaboration Opportunities
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 text-green-600 rounded-lg mb-4">
                <MessageSquare className="h-6 w-6" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">SIH Projects</h3>
              <p className="text-sm text-gray-600">
                Smart India Hackathon solutions and prototype development
              </p>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-100 text-purple-600 rounded-lg mb-4">
                <MapPin className="h-6 w-6" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">College Demos</h3>
              <p className="text-sm text-gray-600">
                Educational demonstrations and technical workshops
              </p>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-orange-100 text-orange-600 rounded-lg mb-4">
                <Mail className="h-6 w-6" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Research</h3>
              <p className="text-sm text-gray-600">
                Academic research collaborations and publications
              </p>
            </div>
          </div>
        </motion.div>

        {/* Quick Response Promise */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="bg-white rounded-xl shadow-lg p-8 text-center"
        >
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Ready to Collaborate?
          </h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Whether you're working on a Smart India Hackathon project, need a technical demonstration for your institution, or are interested in research collaboration, we're here to help bring advanced deepfake detection to your project.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="tel:+916399225833"
              className="inline-flex items-center px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <Phone className="mr-2 h-5 w-5" />
              Call Now
            </a>
            
            <a
              href="mailto:vaibhavgarg364@gmail.com?subject=DeepGuard Collaboration Inquiry"
              className="inline-flex items-center px-6 py-3 bg-white hover:bg-gray-50 text-teal-600 font-semibold rounded-lg border-2 border-teal-200 hover:border-teal-300 transition-all duration-300"
            >
              <Mail className="mr-2 h-5 w-5" />
              Send Email
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Contact;