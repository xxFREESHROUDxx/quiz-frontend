import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { quizSchema, type QuizFormValues } from "../lib/quizSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { apiFetch } from "../lib/apiFetch";
import { API_ROUTES } from "../constants/apiRoutes";
import { WEB_ROUTES } from "../constants/webRoutes";
import PageLayout from "../components/PageLayout";
import Button from "../components/Button";
import FormInput from "../components/FormInput";
import QuestionFields from "../components/quiz-builder/QuestionFields";

export default function CreateQuizPage() {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [serverError, setServerError] = useState<string | null>(null);

  const methods = useForm<QuizFormValues>({
    resolver: zodResolver(quizSchema),
    defaultValues: {
      title: "",
      questions: [
        {
          text: "",
          type: "SINGLE",
          answers: [
            { text: "", isCorrect: false },
            { text: "", isCorrect: false },
          ],
        },
      ],
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = methods;

  const onSubmit = async (data: QuizFormValues) => {
    setServerError(null);

    try {
      await apiFetch(API_ROUTES.QUIZZES.GET_ALL_QUIZZES, {
        method: "POST",
        token,
        body: JSON.stringify(data),
      });

      navigate(WEB_ROUTES.DASHBOARD);
    } catch (err) {
      setServerError(err instanceof Error ? err.message : "Failed to create quiz");
    }
  };

  return (
    <PageLayout>
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex-items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Create Quiz</h1>
            <p className="text-gray-500 text-sm mt-1">Add questions and answers below</p>
          </div>

          <Button variant="ghost" onClick={() => navigate(WEB_ROUTES.DASHBOARD)}>
            Cancel
          </Button>
        </div>

        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
            {/* Quiz title */}
            <div className="bg-white border gray-200 rounded-2xl p-5 shadow-sm">
              <FormInput
                label="Quiz Title"
                placeholder="e.g. World Geography Quiz"
                error={errors.title?.message}
                {...register("title")}
              />
            </div>

            {/* Questions */}
            <QuestionFields />

            {serverError && (
              <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
                {serverError}
              </div>
            )}

            {/* Submit or cancel buttons */}
            <div className="flex justify-end gap-3 pb-8">
              <Button type="button" variant="ghost" onClick={() => navigate(WEB_ROUTES.DASHBOARD)}>
                Cancel
              </Button>

              <Button type="submit" isLoading={isSubmitting}>
                Save Quiz
              </Button>
            </div>
          </form>
        </FormProvider>
      </div>
    </PageLayout>
  );
}
