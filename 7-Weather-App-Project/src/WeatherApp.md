

---

## Project Overview

Is project mein humne ek real-world Weather App banaya jo:
- **Open-Meteo API** se live data fetch karta hai (free, no API key!)
- City search, °C/°F toggle, hourly forecast, aur loading skeleton dikhata hai
- React ke 5 important hooks cover karta hai

---

## File Structure

```
weather-app/
├── src/
│   ├── hooks/
│   │   └── useWeather.js   ← Custom Hook (API logic)
│   ├── App.jsx             ← Main Component (UI)
│   ├── App.css             ← Styles
│   └── main.jsx            ← Entry point
├── index.html
├── package.json
└── vite.config.js
```

---

## 1. `useState` — State Variables Manage Karna

### Concept
`useState` component ke andar **data store karta hai**.  
Jab state change hoti hai, React UI dobara render karta hai.

### Is Project Mein

```js
// App.jsx mein
const [query, setQuery] = useState("");       // search input ki value
const [unit, setUnit]   = useState("C");      // temperature unit (C ya F)

// useWeather.js mein
const [weather, setWeather] = useState(null); // weather data object
const [hourly, setHourly]   = useState([]);   // hourly forecast array
const [loading, setLoading] = useState(false); // API call chal rahi hai?
const [error, setError]     = useState("");   // error message
```

### Pattern — Multiple States
```js
// ✅ Sahi: har cheez ki alag state
const [loading, setLoading] = useState(false);
const [error, setError]     = useState("");

// ❌ Galat approach: sab ek object mein (complex hota hai)
// const [state, setState] = useState({ loading: false, error: "" });
```

---

## 2. `useEffect` — Side Effects Handle Karna

### Concept
`useEffect` component ke **render ke baad** kuch kaam karta hai:
- API calls
- Subscriptions
- DOM manipulation
- Timers

### Syntax
```js
useEffect(() => {
  // kaam karo
  return () => {
    // cleanup (optional)
  };
}, [dependency1, dependency2]); // dependency array
```

### Is Project Mein
```js
// App.jsx mein — sirf pehli baar Lahore ka weather load karo
useEffect(() => {
  fetchWeather("Lahore");
}, []); // ← empty array = sirf ek baar chalega (mount pe)
```

### Dependency Array Rules

| Array | Kab Chalta Hai |
|-------|---------------|
| `[]` | Sirf ek baar — component mount hone pe |
| `[city]` | Har baar jab `city` change ho |
| `[a, b]` | Jab `a` ya `b` mein se koi change ho |
| (koi array nahi) | Har render ke baad — aksar avoid karo |

### Real-world Example
```js
// Agar search automatically trigger karna ho jab query change ho:
useEffect(() => {
  if (query.length > 2) {
    fetchWeather(query); // 3+ characters pe auto search
  }
}, [query]); // query change hone pe chalega
```

---

## 3. `useCallback` — Functions Memoize Karna

### Concept
`useCallback` ek function ko **yaad rakhta hai** — tab tak naya nahi banta  
jab tak uski dependencies na badle.

### Kyun Zaroor Hai?
```js
// Problem without useCallback:
function App() {
  // Har render pe yeh naya function banta hai
  const handleSearch = () => fetchWeather(query);
  // Agar handleSearch kisi child ko prop pass ho, child bhi re-render hoga
}

// Solution with useCallback:
const handleSearch = useCallback(() => {
  fetchWeather(query);
}, [query, fetchWeather]); // sirf in ke change pe naya function banega
```

### Is Project Mein
```js
// App.jsx
const handleSearch = useCallback(() => {
  fetchWeather(query);
}, [query, fetchWeather]); // query ya fetchWeather badle to update ho

const handleKeyDown = useCallback(
  (e) => { if (e.key === "Enter") handleSearch(); },
  [handleSearch] // handleSearch pe depend karta hai
);

const display = useCallback(
  (celsius) => unit === "C" ? `${celsius}°C` : `${toFahrenheit(celsius)}°F`,
  [unit] // unit badle to display function update ho
);

// useWeather.js
const fetchWeather = useCallback(async (city) => {
  // ...API logic
}, []); // koi dependency nahi — kabhi recreate nahi hoga
```

