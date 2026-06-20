import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Layout } from "@/components/Layout";
import { AdminLayout } from "@/components/AdminLayout";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { AdminRoute } from "@/components/AdminRoute";
import { AuthRoute } from "@/components/AuthRoute";
import { useBootstrapAuth } from "@/hooks/useBootstrapAuth";
import { LandingPage } from "@/pages/LandingPage";
import { LoginPage } from "@/pages/LoginPage";
import { RegisterPage } from "@/pages/RegisterPage";
import { DashboardPage } from "@/pages/DashboardPage";
import { CoursesPage } from "@/pages/CoursesPage";
import { CourseDetailPage } from "@/pages/CourseDetailPage";
import { LessonPage } from "@/pages/LessonPage";
import { QuizPage } from "@/pages/QuizPage";
import { AdminCoursesPage } from "@/pages/admin/AdminCoursesPage";
import { AdminLessonsPage } from "@/pages/admin/AdminLessonsPage";
import { AdminQuizPage } from "@/pages/admin/AdminQuizPage";
import { PaymentResultPage } from "@/pages/PaymentResultPage";
import { NotFoundPage } from "@/pages/NotFoundPage";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 2,
      retry: 1,
    },
  },
});

function AppRoutes() {
  const initializing = useBootstrapAuth();

  if (initializing) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <div className="w-5 h-5 rounded-full border-2 border-acc border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<LandingPage />} />

        <Route element={<AuthRoute />}>
          <Route path="dang-nhap" element={<LoginPage />} />
          <Route path="dang-ky" element={<RegisterPage />} />
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="khoa-hoc" element={<CoursesPage />} />
          <Route path="khoa-hoc/:courseId" element={<CourseDetailPage />} />
          <Route
            path="khoa-hoc/:courseId/bai-hoc/:lessonId"
            element={<LessonPage />}
          />
          <Route
            path="khoa-hoc/:courseId/bai-hoc/:lessonId/quiz"
            element={<QuizPage />}
          />
          <Route path="thanh-toan/ket-qua" element={<PaymentResultPage />} />
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Route>

      {/* Admin — layout riêng, không dùng student Layout */}
      <Route element={<AdminRoute />}>
        <Route element={<AdminLayout />}>
          <Route
            path="admin"
            element={<Navigate to="/admin/khoa-hoc" replace />}
          />
          <Route path="admin/khoa-hoc" element={<AdminCoursesPage />} />
          <Route
            path="admin/khoa-hoc/:courseId/bai-hoc"
            element={<AdminLessonsPage />}
          />
          <Route
            path="admin/khoa-hoc/:courseId/bai-hoc/:lessonId/quiz"
            element={<AdminQuizPage />}
          />
        </Route>
      </Route>
    </Routes>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </QueryClientProvider>
  );
}
