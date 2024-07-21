"use server";
import { QdrantVectorStore } from "@langchain/qdrant";
import { OpenAIEmbeddings } from "@langchain/openai";
import {
  CharacterTextSplitter,
  RecursiveCharacterTextSplitter,
} from "@langchain/textsplitters";
import { v4 as uuidv4 } from "uuid";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { TextLoader } from "langchain/document_loaders/fs/text";
import fs from "fs";
import { TogetherAIEmbeddings } from "@langchain/community/embeddings/togetherai";

// const embeddings = new TogetherAIEmbeddings({
//   apiKey: process.env.TOGETHER_AI_API_KEY, =
//   model: "togethercomputer/m2-bert-80M-8k-retrieval",
// });
export default async function Chunker(text: string) {
  const collectionUUID = uuidv4();
  try {
    console.log("chunking text");
    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 300,
      chunkOverlap: 10,
      separators: ["\n"],
    });
    const texts = await splitter.splitText(text);
    // const vectorStore = await QdrantVectorStore.fromExistingCollection(
    //   new OpenAIEmbeddings(
    //     {
    //       configuration: {
    //         baseURL: "https://api.aimlapi.com",
    //         apiKey: process.env.API_KEY,
    //       },
    //       model: "text-embedding-3-small",
    //     },
    //   ),
    //   {
    //     url: "https://a4e3089e-60c5-450b-b9d3-38e7cfb46804.us-east4-0.gcp.cloud.qdrant.io:6333",
    //     apiKey: "f6JDSq2EAzwJ4YdH3tUFS1mRg_17cw3PE7NjaKxH0RND1d4dLOV_5A",
    //     collectionName: 'aistudy4,
    //   }
    // );
    // fs.writeFile('test.txt', text, (err) => {})
    console.log("creating vector store");
    // const loader = new TextLoader('/root/scripts/aistory/test.txt');
    // const docs = await loader.load();
    // const vectorStore = await MemoryVectorStore.fromDocuments(
    //   docs,
    //   new OpenAIEmbeddings({configuration: {baseURL: "https://api.aimlapi.com", apiKey: process.env.API_KEY}, model: "text-embedding-3-small"})
    // );
    await QdrantVectorStore.fromTexts(
      texts.slice(0, 100),
      [{ id: 2 }, { id: 1 }, { id: 3 }, { id: 4 }, { id: 5 }],
      new OpenAIEmbeddings({
        configuration: {
          baseURL: "https://api.aimlapi.com",
          apiKey: process.env.API_KEY,
        },
        model: "text-embedding-3-small",
      }),
      // new TogetherAIEmbeddings({
      //   apiKey: process.env.TOGETHER_AI_API_KEY,
      // }),
      {
        url: process.env.REACT_APP_QDRANT_URL,
        apiKey: process.env.QDRANT_API_KEY,
        collectionName: collectionUUID,
      }
    );
    return collectionUUID;
  } catch(error) {
    console.log(error)
    new Error("Something went wrong.");
    return;
  }

  // console.log("searching for similarity");

  // const client = new QdrantClient({
  //   url: "https://a4e3089e-60c5-450b-b9d3-38e7cfb46804.us-east4-0.gcp.cloud.qdrant.io:6333",
  //   apiKey: "f6JDSq2EAzwJ4YdH3tUFS1mRg_17cw3PE7NjaKxH0RND1d4dLOV_5A",
  // });
  // const embeddings = new OpenAIEmbedding({model: "text-embedding-3-small"})
  // const vectorStore = new QdrantVectorStore({
  //   client: client,
  // });
  // const document = new Document({ text: text });

  // const index = await VectorStoreIndex.fromDocuments([document]);
  // const queryEngine = index.asQueryEngine();
  // const response = await queryEngine.query({
  //   query: "who are the characters in this book",
  // });

  // console.log(response.toString());
}
