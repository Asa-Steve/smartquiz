import React from "react";
import HomePage from "./components/HomePage";
import QuizPage from "./components/QuizPage";

const App = () => {
  return (
    <div className="w-[100vw] h-[100vh] flex justify-center items-center">
      {/* <HomePage /> */}
      <QuizPage />
    </div>
  );
};

export default App;
