import AnimatedBox from "./AnimatedBox";
import Start from "./Start";

function getRandomSize() {
  return Math.floor(Math.random() * 100 + 100); // Random size between 100 and 200
}

const HomePage = () => {
  return (
    <>
      <div className="absolute w-full h-full bg-[#01161e] border"></div>

      {/* Animated blue box */}
      <AnimatedBox size={getRandomSize()} />
      <AnimatedBox bgColor={"#c1121f"} size={getRandomSize()} />
      <AnimatedBox bgColor={"#fff"} size={getRandomSize()} />

      <div className="relative flex flex-col items-center justify-center w-full gap-20 p-4 font-bold h-full backdrop-blur-[40px] bg-[hsla(221,51%,16%,0.6)]">
        <h1 className="font-bold text-white md:text-[4rem] text-center">
          Welcome to this Awesome <br />
          Quiz App
        </h1>
        <Start />
      </div>
    </>
  );
};

export default HomePage;
