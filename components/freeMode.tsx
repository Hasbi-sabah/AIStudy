import { Button } from "./ui/button";
import { Input } from "./ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useEffect, useRef } from "react";
interface history {
  role: string;
  content: string;
}

interface FreeModeProps {
  loading: boolean;
  FreeHistory: history[];
  prompt: string;
  setPrompt: (prompt: string) => void;
  handleSubmit: () => void;
}

export default function FreeMode({
  loading,
  FreeHistory,
  prompt,
  setPrompt,
  handleSubmit,
}: FreeModeProps) {
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [FreeHistory]);
  return (
    <div className="flex flex-col w-full px-10 items-center">
      <p>Ask the document questions:</p>
      {FreeHistory.slice(1).length > 0 &&
        FreeHistory.slice(1).map((msg: history, index: number) => (
          <div
            key={index}
            className={`flex items-center gap-3 ${
              msg.role === "user" ? "self-end" : "self-start"
            }`}
          >
            {msg.role !== "user" && (
              <Avatar>
                <AvatarImage src="/aillama.jpg" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
            )}
            <Card className={`border-none `}>
              <CardHeader className="p-2">
                <CardTitle
                  className={`text-sm custom ${
                    msg.role === "user" ? "self-end" : "self-start"
                  }`}
                >
                  {msg.role === "assistant" ? "Assistant:" : "User:"}
                </CardTitle>
              </CardHeader>
              <CardContent className="pb-2">
                <p>{msg.content}</p>
              </CardContent>
            </Card>
            {msg.role === "user" && (
              <Avatar>
                <AvatarImage src="/llamaUser.jpg" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
            )}
          </div>
        ))}
      <div className="flex w-full items-center space-x-2 pt-3">
        <Input
          className="w-full"
          value={prompt}
          type="text"
          onKeyDown={(event) => {
            if (event.key === "Enter" && prompt.trim() !== "" && !loading) {
              handleSubmit();
            }
          }}
          onChange={(event) => {
            setPrompt(event.target.value);
          }}
          placeholder="Enter a prompt"
        />
        <Button
          disabled={loading || prompt.trim() === ""}
          onClick={handleSubmit}
        >
          Submit
        </Button>
      </div>
      <div ref={messagesEndRef} />
    </div>
  );
}
