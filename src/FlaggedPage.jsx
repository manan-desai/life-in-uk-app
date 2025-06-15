import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { Checkbox } from './ui/checkbox';

export default function FlaggedPage() {
  const navigate = useNavigate();
  const [flaggedQuestions, setFlaggedQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [checked, setChecked] = useState({});
  const [showNext, setShowNext] = useState(false);
  const [isCorrectAnswer, setIsCorrectAnswer] = useState(null);

  useEffect(() => {
    const flaggedOnly =JSON.parse(localStorage.getItem('flaggedQuestions') || '[]');
    setFlaggedQuestions(flaggedOnly);
  }, []);

  const q = flaggedQuestions[currentIndex];
  if (!q) return <div className="p-4">No flagged questions found.</div>;

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
    <div className="p-4 mt-8 max-w-2xl mx-auto flex">
      <div className="w-full max-w-2xl bg-white shadow-lg rounded-2xl p-6">
            <div className="flex justify-between items-start">
                   <h2 className="text-2xl font-bold mb-4">Flagged – Q{currentIndex + 1}/{flaggedQuestions.length} ({q.testId})</h2>
                  <div className="flex gap-2">
                    <Button size="sm" variant="destructive" onClick={handleDelete}>Delete</Button>
                  </div>
                </div>
          
        <p className="text-lg font-medium mb-6">{q.question}</p>

        <div className="grid grid-cols-1 gap-4">
          {q.options.map((opt, idx) => {
            const selectedOpt = selected.includes(opt);
            const isCorrect = q.correctAnswers.includes(opt);
            return (
              <label
                key={idx}
                className={`px-4 py-3 rounded-md flex items-center gap-2 cursor-pointer transition-all
                  ${selectedOpt ? 'bg-blue-50' : 'bg-transparent'}
                  ${wasChecked && isCorrect ? 'ring-2 ring-green-400' : ''}
                  ${wasChecked && selectedOpt && !isCorrect ? 'ring-2 ring-red-400' : ''}
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
                    className="w-5 h-5"
                  />
                )}
                <span>{opt}</span>
              </label>
            );
          })}
        </div>

        {wasChecked && (
          <div className="mt-4 min-h-[60px] space-y-2">
            {isCorrectAnswer === false && (
              <div className="text-red-600 font-semibold">❌ Incorrect</div>
            )}
            {isCorrectAnswer === true && (
              <div className="text-green-600 font-semibold">✅ Correct</div>
            )}
            {q.explanation && (
              <p className="text-sm text-gray-700"><strong>Explanation:</strong> {q.explanation}</p>
            )}
          </div>
        )}

        <div className="flex flex-wrap gap-3 mt-6 justify-center">
          {currentIndex > 0 && (
            <Button variant="outline" onClick={prevQuestion}>Previous</Button>
          )}
          {!wasChecked && (
            <Button onClick={checkAnswer}>Check</Button>
          )}
          {showNext && (
            <Button onClick={nextQuestion} variant="outline">
              {currentIndex === flaggedQuestions.length - 1 ? 'Finish' : 'Next'}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
