import { Suspense, lazy } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Analytics } from "@vercel/analytics/react";
import ProtectedRoute from "@/components/ProtectedRoute";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LanguageProvider } from "@/i18n/LanguageContext";

const ROUTER_FUTURE_FLAGS = {
  v7_startTransition: true,
  v7_relativeSplatPath: true,
} as const;

const Index = lazy(() => import("./pages/Index.tsx"));
const AboutPage = lazy(() => import("./pages/AboutPage.tsx"));
const TeamPage = lazy(() => import("./pages/TeamPage.tsx"));
const ProjectsPage = lazy(() => import("./pages/ProjectsPage.tsx"));
const InvestPage = lazy(() => import("./pages/InvestPage.tsx"));
const FinancingPage = lazy(() => import("./pages/FinancingPage.tsx"));
const TestimonialsPage = lazy(() => import("./pages/TestimonialsPage.tsx"));
const ContactPage = lazy(() => import("./pages/ContactPage.tsx"));
const LoginPage = lazy(() => import("./pages/LoginPage.tsx"));
const AdminPage = lazy(() => import("./pages/AdminPage.tsx"));
const NotFound = lazy(() => import("./pages/NotFound.tsx"));

const queryClient = new QueryClient();

const RouteFallback = () => (
  <div className="min-h-screen bg-background flex items-center justify-center px-4">
    <div className="text-center space-y-3">
      <div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-primary/20 border-t-primary" />
      <p className="text-sm text-muted-foreground">Cargando...</p>
    </div>
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <LanguageProvider>
        <Toaster />
        <BrowserRouter future={ROUTER_FUTURE_FLAGS}>
          <Suspense fallback={<RouteFallback />}>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/sobre-iveth" element={<AboutPage />} />
              <Route path="/equipo" element={<TeamPage />} />
              <Route path="/proyectos" element={<ProjectsPage />} />
              <Route path="/invertir-en-florida" element={<InvestPage />} />
              <Route path="/financiamiento" element={<FinancingPage />} />
              <Route path="/testimonios" element={<TestimonialsPage />} />
              <Route path="/contacto" element={<ContactPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route
                path="/admin"
                element={(
                  <ProtectedRoute>
                    <AdminPage />
                  </ProtectedRoute>
                )}
              />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
        <Analytics />
      </LanguageProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
