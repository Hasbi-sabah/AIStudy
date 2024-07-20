"use server";
import OpenAI from "openai";
import { ChatCompletionMessageParam } from "openai/resources/index.mjs";
import chuncker from "./chuncker";
import SEC from "./searchExistingCollection";

interface history {
  role: string;
  content: string;
}

export async function getStory(
  messages: history[],
  uuid: string,
  mode: string,
  question: string = ""
) {
  console.log("start of getting story");
  let docs;
  if (mode === "free" || mode === "quiz_q") {
    docs = await SEC(uuid, messages[messages.length - 1].content);
  } else {
    docs = await SEC(uuid, question);
  }
  console.log("got docs:", docs);
  let openai: OpenAI;
  try {
    openai = new OpenAI({
      apiKey: process.env.REACT_APP_API_KEY,
      baseURL: "https://api.aimlapi.com/",
    });
  } catch (error) {
    alert("Something went wrong.");
    return;
  }

  console.log("openai setup");
  const new_msgs = messages;
  if (mode === "free" || mode === "quiz_q") {
    new_msgs[new_msgs.length - 1].content +=
      " , use only these documents: " +
      docs
        .map((doc, i: number) => `${doc[0].pageContent}, ${doc[1]}`)
        .join("\n");
  } else {
    new_msgs[new_msgs.length - 1].content =
      `for the question: ${question} is this a correct answer: ` +
      new_msgs[new_msgs.length - 1].content +
      " , answer based only on these documents, do not ask another question: " +
      docs
        .map((doc, i: number) => `${doc[0].pageContent}, ${doc[1]}`)
        .join("\n");
  }
  console.log("all msgs:", new_msgs);
  console.log("new_msgs:", new_msgs[new_msgs.length - 1].content);
  let response: OpenAI.Chat.Completions.ChatCompletion;
  try {
    response = await openai?.chat.completions.create({
      model: "meta-llama/Llama-3-70b-chat-hf",
      messages: messages as ChatCompletionMessageParam[],
      max_tokens: 512,
      stream: false,
    });
  } catch (error) {
    alert("Something went wrong.");
    return;
  }

  // console.log("got response:", response.choices[0].message.content);
  try {
    if (response) {
      if (mode === "quiz_q") {
        const content = response.choices[0]?.message?.content ?? "";
        const regex = /\{((.|\n|\r)*)\}/g;
        const matches = content.match(regex);
        if (matches) {
          const story = JSON.parse(matches[0]);
          story.raw = response.choices[0].message.content;
          return story;
        }
        new Error();
      }
      return response.choices[0].message.content;
    }
  } catch (error) {
    console.log(error);
    // return getStory(messages, uuid, mode);
  }
}
