import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/axios";
import type { AnswerValue, ApiResponse, Quiz, QuizAttempt } from "@/types";

export function useQuiz(lessonId: string | undefined) {
  const valid = !!lessonId && !isNaN(Number(lessonId));
  return useQuery({
    queryKey: ["quiz", Number(lessonId)],
    queryFn: () =>
      api
        .get<ApiResponse<Quiz>>(`/lessons/${lessonId}/quiz`)
        .then((r) => r.data.data),
    enabled: valid,
    retry: false,
  });
}

export function useSubmitQuiz(
  quizId: number,
  lessonId: number,
  courseId: string,
) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (answers: Record<string, AnswerValue>) =>
      api
        .post<ApiResponse<QuizAttempt>>(`/quizzes/${quizId}/attempts`, {
          answers,
        })
        .then((r) => r.data.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lesson", lessonId] });
      queryClient.invalidateQueries({ queryKey: ["recent-attempts"] });
      queryClient.invalidateQueries({ queryKey: ["lessons", courseId] });
      queryClient.invalidateQueries({ queryKey: ["course", courseId] });
      queryClient.invalidateQueries({ queryKey: ["my-courses"] });
      queryClient.invalidateQueries({ queryKey: ["streak"] });
    },
  });
}
