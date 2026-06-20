import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/axios";
import type { ApiResponse, Lesson } from "@/types";

export function useLessonDetail(lessonId: string | undefined) {
  const valid = !!lessonId && !isNaN(Number(lessonId));
  return useQuery({
    queryKey: ["lesson", Number(lessonId)],
    queryFn: () =>
      api
        .get<ApiResponse<Lesson>>(`/lessons/${lessonId}`)
        .then((r) => r.data.data),
    enabled: valid,
  });
}

export function useProgressMutation(
  lessonId: string | undefined,
  courseId: string | undefined,
) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (watchedSeconds: number) =>
      api.post(`/lessons/${lessonId}/progress`, { watchedSeconds }),
    onSuccess: () => {
      if (lessonId) {
        queryClient.invalidateQueries({
          queryKey: ["lesson", Number(lessonId)],
        });
      }
      queryClient.invalidateQueries({ queryKey: ["lessons", courseId] });
      queryClient.invalidateQueries({ queryKey: ["course", courseId] }); // string key khớp với useCourse hook
      queryClient.invalidateQueries({ queryKey: ["my-courses"] });
      queryClient.invalidateQueries({ queryKey: ["streak"] });
    },
  });
}
