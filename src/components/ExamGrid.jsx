import React from 'react';
import { useNavigate } from 'react-router-dom';

const examIds = Array.from({ length: 17 }, (_, i) => `exam-${i + 1}`);

export default function ExamGrid() {
  const navigate = useNavigate();
  const existingCompleted = JSON.parse(localStorage.getItem('completedTests') || '[]');

  return (
    <div className="bg-gray-700 rounded-xl shadow-lg p-8 mb-8 border border-gray-600">
      <h2 className="text-2xl font-bold mb-4 text-white">Official Mock Exams</h2>
      <p className="text-gray-300 mb-6">
        17 full-length practice exams matching the official test format (24 questions each)
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
        {examIds.map((id) => (
          <button
            key={id}
            onClick={() => navigate(`/exam/${id}`)}
            className={`px-4 py-3 rounded-lg font-semibold transition-all border-2 ${
              existingCompleted.includes(id)
                ? 'bg-green-600 border-green-500 text-white hover:bg-green-700'
                : 'bg-gray-800 border-gray-600 text-gray-200 hover:bg-gray-900 hover:border-blue-500 hover:text-blue-400'
            }`}
          >
            {id.replace('exam-', 'Exam ')}
            {existingCompleted.includes(id) && <span className="ml-1">✓</span>}
          </button>
        ))}
      </div>
    </div>
  );
}

