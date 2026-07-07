
---

## Project Overview

Is project mein humne ek classic Tic Tac Toe game banaya React JS aur React Hooks use karke.  
Is ek chote se app mein React ke bohot saare important concepts cover hote hain.

---

## 1. `useState` Hook — State Management

### Concept kya hai?
`useState` ek React Hook hai jo component ke andar **data ko yaad rakhne** ka kaam karta hai.  
Jab bhi state change hoti hai, React component ko dobara render karta hai.

### Syntax

```js
const [value, setValue] = useState(initialValue);
```

- `value` → current state (jo abhi screen pe show ho raha hai)
- `setValue` → state update karne ka function
- `initialValue` → starting value (pehli baar kya hoga)

### Is Project Mein Kahan Use Hua?

```js
// Board state — 9 cells, sab null se start
const [board, setBoard] = useState(Array(9).fill(null));

// Kiska turn hai — true = X, false = O
const [isXTurn, setIsXTurn] = useState(true);

// Score tracker
const [scores, setScores] = useState({ X: 0, O: 0, Draw: 0 });

// Game history — last 5 results
const [history, setHistory] = useState([]);
```

### Key Rule
> State ko **directly mutate mat karo** (e.g. `board[0] = 'X'` ❌)  
> Hamesha `setState` function use karo (`setBoard(newBoard)` ✅)

---

## 2. `useCallback` Hook — Function Optimization

### Concept kya hai?
`useCallback` ek function ko **memoize** karta hai — yaani woh function tab tak dobara nahi banta  
jab tak uski **dependency list** mein koi change na aaye.

### Syntax

```js
const myFunction = useCallback(() => {
  // function ka kaam
}, [dependency1, dependency2]);
```

### Is Project Mein Kahan Use Hua?

```js
// Cell click handler
const handleCellClick = useCallback((index) => {
  if (board[index] || isGameOver) return;
  const newBoard = [...board]; // copy banao, directly mutate mat karo
  newBoard[index] = isXTurn ? 'X' : 'O';
  setBoard(newBoard);
}, [board, isXTurn, isGameOver]);
// ↑ yeh sab dependencies hain — inke change pe function update hoga

// Reset functions
const resetGame = useCallback(() => {
  setBoard(Array(9).fill(null));
  setIsXTurn(true);
}, []); // empty array = kabhi dobara nahi banega

const resetAll = useCallback(() => {
  setBoard(Array(9).fill(null));
  setIsXTurn(true);
  setScores({ X: 0, O: 0, Draw: 0 });
  setHistory([]);
}, []);
```

### Beginner Tip
Abhi ke liye `useCallback` performance optimization hai — agar skip bhi karo to app kaam karega.  
Lekin isko sikhna good practice hai.

---

## 3. Immutability — State ko Copy Karke Update Karna

### Concept kya hai?
React mein state **directly change nahi hoti** — pehle ek naya copy banate hain, phir update karte hain.

### Is Project Mein Kahan Use Hua?

```js
// GALAT tarika ❌
board[index] = 'X'; // original array mutate ho gaya
setBoard(board);    // React notice nahi karega

// SAHI tarika ✅
const newBoard = [...board]; // spread operator se copy
newBoard[index] = 'X';       // copy update karo
setBoard(newBoard);           // React ab re-render karega
```

### Kyun Zaroori Hai?
React `===` se check karta hai ke state change hua ya nahi.  
Agar same reference return karo, React samjhega kuch badla hi nahi aur render skip karega.

---

## 4. Derived State — State Se Compute Karna

### Concept kya hai?
Har cheez `useState` mein store nahi karni — kuch values **existing state se calculate** ki ja sakti hain.

### Is Project Mein Kahan Use Hua?

```js
// ✅ Yeh state nahi, derived values hain
const result = checkWinner(board);      // board se nikala
const winningLine = result ? result.line : [];
const winner = result ? result.winner : null;
const isDraw = !winner && board.every(Boolean); // kya sab cells fill hain?
const isGameOver = winner || isDraw;    // game khatam hua?
```

Agar yeh sab `useState` mein rakhte, to manually sync karna padta.  
Derived state cleaner aur error-proof hoti hai.

---

## 5. Pure Function — Game Logic Separation

### Concept kya hai?
**Pure function** = same input pe hamesha same output, koi side effect nahi.  
Game logic ko component se alag rakhna better architecture hai.

### Is Project Mein Kahan Use Hua?

```js
// Component ke bahar define kiya — pure function
const WINNING_COMBOS = [
  [0,1,2], [3,4,5], [6,7,8], // rows
  [0,3,6], [1,4,7], [2,5,8], // columns
  [0,4,8], [2,4,6]            // diagonals
];

function checkWinner(board) {
  for (const [a, b, c] of WINNING_COMBOS) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return { winner: board[a], line: [a, b, c] };
    }
  }
  return null; // koi winner nahi
}
```

