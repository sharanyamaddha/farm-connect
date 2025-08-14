import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-green-700 text-white py-6 mt-12">
      <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
        <p className="text-sm">&copy; {new Date().getFullYear()} FarmConnect. All rights reserved.</p>
        <div className="flex space-x-4 mt-4 md:mt-0">
          <a href="#" className="hover:text-green-300">Privacy Policy</a>
          <a href="#" className="hover:text-green-300">Terms of Use</a>
          <a href="#" className="hover:text-green-300">Contact</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
