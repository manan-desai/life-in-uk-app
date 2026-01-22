import React from 'react';
import { useNavigate } from 'react-router-dom';
import ExamGrid from './components/ExamGrid';
import TestGrid from './components/TestGrid';
import FeatureCard from './components/FeatureCard';
import ContributeSection from './components/ContributeSection';

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-800">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-4">
            Life in the UK Test Practice
          </h1>
          <p className="text-xl text-gray-300 mb-8">
            Free practice tests for your British citizenship exam
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <button
              onClick={() => navigate('/exam/exam-1')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg font-semibold rounded-lg shadow-lg transition-all transform hover:scale-105"
            >
              🚀 Start Practice Now
            </button>
            <button
              onClick={() => navigate('/review')}
              className="bg-gray-700 hover:bg-gray-600 text-white px-8 py-4 text-lg font-semibold rounded-lg border-2 border-gray-600 hover:border-blue-500 transition-all"
            >
              📚 Review Incorrect
            </button>
            <button
              onClick={() => navigate('/flagged')}
              className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-4 text-lg font-semibold rounded-lg transition-all"
            >
              🚩 Flagged Questions
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <FeatureCard 
            icon="📝"
            title="90+ Practice Tests"
            description="17 full mock exams plus 73 practice tests covering all topics"
          />
          <FeatureCard 
            icon="✅"
            title="Instant Feedback"
            description="Get immediate results with detailed explanations for every question"
          />
          <FeatureCard 
            icon="📊"
            title="Track Progress"
            description="Review incorrect answers, flag difficult questions, and monitor completion"
          />
        </div>

        <ExamGrid />
        <TestGrid />
        <ContributeSection />

        <div className="text-center mt-8 text-sm text-gray-500">
          <p>
            This is an unofficial practice resource. Visit{' '}
            <a href="https://www.gov.uk/life-in-the-uk-test" target="_blank" rel="noopener noreferrer" className="underline">
              gov.uk
            </a>{' '}
            for official information.
          </p>
        </div>
      </div>
    </div>
  );
}
