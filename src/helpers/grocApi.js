import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: import.meta.env.VITE_GROQ_API_KEY,
  dangerouslyAllowBrowser: true,
});
export async function main() {
  const chatCompletion = await getGroqChatCompletion();
  // Print the completion returned by the LLM.
  console.log(chatCompletion.choices[0]?.message?.content || "");
}

export async function getGroqChatCompletion() {
  return groq.chat.completions.create({
    messages: [
      {
        role: "user",
        content: `Generate 5 multiple-choice quiz questions about Golang for beginners.
        Return valid JSON:
        [
            {
            "question": "",
            "options": ["", "", "", ""],
            "answer": ""
            }
  ]`,
      },
    ],
    model: "openai/gpt-oss-20b",
  });
}
