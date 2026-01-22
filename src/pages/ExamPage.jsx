import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import questionsData from '../allQuestions';
import { Button } from '../ui/button';
import { Checkbox } from '../ui/checkbox';
import CompletionScreen from '../components/CompletionScreen';
import QuestionCard from '../components/QuestionCard';
import QuickTestSelector from '../components/QuickTestSelector';

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
  const [flagged, setFlagged] = useState(() => JSON.parse(localStorage.getItem('flaggedQuestions') || '[]'));

  useEffect(() => {
    const qData = questionsData[id] || [];
    setQuestions(qData);
    setCompleted(false);
    setCurrentIndex(0);
    setAnswers({});
    setChecked({});
    setScore(0);
    setShowNext(false);
    setIsCorrectAnswer(null);
    setCorrectness({});
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
      setShowNext(true);
    }
  };

  const nextQuestion = () => {
    const newIndex = currentIndex + 1;
    if (newIndex < questions.length) {
      setCurrentIndex(newIndex);
      setShowNext(checked[newIndex] === true);
      setIsCorrectAnswer(correctness[newIndex] ?? null);
    } else {
      const existingCompleted = JSON.parse(localStorage.getItem('completedTests')) || [];
      localStorage.setItem('completedTests', JSON.stringify([...new Set([...existingCompleted, id])]));
      setCompleted(true);
    }
  };

  const toggleFlag = () => {
    let qObj = questions[currentIndex];
    qObj = { ...qObj, testId: id };

    setFlagged(prev => {
      const exists = prev?.some(f => f.question === qObj.question);
      const updated = exists ? prev.filter(f => f.question !== qObj.question) : [...prev, qObj];
      localStorage.setItem('flaggedQuestions', JSON.stringify(updated));
      return updated;
    });
  };

  const prevQuestion = () => {
    const newIndex = currentIndex - 1;
    if (newIndex >= 0) {
      setCurrentIndex(newIndex);
      setShowNext(checked[newIndex] === true);
      setIsCorrectAnswer(null);
      setIsCorrectAnswer(correctness[newIndex] ?? null);
    }
  };

  if (!questions.length) return <div className="p-4 bg-gray-800 min-h-screen text-white text-center text-xl pt-20">Loading...</div>;

  if (completed) {
    return <CompletionScreen score={score} total={questions.length} testId={id} navigate={navigate} />;
  }

  const q = questions[currentIndex];
  const isMultiple = q.correctAnswers.length > 1;
  const selectedAnswers = answers[currentIndex] || [];
  const wasChecked = checked[currentIndex];
  const isFlagged = flagged.some(f => f.question === q.question);

  return (
    <div className="p-4 mt-4 max-w-5xl mx-auto bg-gray-800 min-h-screen">
      <QuickTestSelector />
      <div className="max-w-3xl mx-auto">
        <QuestionCard
        question={q}
        currentIndex={currentIndex}
        totalQuestions={questions.length}
        testId={id}
        selectedAnswers={selectedAnswers}
        wasChecked={wasChecked}
        isCorrectAnswer={isCorrectAnswer}
        isFlagged={isFlagged}
        isMultiple={isMultiple}
        toggleOption={toggleOption}
        toggleFlag={toggleFlag}
        checkAnswer={checkAnswer}
        prevQuestion={prevQuestion}
        nextQuestion={nextQuestion}
        showNext={showNext}
      />
      </div>
    </div>
  );
}

