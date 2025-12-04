import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import AuthPage from "./AuthPage";
import Setup from "./Setup";
import { useAuthProvider } from "@/context/AuthContext";
import { Spinner } from "./ui/spinner";

const Start = ({ open, setOpen, closeOnClick = false }) => {
  const { user, loadingUser } = useAuthProvider();

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        aria-describedby="start quiz"
        onInteractOutside={closeOnClick ? (e) => e.preventDefault() : null}
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
            <div className="flex-1 rounded-[8px] overflow-hidden">
              {loadingUser && (
                <div className="flex items-center justify-center h-full">
                  <Spinner className={"size-20"} />
                </div>
              )}
              {!loadingUser && !user?.username && <AuthPage />}
              {!loadingUser && user?.username && <Setup setOpen={setOpen} />}
            </div>
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default Start;
