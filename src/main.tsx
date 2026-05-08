import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Self-hosted fonts (Phase 3 Optimization)
import "@fontsource/inter/300.css";
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";
import "@fontsource/inter/700.css";

import "@fontsource/playfair-display/400.css";
import "@fontsource/playfair-display/400-italic.css";
import "@fontsource/playfair-display/500.css";
import "@fontsource/playfair-display/500-italic.css";
import "@fontsource/playfair-display/600.css";
import "@fontsource/playfair-display/600-italic.css";
import "@fontsource/playfair-display/700.css";
import "@fontsource/playfair-display/700-italic.css";

createRoot(document.getElementById("root")!).render(<App />);

