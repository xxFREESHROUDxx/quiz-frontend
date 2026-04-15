import { useState, type FunctionComponent } from "react";
import type { Quiz } from "../types";
import { useNavigate } from "react-router-dom";
import { WEB_ROUTES } from "../constants/webRoutes";
import { apiFetch } from "../lib/apiFetch";
import { API_ROUTES } from "../constants/apiRoutes";
import Button from "./Button";

const COPY_TIMEOUT_DURATION_IN_MS = 2000; // 2 seconds

interface QuizCardProps {
  quiz: Quiz;
  token: string;
  onDeleted: (id: string) => void;
  onPublished: (id: string, permalink: string) => void;
}

const QuizCard: FunctionComponent<QuizCardProps> = ({ quiz, token, onDeleted, onPublished }) => {
  const navigate = useNavigate();
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [isPublishing, setIsPublishing] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  const questionCount = quiz._count?.questions ?? quiz.questions?.length ?? 0;
  const permalinkUrl = quiz.permalink
    ? `${window.location.origin}${WEB_ROUTES.PERMALINK.replace(":permalink", quiz.permalink)}`
    : null;

  const handleDelete = async () => {
    const confirmed = window.confirm("Are you sure you want to delete this quiz?");
    if (!confirmed) return;

    setIsDeleting(true);

    try {
      await apiFetch(API_ROUTES.QUIZZES.DELETE(quiz.id), {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      onDeleted(quiz.id);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to delete quiz");
    } finally {
      setIsDeleting(false);
    }
  };

  const handlePublish = async () => {
    setIsPublishing(true);

    try {
      const data = await apiFetch<{ permalink: string }>(API_ROUTES.QUIZZES.PUBLISH(quiz.id), {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      onPublished(quiz.id, data.permalink);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to publish quiz");
    } finally {
      setIsPublishing(false);
    }
  };

  const handleCopyLink = () => {
    if (!permalinkUrl) return;

    navigator.clipboard.writeText(permalinkUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), COPY_TIMEOUT_DURATION_IN_MS);
  };

  const handleEdit = () => {
    navigate(WEB_ROUTES.EDIT_QUIZ.replace(":id", quiz.id));
  };

  return (
    <div className="bg-white border border-gray-200 justify-between rounded-2xl p-6 flex flex-col gap-4 shadow-sm transition hover:shadow-md">
      {/* Title and Badge */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-base font-semibold text-gray 900">{quiz.title}</h3>
          <p className="text-sm text-gray-400 mt-0 5">
            {questionCount} {questionCount === 1 ? "question" : "questions"}
          </p>
        </div>

        {/* Status Badge */}
        <span
          className={`shrink-0 text-xs font-semibold px-3 py-1 rounded-full ${
            quiz.isPublished ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
          }`}
        >
          {quiz.isPublished ? "Published" : "Draft"}
        </span>
      </div>

      {/* Permalink */}
      {quiz.isPublished && permalinkUrl && (
        <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2">
          <span className="text-xs text-gray-500 truncate flex-1">{permalinkUrl}</span>
          <button
            onClick={handleCopyLink}
            className="text-xs text-blue-500 cursor-pointer bg-blue-100 hover:bg-blue-200 rounded-2xl py-1 px-2 flex items-center justify-center font-medium shrink-0 transition"
          >
            {copied ? "✓ Copied" : "Copy"}
          </button>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex items-center justify-end gap-2 pt-1">
        {/* If quiz is not published, we have Edit and Publish buttons */}
        {!quiz.isPublished && (
          <>
            <Button variant="ghost" onClick={handleEdit}>
              Edit
            </Button>

            <Button variant="primary" onClick={handlePublish} isLoading={isPublishing}>
              Publish
            </Button>
          </>
        )}

        {/* Delete button is always available */}
        <Button variant="danger" isLoading={isDeleting} onClick={handleDelete}>
          Delete
        </Button>
      </div>
    </div>
  );
};

export default QuizCard;
