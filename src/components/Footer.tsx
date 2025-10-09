import React from 'react';
import { Search, Mail, Phone } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-50 dark:bg-slate-800 border-t border-gray-200 dark:border-slate-700 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          {/* Logo and Copyright */}
          <div className="flex items-center space-x-2">
            <Search className="h-6 w-6 text-teal-600 dark:text-teal-400" />
            <span className="text-lg font-semibold text-gray-900 dark:text-slate-100">DeepGuard</span>
          </div>

          {/* Contact Info */}
          <div className="flex items-center space-x-6 text-sm text-gray-600 dark:text-slate-400">
            <div className="flex items-center space-x-2">
              <Mail className="h-4 w-4" />
              <span>vaibhavgarg364@gmail.com</span>
            </div>
            <div className="flex items-center space-x-2">
              <Phone className="h-4 w-4" />
              <span>+91 63992 25833</span>
            </div>
          </div>

          {/* Copyright */}
          <div className="text-sm text-gray-500 dark:text-slate-400">
            © 2025 DeepGuard. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;