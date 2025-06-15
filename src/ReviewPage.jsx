import React, { useEffect, useMemo, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { Checkbox } from './ui/checkbox';

/**
 * ReviewPage – supports filtering by Test / Exam ID
 * -------------------------------------------------
 * • Tracks attempts in localStorage (`reviewAttempts`)
 * • Flag & Delete support
 * • Correct‑answer counter and end summary
 */
export default function ReviewPage() {
  const navigate = useNavigate();

  // ─── state ──────────────────────────────────────────────
  const [questions, setQuestions] = useState([]);
  const [searchParams] = useSearchParams();
  const initialFilter = searchParams.get('testId') || searchParams.get('examId') || 'all';
  const [filterId, setFilterId] = useState(initialFilter);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [checked, setChecked] = useState({});
  const [correctness, setCorrectness] = useState({});
  const [correctScore, setCorrectScore] = useState(0); // ✅ new
  const [attempts, setAttempts] = useState(() => JSON.parse(localStorage.getItem('reviewAttempts') || '{}'));
  const [flagged, setFlagged] = useState(() => new Set(JSON.parse(localStorage.getItem('flaggedQuestions') || '[]')));
  const [showNext, setShowNext] = useState(false);
  const [isCorrectAnswer, setIsCorrectAnswer] = useState(null);
  const [completed, setCompleted] = useState(false);

  // ─── initial load ──────────────────────────────────────
  useEffect(() => {
    const failed = JSON.parse(localStorage.getItem('failedAnswers') || '[]');
    setQuestions(failed);
  }, []);

  // persist attempts
  useEffect(() => {
    localStorage.setItem('reviewAttempts', JSON.stringify(attempts));
  }, [attempts]);

  // unique testIds
  const testIds = useMemo(() => ['all', ...Array.from(new Set(questions.map(q => q.testId)))], [questions]);

  // filtered list
  const displayList = useMemo(() => (filterId === 'all' ? questions : questions.filter(q => q.testId === filterId)), [questions, filterId]);

  // reset index if filter changes length
  useEffect(() => {
    if (currentIndex >= displayList.length) setCurrentIndex(0);
  }, [displayList.length]);

  // ─── helpers ────────────────────────────────────────────
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

    // increment score first time question marked correct
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
    const key = displayList[currentIndex].question;
    const ns = new Set(flagged);
    ns.has(key) ? ns.delete(key) : ns.add(key);
    setFlagged(ns);
    localStorage.setItem('flaggedQuestions', JSON.stringify([...ns]));
  };

  // ─── guards ─────────────────────────────────────────────
  if (!displayList.length) return <div className="p-4">No questions for this filter.</div>;

  // summary page
  if (completed) {
    return (
      <div className="p-6 max-w-xl mx-auto text-center space-y-4">
        <h2 className="text-2xl font-bold">Review Complete 🎉</h2>
        <p className="text-lg">Correct answers: <span className="text-green-600 font-semibold">{correctScore}</span> / {displayList.length}</p>
        <Button onClick={() => window.location.reload()}>Restart</Button>
      </div>
    );
  }

  // current question vars
  const q = displayList[currentIndex];
  const sel = answers[currentIndex] || [];
  const wasChecked = checked[currentIndex];
  const attempt = attempts[q.question] || 0;
  const isFlagged = flagged.has(q.question);

  return (
    <div className="p-4 mt-6 max-w-2xl mx-auto space-y-4">
      {/* Filter */}
      <div className="text-center">
        <select value={filterId} onChange={e => { setFilterId(e.target.value); setCurrentIndex(0); }} className="border rounded px-2 py-1">
          {testIds.map(id => <option key={id} value={id}>{id === 'all' ? 'All Tests' : id}</option>)}
        </select>
      </div>

      <div className="bg-white shadow rounded-2xl p-6 space-y-4">
        <div className="flex justify-between items-start">
          <h2 className="text-lg font-bold">Q{currentIndex + 1}/{displayList.length} ({q.testId})</h2>
          <div className="flex gap-2">
            <Button size="sm" variant={isFlagged ? 'outline' : 'default'} onClick={toggleFlag}>{isFlagged ? '🚩' : 'Flag'}</Button>
            <Button size="sm" variant="destructive" onClick={handleDelete}>Delete</Button>
          </div>
        </div>

        <p className="font-medium">{q.question}</p>
        <div className="grid gap-2">
          {q.options.map((opt, i) => {
            const selected = sel.includes(opt);
            const correct = q.correctAnswers.includes(opt);
            return (
              <label key={i} className={`px-3 py-2 rounded flex gap-2 cursor-pointer transition ${selected ? 'bg-blue-50' : ''} ${wasChecked && correct ? 'ring-2 ring-green-400' : ''} ${wasChecked && selected && !correct ? 'ring-2 ring-red-400' : ''}`}> 
                {q.correctAnswers.length > 1 ? (
                  <Checkbox checked={selected} onCheckedChange={() => toggleOption(opt)} disabled={wasChecked} />
                ) : (
                  <input type="radio" name="opt" checked={selected} onChange={() => toggleOption(opt)} disabled={wasChecked} />
                )}
                <span>{opt}</span>
              </label>
            );
          })}
        </div>

        {wasChecked && (
          <div className="min-h-[48px] space-y-1">
            {isCorrectAnswer === false && <div className="text-red-600">❌ Incorrect (attempts: {attempt})</div>}
            {isCorrectAnswer === true && <div className="text-green-600">✅ Correct</div>}
            {q.explanation && <p className="text-sm text-gray-600"><b>Explanation:</b> {q.explanation}</p>}
          </div>
        )}

        <div className="flex gap-2 justify-center">
          {currentIndex > 0 && <Button variant="outline" onClick={prevQ}>Prev</Button>}
          {!wasChecked && <Button onClick={checkAnswer}>Check</Button>}
          {showNext && <Button variant="outline" onClick={nextQ}>{currentIndex === displayList.length - 1 ? 'Finish' : 'Next'}</Button>}
        </div>
      </div>
    </div>
  );
}
