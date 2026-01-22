import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';

const examIds = Array.from({ length: 17 }, (_, i) => `exam-${i + 1}`);
const testIds = Array.from({ length: 73 }, (_, i) => `test-${i + 1}`);

export default function QuickTestSelector() {
  const navigate = useNavigate();
  const { examId, testId } = useParams();
  const location = useLocation();
  const currentId = examId || testId;
  const isExamRoute = location.pathname.startsWith('/exam');
  
  const [activeTab, setActiveTab] = useState(isExamRoute ? 'exams' : 'tests');
  const existingCompleted = JSON.parse(localStorage.getItem('completedTests') || '[]');

  // Auto-switch tab based on current route
  useEffect(() => {
    if (currentId) {
      setActiveTab(isExamRoute ? 'exams' : 'tests');
    }
  }, [currentId, isExamRoute]);

  const displayIds = activeTab === 'exams' ? examIds : testIds;
  const label = activeTab === 'exams' ? 'Exam' : 'Test';

  return (
    <div className="bg-gray-700 rounded-xl shadow-lg p-6 border border-gray-600 mb-8">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-white">Quick Access</h3>
        <div className="flex gap-2 bg-gray-800 rounded-lg p-1">
          <button
            onClick={() => setActiveTab('exams')}
            className={`px-4 py-2 rounded-md text-sm font-semibold transition-all ${
              activeTab === 'exams'
                ? 'bg-blue-600 text-white'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            Exams (17)
          </button>
          <button
            onClick={() => setActiveTab('tests')}
            className={`px-4 py-2 rounded-md text-sm font-semibold transition-all ${
              activeTab === 'tests'
                ? 'bg-blue-600 text-white'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            Tests (73)
          </button>
        </div>
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2 max-h-64 overflow-y-auto p-2">
        {displayIds.map((id) => {
          const num = id.split('-')[1];
          const isCompleted = existingCompleted.includes(id);
          const isActive = id === currentId;
          return (
            <button
              key={id}
              onClick={() => navigate(activeTab === 'exams' ? `/exam/${id}` : `/test/${id}`)}
              className={`px-3 py-2 rounded-lg font-semibold text-sm transition-all border-2 ${
                isActive
                  ? 'bg-blue-600 border-blue-500 text-white ring-2 ring-blue-400'
                  : isCompleted
                  ? 'bg-green-600 border-green-500 text-white hover:bg-green-700'
                  : 'bg-gray-800 border-gray-600 text-gray-200 hover:bg-gray-900 hover:border-blue-500 hover:text-blue-400'
              }`}
            >
              {num}
              {isCompleted && !isActive && <span className="ml-1 text-xs">✓</span>}
            </button>
          );
        })}
      </div>
    </div>
  );
}

