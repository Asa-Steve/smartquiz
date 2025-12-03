import { useNavigate } from "react-router";
import { Button } from "./ui/button";
import { useIsMobile } from "../hooks/useResize";
import { Spinner } from "@/components/ui/spinner";
import { useEffect, useState } from "react";
import { useQuestions } from "../hooks/useQuestions";
import { useInitialStateContext } from "../context/InitialstateContext";

const Setup = ({ setOpen }) => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { dispatch } = useInitialStateContext();

  // Needed fields variables
  const [fields, setFields] = useState({
    topic: "",
    qNum: 0,
    difficulty: "",
    time: "",
  });

  const { data, isLoading, refetch } = useQuestions({ ...fields });

  // Handle start quiz Fn
  function handleStartQuiz(e) {
    e.preventDefault();
    const { topic, qNum, difficulty, time } = fields;
    if ((!topic || qNum <= 0 || !difficulty, time <= 0)) {
      return;
    }
    refetch();
  }

  useEffect(() => {
    if (data && !isLoading && data?.length > 0) {
      dispatch({
        type: "start",
        payload: {
          questions: data,
          difficulty: fields.difficulty,
          topic: fields.topic,
          allowedTime: parseInt(fields.time, 10),
          totalTime: parseInt(fields.time, 10),
        },
      });
    }
    if (data?.length > 0 && !isLoading) {
      navigate("/quiz");
      setOpen(false);
    }
  }, [data, isLoading, dispatch, fields, navigate, setOpen]);

  return (
    <div className="rounded-[8px] h-full p-2 px-[20px] flex items-center">
      <form
        className={`md:w-[95%] w-full ms-auto ${
          isMobile && "[&_input]:text-center"
        }`}
      >
        <h1 className="text-3xl font-bold text-center max-w-[400px]">
          Ready to start ? 😏
        </h1>
        <p className="mt-2 text-sm text-center text-muted-foreground">
          Fill out the fields below, Lets go!!
        </p>

        <div className="flex gap-3 mt-5">
          <div>
            <label htmlFor="subject" className="text-sm font-bold">
              Subject / topic
            </label>
            <input
              type="text"
              className="px-2 py-1 border mt-1 border-gray-400 rounded-[8px] w-full"
              id="subject"
              placeholder="Golang"
              onChange={(e) =>
                setFields((prev) => ({ ...prev, topic: e.target.value }))
              }
              value={fields.topic}
              disabled={isLoading}
            />
          </div>
          <div>
            <label htmlFor="questions" className="text-sm font-bold">
              Number of questions
            </label>
            <input
              type="text"
              className="px-2 py-1 mt-1 border border-gray-400 rounded-[8px] w-full"
              id="questions"
              placeholder="10"
              onChange={(e) =>
                setFields((prev) => ({ ...prev, qNum: e.target.value }))
              }
              value={fields.qNum}
              disabled={isLoading}
            />
          </div>
        </div>
        <div className="flex gap-3 mt-5">
          <div>
            <label htmlFor="subject" className="text-sm font-bold">
              Difficulty level
            </label>
            <input
              type="text"
              className="px-2 py-1 border mt-1 w-full border-gray-400 rounded-[8px]"
              id="subject"
              placeholder="Easy"
              onChange={(e) =>
                setFields((prev) => ({ ...prev, difficulty: e.target.value }))
              }
              value={fields.difficulty}
              disabled={isLoading}
            />
          </div>
          <div className="">
            <label htmlFor="questions" className="text-sm font-bold">
              {isMobile ? "Time" : "Allowed time"} (in minutes)
            </label>
            <input
              type="text"
              className="px-2 py-1 mt-1 border w-full border-gray-400 rounded-[8px]"
              id="questions"
              placeholder="30"
              onChange={(e) => {
                const value = e.target.value;
                if (/^[0-9]*$/.test(value)) {
                  setFields((prev) => ({ ...prev, time: value }));
                }
              }}
              value={fields.time}
              disabled={isLoading}
            />
          </div>
        </div>

        <Button
          className="w-full mt-[30px] hover:bg-[#02C7DB] hover:border-none"
          onClick={handleStartQuiz}
          disabled={isLoading}
        >
          {isLoading && <Spinner />}
          Start Quiz Now
        </Button>
      </form>
    </div>
  );
};

export default Setup;
