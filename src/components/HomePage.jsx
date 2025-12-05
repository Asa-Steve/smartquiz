import { useState } from "react";
import AnimatedBox from "./AnimatedBox";
import Start from "./Start";
import { Icon } from "@iconify/react";
import { abbrName } from "@/helpers/helper";
import { useAuthProvider } from "@/context/AuthContext";
import { Spinner } from "./ui/spinner";

function getRandomSize() {
  return Math.floor(Math.random() * 100 + 100); // Random size between 100 and 200
}

const HomePage = () => {
  const [open, setOpen] = useState(false);
  const { user, loadingUser, signOut, isSigningOut } = useAuthProvider();

  const { username } = user || {};

  return (
    <>
      <div className="absolute w-full h-[100vh] bg-[#01161e]"></div>

      {/* Animated blue box */}
      <AnimatedBox size={getRandomSize()} />
      <AnimatedBox bgColor={"#c1121f"} size={getRandomSize()} />
      <AnimatedBox bgColor={"#fff"} size={getRandomSize()} />
      {user && (
        <div className="absolute z-[1] p-1 pe-4 border w-fit border-gray-800 right-[2vw] top-2 bg-white/10 rounded flex items-center gap-2 text-white">
          <img
            src={`https://api.dicebear.com/9.x/fun-emoji/svg?seed=${
              username?.split(" ")[0]
            }&radius=5`}
            alt="avatar"
            className="w-[60px] h-[50px]"
          />
          <div className="w-full">
            <p className="text-gray-300">
              {username?.length > 5 ? abbrName(username) : username}
            </p>

            <div className="flex items-center gap-2 pt-1 text-sm border-t border-gray-700 [&_svg]:hover:text-white [&>p]:hover:text-white w-fit pe-2">
              <p className="w-[15px]">
                {!isSigningOut ? (
                  <Icon
                    icon="lets-icons:on-button-light"
                    className="text-muted-foreground mb-[-2.8px] transition-all delay-75"
                  />
                ) : (
                  <Spinner />
                )}
              </p>
              <p
                className="transition-all delay-300 cursor-pointer text-muted-foreground"
                onClick={signOut}
              >
                Logout
              </p>
            </div>
          </div>
          {user?.highscore > 0 && (
            <p className="absolute z-[1] p-1 pe-4 border w-fit border-gray-800 right-0 bottom-[-2rem] bg-white/10 rounded flex items-center gap-2 text-white">
              <Icon
                className="text-gray-300 size-5"
                icon="streamline-cyber:badge-star-2"
              />
              <span className="text-sm italic font-semibold text-gray-300">
                High score: {user?.highscore}%
              </span>
            </p>
          )}
        </div>
      )}
      <div className="relative flex flex-col items-center justify-center w-full h-full gap-20 p-4 overflow-hidden font-bold backdrop-blur-[40px] bg-[hsla(221,51%,16%,0.6)]">
        <h1 className="font-bold text-white md:text-[4rem] text-center text-[2.5rem]">
          Welcome to the <br />
          SmartQuiz
        </h1>
        <button
          onClick={() => setOpen(true)}
          className="w-[200px] bg-transparent outline outline-white outline-offset-2 p-2 rounded hover:bg-white hover:text-[#01161e] text-white transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-5"
          disabled={loadingUser}
        >
          Start Quiz
        </button>
      </div>
      <Start open={open} setOpen={setOpen} />
    </>
  );
};

export default HomePage;
