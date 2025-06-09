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
   const [correctness, setCorrectness] = useState({});
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
    setCorrectness((prev) => ({ ...prev, [currentIndex]: isCorrect }));

    if (isCorrect) {
      // Auto-advance if correct
            // nextQuestion();
              setShowNext(true);
    } else {
      setShowNext(true);
    }
  };
const prevQuestion = () => {
  const newIndex = currentIndex - 1;
  if (newIndex >= 0) {
    setCurrentIndex(newIndex);
    setShowNext(checked[newIndex] === true);
    setIsCorrectAnswer(correctness[newIndex] ?? null);
  }
};

const nextQuestion = () => {
  const newIndex = currentIndex + 1;
  if (newIndex < questions.length) {
    setCurrentIndex(newIndex);
    setShowNext(checked[newIndex] === true);
    setIsCorrectAnswer(correctness[newIndex] ?? null);
  } else {
    // navigate('/');
  }
};


const handleDelete = () => {
  const confirmDelete = window.confirm("Are you sure you want to delete this question?");
  if (!confirmDelete) return;

  const updated = questions.filter((_, i) => i !== currentIndex);
  localStorage.setItem('failedAnswers', JSON.stringify(updated));
  if (updated.length === 0) {
    navigate('/');
  } else {
    setQuestions(updated);
    setCurrentIndex((prev) => Math.min(prev, updated.length - 1));
    setShowNext(false);
    setIsCorrectAnswer(null);
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
  const wasChecked = checked[currentIndex];

  return (
    <div className="p-4 mt-8 max-w-2xl mx-auto flex">
      
      <div className="w-full max-w-2xl bg-white shadow-lg rounded-2xl p-6">
          <Button
            variant="destructive"
            className="ml-2"
            onClick={handleDelete}
          >
            Delete
          </Button>
        <div className="min-h-120">
          <h2 className="text-2xl font-bold mb-4">
            Review - Question {currentIndex + 1} of {questions.length} ({q.testId})
          </h2>
          <p className="text-lg font-medium mb-6">{q.question}</p>

          <div className="grid grid-cols-1 gap-4">
            {q.options.map((opt, idx) => {
              const selected = selectedAnswers.includes(opt);
              const isCorrect = q.correctAnswers.includes(opt);

              return (
                <label
                  key={idx}
                  className={`px-4 py-3 rounded-md flex items-center gap-2 cursor-pointer transition-all
                    ${selected ? 'bg-blue-50' : 'bg-transparent'}
                    ${wasChecked && isCorrect ? 'ring-2 ring-green-400' : ''}
                    ${wasChecked && selected && !isCorrect ? 'ring-2 ring-red-400' : ''}
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

          {wasChecked && (
            <div className="mt-4 min-h-[60px]">
              {!isCorrectAnswer && (
                <div className="text-red-600 font-semibold mb-1">
                  ❌ Incorrect Answer
                </div>
              )}
               {isCorrectAnswer === true && (
                <div className="text-green-600 font-semibold mb-1">
                 ✅ Correct Answer
                </div>)}
              {q.explanation && (
                <div className="text-sm text-gray-700">
                  <strong>Explanation:</strong> {q.explanation}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="flex flex-wrap gap-3 mt-6 justify-center">
          {currentIndex > 0 && (
            <Button variant="outline" onClick={prevQuestion}>
              Previous
            </Button>
          )}
          {!wasChecked && <Button onClick={checkAnswer}>Check</Button>}
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
