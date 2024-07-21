import { Button } from "./ui/button";
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
interface userHistory {
  role: string;
  content:
    | string
    | {
        question: string;
        choices: string[];
      };
}
interface QuizModeProps {
  loading: boolean;
  handleQuestion: () => void;
  userQuizHistory: userHistory[];
  handleResponse: (event: any) => Promise<void>;
}
export default function QuizMode({
  loading,
  handleQuestion,
  userQuizHistory,
  handleResponse,
}: QuizModeProps) {
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [userQuizHistory]);
  return (
    <div className="flex flex-col justify-center items-center gap-3">
      {userQuizHistory.length > 0 &&
        userQuizHistory.map((msg: userHistory, index: number) =>
          typeof msg.content === "string" ? (
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
              <Card className='border-none'>
                <CardHeader className="p-2">
                  <CardTitle
                    className={`text-sm custom ${
                      msg.role === "user" ? "self-end" : "self-start"
                    }`}
                  >
                  {msg.role === 'assistant' ? 'Assistant:' : 'User:'}
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
          ) : (
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
                  {msg.role === 'assistant' ? 'Assistant:' : 'User:'}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pb-2">
                  <p>{msg.content.question}</p>
                  <div className="flex flex-wrap items-start">
                    {msg.content.choices.map((choice: string, i: number) => (
                      <Button
                        onClick={handleResponse}
                        variant="ghost"
                        disabled={
                          userQuizHistory.length - 1 !== index || loading
                        }
                        key={i}
                      >
                        {choice}
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>
              {msg.role === "user" && (
                <Avatar>
                  <AvatarImage src="/llamaUser.jpg" />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
              )}
            </div>
          )
        )}
      <Button disabled={loading} onClick={handleQuestion}>
        Generate Question
      </Button>
      <div ref={messagesEndRef} />
    </div>
  );
}
