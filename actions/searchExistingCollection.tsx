"use server";
import { QdrantVectorStore } from "@langchain/qdrant";
import { OpenAIEmbeddings } from "@langchain/openai";

export default async function SEC(collectionUUID: string, prompt: string) {
    console.log("searching existing collection", collectionUUID, prompt);
  const v = await QdrantVectorStore.fromExistingCollection(
    new OpenAIEmbeddings({
      configuration: {
        baseURL: "https://api.aimlapi.com",
        apiKey: process.env.REACT_APP_API_KEY,
      },
      model: "text-embedding-3-small",
    }),
    {
      url: "https://a4e3089e-60c5-450b-b9d3-38e7cfb46804.us-east4-0.gcp.cloud.qdrant.io:6333",
      apiKey: "f6JDSq2EAzwJ4YdH3tUFS1mRg_17cw3PE7NjaKxH0RND1d4dLOV_5A",
      collectionName: collectionUUID,
    }
  );
  console.log("searching for similarity");
  const response = await v.similaritySearchWithScore(prompt);
  return response;
}
