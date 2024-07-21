export default function ModeToggle({setMode}: {setMode: (mode: string) => void}) {
    return (
        <div className="flex">
        <button
          onClick={() => {
            setMode("free");
          }}
        >
          Free interact
        </button>
        <button
          onClick={() => {
            setMode("quiz");
          }}
        >
          Quiz mode
        </button>
      </div>
    )
}