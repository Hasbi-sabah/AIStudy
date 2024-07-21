import { Button } from "./ui/button";

export default function ModeToggle({
  mode,
  setMode,
}: {
  mode: string;
  setMode: (mode: string) => void;
}) {
  return (
    <div className="flex gap-5">
      <Button
        variant={mode === "free" ? "default" : "secondary"}
        onClick={() => {
          setMode("free");
        }}
      >
        Free interaction Mode
      </Button>
      <Button
        variant={mode !== "free" ? "default" : "secondary"}
        onClick={() => {
          setMode("quiz");
        }}
      >
        Quiz Mode
      </Button>
    </div>
  );
}
