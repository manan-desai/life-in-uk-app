import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 border-t border-gray-800 py-6 mt-12">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center text-sm text-gray-400">
          <p>
            Made with ❤️ by the community |{' '}
            <a 
              href="https://github.com/manan-desai/life-in-uk-app" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-blue-400 hover:text-blue-300 underline"
            >
              Open Source on GitHub
            </a>{' '}
            | MIT License
          </p>
          <p className="mt-2 text-xs text-gray-500">
            Unofficial practice resource • Visit{' '}
            <a href="https://www.gov.uk/life-in-the-uk-test" target="_blank" rel="noopener noreferrer" className="underline hover:text-gray-400">
              gov.uk
            </a>{' '}
            for official information
          </p>
        </div>
      </div>
    </footer>
  );
}

