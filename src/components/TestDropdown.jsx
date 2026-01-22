import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const examIds = Array.from({ length: 17 }, (_, i) => `exam-${i + 1}`);
const testIds = Array.from({ length: 73 }, (_, i) => `test-${i + 1}`);

export default function TestDropdown() {
  const { examId, testId } = useParams();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const currentId = examId || testId;

  if (!currentId) return null;

  const isExam = currentId?.startsWith('exam');
  const allIds = isExam ? examIds : testIds;
  const label = isExam ? 'Exam' : 'Test';
  const currentNumber = currentId?.split('-')[1];

  const handleSelect = (id) => {
    const path = isExam ? `/exam/${id}` : `/test/${id}`;
    navigate(path);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors text-gray-200 font-medium"
      >
        <span>{label} {currentNumber}</span>
        <svg 
          className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute left-0 mt-2 w-64 max-h-96 overflow-y-auto bg-gray-800 rounded-lg shadow-xl border border-gray-700 z-50">
            <div className="p-2">
              <div className="text-xs font-semibold text-gray-400 px-3 py-2">
                Select {label}
              </div>
              {allIds.map((id) => {
                const num = id.split('-')[1];
                const isCurrent = id === currentId;
                return (
                  <button
                    key={id}
                    onClick={() => handleSelect(id)}
                    className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                      isCurrent
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-300 hover:bg-gray-700'
                    }`}
                  >
                    {label} {num}
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

