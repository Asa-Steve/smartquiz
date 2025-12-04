import { Outlet } from "react-router";

const MainLayout = () => {
  return (
    <div className="w-[100vw] h-[100vh]">
      <Outlet />
    </div>
  );
};

export default MainLayout;
