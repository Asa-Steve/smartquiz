import { useAuthProvider } from "@/context/AuthContext";
import { useInitialStateContext } from "@/context/InitialstateContext";
import { Navigate, Outlet } from "react-router";

const QuizLayout = () => {
  const auth = useAuthProvider();
  const {user} = auth || {};
  const {state:{questions}} = useInitialStateContext();

  const isAuthenticated = user?.username ? true : false;

  if (!isAuthenticated || !questions?.length) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default QuizLayout;
