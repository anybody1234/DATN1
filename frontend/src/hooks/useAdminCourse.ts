import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/axios";
import type { ApiResponse, Course, Level } from "@/types";

const ADMIN_COURSES_KEY = ["admin-courses"] as const;

export function useAdminCourses() {
  return useQuery({
    queryKey: ADMIN_COURSES_KEY,
    queryFn: () =>
      api.get<ApiResponse<Course[]>>("/admin/courses").then((r) => r.data.data),
  });
}

export function useAdminLevels() {
  return useQuery({
    queryKey: ["levels"],
    queryFn: () =>
      api.get<ApiResponse<Level[]>>("/levels").then((r) => r.data.data),
  });
}

export function useSaveCourseMutation(courseId?: number) {
  const queryClient = useQueryClient();
  const isEdit = !!courseId;
  return useMutation({
    mutationFn: (body: {
      title: string;
      description: string;
      thumbnailUrl: string;
      levelId: number;
      orderIndex: number;
      price: number;
    }) =>
      isEdit
        ? api.put(`/admin/courses/${courseId}`, body)
        : api.post("/admin/courses", body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_COURSES_KEY });
      queryClient.invalidateQueries({ queryKey: ["courses"] });
    },
  });
}

export function useDeleteCourseMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => api.delete(`/admin/courses/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_COURSES_KEY });
      queryClient.invalidateQueries({ queryKey: ["courses"] });
    },
  });
}

export function useToggleVisibilityMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => api.patch(`/admin/courses/${id}/visibility`),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ADMIN_COURSES_KEY }),
  });
}
