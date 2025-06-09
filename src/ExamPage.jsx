import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import questionsData from './allQuestions';
import { Button } from './ui/button';
import { Checkbox } from './ui/checkbox';

export default function ExamPage() {
  const { examId, testId } = useParams();
  const id = examId || testId;
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [checked, setChecked] = useState({});
  const [score, setScore] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [showNext, setShowNext] = useState(false);
  const [isCorrectAnswer, setIsCorrectAnswer] = useState(null);
  const [correctness, setCorrectness] = useState({});


  useEffect(() => {
    const qData = questionsData[id] || [];
    setQuestions(qData);
  }, [id]);

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

    const currentQuestion = { ...questions[currentIndex], testId: id };
    let failed = JSON.parse(localStorage.getItem('failedAnswers') || '[]');
    failed = failed.filter(q => q.question !== currentQuestion.question);

    if (!isCorrect) {
      failed.push(currentQuestion);
      localStorage.setItem('failedAnswers', JSON.stringify(failed));
      setShowNext(true);
    } else {
      localStorage.setItem('failedAnswers', JSON.stringify(failed));
      setScore((prev) => prev + 1);
      nextQuestion()
    }
  };


 const nextQuestion = () => {
  const newIndex = currentIndex + 1;
  if (newIndex < questions.length) {
    setCurrentIndex(newIndex);
    setShowNext(checked[newIndex] === true);
    setIsCorrectAnswer(correctness[newIndex] ?? null);
  } else {
    setCompleted(true);
  }
};

const prevQuestion = () => {
  console.log(questions[currentIndex])
  const newIndex = currentIndex - 1;
  if (newIndex >= 0) {
    setCurrentIndex(newIndex);
    setShowNext(checked[newIndex] === true);
    setIsCorrectAnswer(null);
    setIsCorrectAnswer(correctness[newIndex] ?? null);
  }
};

  if (!questions.length) return <div className="p-4">Loading...</div>;

  if (completed) {
    return (
      <div className="p-4 max-w-2xl mx-auto text-center">
        <h2 className="text-2xl font-bold mb-4">{id.toUpperCase()} Complete</h2>
        <p className="mb-4 text-lg">✅ You scored {score} out of {questions.length}</p>
        <Button onClick={() => navigate('/review')}>Review Incorrect Answers</Button>
      </div>
    );
  }

  const q = questions[currentIndex];
  const isMultiple = q.correctAnswers.length > 1;
  const selectedAnswers = answers[currentIndex] || [];
  const wasChecked = checked[currentIndex];

  return (
    <div className="p-4 max-w-2xl mx-auto flex">
      <div className="w-full max-w-2xl bg-white shadow-lg rounded-2xl p-6">
        <div className="h-[400px]">
          <h2 className="text-xl font-bold mb-2 text-center">
            {id.toUpperCase()} - Question {currentIndex + 1} of {questions.length}
          </h2>
          <p className="font-medium mb-4 text-lg text-center">{q.question}</p>

          <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
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
            <div className="mt-4 text-center min-h-[60px]">
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

        <div className="flex flex-wrap gap-3 mt-6 justify-center">
          {currentIndex > 0 && (
            <Button variant="outline" onClick={prevQuestion}>Previous</Button>
          )}
          {!wasChecked && (
            <Button onClick={checkAnswer}>Check</Button>
          )}
          {showNext && (
            <Button onClick={nextQuestion} variant="outline">
              {currentIndex === questions.length - 1 ? 'Finish' : 'Next'}
            </Button>
          )}

        </div>
      </div>
    </div>
  );
}
