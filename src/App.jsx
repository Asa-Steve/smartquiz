import React from "react";
import HomePage from "./components/HomePage";
import QuizPage from "./components/QuizPage";
import { Route, Routes } from "react-router";
import MainLayout from "./layouts/MainLayout";
import QuizLayout from "./layouts/QuizLayout";
import InitialstateContext from "./context/InitialstateContext";
import Verify from "./components/Verify";
import AuthProvider from "./context/AuthContext";

const App = () => {
  return (
    <AuthProvider>
      <InitialstateContext>
        <Routes>
          {/* MainLayout wrapper */}
          <Route path="/" element={<MainLayout />}>
            <Route index element={<HomePage />} />
            <Route path="/verify" element={<Verify />} />
          </Route>
          {/* QuizLayout wrapper */}
          <Route path="/quiz" element={<QuizLayout />}>
            <Route index element={<QuizPage />} />
          </Route>
        </Routes>
      </InitialstateContext>
    </AuthProvider>
  );
};

export default App;