- `checkWinner` ko component ki koi bhi state ki zaroorat nahi
- Sirf `board` dena hai, result milta hai
- Testing mein asaan, reusable hai

---

## 6. Conditional Rendering — Condition Se UI Badalna

### Concept kya hai?
React mein UI ko conditionally show karna aam pattern hai — ternary operator ya logical `&&` use hota hai.

### Is Project Mein Kahan Use Hua?

```js
// Ternary — status bar logic
let statusText = winner
  ? `${winner} wins!`    // winner hai
  : isDraw
  ? 'Draw!'              // draw hai
  : `${isXTurn ? 'X' : 'O'}'s turn`; // game chal raha hai

// Logical && — history sirf tab show hogi jab entries houn
{history.length > 0 && (
  <div className="history-section">...</div>
)}
```

### Pattern Summary

```js
// Ternary (ya / ya)
{condition ? <ComponentA /> : <ComponentB />}

// Short circuit (sirf agar true ho)
{condition && <Component />}
```

---

## 7. `.map()` — Array Se UI Banana

### Concept kya hai?
React mein arrays ko UI elements mein convert karna `map()` se hota hai.  
Har element ko ek unique `key` prop deni hoti hai.

### Is Project Mein Kahan Use Hua?

```js
// Board cells render karna
{board.map((cell, index) => (
  <div
    key={index}           // ← zaroori unique identifier
    className={[
      'cell',
      cell === 'X' ? 'x-cell' : '',
      cell === 'O' ? 'o-cell' : '',
      winningLine.includes(index) ? 'winning-cell' : '',
    ].join(' ')}
    onClick={() => handleCellClick(index)}
  >
    {cell}
  </div>
))}

// History list render karna
{history.map((item, i) => (
  <div key={i} className="history-item">{item}</div>
))}
```

### `key` Kyun Chahiye?
React DOM updates efficiently karne ke liye `key` use karta hai.  
Without `key`, React confuse hota hai kaunsa element change hua.

---

## 8. Event Handling — User Interaction

### Concept kya hai?
React mein events camelCase hote hain aur directly JSX attributes mein diye jaate hain.

### Is Project Mein Kahan Use Hua?

```js
// Cell click
<div onClick={() => handleCellClick(index)}>

// Button click
<button onClick={resetGame}>New Game</button>
<button onClick={resetAll}>Reset All</button>
```

### Arrow Function Wrapper Kyun?
```js
// Yeh index pass karne ke liye zaroor hai
onClick={() => handleCellClick(index)}

// Agar yun karein to immediately call ho jaata (render pe)
onClick={handleCellClick(index)} // ❌ GALAT
```

---

## 9. Functional Update Pattern — Score Update

### Concept kya hai?
Jab new state previous state pe depend kare, to **functional update** use karo.

### Is Project Mein Kahan Use Hua?

```js
// Functional update — prev state ko safely use karna
setScores(prevScores => ({
  ...prevScores,               // baaki sab same rakhna
  [winner]: prevScores[winner] + 1  // sirf winner ka score badho
}));

// History update — slice(0,5) se max 5 items rakhna
setHistory(prevHistory => [`${winner} wins!`, ...prevHistory].slice(0, 5));
```

### `prevState` Kyun Use Karna?
```js
// Galat — stale state issue ho sakta hai
setScores({ ...scores, X: scores.X + 1 }); // ❌

// Sahi — guaranteed latest state milti hai
setScores(prev => ({ ...prev, X: prev.X + 1 })); // ✅
```

---

## 10. Component Architecture — Single Component Design

Is project mein humne **single `App` component** use kiya — yeh beginner ke liye perfect hai.

### Agar Agle Level Pe Le Jaayein (Refactor Plan)

```
App (parent)
├── StatusBar   → turn/winner display
├── Board       → grid container
│   └── Cell    → individual cell (3x3 = 9 cells)
├── Controls    → New Game / Reset buttons
└── Scoreboard  → X / Draw / O scores
```

**Props flow:** App se data neeche jaata hai, events upar aate hain — yahi "lifting state up" pattern hai.

---

## Hooks Used — Quick Reference

| Hook | Kaam | Is Project Mein |
|------|------|-----------------|
| `useState` | State store karna | Board, turn, scores, history |
| `useCallback` | Function memoize karna | handleCellClick, reset functions |

---

## Important Patterns Summary

| Pattern | Kahan Use Hua |
|---------|--------------|
| Immutability (`[...arr]`) | Board update karna |
| Derived state | winner, isDraw, isGameOver |
| Pure function | `checkWinner()` |
| Conditional rendering | Status bar, history section |
| `.map()` with `key` | Board cells, history list |
| Functional update | Score aur history update |
| Arrow function wrapper | onClick handlers |

---

