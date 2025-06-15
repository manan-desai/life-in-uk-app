import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, Navigate } from 'react-router-dom';
import ExamPage from './ExamPage';
import ReviewPage from './ReviewPage';
import { Button } from './ui/button';
import FlaggedPage from './FlaggedPage';

const examIds = Array.from({ length: 17 }, (_, i) => `exam-${i + 1}`);
const testIds = Array.from({ length: 73 }, (_, i) => `test-${i + 1}`);

export default function App() {
  const existingCompleted = JSON.parse(localStorage.getItem('completedTests'));
  const [showExams, setShowExams] = useState(false);
  const [showTests, setShowTests] = useState(false);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/exam/exam-1" />} />
        <Route path="/exam/:examId" element={<ExamPage />} />
        <Route path="/test/:testId" element={<ExamPage />} />
        <Route path="/review" element={<ReviewPage />} />
        <Route path="/flagged" element={<FlaggedPage />} />
      </Routes>

      <footer className="p-4 bg-gray-100 shadow-inner border-t pb-24 text-center mt-80">
        <div className="max-w-4xl mx-auto space-y-4">
          <div>
            <Button variant="outline" onClick={() => setShowExams(!showExams)}>
              {showExams ? 'Hide Exams' : 'Show Exams'}
            </Button>
            {showExams && (
              <div className="mt-2 flex flex-wrap justify-center gap-2">
                {examIds.map((id) => (
                    <div key={id} className="space-x-1">
                  <a
                    key={id}
                    href={`/exam/${id}`}
                    className="px-3 py-1 bg-blue-100 text-blue-800 rounded hover:bg-blue-200 transition text-sm"
                  >
                    {id} {existingCompleted?.includes(id) && '(✔)'}
                  </a>
                      {/* <Link
      href={`/review?testId=${id}`}
      className="text-xs text-blue-600 hover:underline"
    >
      review
    </Link> */}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <Button variant="outline" onClick={() => setShowTests(!showTests)}>
              {showTests ? 'Hide Tests' : 'Show Tests'}
            </Button>
            {showTests && (
              <div className="mt-2 flex flex-wrap justify-center gap-2 max-h-40 overflow-y-auto">
                {testIds.map((id) => (
                    <div key={id} className="space-x-1">
                  <a
                    key={id}
                    href={`/test/${id}`}
                    className="px-3 py-1 bg-green-100 text-green-800 rounded hover:bg-green-200 transition text-sm"
                  >
                    {id} {existingCompleted?.includes(id) && '(✔)'}
                  </a>

                   {/* <Link
      href={`/review?testId=${id}`}
      className="text-xs text-blue-600 hover:underline"
    >
      review
    </Link> */}
                  
                  </div>
                  
                ))}
              </div>
            )}
          </div>





          <div className="flex justify-center gap-4 mt-4 flex-wrap">
            <a
              href="/review"
              className="px-4 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 transition font-semibold"
            >
              Review Incorrect
            </a>

              <a
              href="/flagged"
              className="px-4 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition font-semibold"
            >
             Flagged
            </a>

            <Button
  onClick={() => {
    if (window.confirm("Are you sure you want to clear all data? This cannot be undone.")) {
      localStorage.clear();
      window.location.reload();
    }
  }}
  className="bg-red-600 text-white hover:bg-red-700"
>
  Clear All
</Button>

          </div>
        </div>
      </footer>
    </Router>
  );
}
