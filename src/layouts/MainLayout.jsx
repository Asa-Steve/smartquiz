import { Outlet } from "react-router";

const MainLayout = () => {
  return (
    <div className="w-[100vw] h-[100vh] overflow-hidden flex justify-center items-center">
      {<Outlet />}
    </div>
  );
};

export default MainLayout;
