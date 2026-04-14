import type { FunctionComponent } from "react";
import { useFieldArray, useFormContext, useWatch } from "react-hook-form";
import type { QuizFormValues } from "../../lib/quizSchema";

interface AnswerFieldsProps {
  questionIndex: number;
}

const AnswerFields: FunctionComponent<AnswerFieldsProps> = ({ questionIndex }) => {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext<QuizFormValues>();

  const { fields, append, remove } = useFieldArray({
    control,
    name: `questions.${questionIndex}.answers`,
  });

  const questionType = useWatch({
    control,
    name: `questions.${questionIndex}.type`,
  });

  const answers = useWatch({
    control,
    name: `questions.${questionIndex}.answers`,
  });

  const correctCount = answers?.filter((answer) => answer.isCorrect).length ?? 0;

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Answers</p>

        {questionType === "SINGLE" && correctCount > 1 && (
          <p className="text-xs text-red-500">Single choice must have exactly 1 correct answer</p>
        )}

        {questionType === "MULTIPLE" && correctCount === 0 && fields.length > 0 && (
          <p className="text-xs text-red-500">Select at least 1 correct answer</p>
        )}
      </div>

      {fields.map((field, answerIndex) => {
        const answerError = errors.questions?.[questionIndex]?.answers?.[answerIndex]?.text;

        return (
          <div
            key={field.id}
            className="flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2"
          >
            {/* Correct answer checkbox */}
            <input
              type="checkbox"
              className="w-4 h-4 accent-blue-600 shrink-0 cursor-pointer"
              title="Mark as correct answer"
              {...register(`questions.${questionIndex}.answers.${answerIndex}.isCorrect`, {
                setValueAs: (value) => Boolean(value),
              })}
            />

            {/* Answer text */}
            <input
              type="text"
              placeholder={`Answer ${answerIndex + 1}`}
              className={`flex-1 text-sm bg-transparent outline-none placeholder-gray-400
                ${answerError ? "text-red-500" : "text-gray-800"}`}
              {...register(`questions.${questionIndex}.answers.${answerIndex}.text`)}
            />

            {/* Error */}
            {answerError && <p className="text-xs text-red-500 shrink-0">Required</p>}

            {/* Remove answer */}
            {fields.length > 1 && (
              <button
                type="button"
                onClick={() => remove(answerIndex)}
                title="Remove answer"
                className="text-gray-300 mb-0.5 cursor-pointer hover:text-red-400 transition text-lg leading-none shrink-0"
              >
                x
              </button>
            )}
          </div>
        );
      })}

      {/* Add answer button */}
      {fields.length < 5 && (
        <button
          type="button"
          onClick={() => append({ text: "", isCorrect: false })}
          className="text-sm w-fit cursor-pointer text-blue-600 hover:text-blue-800 font-medium text-left transition mt-1"
        >
          + Add answer
        </button>
      )}

      {errors.questions?.[questionIndex]?.answers?.root && (
        <p className="text-xs text-red-500">
          {errors.questions[questionIndex].answers.root?.message}
        </p>
      )}
    </div>
  );
};

export default AnswerFields;
