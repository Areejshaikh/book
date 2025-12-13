import React, { useState } from 'react';

interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number; // Index of the correct option
}

interface QuizComponentProps {
  questions: QuizQuestion[];
  onComplete: (score: number, total: number) => void;
}

export const QuizComponent: React.FC<QuizComponentProps> = ({ questions, onComplete }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);

  const handleOptionSelect = (optionIndex: number) => {
    if (showResult) return; // Lock selection after showing result
    setSelectedOption(optionIndex);
  };

  const handleNextQuestion = () => {
    if (selectedOption === null) return;

    // Check if answer is correct
    const isCorrect = selectedOption === questions[currentQuestionIndex].correctAnswer;
    if (isCorrect) {
      setScore(score + 1);
    }

    if (currentQuestionIndex < questions.length - 1) {
      // Move to next question
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedOption(null);
    } else {
      // Quiz completed
      setShowResult(true);
      onComplete(score + (isCorrect ? 1 : 0), questions.length);
    }
  };

  const handleRestartQuiz = () => {
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setScore(0);
    setShowResult(false);
  };

  if (showResult) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-bold mb-4">Quiz Completed!</h3>
        <p className="text-lg mb-2">
          Your score: <span className="font-semibold">{score}</span> out of <span className="font-semibold">{questions.length}</span>
        </p>
        <p className="mb-4">
          You got <span className="font-semibold">{Math.round((score / questions.length) * 100)}%</span> correct
        </p>
        <button
          onClick={handleRestartQuiz}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Restart Quiz
        </button>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="mb-2">
        <span className="text-sm font-medium text-gray-500">
          Question {currentQuestionIndex + 1} of {questions.length}
        </span>
      </div>
      <h3 className="text-lg font-semibold mb-4">{currentQuestion.question}</h3>
      <div className="space-y-2 mb-6">
        {currentQuestion.options.map((option, index) => (
          <div
            key={index}
            onClick={() => handleOptionSelect(index)}
            className={`p-3 rounded-lg border cursor-pointer transition-colors ${
              selectedOption === index
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:bg-gray-50'
            }`}
          >
            <input
              type="radio"
              id={`option-${currentQuestionIndex}-${index}`}
              name={`question-${currentQuestionIndex}`}
              checked={selectedOption === index}
              onChange={() => {}}
              className="mr-2"
            />
            <label htmlFor={`option-${currentQuestionIndex}-${index}`} className="cursor-pointer">
              {option}
            </label>
          </div>
        ))}
      </div>
      <button
        onClick={handleNextQuestion}
        disabled={selectedOption === null}
        className={`w-full py-2 px-4 rounded ${
          selectedOption === null
            ? 'bg-gray-300 cursor-not-allowed'
            : 'bg-blue-600 text-white hover:bg-blue-700'
        }`}
      >
        {currentQuestionIndex < questions.length - 1 ? 'Next Question' : 'Finish Quiz'}
      </button>
    </div>
  );
};