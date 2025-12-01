import { useEffect, useReducer, useRef, useState } from "react";
import { Button } from "./ui/button";
import { useIsMobile } from "./hooks/useResize";
import SubmitDialogue from "./SubmitDialogue";
import { useInitialStateContext } from "./context/InitialstateContext";

// const questions = [
//   {
//     id: 1,
//     question: "Which keyword is used to create a new goroutine in Go?",
//     options: ["go", "routine", "thread", "spawn"],
//     answer: 0,
//     points: 5,
//   },
//   {
//     id: 2,
//     question: "Which data type is used to store true/false values in Go?",
//     options: ["bool", "boolean", "truthy", "bit"],
//     answer: 0,
//     points: 5,
//   },
//   {
//     id: 3,
//     question:
//       "What is the default value of an uninitialized int variable in Go?",
//     options: ["null", "undefined", "0", "-1"],
//     answer: 2,
//     points: 5,
//   },
//   {
//     id: 4,
//     question: "Which symbol is used for short variable declaration?",
//     options: ["=", ":=", "::", "<-"],
//     answer: 1,
//     points: 5,
//   },
//   {
//     id: 5,
//     question: "What is the correct way to create a slice in Go?",
//     options: [
//       "slice := []int{}",
//       "slice := []int()",
//       "slice := make[]int",
//       "slice := []int{1, 2, 3}",
//     ],
//     answer: 3,
//     points: 10,
//   },
//   {
//     id: 6,
//     question: "What does the `defer` keyword do?",
//     options: [
//       "Runs a function immediately",
//       "Runs a function before exiting the current function",
//       "Deletes a variable",
//       "Pauses execution",
//     ],
//     answer: 1,
//     points: 10,
//   },
//   {
//     id: 7,
//     question: "What is the purpose of the `fmt` package?",
//     options: [
//       "Math operations",
//       "File handling",
//       "Formatted I/O operations",
//       "Web routing",
//     ],
//     answer: 2,
//     points: 5,
//   },
//   {
//     id: 8,
//     question: "Which operator is used to send data into a channel?",
//     options: ["->", "<-", "::", "=>"],
//     answer: 1,
//     points: 10,
//   },
//   {
//     id: 9,
//     question: "How do you write a comment in Go?",
//     options: ["# comment", "// comment", "<!-- comment -->", "** comment **"],
//     answer: 1,
//     points: 5,
//   },
//   {
//     id: 10,
//     question: "Which function is the entry point of every Go program?",
//     options: ["start()", "main()", "run()", "init()"],
//     answer: 1,
//     points: 10,
//   },
// ];

//Setting up my reducer
const reducer = (state, action) => {
  switch (action.type) {
    case "next":
      return {
        ...state,
        currentQuestion:
          state.currentQuestion < state.totalQuestions - 1
            ? state.currentQuestion + 1
            : state.currentQuestion,
      };
    case "previous":
      return {
        ...state,
        currentQuestion:
          state.currentQuestion > 0
            ? state.currentQuestion - 1
            : state.currentQuestion,
      };
    case "choice": {
      const choice = action.payload?.answer;
      const answer = action?.payload?.correctAns;
      const point = action?.payload?.points;
      const pointAddedBefore = Boolean(
        state.answers.filter(
          (ans) => ans?.qid == action?.payload?.qid && ans?.answer == answer
        )?.length
      );

      console.log({ point });

      return {
        ...state,
        choice,
        answers: [
          ...state.answers.filter(
            (answer) => answer?.qid != action?.payload?.qid
          ),
          {
            qid: action.payload?.qid,
            answer: choice,
          },
        ],
        totalScore:
          pointAddedBefore && choice !== answer
            ? state?.totalScore - point
            : !pointAddedBefore && choice == answer
            ? state?.totalScore + point
            : state?.totalScore,
      };
    }
    case "jumpto": {
      const isValid =
        action.payload >= 0 && action.payload <= state.totalQuestions
          ? true
          : false;
      return {
        ...state,
        currentQuestion: isValid ? action.payload : state.currentQuestion,
        choice: null,
      };
    }

    case "tick":
      return {
        ...state,
        allowedTime: state.allowedTime > 0 && state.allowedTime - 1,
      };
  }
};

//initialState
// const initialState = {
//   choice: null,
//   allowedTime: 5,
//   totalQuestions: 10,
//   currentQuestion: 0,
//   answer: null,
//   totalScore: 0,
//   points: 0,
//   answers: [],
// };

const QuizPage = () => {
  const { initialState } = useInitialStateContext();
  const [_, dispatch] = useReducer(reducer, initialState);
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
  } = initialState;

  // Timer Update per minite
  function handleTick() {
    dispatch({ type: "tick" });
  }

  // Hour tick
  useEffect(() => {
    setHrs(Math.floor(allowedTime / 60));
  }, [allowedTime]);

  // Useffect responsible for ticking and tracking time
  useEffect(() => {
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
  }, [secs, allowedTime, ended]);

  return (
    <div className="h-[100vh] flex overflow-hidden relative items-center w-[100vw] lg:p-2">
      {/* Left hand side */}
      <div className="flex flex-col flex-1 h-full gap-2 p-2 lg:p-3">
        {/* Question section */}
        <div className="border border-gray-200 min-h-[30%] md:min-h-[40%] p-2 flex items-center bg-gray-200 justify-center rounded-[8px] relative">
          {isMobile && (
            <div className="absolute flex border border-gray-600 top-1 left-[10px] font-bold py-1 px-3 rounded-[8px] bg-[#01161e]  text-white">
              {hrs} {" : "}
              {allowedTime % 60} : {secs}
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
                allowedTime &&
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
            {hrs} {" : "}
            {allowedTime % 60}: {secs}
          </div>
          <div className="absolute text-sm left-2 top-2">
            <div>Subject : {topic[0]?.toUpperCase() + topic.slice(1)}</div>
          </div>
          <div className="absolute text-sm left-2 top-7">
            <div>
              Difficulty : {difficulty[0]?.toUpperCase() + difficulty.slice(1)}
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
