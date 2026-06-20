export interface User {
  id: number;
  email: string;
  role: "STUDENT" | "ADMIN";
  createdAt: string;
}

export interface Level {
  id: number;
  name: string;
  description: string;
  order: number;
  courseCount?: number;
}

export interface Course {
  id: number;
  levelId: number;
  levelName?: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  order: number;
  lessonCount?: number;
  completedLessons?: number;
  hidden?: boolean;
  price: number;
}

export interface Lesson {
  id: number;
  courseId: number;
  title: string;
  videoUrl: string;
  duration: number;
  order: number;
  completed?: boolean;
  watchedSeconds?: number;
}

export interface Question {
  id: number;
  quizId: number;
  content: string;
  options: string[];
  orderIndex: number;
  questionType: "VOCABULARY" | "CONTENT" | "SEQUENCE";
  // correctOption không có trong GET /quiz — chỉ xuất hiện trong QuestionResult sau khi nộp bài
}

export interface Quiz {
  id: number;
  lessonId: number;
  passScore: number;
  questions: Question[];
}

export interface AdminQuestion {
  id: number;
  quizId: number;
  content: string;
  options: string[];
  correctOption: number;
  correctAnswerText: string | null;
  correctOrder: number[] | null;
  orderIndex: number;
  questionType: "VOCABULARY" | "CONTENT" | "SEQUENCE";
}

export interface AdminQuiz {
  id: number;
  lessonId: number;
  passScore: number;
  questions: AdminQuestion[];
}

// Đáp án gửi lên / nhận về theo loại câu hỏi:
// VOCABULARY -> số (index 0-3), CONTENT -> chuỗi, SEQUENCE -> mảng index theo thứ tự click
export type AnswerValue = number | string | number[];

export interface QuestionResult {
  questionId: number;
  questionType: "VOCABULARY" | "CONTENT" | "SEQUENCE";
  correctOption: number | null;
  correctAnswerText: string | null;
  correctOrder: number[] | null;
  selectedAnswer: AnswerValue | null;
}

export interface QuestionReview {
  id: number;
  content: string;
  options: string[];
  questionType: "VOCABULARY" | "CONTENT" | "SEQUENCE";
  orderIndex: number;
  correctOption: number | null;
  correctAnswerText: string | null;
  correctOrder: number[] | null;
  selectedAnswer: AnswerValue | null;
}

export interface AttemptReview {
  id: number;
  lessonTitle: string;
  lessonId: number;
  courseId: number;
  score: number;
  passScore: number;
  passed: boolean;
  attemptedAt: string;
  questions: QuestionReview[];
}

export interface QuizAttempt {
  id: number;
  quizId: number;
  score: number;
  answers: Record<string, AnswerValue>;
  attemptedAt: string;
  passed: boolean;
  results: QuestionResult[]; // kết quả từng câu — chỉ có sau khi nộp
  lessonTitle?: string;
  lessonId?: number;
  courseId?: number;
}

export interface UserStreak {
  currentStreak: number;
  longestStreak: number;
  lastActivityDate: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface ApiError {
  success: false;
  error: {
    code: string;
    message: string;
  };
}

export interface PaginatedData<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  page: number;
  size: number;
}
