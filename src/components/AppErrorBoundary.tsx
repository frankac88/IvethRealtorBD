import { Component, type ErrorInfo, type ReactNode } from "react";

type AppErrorBoundaryProps = {
  children: ReactNode;
};

type AppErrorBoundaryState = {
  hasError: boolean;
};

const boundaryCopy = {
  es: {
    title: "Algo salió mal",
    description: "No pudimos cargar esta vista correctamente. Intenta recargar la página.",
    cta: "Recargar página",
  },
  en: {
    title: "Something went wrong",
    description: "We could not load this view correctly. Please try refreshing the page.",
    cta: "Reload page",
  },
} as const;

export default class AppErrorBoundary extends Component<AppErrorBoundaryProps, AppErrorBoundaryState> {
  state: AppErrorBoundaryState = {
    hasError: false,
  };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("AppErrorBoundary caught an error:", error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (!this.state.hasError) {
      return this.props.children;
    }

    const language = document.documentElement.lang === "en" ? "en" : "es";
    const copy = boundaryCopy[language];

    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4">
        <div className="max-w-md rounded-[1.75rem] border border-border/70 bg-card px-6 py-8 text-center shadow-[0_24px_64px_rgba(26,31,46,0.12)]">
          <h1 className="font-serif text-3xl text-foreground">{copy.title}</h1>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">{copy.description}</p>
          <button
            type="button"
            onClick={this.handleReload}
            className="mt-6 inline-flex items-center justify-center rounded-full bg-primary px-5 py-3 text-sm font-medium text-primary-foreground transition hover:bg-primary/90"
          >
            {copy.cta}
          </button>
        </div>
      </div>
    );
  }
}
