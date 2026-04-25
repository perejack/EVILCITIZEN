import { Routes, Route } from "react-router-dom";
import HomePage from "./routes/index";
import NationalPage from "./routes/national";
import CountiesPage from "./routes/counties";
import HelpPage from "./routes/help";
import LoginPage from "./routes/login";
import KraPage from "./routes/kra";
import CrbPage from "./routes/crb";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/national" element={<NationalPage />} />
      <Route path="/counties" element={<CountiesPage />} />
      <Route path="/help" element={<HelpPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/kra" element={<KraPage />} />
      <Route path="/crb" element={<CrbPage />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}
