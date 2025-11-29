import { Button } from "./ui/button";

const Setup = () => {
  return (
    <div className="rounded-[8px] h-full p-2 px-[20px] flex items-center">
      <form className="md:w-[95%] w-full ms-auto">
        <h1 className="text-3xl font-bold text-center max-w-[400px]">
          Ready To start ? 😏
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
            />
          </div>
          <div className="">
            <label htmlFor="questions" className="text-sm font-bold">
              Allowed time (in minutes)
            </label>
            <input
              type="text"
              className="px-2 py-1 mt-1 border w-full border-gray-400 rounded-[8px]"
              id="questions"
              placeholder="30"
            />
          </div>
        </div>

        <Button className="w-full mt-[30px] hover:bg-[#02C7DB] hover:border-none">
          Start Quiz Now
        </Button>
      </form>
    </div>
  );
};

export default Setup;
