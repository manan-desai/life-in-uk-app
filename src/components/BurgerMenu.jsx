import React, { useState } from 'react';
import { Button } from '../ui/button';

export default function BurgerMenu() {
  const [isOpen, setIsOpen] = useState(false);

  const handleClearData = () => {
    if (window.confirm("Clear all progress? This cannot be undone.")) {
      localStorage.clear();
      window.location.href = '/';
    }
  };

  return (
    <div className="relative md:hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-lg hover:bg-gray-700 transition-colors"
        aria-label="Menu"
      >
        <svg className="w-6 h-6 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          {isOpen ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          )}
        </svg>
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-64 bg-gray-800 rounded-lg shadow-xl border border-gray-700 z-50 overflow-hidden">
            <div className="p-4 border-b border-gray-700">
              <h3 className="font-semibold text-white text-lg">Menu</h3>
            </div>
            
            <div className="p-2">
              <a
                href="/"
                className="block px-4 py-3 text-gray-300 hover:bg-gray-700 rounded-lg transition-colors"
              >
                🏠 Home
              </a>
              <a
                href="/review"
                className="block px-4 py-3 text-gray-300 hover:bg-gray-700 rounded-lg transition-colors"
              >
                📚 Review Incorrect
              </a>
              <a
                href="/flagged"
                className="block px-4 py-3 text-gray-300 hover:bg-gray-700 rounded-lg transition-colors"
              >
                🚩 Flagged Questions
              </a>
            </div>

            <div className="p-4 border-t border-gray-700">
              <h4 className="text-sm font-semibold text-gray-400 mb-2">Settings</h4>
              <Button
                onClick={handleClearData}
                variant="outline"
                size="sm"
                className="w-full text-red-400 border-red-800 hover:bg-red-900/20"
              >
                🗑️ Clear All Progress
              </Button>
              <p className="text-xs text-gray-500 mt-2">Remove all saved progress and data</p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

