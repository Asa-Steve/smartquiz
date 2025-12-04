import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { Icon } from "@iconify/react";
import { Button } from "./ui/button";
import { useNavigate } from "react-router";
import { useEffect, useState } from "react";
import Start from "./Start";
import { useInitialStateContext } from "../context/InitialstateContext";
import { useAuthProvider } from "@/context/AuthContext";
import { Spinner } from "./ui/spinner";
import { toast } from "sonner";

const QuizResult = ({ open, setOpen }) => {
  const navigate = useNavigate();
  const [retake, setRetake] = useState(null);
  const { state, dispatch } = useInitialStateContext();
  const { questions, totalScore, answers, allowedTime, totalTime } = state;
  const { updateScore, isUpdatingScore, user } = useAuthProvider();

  const [aggregate, setAggregate] = useState({
    correctAnswers: 0,
    incorrectAnswers: 0,
    totalPoints: 0,
  });

  function handleExit() {
    setOpen(false);
    dispatch({ type: "end" });
    navigate("/");
  }

  function handleRetake() {
    setRetake(true);
    dispatch({ type: "end" });
  }

  useEffect(() => {
    if (open && retake == false) {
      setOpen(false);
    }
  }, [retake, open, setOpen]);

  useEffect(() => {
    if (questions.length === 0) return;

    let totalPoints = 0;
    let correctAnswers = 0;
    let incorrectAnswers = 0;

    questions.forEach((question) => {
      totalPoints += question?.points ?? 0;

      const userAnswer = answers.find((a) => a.qid === question.id);
      if (userAnswer) {
        if (userAnswer.answer === question.answer) {
          correctAnswers++;
        } else {
          incorrectAnswers++;
        }
      }
    });

    setAggregate({
      correctAnswers,
      incorrectAnswers,
      totalPoints,
    });
  }, [questions, answers]);

  useEffect(() => {
    if (
      !(
        user?.highscore <
          Math.trunc((totalScore / aggregate?.totalPoints) * 100) &&
        answers?.length > user?.highest_qnum
      )
    )
      return;
    updateScore(
      {
        score: Math.trunc((totalScore / aggregate?.totalPoints) * 100),
        highest_qnum: answers?.length,
      },
      {
        onSuccess: () => toast.success("💐 new highscore saved!"),
      }
    );
  }, [
    totalScore,
    aggregate?.totalPoints,
    updateScore,
    user?.highscore,
    user?.highest_qnum,
    answers,
  ]);

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          onInteractOutside={(e) => e.preventDefault()}
          className="[&>button]:hidden w-[90%] rounded-[8px] min-h-[60vh] md:max-w-full lg:max-w-[70vw]"
        >
          <DialogHeader>
            <div className="flex h-full min-h-[400px] gap-2 rounded-[8px] overflow-hidden">
              <div className="flex-1 hidden rounded-[8px] overflow-hidden md:flex items-center">
                <img
                  src="q1.webp"
                  alt="quiz-image"
                  className="object-cover w-full h-full max-h-[400px]"
                />
              </div>
              <div className="flex-1 flex flex-col rounded-[8px] overflow-hidden">
                <div>
                  <h1 className="text-[2.2rem] lg:text-[3rem] text-center">
                    {" "}
                    Quiz Results Stat
                  </h1>
                </div>
                <div className="p-2 max-h-[300px] flex flex-col gap-2 my-auto">
                  <div className="flex items-center gap-2 p-2  lg:p-1 border rounded-[8px]">
                    <Icon
                      icon="material-symbols-light:social-leaderboard-outline"
                      className="size-9"
                    />
                    <h2 className="font-bold">
                      Total Score:{" "}
                      {Math.trunc(
                        (totalScore / aggregate?.totalPoints) * 100
                      ) || 0}
                      %
                    </h2>
                  </div>
                  <div className="flex items-center gap-3  lg:p-1  p-2 border rounded-[8px]">
                    <Icon icon="game-icons:sands-of-time" className="size-7" />
                    <h2 className="font-bold">
                      Total Time Taken: {totalTime - allowedTime} min
                      {totalTime - allowedTime > 1 && "s"}
                    </h2>
                  </div>
                  <div className="flex items-center gap-3  lg:p-1  p-2 border rounded-[8px]">
                    <Icon
                      icon="icon-park-outline:list-success"
                      className="size-7"
                    />
                    <h2 className="font-bold">
                      Attempted Questions: &nbsp; {answers?.length ?? 0} /{" "}
                      {questions?.length ?? 0} &nbsp;
                    </h2>
                  </div>
                  <div className="flex items-center gap-3  lg:p-1  p-2 border rounded-[8px]">
                    <Icon icon="solar:list-check-broken" className="size-8" />
                    <h2 className="font-bold">
                      Correct Answers: {aggregate?.correctAnswers}
                    </h2>
                  </div>
                  <div className="flex items-center gap-3  lg:p-1  p-2 border rounded-[8px]">
                    <Icon
                      icon="solar:list-cross-minimalistic-broken"
                      className="size-8"
                    />
                    <h2 className="font-bold">
                      Incorrect Answers: {aggregate?.incorrectAnswers}
                    </h2>
                  </div>
                </div>
                <div className="flex justify-between px-2 min-h-[60px] items-center">
                  {isUpdatingScore ? (
                    <Button
                      disabled
                      className="flex items-center justify-center gap-2"
                    >
                      <Spinner /> Saving new highscore
                    </Button>
                  ) : (
                    <>
                      <Button
                        onClick={handleRetake}
                        className={"hover:bg-[#02C7DB] border-none"}
                      >
                        Retake Quiz
                      </Button>
                      <Button
                        onClick={handleExit}
                        variant={"destructive"}
                        className="border-none hover:bg-red-400"
                      >
                        Exit Quiz
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </DialogHeader>
        </DialogContent>
      </Dialog>
      {retake && (
        <Start open={retake} setOpen={setRetake} closeOnClick={true} />
      )}
    </>
  );
};

export default QuizResult;
