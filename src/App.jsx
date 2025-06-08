// src/router.jsx
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  Navigate
} from 'react-router-dom';
import ExamPage from './ExamPage';
import ReviewPage from './ReviewPage';

const router =  createBrowserRouter(
  createRoutesFromElements(
  <>
      <Route path="exam/:examId" element={<ExamPage />} />
      <Route path="test/:testId" element={<ExamPage />} />
      <Route path="review" element={<ReviewPage />} />
    </>
  ),
  {
    basename: '/life-in-uk-app', // 👈 Important
  }
)

export default router;
