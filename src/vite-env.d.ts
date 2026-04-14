/// <reference types="vite/client" />

declare module "react" {
  interface ImgHTMLAttributes<T> {
    fetchpriority?: "high" | "low" | "auto";
  }
}
