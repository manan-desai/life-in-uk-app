import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './HomePage';
import ExamPage from './pages/ExamPage';
import ReviewPage from './pages/ReviewPage';
import FlaggedPage from './pages/FlaggedPage';

export default function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/exam/:examId" element={<ExamPage />} />
          <Route path="/test/:testId" element={<ExamPage />} />
          <Route path="/review" element={<ReviewPage />} />
          <Route path="/flagged" element={<FlaggedPage />} />
        </Routes>
      </Layout>
    </Router>
  );
}
