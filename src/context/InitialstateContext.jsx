import { reducer } from "@/helpers/reducer";
import { createContext, useContext, useReducer } from "react";

const stateContext = createContext();

const initialState = {
  questions: [],
  choice: null,
  allowedTime: 0,
  totalTime: 0,
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
  // const [initialState, setInitialState] = useState(initialSt);
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <stateContext.Provider value={{ state, dispatch }}>
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
