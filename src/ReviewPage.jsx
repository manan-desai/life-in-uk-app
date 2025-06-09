import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { Checkbox } from './ui/checkbox';

export default function ReviewPage() {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [checked, setChecked] = useState({});
  const [showNext, setShowNext] = useState(false);
  const [isCorrectAnswer, setIsCorrectAnswer] = useState(null);

  useEffect(() => {
    const failed = JSON.parse(localStorage.getItem('failedAnswers') || '[]');
    setQuestions(failed);
  }, []);

  const toggleOption = (option) => {
    const correctCount = questions[currentIndex].correctAnswers.length;
    setAnswers((prev) => {
      const current = prev[currentIndex] || [];
      const updated = current.includes(option)
        ? current.filter((o) => o !== option)
        : correctCount === 1
        ? [option]
        : [...current, option];
      return { ...prev, [currentIndex]: updated };
    });
  };

  const checkAnswer = () => {
    const selected = answers[currentIndex] || [];
    const correct = questions[currentIndex].correctAnswers;
    const isCorrect =
      selected.length === correct.length &&
      correct.every((ans) => selected.includes(ans));
    setChecked((prev) => ({ ...prev, [currentIndex]: true }));
    setIsCorrectAnswer(isCorrect);
    setShowNext(true);
  };

  const nextQuestion = () => {
    setShowNext(false);
    setIsCorrectAnswer(null);
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      navigate('/');
    }
  };

  if (!questions.length)
    return (
      <div className="p-4 text-lg font-medium">
        No failed questions found.
      </div>
    );

  const q = questions[currentIndex];
  const isMultiple = q.correctAnswers.length > 1;
  const selectedAnswers = answers[currentIndex] || [];

  return (
    <div className="p-4 max-w-2xl mx-auto justify-items-center flex ">
      <div className="w-full max-w-2xl bg-white shadow-lg rounded-2xl p-6 ">
             <div className="h-[300px] ">
        <h2 className="text-2xl font-bold mb-4">
          Review - Question {currentIndex + 1} of {questions.length}
        </h2>
        <p className="text-lg font-medium mb-6">{q.question}</p>

        <div className="grid grid-cols-2 gap-4">
          {q.options.map((opt, idx) => {
            const selected = selectedAnswers.includes(opt);
            const isCorrect = q.correctAnswers.includes(opt);
            const wasChecked = checked[currentIndex];

            return (
              <label
                key={idx}
                className={`px-4 py-3 rounded-md flex items-center gap-2 cursor-pointer transition-all
                  ${selected ? 'bg-blue-50' : 'bg-transparent'}
                  ${wasChecked && isCorrect ? 'ring-2 ring-green-400' : ''}
                `}
              >
                {isMultiple ? (
                  <Checkbox
                    checked={selected}
                    onCheckedChange={() => toggleOption(opt)}
                    disabled={wasChecked}
                  />
                ) : (
                  <input
                    type="radio"
                    name={`question-${currentIndex}`}
                    checked={selected}
                    onChange={() => toggleOption(opt)}
                    disabled={wasChecked}
                    className="w-5 h-5"
                  />
                )}
                <span className="text-base text-gray-800">{opt}</span>
              </label>
            );
          })}
        </div>

        {checked[currentIndex] && (
          <div className="mt-4 min-h-[60px]">
            {!isCorrectAnswer && (
              <div className="text-red-600 font-semibold mb-1">
                ❌ Incorrect Answer
              </div>
            )}
            {q.explanation && (
              <div className="text-sm text-gray-700">
                <strong>Explanation:</strong> {q.explanation}
              </div>
            )}
          </div>
        )}
</div>
        <div className="flex gap-3 mt-6 justify-center">
          {!checked[currentIndex] && <Button onClick={checkAnswer}>Check</Button>}
          {showNext && (
            <Button onClick={nextQuestion} variant="outline">
              {currentIndex === questions.length - 1 ? 'Finish Review' : 'Next'}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
