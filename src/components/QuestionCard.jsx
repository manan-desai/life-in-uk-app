import React from 'react';
import { Checkbox } from '../ui/checkbox';

export default function QuestionCard({
  question,
  currentIndex,
  totalQuestions,
  testId,
  selectedAnswers,
  wasChecked,
  isCorrectAnswer,
  isFlagged,
  isMultiple,
  toggleOption,
  toggleFlag,
  checkAnswer,
  prevQuestion,
  nextQuestion,
  showNext
}) {
  return (
    <div className="w-full bg-gray-700 shadow-lg rounded-xl p-8 border border-gray-600">
      <div className="min-h-120">
        <div className="mb-6 pb-4 border-b border-gray-600">
          <div className="flex items-center justify-between mb-3">
            <div className="text-sm font-semibold text-blue-300 bg-blue-900/40 px-4 py-2 rounded-lg border border-blue-700">
              {testId.toUpperCase()}
            </div>
            <button
              onClick={toggleFlag}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all text-sm ${
                isFlagged
                  ? 'bg-orange-600 hover:bg-orange-700 text-white border-2 border-orange-500'
                  : 'bg-gray-800 hover:bg-gray-600 text-gray-300 border-2 border-gray-600'
              }`}
            >
              <span className="text-base">{isFlagged ? '🚩' : '🏴'}</span>
              <span>{isFlagged ? 'Flagged' : 'Flag'}</span>
            </button>
          </div>
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="flex-1 h-2 bg-gray-600 rounded-full overflow-hidden">
              <div 
                className="h-full bg-blue-500 transition-all duration-300 ease-out"
                style={{ width: `${((currentIndex + 1) / totalQuestions) * 100}%` }}
              />
            </div>
            <span className="text-sm font-semibold text-gray-300 min-w-fit">
              {currentIndex + 1} / {totalQuestions}
            </span>
          </div>
        </div>
        
        <p className="font-semibold mb-6 text-xl text-white leading-relaxed">
          {question.question}
        </p>

        {isMultiple && (
          <div className="mb-4">
            <span className="inline-block bg-amber-900/40 text-amber-300 px-4 py-2 rounded-lg text-sm font-semibold border border-amber-700">
              ⚠️ Multiple answers required - Select {question.correctAnswers.length} options
            </span>
          </div>
        )}

        <div className="grid grid-cols-1 gap-3">
          {question.options.map((opt, idx) => {
            const selected = selectedAnswers.includes(opt);
            const isCorrect = question.correctAnswers.includes(opt);

            return (
              <label
                key={idx}
                className={`px-5 py-4 rounded-lg flex items-center gap-3 cursor-pointer transition-all border-2
                  ${!wasChecked && !selected ? 'bg-gray-800 border-gray-600 hover:border-blue-500 hover:bg-gray-750 text-gray-200' : ''}
                  ${!wasChecked && selected ? 'bg-blue-900/40 border-blue-500 text-white' : ''}
                  ${wasChecked && isCorrect ? 'bg-green-900/40 border-green-500 text-white' : ''}
                  ${wasChecked && selected && !isCorrect ? 'bg-red-900/40 border-red-500 text-white' : ''}
                  ${wasChecked && !selected && !isCorrect ? 'bg-gray-800 border-gray-600 opacity-50 text-gray-400' : ''}
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
                    className="w-5 h-5 accent-blue-600"
                  />
                )}
                <span className="flex-1 text-base font-medium">{opt}</span>
                {wasChecked && isCorrect && (
                  <span className="text-green-600 font-bold text-xl">✓</span>
                )}
                {wasChecked && selected && !isCorrect && (
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
              {question.explanation && (
                <div className="text-gray-200 leading-relaxed mt-3 bg-gray-800/60 p-4 rounded-lg border border-gray-600">
                  <strong className="text-white">Explanation:</strong> {question.explanation}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

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
            disabled={selectedAnswers.length === 0}
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
            {currentIndex === totalQuestions - 1 ? 'Finish Test →' : 'Next Question →'}
          </button>
        )}
      </div>
    </div>
  );
}

