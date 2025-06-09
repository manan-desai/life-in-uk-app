import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link, Navigate } from 'react-router-dom';
import ExamPage from './ExamPage';
import ReviewPage from './ReviewPage';

// Example IDs (you can generate this list dynamically if needed)
const examIds = Array.from({ length: 17 }, (_, i) => `exam-${i + 1}`);
const testIds = Array.from({ length: 73 }, (_, i) => `test-${i + 1}`);

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/exam/exam-1" />} />
        <Route path="/exam/:examId" element={<ExamPage />} />
        <Route path="/test/:testId" element={<ExamPage />} />
        <Route path="/review" element={<ReviewPage />} />
      </Routes>

        <nav className="p-4 bg-gray-100 shadow-md flex flex-wrap justify-center gap-3 text-sm">
        {examIds.map((id) => (
          <Link
            key={id}
            to={`/exam/${id}`}
            className="px-3 py-1 bg-blue-100 text-blue-800 rounded hover:bg-blue-200 transition"
          >
            {id}
          </Link>
        ))}
        {testIds.map((id) => (
          <Link
            key={id}
            to={`/test/${id}`}
            className="px-3 py-1 bg-green-100 text-green-800 rounded hover:bg-green-200 transition"
          >
            {id}
          </Link>
        ))}
        <Link
          to="/review"
          className="px-4 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 transition font-semibold"
        >
          Review Incorrect
        </Link>
      </nav>
    </Router>
  );
}
