import { useState, useCallback } from "react";
import "./styles.css";

const WINNING_COMBOS = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6],
];

function checkWinner(board) {
  for (const [a, b, c] of WINNING_COMBOS) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return { winner: board[a], line: [a, b, c] };
    }
  }
  return null;
}

function TicTacToe() {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isXTurn, setIsXTurn] = useState(true);
  const [scores, setScores] = useState({ X: 0, O: 0, Draw: 0 });
  const [history, setHistory] = useState([]);

  const result = checkWinner(board);
  const winningLine = result ? result.line : [];
  const winner = result ? result.winner : null;
  const isDraw = !winner && board.every(Boolean);
  const isGameOver = winner || isDraw;

  const handleCellClick = useCallback(
    (index) => {
      if (board[index] || isGameOver) return;

      const newBoard = [...board];
      newBoard[index] = isXTurn ? "X" : "O";
      setBoard(newBoard);

      const newResult = checkWinner(newBoard);
      const newDraw = !newResult && newBoard.every(Boolean);

      if (newResult) {
        setScores((prev) => ({
          ...prev,
          [newResult.winner]: prev[newResult.winner] + 1,
        }));
        setHistory((prev) => [`${newResult.winner} wins!`, ...prev].slice(0, 5));
      } else if (newDraw) {
        setScores((prev) => ({ ...prev, Draw: prev.Draw + 1 }));
        setHistory((prev) => ["Draw!", ...prev].slice(0, 5));
      } else {
        setIsXTurn(!isXTurn);
      }
    },
    [board, isXTurn, isGameOver]
  );

  const resetGame = useCallback(() => {
    setBoard(Array(9).fill(null));
    setIsXTurn(true);
  }, []);

  const resetAll = useCallback(() => {
    setBoard(Array(9).fill(null));
    setIsXTurn(true);
    setScores({ X: 0, O: 0, Draw: 0 });
    setHistory([]);
  }, []);

  const getStatus = () => {
    if (winner) return `${winner} wins! 🏆`;
    if (isDraw) return "Draw!";
    return `${isXTurn ? "X" : "O"}'s turn`;
  };

  return (
    <div className="app">
      <h1 className="title">Tic Tac Toe</h1>
      <p className="subtitle">React Hooks — Beginner Project</p>

      <div className="status-bar">{getStatus()}</div>

      <div className="board">
        {board.map((cell, index) => (
          <div
            key={index}
            className={[
              "cell",
              cell ? "filled" : "",
              cell === "X" ? "x-cell" : "",
              cell === "O" ? "o-cell" : "",
              winningLine.includes(index) ? "winning-cell" : "",
              isGameOver && !cell ? "game-over-cell" : "",
            ].join(" ")}
            onClick={() => handleCellClick(index)}
          >
            {cell}
          </div>
        ))}
      </div>

      <div className="controls">
        <button onClick={resetGame}>New Game</button>
        <button onClick={resetAll}>Reset All</button>
      </div>

      <div className="score-row">
        <div className="score-card">
          <div className="score-label">X Wins</div>
          <div className="score-value x">{scores.X}</div>
        </div>
        <div className="score-card">
          <div className="score-label">Draws</div>
          <div className="score-value">{scores.Draw}</div>
        </div>
        <div className="score-card">
          <div className="score-label">O Wins</div>
          <div className="score-value o">{scores.O}</div>
        </div>
      </div>

      {history.length > 0 && (
        <div className="history-section">
          <div className="history-label">Recent Results</div>
          <div className="history-list">
            {history.map((item, i) => (
              <div key={i} className="history-item">
                {item}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default TicTacToe ;