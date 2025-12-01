import { createContext, useContext, useState } from "react";
export const stateContext = createContext();

const initialSt = {
  questions: [],
  choice: null,
  allowedTime: 0,
  totalQuestions: 0,
  currentQuestion: 0,
  answer: null,
  totalScore: 0,
  points: 0,
  answers: [],
  topic: "",
  difficulty: "",
  ended: false,
};

const InitialstateContext = ({ children }) => {
  const [initialState, setInitialState] = useState(initialSt);
  return (
    <stateContext.Provider value={{ initialState, setInitialState }}>
      {children}
    </stateContext.Provider>
  );
};

export const useInitialStateContext = () => {
  const initialStateContext = useContext(stateContext);

  if (initialStateContext === undefined) {
    throw new Error("context used out of scope");
  }
  return initialStateContext;
};

export default InitialstateContext;
