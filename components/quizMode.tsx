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
export default function QuizMode({loading, handleQuestion, userQuizHistory, handleResponse}: QuizModeProps) {
  return (
    <>
      <button disabled={loading} onClick={handleQuestion}>
        Generate Question
      </button>
      {userQuizHistory.length > 0 &&
        userQuizHistory.map((msg: userHistory, index: number) =>
          typeof msg.content === "string" ? (
            <h1 key={index}>
              {msg.role}: {msg.content}
            </h1>
          ) : (
            <h1 key={index}>
              {msg.role}: {msg.content.question}
              {msg.content.choices.map((choice: string, i: number) => (
                <button
                  onClick={handleResponse}
                  disabled={userQuizHistory.length - 1 !== index || loading}
                  key={i}
                >
                  {choice}
                </button>
              ))}
            </h1>
          )
        )}
    </>
  );
}
