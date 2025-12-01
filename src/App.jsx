import React from "react";
import HomePage from "./components/HomePage";
import QuizPage from "./components/QuizPage";
import { Route, Routes } from "react-router";
import MainLayout from "./layouts/MainLayout";
import QuizLayout from "./layouts/QuizLayout";
import InitialstateContext from "./components/context/InitialstateContext";

const App = () => {
  return (
    <InitialstateContext>
      <Routes>
        {/* MainLayout wrapper */}
        <Route path="/" element={<MainLayout />}>
          <Route index element={<HomePage />} />
        </Route>
        {/* QuizLayout wrapper */}
        <Route path="/quiz" element={<QuizLayout />}>
          <Route index element={<QuizPage />} />
        </Route>
      </Routes>
    </InitialstateContext>
  );
};

export default App;
