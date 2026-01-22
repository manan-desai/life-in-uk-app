import React from 'react';
import BurgerMenu from './BurgerMenu';
import TestDropdown from './TestDropdown';
import DesktopNav from './DesktopNav';

export default function Header() {
  return (
    <header className="bg-gray-900 border-b border-gray-800 shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <a href="/" className="flex items-center space-x-3 hover:opacity-80 transition">
            <div>
              <h1 className="text-xl md:text-2xl font-bold tracking-tight text-white">Life in the UK Test</h1>
              <p className="text-gray-400 text-xs md:text-sm">Free Practice & Exam Preparation</p>
            </div>
          </a>
          
          <div className="flex items-center gap-3">
            <TestDropdown />
            <DesktopNav />
            <BurgerMenu />
          </div>
        </div>
      </div>
    </header>
  );
}

