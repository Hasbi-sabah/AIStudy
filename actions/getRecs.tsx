"use server";

export async function getRecs() {
  const headers = {
    "Authorization": `Bearer ${process.env.API_KEY}`,
    "Content-Type": "application/json",
  };

  const format = "list[str(60 chars max)]";
  const messages = [
    {
      role: "user",
      content: `give me 3 story ideas in the specific list json format ${format}, no start`,
    },
  ];
  const payload = {
    messages: messages,
    model: "google/gemma-7b-it",
    top_p: 0.7,
  };

  const response = await fetch("https://api.aimlapi.com/chat/completions", {
    method: "POST",
    headers: headers,
    body: JSON.stringify(payload),
  });

  const res = await response.json();
  const regex = /\[((.|\n|\r)*)\]/g
  const matches = res.choices[0].message.content.match(regex)
  return JSON.parse(matches[0]);
}
