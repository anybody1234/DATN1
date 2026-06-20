import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/axios";
import type { ApiResponse, Lesson } from "@/types";

const adminLessonsKey = (courseId: string | number | undefined) =>
  ["admin-lessons", courseId !== undefined ? Number(courseId) : null] as const;

export function useAdminLessons(courseId: string | undefined) {
  return useQuery({
    queryKey: adminLessonsKey(courseId),
    queryFn: () =>
      api
        .get<ApiResponse<Lesson[]>>(`/admin/courses/${courseId}/lessons`)
        .then((r) => r.data.data),
    enabled: !!courseId,
  });
}

export function useSaveLessonMutation(courseId: string, lessonId?: number) {
  const queryClient = useQueryClient();
  const isEdit = !!lessonId;
  return useMutation({
    mutationFn: (body: {
      title: string;
      videoUrl: string;
      duration: number;
      orderIndex: number;
    }) =>
      isEdit
        ? api.put(`/admin/lessons/${lessonId}`, body)
        : api.post(`/admin/courses/${courseId}/lessons`, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminLessonsKey(courseId) });
      queryClient.invalidateQueries({ queryKey: ["admin-courses"] });
    },
  });
}

export function useDeleteLessonMutation(courseId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (lessonId: number) => api.delete(`/admin/lessons/${lessonId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminLessonsKey(courseId) });
      queryClient.invalidateQueries({ queryKey: ["admin-courses"] });
    },
  });
}
