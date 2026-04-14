import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { quizSchema, type QuizFormValues } from "../lib/quizSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { apiFetch } from "../lib/apiFetch";
import { API_ROUTES } from "../constants/apiRoutes";
import type { Quiz } from "../types";
import { WEB_ROUTES } from "../constants/webRoutes";
import PageLayout from "../components/PageLayout";
import Button from "../components/Button";
import FormInput from "../components/FormInput";
import QuestionFields from "../components/quiz-builder/QuestionFields";

export default function EditQuizPage() {
  const { token } = useAuth();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [serverError, setServerError] = useState<string | null>(null);
  const [isLoadingQuiz, setIsLoadingQuiz] = useState<boolean>(true);

  const methods = useForm<QuizFormValues>({
    resolver: zodResolver(quizSchema),
    defaultValues: {
      title: "",
      questions: [],
    },
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = methods;

  // Fetch existing quiz data and populate the form
  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const quiz = await apiFetch<Quiz>(API_ROUTES.QUIZZES.GET_BY_ID(id!), { token });

        // If published, redirect back to dashboard
        if (quiz.isPublished) {
          navigate(WEB_ROUTES.DASHBOARD, { replace: true });
          return;
        }

        // Populate form with existing quiz data
        reset({
          title: quiz.title,
          questions: quiz.questions.map((question) => ({
            text: question.text,
            type: question.type,
            answers: question.answers.map((answer) => ({
              text: answer.text,
              isCorrect: answer.isCorrect ?? false,
            })),
          })),
        });
      } catch {
        navigate(WEB_ROUTES.DASHBOARD, { replace: true });
      } finally {
        setIsLoadingQuiz(false);
      }
    };

    if (id) fetchQuiz();
  }, [id, token, reset, navigate]);

  const onSubmit = async (data: QuizFormValues) => {
    setServerError(null);

    try {
      await apiFetch(`${API_ROUTES.QUIZZES.GET_BY_ID(id!)}`, {
        method: "PUT",
        token,
        body: JSON.stringify(data),
      });

      navigate(WEB_ROUTES.DASHBOARD);
    } catch (err) {
      setServerError(err instanceof Error ? err.message : "Failed to update quiz");
    }
  };

  if (isLoadingQuiz) {
    return (
      <PageLayout>
        <div className="flex items-center justify-center py-20">
          <p className="text-gray-400 text-sm">Loading quiz...</p>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-body text-gray-900">Edit Quiz</h1>
            <p className="text-gray-500 text-sm mt-1">Changes replace all existing questions</p>
          </div>

          <Button variant="ghost" onClick={() => navigate(WEB_ROUTES.DASHBOARD)}>
            Cancel
          </Button>
        </div>

        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
            {/* Quiz title */}
            <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
              <FormInput
                label="Quiz Title"
                placeholder="e.g. World Geography Quiz"
                error={errors.title?.message}
                {...register("title")}
              />
            </div>

            <QuestionFields />

            {serverError && (
              <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
                {serverError}
              </div>
            )}

            {/* Cancel and Submit buttons */}
            <div className="flex justify-end gap-3 pb-8">
              <Button variant="ghost" type="button" onClick={() => navigate(WEB_ROUTES.DASHBOARD)}>
                Cancel
              </Button>

              <Button type="submit" isLoading={isSubmitting}>
                Save Changes
              </Button>
            </div>
          </form>
        </FormProvider>
      </div>
    </PageLayout>
  );
}
