import { useState } from "react";
import {useLocation, useSearchParams} from "react-router-dom";
import babyFeudData from "../data/babyFeudData.js";

//shuffle the order based on the seed passed as an argument.
function seededShuffle(array, seed) {
  let result = [...array];
  let random = mulberry32(seed);
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

// deterministic PRNG
function mulberry32(a) {
  return function () {
    let t = (a += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export default function BabyFeud() {
  const location = useLocation();
  const isHost = new URLSearchParams(location.search).get("host") === "true";

  // Use a fixed seed so order matches across devices, pass the seed as an argument in the url
  // Game mode /baby-feud?seed=3245 host mode - /baby-feud?host=true&seed=3245

  const [searchParams] = useSearchParams();
  const seed = parseInt(searchParams.get("seed") || "2025", 10);

  const shuffledData = seededShuffle(babyFeudData, seed);

  const [roundIndex, setRoundIndex] = useState(0);
  const [revealed, setRevealed] = useState([]);

  const round = shuffledData[roundIndex];

  const handleReveal = (i) => {
    if (!revealed.includes(i)) {
      setRevealed([...revealed, i]);
    }
  };

  const nextRound = () => {
    if (roundIndex < shuffledData.length - 1) {
      setRoundIndex(roundIndex + 1);
      setRevealed([]);
    }
  };

  const previousRound = () => {
    if (roundIndex > 0) {
      setRoundIndex(roundIndex - 1);
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
          👶 Baby Feud – Round {roundIndex + 1}
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
              {revealed.includes(i)
                ? `${ans.text} – ${ans.points}`
                : isHost
                ? `${ans.text} – ${ans.points}` // Host sees answers
                : "❓"}
            </button>
          ))}
        </div>

        {/* Controls */}
        <div className="flex gap-4 justify-center">
          <button
            onClick={previousRound}
            disabled={roundIndex === 0}
            className={`px-4 py-2 rounded-lg shadow font-semibold ${
              roundIndex === 0
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
            disabled={roundIndex === shuffledData.length - 1}
            className={`px-4 py-2 rounded-lg shadow font-semibold ${
              roundIndex === shuffledData.length - 1
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
