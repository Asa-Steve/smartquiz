import { useAuthProvider } from "@/context/AuthContext";
import { useInitialStateContext } from "@/context/InitialstateContext";
import { Navigate, Outlet } from "react-router";

const QuizLayout = () => {
  const { user } = useAuthProvider();
  const { questions } = useInitialStateContext();
  const isAuthenticated = user?.username ? true : false;

  if (!isAuthenticated || !questions?.length) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default QuizLayout;
