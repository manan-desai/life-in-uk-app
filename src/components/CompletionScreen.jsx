import React from 'react';

export default function CompletionScreen({ score, total, testId, navigate }) {
  const percentage = Math.round((score / total) * 100);
  const passed = percentage >= 75;

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="bg-gray-700 rounded-2xl shadow-lg p-8 text-center border border-gray-600">
        <div className={`text-6xl mb-4 ${passed ? 'animate-bounce' : ''}`}>
          {passed ? '🎉' : '📚'}
        </div>
        <h2 className="text-3xl font-bold mb-3 text-white">
          {testId.toUpperCase()} Complete!
        </h2>
        <div className={`text-5xl font-bold mb-4 ${passed ? 'text-green-400' : 'text-orange-400'}`}>
          {percentage}%
        </div>
        <p className="text-xl mb-2 text-gray-200">
          You scored <strong>{score}</strong> out of <strong>{total}</strong>
        </p>
        <div className={`inline-block px-6 py-3 rounded-full text-white font-semibold mb-6 shadow-sm ${passed ? 'bg-green-600' : 'bg-orange-500'}`}>
          {passed ? '✅ Pass (75% required)' : '⚠️ Keep Practicing (75% required)'}
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 justify-center mt-8">
          <button
            onClick={() => navigate('/review')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold text-base transition-all shadow-lg"
          >
            📚 Review Incorrect Answers
          </button>
          <button
            onClick={() => window.location.reload()}
            className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold text-base transition-all border-2 border-gray-600 hover:border-gray-500"
          >
            🔄 Retry This Test
          </button>
        </div>
      </div>
    </div>
  );
}

