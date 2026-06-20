import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/axios";
import type { AdminQuestion, AdminQuiz, ApiResponse } from "@/types";

export function useAdminQuiz(lessonId: string | undefined) {
  return useQuery({
    queryKey: ["admin-quiz", lessonId],
    queryFn: async () => {
      const res = await api.get<ApiResponse<AdminQuiz>>(
        `/admin/lessons/${lessonId}/quiz`,
      );
      return res.data.data;
    },
    enabled: !!lessonId,
    retry: false,
  });
}

interface QuestionRequest {
  content: string;
  options: string[];
  correctOption: number;
  correctAnswerText?: string | null;
  correctOrder?: number[] | null;
}

export function useUpdateQuestionMutation(lessonId: string | undefined) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      questionId,
      data,
    }: {
      questionId: number;
      data: QuestionRequest;
    }) => {
      const res = await api.put<ApiResponse<AdminQuestion>>(
        `/admin/questions/${questionId}`,
        data,
      );
      return res.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-quiz", lessonId] });
    },
  });
}

export function useCreateQuizMutation(lessonId: string | undefined) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (passScore: number) => {
      const res = await api.post<ApiResponse<AdminQuiz>>(
        `/admin/lessons/${lessonId}/quiz`,
        { passScore },
      );
      return res.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-quiz", lessonId] });
    },
  });
}

export function useDeleteQuizMutation(lessonId: string | undefined) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (quizId: number) => {
      await api.delete(`/admin/quizzes/${quizId}`);
    },
    onSuccess: () => {
      queryClient.setQueryData(["admin-quiz", lessonId], undefined);
    },
  });
}
