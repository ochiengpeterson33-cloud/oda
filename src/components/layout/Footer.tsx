import React from 'react';
import { Building2, Mail, MapPin, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Footer = () => {
  return (
    <footer className="bg-surface border-t border-earth-sand/30 py-8 text-xs text-earth-gray-dark shrink-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div>&copy; {new Date().getFullYear()} Oda Marketplace. All Rights Reserved.</div>
          <div className="flex gap-6 uppercase tracking-widest font-medium">
            <Link to="/security" className="hover:text-earth-brown">Security</Link>
            <Link to="/privacy" className="hover:text-earth-brown">Privacy</Link>
            <Link to="/terms" className="hover:text-earth-brown">Terms</Link>
            <Link to="/status" className="hover:text-earth-brown">API Status</Link>
          </div>
          <div className="flex items-center gap-2 font-medium">
            <div className="w-2 h-2 rounded-full bg-green-500"></div>
            <span>Systems Operational</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
