import React from 'react';
import { useNavigate } from 'react-router-dom';

const testIds = Array.from({ length: 73 }, (_, i) => `test-${i + 1}`);

export default function TestGrid() {
  const navigate = useNavigate();
  const existingCompleted = JSON.parse(localStorage.getItem('completedTests') || '[]');

  return (
    <div className="bg-gray-700 rounded-xl shadow-lg p-8 mb-8 border border-gray-600">
      <h2 className="text-2xl font-bold mb-4 text-white">Practice Tests</h2>
      <p className="text-gray-300 mb-6">
        73 additional practice tests for comprehensive preparation
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 max-h-96 overflow-y-auto p-2">
        {testIds.map((id) => (
          <button
            key={id}
            onClick={() => navigate(`/test/${id}`)}
            className={`px-4 py-3 rounded-lg font-semibold transition-all border-2 ${
              existingCompleted.includes(id)
                ? 'bg-green-600 border-green-500 text-white hover:bg-green-700'
                : 'bg-gray-800 border-gray-600 text-gray-200 hover:bg-gray-900 hover:border-indigo-500 hover:text-indigo-400'
            }`}
          >
            {id.replace('test-', 'Test ')}
            {existingCompleted.includes(id) && <span className="ml-1">✓</span>}
          </button>
        ))}
      </div>
    </div>
  );
}

