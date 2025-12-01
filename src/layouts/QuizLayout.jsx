import { Navigate, Outlet } from "react-router";

const QuizLayout = () => {
  const isAuthenticated = true;

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default QuizLayout;
