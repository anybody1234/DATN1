import { useQuery } from "@tanstack/react-query";
import api from "@/lib/axios";
import type {
  ApiResponse,
  AttemptReview,
  Course,
  QuizAttempt,
  UserStreak,
} from "@/types";

export function useStreak() {
  return useQuery({
    queryKey: ["streak"],
    queryFn: () =>
      api
        .get<ApiResponse<UserStreak>>("/users/me/streak")
        .then((r) => r.data.data),
  });
}

export function useMyCourses() {
  return useQuery({
    queryKey: ["my-courses"],
    queryFn: () =>
      api
        .get<ApiResponse<Course[]>>("/users/me/courses")
        .then((r) => r.data.data),
  });
}

export function useRecentAttempts(size = 5) {
  return useQuery({
    queryKey: ["recent-attempts", size], // size trong key để tránh cache miss khi thay đổi
    queryFn: () =>
      api
        .get<ApiResponse<QuizAttempt[]>>(`/users/me/quiz-attempts?size=${size}`)
        .then((r) => r.data.data),
  });
}

export function useAttemptReview(attemptId: number | null) {
  return useQuery({
    queryKey: ["attempt-review", attemptId],
    queryFn: () =>
      api
        .get<ApiResponse<AttemptReview>>(`/users/me/quiz-attempts/${attemptId}`)
        .then((r) => r.data.data),
    enabled: attemptId !== null,
  });
}
