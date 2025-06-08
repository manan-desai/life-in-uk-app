// App.jsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes, useParams, Navigate } from 'react-router-dom';
import ExamPage from './ExamPage';
import ReviewPage from './ReviewPage';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/exam/exam-1" />} />
 <Route path="/exam/:examId" element={<ExamPage />} />
<Route path="/test/:testId" element={<ExamPage />} />
        <Route path="/review" element={<ReviewPage />} />
      </Routes>
    </Router>
  );
} 



