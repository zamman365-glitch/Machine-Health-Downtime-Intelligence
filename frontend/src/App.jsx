import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Navbar } from "./components/Navbar";
import { LandingPage } from "./pages/LandingPage";
import { PredictorPage } from "./pages/PredictorPage";
import { NotFoundPage } from "./pages/NotFoundPage";
import { ToastContainer } from "./components/Toast";

import { useTheme } from "./hooks/useTheme";
import { useApiHealth } from "./hooks/useApiHealth";
import { useToasts } from "./hooks/useToasts";

export default function App() {
  const { theme, toggleTheme } = useTheme();
  const { isOnline, isChecking } = useApiHealth();
  const { toasts, addToast, removeToast } = useToasts();

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-slate-50 dark:bg-[#0b0f19] text-slate-900 dark:text-slate-100 font-sans transition-colors duration-200">
        {/* Navigation Bar */}
        <Navbar
          isOnline={isOnline}
          isChecking={isChecking}
          theme={theme}
          onToggleTheme={toggleTheme}
        />

        {/* Page Routes */}
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route
            path="/predict"
            element={<PredictorPage onShowToast={addToast} theme={theme} />}
          />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>

        {/* Global Toast Container */}
        <ToastContainer toasts={toasts} onClose={removeToast} />
      </div>
    </BrowserRouter>
  );
}
