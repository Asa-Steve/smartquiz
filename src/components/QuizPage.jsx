const QuizPage = () => {
  return (
    <div className="border-2 border-black h-[100vh] flex items-center w-[100vw] p-2">
      <div className="w-[calc(100%-400px)] h-full flex flex-col gap-2 p-3 border-2 border-red-500">
        <div className="bg-red-400 h-[40%]"></div>
        <div className="bg-amber-950 h-[60%]"></div>
      </div>
      <div className="bg-blue-500 border-2 h-full w-[400px] flex flex-col gap-2 p-2">
        <div className="bg-black h-[30%]"></div>
        <div className="bg-yellow-500 h-[70%]"></div>
      </div>
    </div>
  );
};

export default QuizPage;
