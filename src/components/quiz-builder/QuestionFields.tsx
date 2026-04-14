import type { FunctionComponent } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
import type { QuizFormValues } from "../../lib/quizSchema";
import AnswerFields from "./AnswerFields";

const QuestionFields: FunctionComponent = () => {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext<QuizFormValues>();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "questions",
  });

  const addQuestion = () => {
    append({
      text: "",
      type: "SINGLE",
      answers: [
        { text: "", isCorrect: false },
        { text: "", isCorrect: false },
      ],
    });
  };

  return (
    <div className="flex flex-col gap-4">
      {fields.map((field, questionIndex) => {
        const questionError = errors.questions?.[questionIndex]?.text;

        return (
          <div
            key={field.id}
            className="bg-white border border-gray-200 rounded-2xl p-5 flex flex-col gap-4 shadow-sm"
          >
            {/* Question header */}
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-gray-500">
                Question {questionIndex + 1}
              </span>

              {fields.length > 1 && (
                <button
                  type="button"
                  onClick={() => remove(questionIndex)}
                  className="text-sm text-red-400 hover:text-red-600 transition font-medium"
                >
                  Remove
                </button>
              )}
            </div>

            {/* Question text */}
            <div className="flex flex-col gap-1">
              <input
                type="text"
                placeholder="Enter your question..."
                className={`w-full px-4 py-2.5 rounded-lg border text-sm outline-none transition focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${questionError ? "border-red-400" : "border-gray-300 bg-gray-50 hover:border-gray-400"}`}
                {...register(`questions.${questionIndex}.text`)}
              />

              {questionError && <p className="text-xs text-red-500">{questionError.message}</p>}
            </div>

            {/* Question type selector */}
            <div className="flex gap-2">
              {(["SINGLE", "MULTIPLE"] as const).map((type) => (
                <label key={type} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    value={type}
                    className="accent-blue-600"
                    {...register(`questions.${questionIndex}.type`)}
                  />
                  <span className="text-sm text-gray-600">
                    {type === "SINGLE" ? "Single correct answer" : "Multiple correct answers"}
                  </span>
                </label>
              ))}
            </div>

            {/* Answers */}
            <AnswerFields questionIndex={questionIndex} />
          </div>
        );
      })}

      {/* Add question button */}
      {fields.length < 10 && (
        <button
          type="button"
          onClick={addQuestion}
          className="w-full py-3 border-2 border-dashed border-gray-300 rounded-2xl text-sm text-gray-400 hover:border-blue-400 hover:text-blue-500 transition font-medium"
        >
          + Add Question
        </button>
      )}

      {errors.questions?.root && (
        <p className="text-xs text-red-500">{errors.questions.root.message}</p>
      )}
    </div>
  );
};

export default QuestionFields;
