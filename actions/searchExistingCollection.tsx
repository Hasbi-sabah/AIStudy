"use server";
import { QdrantVectorStore } from "@langchain/qdrant";
import { OpenAIEmbeddings } from "@langchain/openai";

export default async function SEC(collectionUUID: string, prompt: string) {
  console.log("searching existing collection", collectionUUID, prompt);
  let response;
  try {
    const v = await QdrantVectorStore.fromExistingCollection(
      new OpenAIEmbeddings({
        configuration: {
          baseURL: "https://api.aimlapi.com",
          apiKey: process.env.API_KEY,
        },
        model: "text-embedding-3-small",
      }),
      {
        url: process.env.REACT_APP_QDRANT_URL,
        apiKey: process.env.QDRANT_API_KEY,
        collectionName: collectionUUID,
      }
    );
    console.log("searching for similarity");
    response = await v.similaritySearchWithScore(prompt);
    console.log("searching for similarity", response);
  } catch {
    new Error("Something went wrong.");
    return;
  }

  return response;
}
