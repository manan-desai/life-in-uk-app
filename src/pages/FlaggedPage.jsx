import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Checkbox } from '../ui/checkbox';
import QuickTestSelector from '../components/QuickTestSelector';

export default function FlaggedPage() {
  const navigate = useNavigate();
  const [flaggedQuestions, setFlaggedQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [checked, setChecked] = useState({});
  const [showNext, setShowNext] = useState(false);
  const [isCorrectAnswer, setIsCorrectAnswer] = useState(null);

  useEffect(() => {
    const flaggedOnly = JSON.parse(localStorage.getItem('flaggedQuestions') || '[]');
    setFlaggedQuestions(flaggedOnly);
  }, []);

  const q = flaggedQuestions[currentIndex];
  if (!q) return <div className="p-4 bg-gray-800 min-h-screen text-white text-center text-xl pt-20">No flagged questions found.</div>;

  const isMultiple = q.correctAnswers.length > 1;
  const selected = answers[currentIndex] || [];
  const wasChecked = checked[currentIndex];

  const toggleOption = (opt) => {
    const correctCount = q.correctAnswers.length;
    setAnswers(prev => {
      const curr = prev[currentIndex] || [];
      const updated = curr.includes(opt)
        ? curr.filter(o => o !== opt)
        : correctCount === 1
        ? [opt]
        : [...curr, opt];
      return { ...prev, [currentIndex]: updated };
    });
  };

  const checkAnswer = () => {
    const correct = q.correctAnswers;
    const selected = answers[currentIndex] || [];
    const isCorrect = selected.length === correct.length && correct.every(a => selected.includes(a));
    setChecked(prev => ({ ...prev, [currentIndex]: true }));
    setIsCorrectAnswer(isCorrect);
    setShowNext(true);
  };

  const nextQuestion = () => {
    if (currentIndex < flaggedQuestions.length - 1) {
      setCurrentIndex(i => i + 1);
      setShowNext(checked[currentIndex + 1] === true);
      setIsCorrectAnswer(null);
    } else {
      navigate('/');
    }
  };

  const prevQuestion = () => {
    if (currentIndex > 0) {
      setCurrentIndex(i => i - 1);
      setShowNext(checked[currentIndex - 1] === true);
      setIsCorrectAnswer(null);
    }
  };

  const handleDelete = () => {
    if (!window.confirm('Delete this question from flagged list?')) return;
    const updated = flaggedQuestions.filter(q => q !== flaggedQuestions[currentIndex]);
    localStorage.setItem('flaggedQuestions', JSON.stringify(updated));
    setFlaggedQuestions(updated);
  };

  return (
    <div className="p-4 mt-4 max-w-5xl mx-auto bg-gray-800 min-h-screen">
      <QuickTestSelector />
      <div className="max-w-3xl mx-auto">
        <div className="w-full bg-gray-700 shadow-lg rounded-2xl p-8 border border-gray-600">
        <div className="mb-6 pb-4 border-b border-gray-600">
          <div className="flex items-center justify-between mb-3">
            <div className="text-sm font-semibold text-orange-300 bg-orange-900/40 px-4 py-2 rounded-full border border-orange-700">
              🚩 Flagged - {q.testId.toUpperCase()}
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleDelete}
                className="px-3 py-2 rounded-lg font-medium transition-all text-sm bg-gray-800 hover:bg-red-900/30 text-red-400 border-2 border-gray-600 hover:border-red-800"
              >
                🗑️ Remove Flag
              </button>
            </div>
          </div>
          <div className="flex items-center justify-center gap-2">
            <div className="flex-1 h-2 bg-gray-600 rounded-full overflow-hidden">
              <div 
                className="h-full bg-orange-500 transition-all duration-300 ease-out"
                style={{ width: `${((currentIndex + 1) / flaggedQuestions.length) * 100}%` }}
              />
            </div>
            <span className="text-sm font-semibold text-gray-300 min-w-fit">
              {currentIndex + 1} / {flaggedQuestions.length}
            </span>
          </div>
        </div>
          
        <p className="font-semibold mb-6 text-xl text-white leading-relaxed">{q.question}</p>

        {isMultiple && (
          <div className="mb-4">
            <span className="inline-block bg-amber-900/40 text-amber-300 px-4 py-2 rounded-lg text-sm font-semibold border border-amber-700">
              ⚠️ Multiple answers required - Select {q.correctAnswers.length} options
            </span>
          </div>
        )}

        <div className="grid grid-cols-1 gap-3">
          {q.options.map((opt, idx) => {
            const selectedOpt = selected.includes(opt);
            const isCorrect = q.correctAnswers.includes(opt);
            return (
              <label
                key={idx}
                className={`px-5 py-4 rounded-lg flex items-center gap-3 cursor-pointer transition-all border-2
                  ${!wasChecked && !selectedOpt ? 'bg-gray-800 border-gray-600 hover:border-blue-500 hover:bg-gray-750 text-gray-200' : ''}
                  ${!wasChecked && selectedOpt ? 'bg-blue-900/40 border-blue-500 text-white' : ''}
                  ${wasChecked && isCorrect ? 'bg-green-900/40 border-green-500 text-white' : ''}
                  ${wasChecked && selectedOpt && !isCorrect ? 'bg-red-900/40 border-red-500 text-white' : ''}
                  ${wasChecked && !selectedOpt && !isCorrect ? 'bg-gray-800 border-gray-600 opacity-50 text-gray-400' : ''}
                `}
              >
                {isMultiple ? (
                  <Checkbox
                    checked={selectedOpt}
                    onCheckedChange={() => toggleOption(opt)}
                    disabled={wasChecked}
                  />
                ) : (
                  <input
                    type="radio"
                    name={`flagged-${currentIndex}`}
                    checked={selectedOpt}
                    onChange={() => toggleOption(opt)}
                    disabled={wasChecked}
                    className="w-5 h-5 accent-blue-600"
                  />
                )}
                <span className="flex-1 text-base font-medium">{opt}</span>
                {wasChecked && isCorrect && (
                  <span className="text-green-600 font-bold text-xl">✓</span>
                )}
                {wasChecked && selectedOpt && !isCorrect && (
                  <span className="text-red-600 font-bold text-xl">✗</span>
                )}
              </label>
            );
          })}
        </div>

        {wasChecked && (
          <div className="mt-6">
            <div className={`rounded-lg p-5 border-2 ${isCorrectAnswer ? 'bg-green-900/30 border-green-600' : 'bg-red-900/30 border-red-600'}`}>
              <div className={`font-bold text-lg mb-2 flex items-center gap-2 ${isCorrectAnswer ? 'text-green-300' : 'text-red-300'}`}>
                {isCorrectAnswer ? (
                  <>
                    <span className="text-2xl">✅</span>
                    <span>Correct!</span>
                  </>
                ) : (
                  <>
                    <span className="text-2xl">❌</span>
                    <span>Incorrect</span>
                  </>
                )}
              </div>
              {q.explanation && (
                <div className="text-gray-200 leading-relaxed mt-3 bg-gray-800/60 p-4 rounded-lg border border-gray-600">
                  <strong className="text-white">Explanation:</strong> {q.explanation}
                </div>
              )}
            </div>
          </div>
        )}

        <div className="flex flex-wrap gap-3 mt-8 justify-center border-t border-gray-600 pt-6">
          {currentIndex > 0 && (
            <button
              onClick={prevQuestion}
              className="px-6 py-3 text-base font-semibold bg-gray-700 hover:bg-gray-600 text-white rounded-lg border-2 border-gray-600 hover:border-gray-500 transition-all"
            >
              ← Previous
            </button>
          )}
          {!wasChecked && (
            <button
              onClick={checkAnswer}
              disabled={selected.length === 0}
              className="px-8 py-3 text-base bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-lg rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-blue-600"
            >
              Check Answer
            </button>
          )}
          {showNext && (
            <button
              onClick={nextQuestion}
              className="px-8 py-3 text-base bg-green-600 hover:bg-green-700 text-white font-semibold shadow-lg rounded-lg transition-all"
            >
              {currentIndex === flaggedQuestions.length - 1 ? 'Finish Flagged →' : 'Next Question →'}
            </button>
          )}
        </div>
      </div>
      </div>
    </div>
  );
}

