import { useState } from "react";
import AnimatedBox from "./AnimatedBox";
import Start from "./Start";

function getRandomSize() {
  return Math.floor(Math.random() * 100 + 100); // Random size between 100 and 200
}

const HomePage = () => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <div className="absolute w-full h-[100vh] bg-[#01161e]"></div>

      {/* Animated blue box */}
      <AnimatedBox size={getRandomSize()} />
      <AnimatedBox bgColor={"#c1121f"} size={getRandomSize()} />
      <AnimatedBox bgColor={"#fff"} size={getRandomSize()} />

      <div className="relative flex flex-col items-center justify-center w-full h-full gap-20 p-4 overflow-hidden font-bold backdrop-blur-[40px] bg-[hsla(221,51%,16%,0.6)]">
        <h1 className="font-bold text-white md:text-[4rem] text-center">
          Welcome to this Awesome <br />
          Quiz App
        </h1>
        <button
          onClick={() => setOpen(true)}
          className="w-[200px] bg-transparent outline outline-white outline-offset-2 p-2 rounded hover:bg-white hover:text-[#01161e] text-white transition-all duration-300"
        >
          Start Quiz
        </button>
      </div>
      <Start open={open} setOpen={setOpen} />
    </>
  );
};

export default HomePage;
