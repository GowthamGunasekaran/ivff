/**
 * @file IdppRouterHandler.jsx
 * @description Root router component wrapping the app with BrowserRouter, AppProvider context,
 * and defining the main route to LandingPage.
 */

import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppProvider } from "../AppContext";
import LandingPage from "../pages/LandingPage";

export default function IdppRouterHandler() {
  return (
    <BrowserRouter>
      <AppProvider>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/load-optimizer" element={<LandingPage />} />
          <Route path="/qc-email-agent" element={<LandingPage />} />
          <Route path="*" element={<LandingPage />} />
        </Routes>
      </AppProvider>
    </BrowserRouter>
  );
}
