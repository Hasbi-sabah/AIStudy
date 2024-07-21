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
  return (
    <div className="flex flex-col w-full px-10 items-center">
      <p>Ask the document questions:</p>
      {FreeHistory.slice(1).length > 0 &&
        FreeHistory.slice(1).map((msg: history, index: number) => (
          <div className={`flex items-center gap-3 ${
            msg.role === "user" ? "self-end" : "self-start"
          }`}>
            {msg.role !== "user" && (
              <Avatar>
                <AvatarImage  src="/aillama.jpg" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
            )}
            <Card
              key={index}
              className={`border-none `}
            >
              <CardHeader className="p-2">
                <CardTitle
                  className={`text-sm ${
                    msg.role === "user" ? "self-end" : "self-start"
                  }`}
                >
                  {msg.role}
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
    </div>
  );
}
