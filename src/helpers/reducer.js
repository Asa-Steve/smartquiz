export const reducer = (state, action) => {
  switch (action.type) {
    case "start":
      return {
        ...state,
        questions: action.payload?.questions,
        totalQuestions: action.payload?.questions.length,
        topic: action.payload?.topic,
        difficulty: action.payload?.difficulty,
        allowedTime: action.payload?.allowedTime,
        totalTime: action.payload?.totalTime,
        ended: false,
      };
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

    case "submit":
      return {
        ...state,
        ended: true,
      };
    case "end":
      return {
        ...state,
        choice: null,
        totalQuestions: 0,
        currentQuestion: 0,
        answer: null,
        totalScore: 0,
        points: 0,
        answers: [],
        ended: true,
      };
  }
};
