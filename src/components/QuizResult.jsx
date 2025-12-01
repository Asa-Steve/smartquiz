import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Icon } from "@iconify/react";
import { Button } from "./ui/button";
import { useNavigate } from "react-router";
import { useEffect, useState } from "react";
import Start from "./Start";

const QuizResult = ({ open, setOpen }) => {
  const navigate = useNavigate();
  const [retake, setRetake] = useState(false);

  useEffect(() => {
    if (retake) {
      setOpen(false);
    }
  }, [retake, setOpen]);

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="[&>button]:hidden w-[90%] rounded-[8px] min-h-[60vh] md:max-w-full lg:max-w-[70vw]">
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
                      className="size-10"
                    />
                    <h2 className="font-bold">Total Score: 80%</h2>
                  </div>
                  <div className="flex items-center gap-3  lg:p-1  p-2 border rounded-[8px]">
                    <Icon icon="game-icons:sands-of-time" className="size-8" />
                    <h2 className="font-bold">Total Time Taken: 120mins</h2>
                  </div>
                  <div className="flex items-center gap-3  lg:p-1  p-2 border rounded-[8px]">
                    <Icon
                      icon="icon-park-outline:list-success"
                      className="size-7"
                    />
                    <h2 className="font-bold">Attempted Questions: 7</h2>
                  </div>
                  <div className="flex items-center gap-3  lg:p-1  p-2 border rounded-[8px]">
                    <Icon
                      icon="icon-park-outline:list-success"
                      className="size-7"
                    />
                    <h2 className="font-bold">Correct Answers: 5</h2>
                  </div>
                  <div className="flex items-center gap-3  lg:p-1  p-2 border rounded-[8px]">
                    <Icon
                      icon="solar:list-cross-minimalistic-broken"
                      className="size-8"
                    />
                    <h2 className="font-bold">Incorrect Answers: 2</h2>
                  </div>
                </div>
                <div className="flex justify-between px-2 min-h-[60px] items-center">
                  <Button
                    onClick={() => {
                      console.log("i ran");
                      setRetake(true);
                    }}
                    className={"hover:bg-[#02C7DB] border-none"}
                  >
                    Retake Quiz
                  </Button>
                  <Button
                    onClick={() => navigate("/")}
                    variant={"destructive"}
                    className="border-none hover:bg-red-400"
                  >
                    Exit Quiz
                  </Button>
                </div>
              </div>
            </div>
          </DialogHeader>
        </DialogContent>
      </Dialog>
      <Start open={retake} setOpen={setRetake} />
    </>
  );
};

export default QuizResult;
