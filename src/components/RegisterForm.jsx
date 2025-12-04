import { Icon } from "@iconify/react";
import { Button } from "./ui/button";
import { useState } from "react";
import { emailRegex } from "@/helpers/helper";
import { useAuthProvider } from "@/context/AuthContext";
import { Spinner } from "./ui/spinner";

const RegisterForm = () => {
  const [showPw, setShowPw] = useState(false);
  const [isErr, setIsErr] = useState(false);
  const { register, isRegisteringUser } = useAuthProvider();
  const [formD, setFormD] = useState({
    username: "",
    email: "",
    password: "",
    confirm: "",
  });

  function handleSubmit(e) {
    e.preventDefault();
    let isErrorFound = false;

    for (let [_, val] of Object.entries(formD)) {
      if (val == "") {
        isErrorFound = true;
        break;
      }
    }

    if (formD.password != formD.confirm) {
      isErrorFound = true;
    }
    if (!emailRegex.test(formD.email)) {
      isErrorFound = true;
    }

    if (isErrorFound) {
      setIsErr(isErrorFound);
      return;
    }

    const { confirm, ...others } = formD;
    register(others);
  }

  return (
    <div className="h-full *:rounded-[8px] px-4 flex flex-col gap-[10px] mb-[1rem] pb-2 text-start">
      <h2 className="mt-4 mb-4 text-2xl font-bold uppercase">
        Register To get started!
      </h2>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <div className="flex flex-col">
          <label htmlFor="username" className="mb-1 font-medium">
            Username
          </label>
          <input
            type="text"
            id="username"
            placeholder="Dev Steve"
            className="border border-gray-400 h-[40px] rounded-[8px] p-2 focus:outline-none"
            value={formD?.username ?? ""}
            style={
              isErr && !formD?.username
                ? {
                    outline: "1px solid red",
                    outlineOffset: "2px",
                  }
                : {}
            }
            onChange={(e) =>
              setFormD((prev) => ({ ...prev, username: e.target.value }))
            }
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="email" className="mb-1 font-medium">
            Email
          </label>
          <div
            className="flex border border-gray-400 h-[40px] rounded-[8px] overflow-hidden items-center"
            style={
              isErr && (!formD?.email || !emailRegex.test(formD.email))
                ? {
                    outline: "1px solid red",
                    outlineOffset: "2px",
                  }
                : {}
            }
          >
            <input
              type="text"
              id="email"
              placeholder="devsteve@example.com"
              className="h-full p-2 w-full rounded-[8px] focus:outline-none"
              value={formD?.email ?? ""}
              onChange={(e) =>
                setFormD((prev) => ({ ...prev, email: e.target.value }))
              }
            />
          </div>
        </div>
        <div className="flex flex-col gap-2 md:flex-row">
          <div className="flex flex-col">
            <label htmlFor="password" className="mb-1 font-medium">
              Password
            </label>
            <div
              className="flex border border-gray-400 h-[40px] rounded-[8px] overflow-hidden items-center"
              style={
                isErr && !formD?.password
                  ? {
                      outline: "1px solid red",
                      outlineOffset: "2px",
                    }
                  : {}
              }
            >
              <input
                type={showPw ? "text" : "password"}
                id="password"
                placeholder="at least 6 characters"
                className="h-full p-2 w-[90%] rounded-[8px] focus:outline-none"
                value={formD?.password ?? ""}
                onChange={(e) =>
                  setFormD((prev) => ({ ...prev, password: e.target.value }))
                }
              />
              <Icon
                icon={showPw ? "mdi-light:eye" : "mdi-light:eye-off"}
                className="cursor-pointer size-6"
                onClick={() => setShowPw((prev) => !prev)}
              />
            </div>
          </div>
          <div className="flex flex-col">
            <label htmlFor="confirmPw" className="mb-1 font-medium">
              Confirm Password
            </label>
            <input
              type={showPw ? "text" : "password"}
              id="confirmPw"
              placeholder="********"
              className="p-2 w-full border border-gray-400 h-[40px] rounded-[8px] overflow-hidden focus:outline-none"
              value={formD?.confirm ?? ""}
              style={
                isErr && (!formD?.confirm || formD.confirm != formD.password)
                  ? {
                      outline: "1px solid red",
                      outlineOffset: "2px",
                    }
                  : {}
              }
              onChange={(e) =>
                setFormD((prev) => ({ ...prev, confirm: e.target.value }))
              }
            />
          </div>
        </div>

        <Button
          className="hover:bg-[#02C7DB] hover:border-none disabled:cursor-not-allowed disabled:opacity-60"
          disabled={isRegisteringUser}
        >
          {isRegisteringUser ? <Spinner /> : "Register"}
        </Button>
      </form>
    </div>
  );
};

export default RegisterForm;