---

## 4. `useRef` — DOM Reference Rakhna

### Concept
`useRef` ek **mutable reference** deta hai jo:
1. Re-render trigger nahi karta (unlike `useState`)
2. DOM elements access karne deta hai

### Is Project Mein
```js
const inputRef = useRef(null); // input field ka reference

// JSX mein:
<input ref={inputRef} ... />

// Ab inputRef.current se input access kar sakte hain, jaise:
// inputRef.current.focus()  → input pe focus karo
// inputRef.current.value    → current value padho
```

### `useState` vs `useRef`

| | `useState` | `useRef` |
|-|------------|----------|
| Re-render triggers? | Haan | Nahi |
| Value persist? | Haan | Haan |
| Use case | UI data | DOM refs, timers, mutable values |

---

## 5. Custom Hook — `useWeather`

### Concept
Custom hook ek **apna function** hota hai jo React hooks use karta hai.  
Naam hamesha `use` se start hona chahiye.

### Faida
```
Without Custom Hook:          With Custom Hook:
────────────────              ────────────────
App.jsx                       App.jsx          useWeather.js
├── useState (4x)             ├── useWeather() ├── useState (4x)
├── fetchWeather()            └── display()    ├── fetchWeather()
├── display()                                  └── getCondition()
└── getCondition()
     ↑ sab ek jagah = messy      ↑ clean!
```

### Is Project Ka Custom Hook
```js
// hooks/useWeather.js
export function useWeather() {
  // State internally manage hoti hai
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");
  const [hourly, setHourly]   = useState([]);

  // API call logic encapsulated hai
  const fetchWeather = useCallback(async (city) => {
    setLoading(true);
    // ... fetch logic
    setLoading(false);
  }, []);

  // Return karo jo App ko chahiye
  return { weather, hourly, loading, error, fetchWeather };
}

// App.jsx mein use karna bohot simple hai:
const { weather, hourly, loading, error, fetchWeather } = useWeather();
```

### Custom Hook Rules
1. Naam `use` se start ho (`useWeather`, `useFetch`, `useAuth`)
2. Regular React hooks (`useState`, `useEffect`) use kar sakta hai
3. Reusable hai — kisi bhi component mein use karo

---

## 6. Async/Await + Fetch API

### Concept
Real-world apps mein data **asynchronously** aata hai (time laghta hai).  
`async/await` is process ko synchronous jaisa dikhata hai.

### Is Project Mein — 2-Step API Call
```js
const fetchWeather = useCallback(async (city) => {
  try {
    // Step 1 — City ka naam → Latitude/Longitude (Geocoding)
    const geoRes = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${city}`
    );
    const geoData = await geoRes.json(); // response ko JSON banao

    // Check karo city mili ya nahi
    if (!geoData.results?.length) {
      setError("City not found");
      return; // bahar niklo
    }

    const { latitude, longitude, name } = geoData.results[0];

    // Step 2 — Lat/Lon → Weather Data
    const wRes = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m`
    );
    const wData = await wRes.json();

    setWeather({ city: name, temp: wData.current.temperature_2m });

  } catch (err) {
    // Network error ya koi aur problem
    setError("Could not fetch weather.");
  }
}, []);
```

### Error Handling Pattern
```js
try {
  setLoading(true);   // loading shuru
  setError("");       // purani errors clear karo

  // ... async kaam karo

} catch (err) {
  setError("Something went wrong."); // user ko batao
} finally {
  setLoading(false);  // loading khatam — chahe success ho ya error
}
```

---

## 7. Component Architecture — Separation of Concerns

### Pattern — Multiple Small Components
```
App (parent)
├── Skeleton           → loading state dikhata hai
├── WeatherCard        → city, temp, condition
├── StatsGrid          → humidity, wind
└── HourlyForecast     → 12-hour strip
```

