import React, { useEffect, useMemo, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Checkbox } from '../ui/checkbox';
import QuickTestSelector from '../components/QuickTestSelector';

export default function ReviewPage() {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [searchParams] = useSearchParams();
  const initialFilter = searchParams.get('testId') || searchParams.get('examId') || 'all';
  const [filterId, setFilterId] = useState(initialFilter);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [checked, setChecked] = useState({});
  const [correctness, setCorrectness] = useState({});
  const [correctScore, setCorrectScore] = useState(0);
  const [attempts, setAttempts] = useState(() => JSON.parse(localStorage.getItem('reviewAttempts') || '{}'));
  const [flagged, setFlagged] = useState(() => JSON.parse(localStorage.getItem('flaggedQuestions') || '[]'));
  const [showNext, setShowNext] = useState(false);
  const [isCorrectAnswer, setIsCorrectAnswer] = useState(null);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    const failed = JSON.parse(localStorage.getItem('failedAnswers') || '[]');
    setQuestions(failed);
  }, []);

  useEffect(() => {
    localStorage.setItem('reviewAttempts', JSON.stringify(attempts));
  }, [attempts]);

  const testIds = useMemo(() => ['all', ...Array.from(new Set(questions.map(q => q.testId)))], [questions]);
  const displayList = useMemo(() => (filterId === 'all' ? questions : questions.filter(q => q.testId === filterId)), [questions, filterId]);

  useEffect(() => {
    if (currentIndex >= displayList.length) setCurrentIndex(0);
  }, [displayList.length]);

  const updateNavState = (idx) => {
    setShowNext(checked[idx]);
    setIsCorrectAnswer(correctness[idx] ?? null);
  };

  const toggleOption = (opt) => {
    const correctCount = displayList[currentIndex].correctAnswers.length;
    setAnswers(prev => {
      const cur = prev[currentIndex] || [];
      const upd = cur.includes(opt) ? cur.filter(o => o !== opt) : correctCount === 1 ? [opt] : [...cur, opt];
      return { ...prev, [currentIndex]: upd };
    });
  };

  const prevQ = () => {
    if (currentIndex > 0) {
      setCurrentIndex(i => i - 1);
      updateNavState(currentIndex - 1);
    }
  };

  const nextQ = () => {
    if (currentIndex < displayList.length - 1) {
      setCurrentIndex(i => i + 1);
      updateNavState(currentIndex + 1);
    } else {
      setCompleted(true);
    }
  };

  const checkAnswer = () => {
    const q = displayList[currentIndex];
    const sel = answers[currentIndex] || [];
    const correct = q.correctAnswers;
    const ok = sel.length === correct.length && correct.every(a => sel.includes(a));

    setChecked(prev => ({ ...prev, [currentIndex]: true }));
    setCorrectness(prev => ({ ...prev, [currentIndex]: ok }));
    setIsCorrectAnswer(ok);

    if (ok && !correctness[currentIndex]) {
      setCorrectScore(s => s + 1);
    }

    if (!ok) {
      setAttempts(prev => ({ ...prev, [q.question]: (prev[q.question] || 0) + 1 }));
      setShowNext(true);
    } else {
      setShowNext(true);
    }
  };

  const handleDelete = () => {
    if (!window.confirm('Delete this question from failed list?')) return;
    const updated = questions.filter(q => q !== displayList[currentIndex]);
    localStorage.setItem('failedAnswers', JSON.stringify(updated));
    setQuestions(updated);
  };

  const toggleFlag = () => {
    const qObj = displayList[currentIndex];
    setFlagged(prev => {
      const exists = prev?.some(f => f.question === qObj.question);
      const updated = exists ? prev.filter(f => f.question !== qObj.question) : [...prev, qObj];
      localStorage.setItem('flaggedQuestions', JSON.stringify(updated));
      return updated;
    });
  };

  if (!displayList.length) return <div className="p-4 bg-gray-800 min-h-screen text-white text-center text-xl pt-20">No questions for this filter.</div>;

  if (completed) {
    const percentage = Math.round((correctScore / displayList.length) * 100);
    return (
      <div className="p-6 max-w-2xl mx-auto bg-gray-800 min-h-screen">
        <div className="bg-gray-700 rounded-2xl shadow-lg p-8 text-center border border-gray-600">
          <div className="text-6xl mb-4 animate-bounce">🎉</div>
          <h2 className="text-3xl font-bold mb-3 text-white">Review Complete!</h2>
          <div className={`text-5xl font-bold mb-4 ${percentage >= 75 ? 'text-green-400' : 'text-orange-400'}`}>
            {percentage}%
          </div>
          <p className="text-xl mb-6 text-gray-200">
            Correct answers: <strong className="text-green-400">{correctScore}</strong> / <strong>{displayList.length}</strong>
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => window.location.reload()}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold text-base transition-all shadow-lg"
            >
              🔄 Review Again
            </button>
            <button
              onClick={() => navigate('/')}
              className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold text-base transition-all border-2 border-gray-600 hover:border-gray-500"
            >
              🏠 Back to Tests
            </button>
          </div>
        </div>
      </div>
    );
  }

  const q = displayList[currentIndex];
  const sel = answers[currentIndex] || [];
  const wasChecked = checked[currentIndex];
  const attempt = attempts[q.question] || 0;
  const isFlagged = flagged.some(f => f.question === q.question);

  return (
    <div className="p-4 mt-4 max-w-5xl mx-auto bg-gray-800 min-h-screen">
      <QuickTestSelector />
      <div className="max-w-3xl mx-auto space-y-4">
        <div className="text-center mb-4">
        <div className="inline-block bg-gray-700 rounded-xl shadow-lg px-4 py-3 border border-gray-600">
          <label className="text-sm font-semibold text-gray-200 mr-3">Filter by Test:</label>
          <select 
            value={filterId} 
            onChange={e => { setFilterId(e.target.value); setCurrentIndex(0); }} 
            className="border-2 border-gray-500 bg-gray-800 text-gray-200 rounded-lg px-4 py-2 font-medium focus:border-blue-500 focus:outline-none"
          >
            {testIds.map(id => <option key={id} value={id}>{id === 'all' ? 'All Tests' : id.toUpperCase()}</option>)}
          </select>
        </div>
      </div>

      <div className="bg-gray-700 shadow-lg rounded-2xl p-8 border border-gray-600">
        <div className="mb-6 pb-4 border-b border-gray-600">
          <div className="flex items-center justify-between mb-3">
            <div className="text-sm font-semibold text-blue-300 bg-blue-900/40 px-4 py-2 rounded-full border border-blue-700">
              Review Mode - {q.testId.toUpperCase()}
            </div>
            <div className="flex gap-2">
              <button
                onClick={toggleFlag}
                className={`px-3 py-2 rounded-lg font-medium transition-all text-sm ${
                  isFlagged
                    ? 'bg-orange-600 hover:bg-orange-700 text-white border-2 border-orange-500'
                    : 'bg-gray-800 hover:bg-gray-600 text-gray-300 border-2 border-gray-600'
                }`}
              >
                {isFlagged ? '🚩 Flagged' : '🏴 Flag'}
              </button>
              <button
                onClick={handleDelete}
                className="px-3 py-2 rounded-lg font-medium transition-all text-sm bg-gray-800 hover:bg-red-900/30 text-red-400 border-2 border-gray-600 hover:border-red-800"
              >
                🗑️ Delete
              </button>
            </div>
          </div>
          <div className="flex items-center justify-center gap-2">
            <div className="flex-1 h-2 bg-gray-600 rounded-full overflow-hidden">
              <div 
                className="h-full bg-red-500 transition-all duration-300 ease-out"
                style={{ width: `${((currentIndex + 1) / displayList.length) * 100}%` }}
              />
            </div>
            <span className="text-sm font-semibold text-gray-300 min-w-fit">
              {currentIndex + 1} / {displayList.length}
            </span>
          </div>
          {attempt > 0 && (
            <div className="mt-2 text-center text-xs text-orange-400 font-semibold">
              ⚠️ Attempted {attempt} time{attempt !== 1 ? 's' : ''} before
            </div>
          )}
        </div>

        <p className="font-semibold mb-6 text-xl text-white leading-relaxed">{q.question}</p>

        {q.correctAnswers.length > 1 && (
          <div className="mb-4">
            <span className="inline-block bg-amber-900/40 text-amber-300 px-4 py-2 rounded-lg text-sm font-semibold border border-amber-700">
              ⚠️ Multiple answers required - Select {q.correctAnswers.length} options
            </span>
          </div>
        )}

        <div className="grid gap-3">
          {q.options.map((opt, i) => {
            const selected = sel.includes(opt);
            const correct = q.correctAnswers.includes(opt);
            return (
              <label 
                key={i} 
                className={`px-5 py-4 rounded-lg flex items-center gap-3 cursor-pointer transition-all border-2
                  ${!wasChecked && !selected ? 'bg-gray-800 border-gray-600 hover:border-blue-500 hover:bg-gray-750 text-gray-200' : ''}
                  ${!wasChecked && selected ? 'bg-blue-900/40 border-blue-500 text-white' : ''}
                  ${wasChecked && correct ? 'bg-green-900/40 border-green-500 text-white' : ''}
                  ${wasChecked && selected && !correct ? 'bg-red-900/40 border-red-500 text-white' : ''}
                  ${wasChecked && !selected && !correct ? 'bg-gray-800 border-gray-600 opacity-50 text-gray-400' : ''}
                `}
              > 
                {q.correctAnswers.length > 1 ? (
                  <Checkbox checked={selected} onCheckedChange={() => toggleOption(opt)} disabled={wasChecked} />
                ) : (
                  <input type="radio" name="opt" checked={selected} onChange={() => toggleOption(opt)} disabled={wasChecked} className="w-5 h-5 accent-blue-600" />
                )}
                <span className="flex-1 text-base font-medium">{opt}</span>
                {wasChecked && correct && (
                  <span className="text-green-600 font-bold text-xl">✓</span>
                )}
                {wasChecked && selected && !correct && (
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
                    <span>Incorrect{attempt > 0 ? ` (${attempt} attempt${attempt !== 1 ? 's' : ''})` : ''}</span>
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

        <div className="flex gap-3 mt-8 justify-center border-t border-gray-600 pt-6">
          {currentIndex > 0 && (
            <button
              onClick={prevQ}
              className="px-6 py-3 text-base font-semibold bg-gray-700 hover:bg-gray-600 text-white rounded-lg border-2 border-gray-600 hover:border-gray-500 transition-all"
            >
              ← Previous
            </button>
          )}
          {!wasChecked && (
            <button
              onClick={checkAnswer}
              disabled={sel.length === 0}
              className="px-8 py-3 text-base bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-lg rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-blue-600"
            >
              Check Answer
            </button>
          )}
          {showNext && (
            <button
              onClick={nextQ}
              className="px-8 py-3 text-base bg-green-600 hover:bg-green-700 text-white font-semibold shadow-lg rounded-lg transition-all"
            >
              {currentIndex === displayList.length - 1 ? 'Finish Review →' : 'Next Question →'}
            </button>
          )}
        </div>
      </div>
      </div>
    </div>
  );
}

