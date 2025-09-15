import "./styles/ProgressBar.css";

export default function ProgressBar({ progress }) {
  return (
    <div className="progress-container">
      <div className="progress-bar" style={{ width: `${progress}%` }}></div>
      <span className="progress-text">{progress.toFixed(0)}%</span>
    </div>
  );
}
