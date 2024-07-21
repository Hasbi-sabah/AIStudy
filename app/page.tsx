"use client";
import Chunker from "@/actions/chuncker";
import { getStory } from "@/actions/getStory";
import { useEffect, useState } from "react";
interface history {
  role: string;
  content: string;
}

interface userHistory {
  role: string;
  content:
    | string
    | {
        question: string;
        choices: string[];
      };
}
import * as pdfjsLib from "pdfjs-dist";
pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.js";
import mammoth from "mammoth";
import Upload from "@/components/upload";
import FreeMode from "@/components/freeMode";
import QuizMode from "@/components/quizMode";
import ModeToggle from "@/components/modeToggle";
import Loading from "@/components/loading";

export default function Home() {
  const [file, setFile] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>("");
  const [mode, setMode] = useState<string>("free");
  const [loading, setLoading] = useState<boolean>(false);
  const [prompt, setPrompt] = useState<string>("");
  const [FreeHistory, setFreeHistory] = useState<history[]>([
    {
      role: "system",
      content: `You are a document, the user will ask questions and you will answer based on the provided context, do not answer questions that don't relate to the context.`,
    },
  ]);

  const [QuizHistory, setQuizHistory] = useState<history[]>([
    {
      role: "system",
      content: `You are a document, ask the user questions about the document, the user will give you answers, and you will have to tell them if they are correct or not, do not ask questions that don't relate to the context.`,
    },
  ]);
  const [userQuizHistory, setUserQuizHistory] = useState<userHistory[]>([]);
  const [UUID, setUUID] = useState<string>("");
  const [question, setQuestion] = useState<string>("");

  async function handleQuestion() {
    setLoading(true);
    const format = '{"question": str,"choices": list[str](4 choices)}';
    const newQuizHistory = [
      ...QuizHistory,
      {
        role: "user",
        content: `Ask me a unique question that has not been asked before about the document in this exact JSON format ${format}`,
      },
    ];
    setQuizHistory(newQuizHistory);
    let question, choices, raw;
    try {
      ({ question, choices, raw } = await getStory(
        newQuizHistory,
        UUID,
        "quiz_q"
      ));
    } catch {
      alert("Something went wrong.");
      return;
    }
    setQuestion(question);
    setQuizHistory([
      ...newQuizHistory,
      {
        role: "assistant",
        content: raw,
      },
    ]);
    setUserQuizHistory([
      ...userQuizHistory,
      { role: "assistant", content: { question, choices } },
    ]);
    setLoading(false);
  }
  const handleFileChange = (event: any) => {
    setFile(null);
    setFileName("");
    setFreeHistory([
      {
        role: "system",
        content: `You are a document, the user will ask questions and you will answer based on the provided context, do not answer questions that don't relate to the context.`,
      },
    ]);
    setPrompt("");
    const file = event.target.files[0];
    if (file) {
      console.log(file.type);
      if (file.type === "text/plain") {
        const reader = new FileReader();
        reader.onload = async (e) => {
          const result = e.target?.result;
          if (typeof result === "string") {
            try {
              setLoading(true);
              setUUID((await Chunker(result)) || "");
              setFile(result);
              setFileName(file.name);
              setLoading(false);
            } catch {
              alert("Something went wrong.");
              return;
            }
          } else {
            alert("File content is not a string.");
            return;
          }
        };
        reader.readAsText(file);
      } else if (file.type === "application/pdf") {
        const reader = new FileReader();
        reader.onload = async (event) => {
          const arrayBuffer = event.target?.result;
          if (arrayBuffer === null) {
            alert("Failed to load file.");
            return;
          }
          if (arrayBuffer && arrayBuffer instanceof ArrayBuffer) {
            const typedArray = new Uint8Array(arrayBuffer);
          } else {
            alert("Something went wrong.");
            return;
          }
          const typedArray = new Uint8Array(arrayBuffer);
          const pdf = await pdfjsLib.getDocument({ data: typedArray }).promise;
          let fullText = "";

          for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
            const page = await pdf.getPage(pageNum);
            const textContent = await page.getTextContent();
            const textItems = textContent.items
              .map((item: any) => item.str)
              .join(" ");
            fullText += textItems + " ";
          }
          if (typeof fullText === "string") {
            try {
              setLoading(true);
              setUUID((await Chunker(fullText)) || "");
              setFile(fullText);
              setFileName(file.name);
              setLoading(false);
            } catch {
              alert("Something went wrong.");
              return;
            }
          } else {
            alert("File content is not a string.");
            return;
          }
        };
        reader.readAsArrayBuffer(file);
      } else if (
        file.type ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      ) {
        const reader = new FileReader();
        reader.onload = async (event) => {
          const arrayBuffer = event.target?.result;

          try {
            if (!(arrayBuffer instanceof ArrayBuffer)) {
              alert("Failed to load file.");
              return;
            }
            const result = await mammoth.extractRawText({
              arrayBuffer: arrayBuffer,
            });
            const text = result.value;
            setLoading(true);
            setUUID((await Chunker(text)) || "");
            setFile(text);
            setFileName(file.name);
            setLoading(false);
          } catch (error) {
            console.error("Error extracting text from docx:", error);
            alert("Could not extract text from document.");
            return;
          }
        };
        reader.readAsArrayBuffer(file);
      } else {
        alert("Please select a .txt file.");
        return;
      }
    }
  };

  async function handleSubmit() {
    setLoading(true);
    setPrompt("");
    const newFreeHistory = [
      ...FreeHistory,
      {
        role: "user",
        content: prompt,
      },
    ];
    setFreeHistory(newFreeHistory);
    let res;
    try {
      res = await getStory(newFreeHistory, UUID, "free");
    } catch {
      alert("Something went wrong.");
      return;
    }
    const newHistory = [...newFreeHistory, { role: "assistant", content: res }];
    setFreeHistory(newHistory);
    setLoading(false);
  }
  async function handleResponse(event: any) {
    setLoading(true);
    const newQuizHistory = [
      ...QuizHistory,
      {
        role: "user",
        content: event.target.innerText,
      },
    ];
    const newUserQuizHistory = [
      ...userQuizHistory,
      {
        role: "user",
        content: event.target.innerText,
      },
    ];
    setQuizHistory(newQuizHistory);
    setUserQuizHistory(newUserQuizHistory);
    let res;
    try {
      res = await getStory(newQuizHistory, UUID, "quiz_r", question);
    } catch {
      alert("Something went wrong.");
      return;
    }
    const newHistory = [...newQuizHistory, { role: "assistant", content: res }];
    const newUserHistory = [
      ...newUserQuizHistory,
      { role: "assistant", content: res },
    ];
    setUserQuizHistory(newUserHistory);
    setQuizHistory(newHistory);
    setLoading(false);
  }
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <Upload handleFileChange={handleFileChange} fileName={fileName} />
      <Loading loading={loading} />
      {file && (
        <div>
          <ModeToggle setMode={setMode} />
          {mode === "free" ? (
            <FreeMode
              FreeHistory={FreeHistory}
              prompt={prompt}
              setPrompt={setPrompt}
              handleSubmit={handleSubmit}
            />
          ) : (
            <QuizMode
              loading={loading}
              handleQuestion={handleQuestion}
              userQuizHistory={userQuizHistory}
              handleResponse={handleResponse}
            />
          )}
        </div>
      )}
    </main>
  );
}
