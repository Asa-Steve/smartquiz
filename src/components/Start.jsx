import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import AuthPage from "./AuthPage";
import Setup from "./Setup";

const Start = () => {
  const isAuthenticated = true;
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="w-[200px] bg-transparent outline outline-white outline-offset-2 p-2 rounded hover:bg-white hover:text-[#01161e] text-white transition-all duration-300">
          Start Quiz
        </button>
      </DialogTrigger>
      <DialogContent className="[&>button]:hidden w-[90%] min-h-[60vh] md:max-w-full lg:max-w-[70vw]">
        <DialogHeader>
          <div className="flex h-full min-h-[400px] gap-2 rounded-[8px] overflow-hidden">
            <div className="flex-1 hidden rounded-[8px] overflow-hidden md:flex items-center">
              <img
                src="q1.webp"
                alt="quiz-image"
                className="object-cover w-full h-full max-h-[400px]"
              />
            </div>
            <div className="flex-1 rounded-[8px] overflow-hidden">
              {!isAuthenticated && <AuthPage />}
              {isAuthenticated && <Setup />}
            </div>
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default Start;
