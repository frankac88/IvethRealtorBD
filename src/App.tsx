import { Suspense, lazy, useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";

import ProtectedRoute from "@/components/ProtectedRoute";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LanguageProvider, useLanguage } from "@/i18n/LanguageContext";
import { getLanguageForPath, getLocalizedPaths, type LocalizedRouteKey } from "@/i18n/routes";

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

const publicRoutes: Array<{ key: LocalizedRouteKey; element: JSX.Element }> = [
  { key: "home", element: <Index /> },
  { key: "about", element: <AboutPage /> },
  { key: "team", element: <TeamPage /> },
  { key: "projects", element: <ProjectsPage /> },
  { key: "invest", element: <InvestPage /> },
  { key: "financing", element: <FinancingPage /> },
  { key: "testimonials", element: <TestimonialsPage /> },
  { key: "contact", element: <ContactPage /> },
];

const LanguageRouteSync = () => {
  const location = useLocation();
  const { language, setLanguage } = useLanguage();

  useEffect(() => {
    const routeLanguage = getLanguageForPath(location.pathname);
    if (routeLanguage && routeLanguage !== language) {
      setLanguage(routeLanguage);
    }
  }, [language, location.pathname, setLanguage]);

  return null;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <BrowserRouter future={ROUTER_FUTURE_FLAGS}>
        <LanguageProvider>
          <Toaster />
          <LanguageRouteSync />
          <Suspense fallback={<RouteFallback />}>
            <Routes>
              {publicRoutes.flatMap((route) =>
                getLocalizedPaths(route.key).map((path) => (
                  <Route key={`${route.key}-${path}`} path={path} element={route.element} />
                )),
              )}
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
        </LanguageProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
