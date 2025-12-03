import { useEffect, useRef, useState } from "react";
import { Button } from "./ui/button";
import { useIsMobile } from "../hooks/useResize";
import SubmitDialogue from "./SubmitDialogue";
import { useInitialStateContext } from "../context/InitialstateContext";

const QuizPage = () => {
  const { state, dispatch } = useInitialStateContext();
  const [secs, setSeconds] = useState(59);
  const [hrs, setHrs] = useState(0);
  const isInitialTick = useRef(true);
  const isMobile = useIsMobile(700);
  const [show, setShow] = useState(false);

  const {
    questions,
    answers,
    difficulty,
    topic,
    allowedTime,
    totalQuestions,
    currentQuestion,
    ended,
  } = state;

  // Hour tick
  useEffect(() => {
    setHrs(Math.floor(allowedTime / 60));
  }, [allowedTime]);

  // Useffect responsible for ticking and tracking time
  useEffect(() => {
    // Timer Update per minite
    function handleTick() {
      dispatch({ type: "tick" });
    }

    // first tick upon start of quiz
    if (isInitialTick.current) {
      handleTick();
      isInitialTick.current = false;
    }
    if (ended) {
      setSeconds(0);
    }

    const timer = setTimeout(() => {
      // tick per minute and resetting seconds timer
      if (secs == 0 && allowedTime && !ended) {
        setSeconds(59);
        handleTick();
      }
      //ticking per second
      if (secs > 0) {
        setSeconds(secs - 1);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [secs, allowedTime, ended, dispatch]);

  return (
    <div className="h-[100vh] flex overflow-hidden relative items-center w-[100vw] lg:p-2">
      {/* Left hand side */}
      <div className="flex flex-col flex-1 h-full gap-2 p-2 lg:p-3">
        {/* Question section */}
        <div className="border border-gray-200 min-h-[30%] md:min-h-[40%] p-2 flex items-center bg-gray-200 justify-center rounded-[8px] relative">
          {isMobile && (
            <div className="absolute flex border border-gray-600 top-1 left-[10px] font-bold py-1 px-3 rounded-[8px] bg-[#01161e]  text-white">
              {hrs ?? 0} {" : "}
              {allowedTime % 60 || 0} : {secs}
            </div>
          )}
          <div className="absolute top-1 right-[10px] font-bold py-1 px-3 rounded-[8px] bg-[#01161e]  text-white">
            Question: {currentQuestion + 1}
          </div>
          <h1 className="text-2xl font-bold text-center">
            {questions[currentQuestion]?.question}
          </h1>
        </div>
        {/* Options section */}
        <div className="border-2 lg:p-3 bg-[#01161e] lg:flex-1 md:h-[60%] min-h-[40%] overflow-x-hidden overflow-y-auto rounded-[8px] flex flex-col items-center justify-center lg:grid  lg:grid-cols-2 place-items-center gap-2 lg:gap-y-[2rem] lg:place-content-center mt-auto">
          {questions[currentQuestion]?.options.map((option, id) => (
            <div
              className="p-2 hover:outline hover:outline-offset-1 hover:outline-[#02C7DB] cursor-pointer lg:text-xl text-center bg-gray-300 h-fit rounded-[8px] w-full max-w-[95%]"
              style={{
                backgroundColor: answers.filter(
                  ({ answer, qid }) =>
                    answer == id && qid == questions[currentQuestion]?.id
                )?.length
                  ? "#FEC200"
                  : null,
                cursor: allowedTime == 0 ? "not-allowed" : null,
              }}
              onClick={() =>
                !ended &&
                dispatch({
                  type: "choice",
                  payload: {
                    qid: questions[currentQuestion]?.id,
                    answer: id,
                    correctAns: questions[currentQuestion]?.answer,
                    points: questions[currentQuestion]?.points,
                  },
                })
              }
              key={id}
            >
              {option}
            </div>
          ))}
        </div>
        {/* Bottom button section */}
        {isMobile && (
          <>
            <div className="flex w-[80%] min-h-[50px] items-center bg-[#01161e] justify-between rounded-[8px] outline-double outline-gray-100 outline-offset-1 px-3 m-auto">
              <Button
                size={"sm"}
                className="w-[45%] font-bold hover:border-none border border-gray-50 hover:bg-gray-50 hover:text-[#01161e] bg-transparent"
                onClick={() => dispatch({ type: "previous" })}
              >
                Previous
              </Button>
              <Button
                variant={"outline"}
                className="w-[45%] font-bold border-none"
                size={"sm"}
                onClick={() => dispatch({ type: "next" })}
              >
                Next
              </Button>
            </div>
            <div
              className="border w-[40px] h-[40px] bg-black flex items-center justify-center text-white absolute bottom-[8.7vh] rounded-s-md right-0 z-50"
              onClick={() => setShow((prev) => !prev)}
            >
              {show ? "➡️" : "⬅️"}
            </div>
          </>
        )}
      </div>
      {/* Right hand side */}
      <div
        className="h-full w-[350px] flex flex-col gap-2 p-3"
        style={
          isMobile
            ? {
                position: "absolute",
                backgroundColor: "white",
                width: "100vw",
                right: show ? "0%" : "-100%",
                transition: "all 0.3s",
              }
            : {}
        }
      >
        <div className="relative flex flex-col gap-2  bg-[#01161e] h-[30%] rounded-[8px] text-white text-4xl font-bold items-center justify-center">
          <div className="">
            {hrs || 0} {" : "}
            {allowedTime % 60 || 0} : {secs}
          </div>
          <div className="absolute text-sm left-2 top-2">
            <div>
              Subject : {topic ? topic[0]?.toUpperCase() + topic.slice(1) : ""}
            </div>
          </div>
          <div className="absolute text-sm left-2 top-7">
            <div>
              Difficulty :{" "}
              {difficulty
                ? difficulty[0]?.toUpperCase() + difficulty.slice(1)
                : ""}
            </div>
          </div>
          <div className="absolute text-sm left-2 bottom-2">
            <div>Attempted : {answers.length}</div>
            <div>Total Questions : {totalQuestions}</div>
          </div>

          {!isMobile && (
            <div className="absolute text-sm right-2 bottom-2">
              <SubmitDialogue />
            </div>
          )}
        </div>
        <div className="h-[70%] flex flex-col gap-2">
          <div className="lg:h-[85%] max-h-[350px] overflow-y-auto border border-gray-100 px-1 rounded-[8px] grid grid-cols-6 place-items-center place-content-start gap-2 py-2">
            {questions?.map((item, id) => (
              <div
                key={id}
                style={
                  id == currentQuestion
                    ? {
                        backgroundColor: "#01161e",
                        color: "#fff",
                      }
                    : answers.filter((answer) => answer?.qid == item?.id)
                        ?.length
                    ? { backgroundColor: "#FEC200" }
                    : {}
                }
                className="border cursor-pointer hover:bg-[#02c5db90] bg-[#02C7DB] text-[#01161e] font-semibold h-[40px] w-[50px] rounded items-center justify-center flex"
                onClick={() => dispatch({ type: "jumpto", payload: id })}
              >
                {id + 1}
              </div>
            ))}
          </div>
          {/* Bottom button */}
          {!isMobile ? (
            <div className="flex items-center bg-[#01161e] justify-between mt-auto md:min-h-[60px] rounded-[8px] outline-double outline-gray-100 outline-offset-1 px-3">
              <Button
                size={"sm"}
                className="w-[30%] font-bold hover:border-none border border-gray-50 hover:bg-gray-50 hover:text-[#01161e] bg-transparent"
                onClick={() => dispatch({ type: "previous" })}
              >
                Previous
              </Button>
              <Button
                variant={"outline"}
                className="w-[30%] font-bold border-none"
                size={"sm"}
                onClick={() => dispatch({ type: "next" })}
              >
                Next
              </Button>
            </div>
          ) : (
            <SubmitDialogue />
          )}
        </div>
      </div>
    </div>
  );
};

export default QuizPage;
