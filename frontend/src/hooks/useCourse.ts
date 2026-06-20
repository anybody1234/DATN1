import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/axios";
import type { ApiResponse, Course, Lesson, Level } from "@/types";

// Dùng string key nhất quán để tránh cache miss khi mix string/number courseId
export function useCourse(courseId: string | undefined) {
  return useQuery({
    queryKey: ["course", courseId],
    queryFn: () =>
      api
        .get<ApiResponse<Course>>(`/courses/${courseId}`)
        .then((r) => r.data.data),
    enabled: !!courseId,
  });
}

export function useEnrollment(courseId: string | undefined) {
  return useQuery({
    queryKey: ["enrollment", courseId],
    queryFn: () =>
      api
        .get<ApiResponse<boolean>>(`/courses/${courseId}/enrollment`)
        .then((r) => r.data.data),
    enabled: !!courseId,
  });
}

export function useCourseLessons(courseId: string | undefined) {
  return useQuery({
    queryKey: ["lessons", courseId],
    queryFn: () =>
      api
        .get<ApiResponse<Lesson[]>>(`/courses/${courseId}/lessons`)
        .then((r) => r.data.data),
    enabled: !!courseId,
  });
}

export function useEnrollMutation(courseId: string | undefined) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => api.post(`/courses/${courseId}/enroll`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["enrollment", courseId] });
      queryClient.invalidateQueries({ queryKey: ["my-courses"] });
    },
  });
}

export function useLevels() {
  return useQuery({
    queryKey: ["levels"],
    queryFn: () =>
      api.get<ApiResponse<Level[]>>("/levels").then((r) => r.data.data),
  });
}

export function useAllCourses(levelId: number | null) {
  return useQuery({
    queryKey: ["courses", levelId],
    queryFn: () => {
      const url = levelId ? `/courses?levelId=${levelId}` : "/courses";
      return api.get<ApiResponse<Course[]>>(url).then((r) => r.data.data);
    },
  });
}
