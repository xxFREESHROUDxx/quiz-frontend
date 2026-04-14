import z from "zod";

export const answerSchema = z.object({
  text: z.string().min(1, "Answer text is required"),
  isCorrect: z.boolean(),
});

export const questionSchema = z
  .object({
    text: z.string().min(1, "Question text is required"),
    type: z.enum(["SINGLE", "MULTIPLE"]),
    answers: z
      .array(answerSchema)
      .min(1, "At least 1 answer is required")
      .max(5, "Maximum 5 answers allowed"),
  })
  .refine(
    (question) => {
      const correctCount = question.answers.filter((a) => a.isCorrect).length;
      if (question.type === "SINGLE") {
        return correctCount === 1; // Exactly 1 for single choice
      } else {
        return correctCount >= 1; // At least 1 for multiple choice
      }
    },
    {
      message: "Question must have at least one correct answer",
      path: ["answers"],
    },
  );

export const quizSchema = z.object({
  title: z.string().min(1, "Title is required"),
  questions: z
    .array(questionSchema)
    .min(1, "At least 1 question is required")
    .max(10, "Maximum 10 questions allowed"),
});

export type AnswerFormValues = z.infer<typeof answerSchema>;
export type QuestionFormValues = z.infer<typeof questionSchema>;
export type QuizFormValues = z.infer<typeof quizSchema>;
