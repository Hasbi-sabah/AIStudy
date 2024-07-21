interface history {
  role: string;
  content: string;
}

interface FreeModeProps {
    FreeHistory: history[];
    prompt: string;
    setPrompt: (prompt: string) => void;
    handleSubmit: () => void;
  }

export default function FreeMode({FreeHistory, prompt, setPrompt, handleSubmit}: FreeModeProps) {
  return (
    <>
      <p>file loaded successfully! Ask the document questions:</p>
      {FreeHistory.slice(1).length > 0 &&
        FreeHistory.slice(1).map((msg: history, index: number) => (
          <h1 key={index}>
            {msg.role}: {msg.content}
          </h1>
        ))}
      <input
        className="text-black w-full"
        type="text"
        value={prompt}
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            handleSubmit();
          }
        }}
        onChange={(event) => {
          setPrompt(event.target.value);
        }}
      />
      <button onClick={handleSubmit}>Submit</button>
    </>
  );
}
