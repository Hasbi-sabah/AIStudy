'use server'

export default async function getImg(prompt: string) {
  const headers = {
    Authorization: `Bearer ${process.env.REACT_APP_API_KEY}`,
    "Content-Type": "application/json",
  };
  const payload = {
    model: "stabilityai/stable-diffusion-xl-base-1.0",
    prompt: `a hyper realistic image of ${prompt}`,
    n: 1
  };
  const response = await fetch(
    "https://api.aimlapi.com/images/generations/with-url",
    {
      method: "POST",
      headers: headers,
      body: JSON.stringify(payload),
    }
  );
  const res = await response.json();
  return res.output.choices[0].url;
}
