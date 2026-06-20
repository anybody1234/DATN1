import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/axios";
import type { ApiResponse } from "@/types";

interface PaymentDto {
  courseId: number;
  amount: number;
  status: string;
  paymentUrl: string | null;
}

export function useCreatePaymentMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (courseId: number) => {
      const res = await api.post<ApiResponse<PaymentDto>>(
        `/payments/create?courseId=${courseId}`,
      );
      return res.data.data;
    },
    onSuccess: (data) => {
      // Khóa miễn phí enroll ngay — invalidate enrollment cache tức thì
      if (data.status === "SUCCESS") {
        queryClient.invalidateQueries({
          queryKey: ["enrollment", String(data.courseId)],
        });
        queryClient.invalidateQueries({ queryKey: ["my-courses"] });
      }
    },
  });
}
