import { useState } from "react";
import babyFeudData from "../data/babyFeudData.js";

export default function BabyFeud() {
  const [roundIndex, setRoundIndex] = useState(0);
  const [revealed, setRevealed] = useState([]);

  const round = babyFeudData[roundIndex];
  const handleReveal = (i) => {
    if (!revealed.includes(i)) {
      setRevealed([...revealed, i]);
    }
  };

  const nextRound = () => {
    if (roundIndex < babyFeudData.length - 1) {
      setRoundIndex(roundIndex + 1);
      setRevealed([]);
    }
  };

  const previousRound = () => {
    if (roundIndex > 0) {
      setRoundIndex(roundIndex-1);
      setRevealed([]);
    }
  };

  const resetRound = () => {
    setRevealed([]);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-pink-200 to-blue-200 p-6">
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-xl p-6 text-center">
        <h1 className="text-3xl font-extrabold mb-4">
          👶 Baby Feud – Round {round.round}
        </h1>
        <h2 className="text-xl font-semibold mb-6">{round.question}</h2>

        {/* Answers grid */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          {round.answers.map((ans, i) => (
            <button
              key={i}
              onClick={() => handleReveal(i)}
              className={`p-4 rounded-xl shadow font-bold text-lg transition 
                ${revealed.includes(i) ? "bg-green-200" : "bg-gray-300"}
              `}
            >
              {revealed.includes(i) ? `${ans.text} – ${ans.points}` : "❓"}
            </button>
          ))}
        </div>

        {/* Controls */}
        <div className="flex gap-4 justify-center">
          <button
            onClick={previousRound}
            disabled={roundIndex === 0}
            className={`px-4 py-2 rounded-lg shadow font-semibold ${
              roundIndex === babyFeudData.length - 1
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-500 text-white"
            }`}
          >
            ← Previous Round
          </button>
          <button
            onClick={resetRound}
            className="px-4 py-2 bg-yellow-400 rounded-lg shadow font-semibold"
          >
            Reset Round
          </button>
          <button
            onClick={nextRound}
            disabled={roundIndex === babyFeudData.length - 1}
            className={`px-4 py-2 rounded-lg shadow font-semibold ${
              roundIndex === babyFeudData.length - 1
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-500 text-white"
            }`}
          >
            Next Round →
          </button>

        </div>
      </div>
    </div>
  );
}
