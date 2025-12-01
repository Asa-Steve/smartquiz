export async function getQuestions({ topic, qNum, difficulty = "Easy" }) {
  const res = await fetch(
    "https://ekmbxvhtjpjybbiqeite.supabase.co/functions/v1/generate-question",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ topic, qNum, difficulty }),
    }
  );

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Server Error: ${errorText}`);
  }

  const data = await res.json();
  return data.quiz; 
}
