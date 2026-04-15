import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";
import type { Quiz } from "../types";
import { apiFetch } from "../lib/apiFetch";
import { API_ROUTES } from "../constants/apiRoutes";
import PageLayout from "../components/PageLayout";
import Button from "../components/Button";
import { WEB_ROUTES } from "../constants/webRoutes";
import QuizCard from "../components/QuizCard";

export default function DashboardPage() {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const data = await apiFetch<Quiz[]>(API_ROUTES.QUIZZES.GET_ALL_QUIZZES, {
          token,
        });
        setQuizzes(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load quizzes");
      } finally {
        setIsLoading(false);
      }
    };

    fetchQuizzes();
  }, [token]);

  const handleDeleted = (id: string) => {
    setQuizzes((prev) => prev.filter((quiz) => quiz.id !== id));
  };

  const handlePublished = (id: string, permalink: string) => {
    setQuizzes((prev) =>
      prev.map((quiz) => (quiz.id === id ? { ...quiz, isPublished: true, permalink } : quiz)),
    );
  };

  return (
    <PageLayout>
      {/* Page Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Quizzes</h1>
          <p className="text-gray-500 text-sm-mt-1">Manage and share your quizzes</p>
        </div>

        <Button onClick={() => navigate(WEB_ROUTES.CREATE_QUIZ)}>Create Quiz</Button>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center py-20">
          <div className="text-gray-400 text-sm">Loading quizzes...</div>
        </div>
      )}

      {/* Error state */}
      {error && (
        <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
          {error}
        </div>
      )}

      {/* Empty state */}
      {!isLoading && !error && quizzes.length === 0 && (
        <div className="text-center py-20">
          <p className="text-gray-400 text-lg mb-2">No quizzes yet</p>
          <p className="text-gray-400 text-sm mb-6">
            Create your first quiz and share it with the world
          </p>
          <Button onClick={() => navigate(WEB_ROUTES.CREATE_QUIZ)}>Create your first quiz</Button>
        </div>
      )}

      {/* Quiz grid */}
      {!isLoading && !error && quizzes.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {quizzes.map((quiz) => (
            <QuizCard
              key={quiz.id}
              quiz={quiz}
              token={token!}
              onDeleted={handleDeleted}
              onPublished={handlePublished}
            />
          ))}
        </div>
      )}
    </PageLayout>
  );
}
