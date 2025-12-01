import { Icon } from "@iconify/react";
import { Button } from "./ui/button";
import { useState } from "react";

const LoginForm = () => {
  const [showPw, setShowPw] = useState(false);

  return (
    <div className="h-full *:rounded-[8px] px-4 flex flex-col gap-[10px] mb-[1rem] pb-2 text-start md:text-inherit">
      <h2 className="mt-4 mb-4 text-2xl font-bold uppercase">
        Login To get started!
      </h2>
      <form className="flex flex-col gap-4">
        <div className="flex flex-col">
          <label htmlFor="username" className="mb-1 font-medium">
            Username
          </label>
          <input
            type="text"
            id="username"
            placeholder="Dev Steve"
            className="border border-gray-400 h-[40px] rounded-[8px] p-2 focus:outline-none"
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="password" className="mb-1 font-medium">
            Password
          </label>
          <div className="flex border border-gray-400 h-[40px] rounded-[8px] overflow-hidden items-center">
            <input
              type={showPw ? "text" : "password"}
              id="password"
              placeholder="********"
              className="h-full p-2 w-[90%] rounded-[8px] focus:outline-none"
            />
            <Icon
              icon={showPw ? "mdi-light:eye" : "mdi-light:eye-off"}
              className="cursor-pointer size-6"
              onClick={() => setShowPw((prev) => !prev)}
            />
          </div>
        </div>
        <Button className="hover:bg-[#02C7DB] hover:border-none">Login</Button>
      </form>
    </div>
  );
};

export default LoginForm;
