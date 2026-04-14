// API (backend) route constants
export const API_ROUTES = {
  AUTH: {
    REGISTER: "/auth/register",
    LOGIN: "/auth/login",
    ME: "/auth/me",
  },
  QUIZZES: {
    GET_ALL_QUIZZES: "/quizzes",
    GET_BY_ID: (id: string) => `/quizzes/${id}`,
    UPDATE: (id: string) => `/quizzes/${id}`,
    DELETE: (id: string) => `/quizzes/${id}`,
    PUBLISH: (id: string) => `/quizzes/${id}/publish`,
  },
  PUBLIC: {
    GET_BY_PERMALINK: (permalink: string) => `/public/${permalink}`,
    SUBMIT: (permalink: string) => `/public/${permalink}/submit`,
  },
};
