import { useState } from "react";
import LoginForm from "./LoginForm";
import { Icon } from "@iconify/react";
import RegisterForm from "./RegisterForm";

const AuthPage = () => {
  const [choice, setChoice] = useState("login");

  return (
    <div className="md:max-h-[500px] overflow-y-auto flex flex-col justify-around md:block h-full">
      <div>
        {choice == "login" && <LoginForm />}
        {choice == "register" && <RegisterForm />}
      </div>
      <div className="flex flex-col gap-3">
        <div className="flex h-[10px] items-center justify-center gap-2">
          <span className="border border-gray-500 w-[20px]"></span>
          <span className="mt-[-4px]">or</span>
          <span className="border  border-gray-500 w-[20px]"></span>
        </div>
        <div className="flex items-start justify-center gap-1 py-1 px-2 mx-auto transition-all duration-300 border border-gray-100 cursor-pointer hover:bg-gray-300 w-fit rounded-[8px]">
          <Icon icon="basil:gmail-outline" className="size-6" />
          <span className="mt-[-1px]">Mail</span>
        </div>
        <div className="text-center">
          {choice == "login" && (
            <>
              <span className="text-sm text-muted-foreground">
                Don't have an account? No Problem,{" "}
              </span>
              <span
                className="font-bold border-b border-gray-900 cursor-pointer ms-1"
                onClick={() => setChoice("register")}
              >
                Create one here
              </span>
            </>
          )}
          {choice == "register" && (
            <>
              <span className="text-sm text-muted-foreground">
                have an account? No Problem,
              </span>
              <span
                className="font-bold border-b border-gray-900 cursor-pointer ms-1"
                onClick={() => setChoice("login")}
              >
                Login here
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
