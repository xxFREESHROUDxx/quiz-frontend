import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import type { Quiz } from "../types";
import { apiFetch } from "../lib/apiFetch";
import { API_ROUTES } from "../constants/apiRoutes";

type Selections = Record<string, string[]>;

type ScoreResult = {
  score: number;
  total: number;
};

export default function TakeQuizPage() {
  const { permalink } = useParams<{ permalink: string }>();
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selections, setSelections] = useState<Selections>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [result, setResult] = useState<ScoreResult | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const data = await apiFetch<Quiz>(API_ROUTES.PUBLIC.GET_BY_PERMALINK(permalink!));
        setQuiz(data);
      } catch {
        setError("Quiz not found or no longer available.");
      } finally {
        setIsLoading(false);
      }
    };

    if (permalink) fetchQuiz();
  }, [permalink]);

  const handleSingleSelect = (questionId: string, answerId: string) => {
    setSelections((prev) => ({ ...prev, [questionId]: [answerId] }));
  };

  const handleMultiSelect = (questionId: string, answerId: string, checked: boolean) => {
    setSelections((prev) => {
      const current = prev[questionId] || [];
      return {
        ...prev,
        [questionId]: checked ? [...current, answerId] : current.filter((id) => id !== answerId),
      };
    });
  };

  const allAnswered =
    quiz?.questions.every((question) => (selections[question.id]?.length ?? 0) > 0) ?? false;

  const handleSubmit = async () => {
    if (!quiz || !allAnswered) return;
    setSubmitError(null);
    setIsSubmitting(true);

    try {
      const answers = quiz.questions.map((question) => ({
        questionId: question.id,
        selectedAnswerIds: selections[question.id] ?? [],
      }));

      const data = await apiFetch<ScoreResult>(API_ROUTES.PUBLIC.SUBMIT(permalink!), {
        method: "POST",
        body: JSON.stringify({ answers }),
      });

      setResult(data);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Submission failed! Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // ── Loading ──────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-400 text-sm">Loading quiz...</p>
      </div>
    );
  }

  // ── Error ────────────────────────────────────────────────
  if (error || !quiz) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center">
          <p className="text-2xl mb-2">😕</p>
          <p className="text-gray-700 font-medium">Quiz not found</p>
          <p className="text-gray-400 text-sm mt-1">{error ?? "This quiz is not available."}</p>
        </div>
      </div>
    );
  }

  // ── Score screen ─────────────────────────────────────────
  if (result) {
    const percentage = Math.round((result.score / result.total) * 100);

    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="w-full max-w-md bg-white border border-gray-200 rounded-2xl shadow-sm p-8 text-center">
          <div className="text-5xl mb-4">
            {percentage === 100 ? "🏆" : percentage >= 50 ? "👍" : "📚"}
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-2">Quiz Complete!</h2>

          <p className="text-lg text-gray-600 mb-1">
            You answered{" "}
            <span className="font-bold text-blue-600">
              {result.score}/{result.total}
            </span>{" "}
            questions correctly
          </p>

          <p className="text-gray-400 text-sm mb-8">
            {percentage === 100
              ? "Perfect score! Well done."
              : percentage >= 50
                ? "Good effort! Keep it up."
                : "Better luck next time!"}
          </p>

          <button
            onClick={() => {
              setResult(null);
              setSelections({});
            }}
            className="text-sm cursor-pointer text-blue-600 hover:text-blue-800 font-medium transition"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="max-w-2xl mx-auto flex flex-col gap-6">
        {/* Quiz header */}
        <div className="text-center mb-2">
          <h1 className="text-2xl font-bold text-gray-900">{quiz.title}</h1>
          <p className="text-gray-400 text-sm mt-1">
            {quiz.questions.length} {quiz.questions.length === 1 ? "question" : "questions"}
          </p>
        </div>

        {/* Questions */}
        {quiz.questions.map((question, qIndex) => (
          <div
            key={question.id}
            className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm flex flex-col gap-4"
          >
            {/* Question header */}
            <div className="flex flex-col gap-1">
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                Question {qIndex + 1}
              </span>
              <p className="text-gray-900 font-medium">{question.text}</p>
              <span className="text-xs text-gray-400">
                {question.type === "SINGLE" ? "Select one answer" : "Select all that apply"}
              </span>
            </div>

            {/* Answers */}
            <div className="flex flex-col gap-2">
              {question.answers.map((answer) => {
                const isSelected = selections[question.id]?.includes(answer.id) ?? false;

                return (
                  <label
                    key={answer.id}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl border cursor-pointer transition
                      ${
                        isSelected
                          ? "border-blue-400 bg-blue-50"
                          : "border-gray-200 bg-gray-50 hover:border-gray-300 hover:bg-gray-100"
                      }`}
                  >
                    {question.type === "SINGLE" ? (
                      <input
                        type="radio"
                        name={`question-${question.id}`}
                        value={answer.id}
                        checked={isSelected}
                        onChange={() => handleSingleSelect(question.id, answer.id)}
                        className="accent-blue-600 w-4 h-4 shrink-0"
                      />
                    ) : (
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={(e) =>
                          handleMultiSelect(question.id, answer.id, e.target.checked)
                        }
                        className="accent-blue-600 w-4 h-4 shrink-0"
                      />
                    )}
                    <span className="text-sm text-gray-700">{answer.text}</span>
                  </label>
                );
              })}
            </div>
          </div>
        ))}

        {/* Submit error */}
        {submitError && (
          <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
            {submitError}
          </div>
        )}

        {/* Submit button */}
        <div className="flex flex-col items-center gap-2 pb-10">
          <button
            onClick={handleSubmit}
            disabled={!allAnswered || isSubmitting}
            className={`w-full py-3 rounded-xl cursor-pointer font-semibold text-sm transition
              ${
                allAnswered && !isSubmitting
                  ? "bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed"
              }`}
          >
            {isSubmitting ? "Submitting..." : "Submit Quiz"}
          </button>

          {!allAnswered && <p className="text-xs text-gray-400">Answer all questions to submit</p>}
        </div>
      </div>
    </div>
  );
}
