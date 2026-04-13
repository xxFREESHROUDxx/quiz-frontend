export interface Answer {
  id: string;
  text: string;
  isCorrect?: boolean; // present in owner view, absent in public view
}

export interface Question {
  id: string;
  text: string;
  type: "SINGLE" | "MULTIPLE";
  answers: Answer[];
}

export interface Quiz {
  id: string;
  title: string;
  isPublished: boolean;
  permalink: string | null;
  userId?: string;
  questions: Question[];
  _count?: {
    questions: number;
  };
}

export interface User {
  id: string;
  email: string;
}

export interface AuthState {
  token: string | null;
  user: User | null;
}
