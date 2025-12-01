import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "./ui/button";
import { useState } from "react";
import QuizResult from "./QuizResult";
import { useInitialStateContext } from "./context/InitialstateContext";

const SubmitDialogue = () => {
  const [showResult, setShowResult] = useState(false);
  const { initialState, setInitialState } = useInitialStateContext();

  function handleSubmit() {
    setShowResult(true);
    console.log("before submitting", initialState);
    setInitialState((prevState) => ({
      ...prevState,
      allowedTime: 0,
      ended: true,
    }));
    console.log("submitted", initialState);
  }

  return (
    <>
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button
            variant={"destructive"}
            className="w-full mt-[2rem] border-none"
          >
            Submit Quiz
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent className="w-[90%] rounded-[8px] min-h-[50vh] md:max-w-full lg:max-w-[40vw] place-content-center">
          <AlertDialogHeader className={"sm:text-center"}>
            <AlertDialogTitle>
              Are you ABSOLUTELY sure you want to SUBMIT?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will terminate quiz and submit
              your result to our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter
            className={"sm:justify-around md:gap-3 lg:mx-auto"}
          >
            <AlertDialogCancel>Cancel to return</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleSubmit}
              className="bg-red-500 hover:bg-red-400"
            >
              Continue to submit
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <QuizResult open={showResult} setOpen={setShowResult} />
    </>
  );
};

export default SubmitDialogue;
