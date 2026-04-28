import React from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { MembersPage } from "./pages/MembersPage";
import { FeesPage } from "./pages/FeesPage";
import { DashboardPage } from "./pages/DashboardPage";
import { AppLayout } from "./components/layout/AppLayout";
import { GymDataProvider } from "./context/GymDataContext";

export default function App() {
  return (
    <BrowserRouter>
      <GymDataProvider>
        <Routes>
          <Route element={<AppLayout />}>
            <Route index element={<DashboardPage />} />
            <Route path="/members" element={<MembersPage />} />
            <Route path="/fees" element={<FeesPage />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </GymDataProvider>
    </BrowserRouter>
  );
}