### Props Passing
```jsx
// Parent (App) → child ko data deta hai via props
<WeatherCard weather={weather} display={display} />
<StatsGrid   weather={weather} />
<HourlyForecast hourly={hourly} display={display} />

// Child (WeatherCard) → props receive karta hai
function WeatherCard({ weather, display }) {
  return (
    <div>
      <h1>{weather.city}</h1>
      <p>{display(weather.temp)}</p>
    </div>
  );
}
```

---

## 8. Conditional Rendering — Different UI States

### Yeh App 4 States Handle Karta Hai

```jsx
{/* State 1: Error */}
{error && <div className="error-msg">{error}</div>}

{/* State 2: Loading */}
{loading && <Skeleton />}

{/* State 3: Data available */}
{weather && !loading && (
  <div>
    <WeatherCard weather={weather} display={display} />
    <StatsGrid weather={weather} />
    {hourly.length > 0 && <HourlyForecast hourly={hourly} display={display} />}
  </div>
)}

{/* State 4: Empty (kuch nahi) */}
{!weather && !loading && !error && (
  <div className="empty-state">Enter a city name.</div>
)}
```

### Short-circuit Operator `&&`
```js
// Sirf tab render karo jab condition true ho
{hourly.length > 0 && <HourlyForecast />}
// ↑ agar hourly empty hai to kuch nahi dikhega
```

---

## 9. Derived Value — Pure Helper Function

### Concept
Har cheez state mein nahi rakhni — kuch values **calculate** ki ja sakti hain.

### Is Project Mein
```js
// State mein sirf Celsius rakha
const [unit, setUnit] = useState("C");

// Fahrenheit calculate karo jab chahiye
function toFahrenheit(celsius) {
  return Math.round((celsius * 9) / 5 + 32);
}

// Display function — unit pe depend karta hai
const display = useCallback(
  (celsius) =>
    unit === "C"
      ? `${celsius}°C`          // Celsius dikhao
      : `${toFahrenheit(celsius)}°F`, // ya Fahrenheit
  [unit]
);

// Use karna simple hai:
display(25) // → "25°C" ya "77°F" — unit ke hisaab se
```

---

## 10. Loading Skeleton — UX Pattern

### Concept
Jab data load ho raha ho, blank screen dikhana poor UX hai.  
**Skeleton** ek placeholder UI hai jo data ki shape dikhata hai.

### Is Project Mein
```jsx
function Skeleton() {
  return (
    <div className="skeleton">
      <div className="sk-line" style={{ width: "60%" }} />
      <div className="sk-line" style={{ width: "35%" }} />
      <div className="sk-line" style={{ width: "50%" }} />
    </div>
  );
}
```

```css
/* Pulsing animation — CSS se */
.sk-line {
  height: 14px;
  background: #e0e0e0;
  border-radius: 6px;
  animation: pulse 1.2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 0.4; }
  50%       { opacity: 1; }
}
```

---

## Hooks Used — Quick Reference

| Hook | File | Kaam |
|------|------|------|
| `useState` | `App.jsx` + `useWeather.js` | query, unit, weather, loading, error, hourly |
| `useEffect` | `App.jsx` | Mount pe Lahore load karna |
| `useCallback` | `App.jsx` + `useWeather.js` | handleSearch, display, fetchWeather |
| `useRef` | `App.jsx` | Input DOM element reference |
| Custom Hook | `useWeather.js` | Poori API logic encapsulate karna |

---

## API Flow — Diagram

```
User types "Karachi" → handleSearch()
         ↓
   fetchWeather("Karachi")
         ↓
   setLoading(true) → Skeleton dikhta hai
         ↓
   Geocoding API call
   "Karachi" → { lat: 24.86, lon: 67.01 }
         ↓
   Weather API call
   lat/lon → { temp, humidity, wind, code }
         ↓
   setWeather({...}) → WeatherCard dikhta hai
   setHourly([...]) → HourlyForecast dikhta hai
         ↓
   setLoading(false) → Skeleton hata
```

---

## Commands — Local Machine Pe Run Karna

```bash
# Project folder mein jao
cd weather-app

# Dependencies install karo
npm install

# Development server start karo
npm run dev

# Browser mein kholo
# http://localhost:5173
```

---

