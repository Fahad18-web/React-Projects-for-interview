# React Accordion Component — Study Notes

> **Component:** `Accordian.jsx` | **Pattern:** Single / Multi-Selection Toggle  
> **Core Concepts:** React Hooks · Conditional Rendering · Array Methods · Event Handling

---

## 01. Component Ka Overview (Kya Karta Hai?)

Yeh ek **FAQ-style Accordion UI** component hai jisme:

- Ek list of **questions** display hoti hai
- Kisi bhi question par **click** karne se uska **answer expand** hota hai
- Ek **toggle button** hai jo Single aur Multi-Selection mode switch karta hai

**External Dependencies:**
- `./data` — Questions aur answers ka array (data source)
- `./styles.css` — Visual styling

---

## 02. State Variables — Component Ki "Yaaddasht"

| State Variable | Initial Value | Type | Purpose |
|---|---|---|---|
| `selected` | `null` | `null \| number` | Single mode mein currently open item ki ID |
| `enablemultiselection` | `false` | `boolean` | Mode flag — `false` = single, `true` = multi |
| `multiple` | `[]` | `number[]` | Multi mode mein open items ki IDs ka array |

```jsx
const [selected, setSelected] = useState(null)
const [enablemultiselection, setMultiSelection] = useState(false)
const [multiple, setMultiple] = useState([])
```

> **Why Teen Alag States?**  
> Single mode mein sirf ek ID track karni hoti hai (number), jabke multi mode mein multiple IDs track karni hoti hain (array). Dono ki logic fundamentally alag hai — isliye alag states rakhe gaye hain.

---

## 03. Handler Functions — Logic Ka Dil

### 3.1 `handleSingleSelection(getCurrentID)`

```jsx
const handleSingleSelection = function (getCurrentID) {
    setSelected(getCurrentID === selected ? null : getCurrentID)
}
```

**Step-by-step Flow:**

1. User kisi item par click karta hai → uski `id` function mein aati hai
2. **Ternary check:** `getCurrentID === selected ?`
   - `true` (same item dobara click kiya) → `null` set karo → item **band ho jata hai**
   - `false` (naya item click kiya) → `getCurrentID` set karo → item **khul jata hai**
3. Ek waqt mein sirf ek item open ho sakta hai

---

### 3.2 `handleMultiSelection(getCurrentID)`

```jsx
const handleMultiSelection = function (getCurrentID) {
    let cpyMultiple = [...multiple];                         // Step 1: Copy banao
    const findIndexOfCurrentId = cpyMultiple.indexOf(getCurrentID)  // Step 2: Check karo
    
    if (findIndexOfCurrentId === -1) {                      // Step 3: Nahi mila?
        cpyMultiple.push(getCurrentID)                      //   → Add karo
    } else {                                                // Step 4: Mila?
        cpyMultiple.splice(findIndexOfCurrentId, 1)         //   → Remove karo
    }
    
    setMultiple(cpyMultiple)                                // Step 5: State update karo
}
```

**Step-by-step Flow:**

1. `[...multiple]` — Spread operator se **immutable copy** banao (React ka rule)
2. `indexOf(getCurrentID)` — Check karo: ID array mein hai ya nahi?
   - Returns `-1` → ID **nahi hai** → `push()` se add karo
   - Returns `0` ya usse zyada → ID **hai** → `splice(index, 1)` se remove karo
3. Updated copy se `setMultiple()` call karo → UI re-render hota hai

> ⚠️ **Critical Rule:** State ko **direct mutate mat karo**.  
> `multiple.push()` galat hai — yeh original state change karta hai.  
> `[...multiple]` copy banana aur usse modify karna sahi approach hai.

---

## 04. JSX Structure — Template Ka Breakdown

```jsx
return (
    <div className='wrapper'>
        {/* Toggle Button */}
        <button onClick={() => setMultiSelection(!enablemultiselection)}>
            Enable Multiple Selection
        </button>

        <div className='Accordian'>
            {data && data.length > 0 ? (
                data.map((dataItems) => (
                    <div className='items' key={dataItems.id}>

                        {/* Question Row */}
                        <div className='title'
                            onClick={
                                enablemultiselection
                                    ? () => handleMultiSelection(dataItems.id)
                                    : () => handleSingleSelection(dataItems.id)
                            }
                        >
                            <h3>{dataItems.question}</h3>
                            <span>{selected === dataItems.id ? '−' : '+'}</span>
                        </div>

                        {/* Answer — Conditional Rendering */}
                        {
                            enablemultiselection
                                ? multiple.indexOf(dataItems.id) !== -1 && (
                                    <div className='content'>{dataItems.answer}</div>
                                )
                                : selected === dataItems.id && (
                                    <div className='content'>{dataItems.answer}</div>
                                )
                        }

                    </div>
                ))
            ) : (
                <div className='no-data'>No data found</div>
            )}
        </div>
    </div>
)
```

### JSX ke Important Points:

| Element | Purpose |
|---|---|
| `<button onClick={() => setMultiSelection(!enablemultiselection)}>` | Mode toggle — `!` se boolean flip hota hai |
| `data && data.length > 0 ? ... : ...` | Guard check — data exist karta hai aur empty nahi hai |
| `data.map((dataItems) => ...)` | Array ko iterate karke har item ka JSX banata hai |
| `key={dataItems.id}` | React ko list items uniquely identify karne ke liye **zaroori** |
| `onClick={enablemultiselection ? handleMulti : handleSingle}` | Runtime mein mode check karke sahi handler call karta hai |

---

## 05. Conditional Rendering — Answer Kab Dikhega?

React mein `&&` (short-circuit evaluation) use hoti hai:

```
condition && <JSX />
```

- Agar `condition` → `false` ya `null` → JSX **render nahi hota** (component hidden)
- Agar `condition` → `true` → JSX **render hota hai** (component visible)

### Single Mode:

```jsx
selected === dataItems.id && (
    <div className='content'>{dataItems.answer}</div>
)
```

`selected` ID match kare to answer dikhao, warna kuch nahi.

### Multi Mode:

```jsx
multiple.indexOf(dataItems.id) !== -1 && (
    <div className='content'>{dataItems.answer}</div>
)
```

`multiple` array mein ID exist kare (`-1` na aaye) to answer dikhao.

---

## 06. Bugs & Issues — Dhyan Se Padho

### Bug 01 — Icon Multi-Mode Mein Galat Dikhta Hai

```jsx
{/* Current (Buggy) Code */}
<span>{selected === dataItems.id ? '−' : '+'}</span>
```

**Problem:** Yeh sirf `selected` state check karta hai jo single mode ke liye hai.  
Multi mode mein `selected` change nahi hota, isliye icon hamesha `+` dikhega — chahe item open ho.

**Fix:**

```jsx
<span>
    {
        enablemultiselection
            ? multiple.indexOf(dataItems.id) !== -1 ? '−' : '+'
            : selected === dataItems.id ? '−' : '+'
    }
</span>
```

---

### Bug 02 — Commented Code Mein Logic Error

```jsx
{/* Yeh commented out hai — galat bracket placement */}
{selected === dataItems.id || multiple.indexOf(dataItems.id !== -1) ? (
    <div className='content'>{dataItems.answer}</div>
) : null}
```

**Problem:** `dataItems.id !== -1` bracket ke andar hai — yeh `boolean` (`true`) return karta hai, ID nahi.  
Sahi hona chahiye tha: `multiple.indexOf(dataItems.id) !== -1`

Isliye developer ne yeh approach chhod kar alag if/else approach use ki.

---

## 07. Data Flow — Component Mein Information Kaise Chalta Hai?

```
./data (Array)
    ↓
data.map()
    ↓
dataItems (ek item)
    ↓  ↓
id  question  answer
↓       ↓         ↓
key  <h3>    .content div
```

---

## 08. Key Concepts — Exam/Interview Ke Liye

| Concept | Code Example | Explanation |
|---|---|---|
| `useState` Hook | `const [val, setVal] = useState(initial)` | Functional component mein state manage karna |
| Immutable State Update | `let copy = [...arr]; copy.push(x); setState(copy)` | Direct mutation se bachna |
| Short-circuit `&&` | `condition && <JSX />` | Condition false ho to render nahi hota |
| Ternary in JSX | `condition ? A : B` | Inline if-else |
| `Array.indexOf()` | `arr.indexOf(val)` returns `-1` if not found | Existence check |
| `Array.splice()` | `arr.splice(index, 1)` | Element remove karna |
| Spread Operator | `[...arr]` | Shallow copy banana |
| `key` prop | `key={item.id}` | List mein unique identifier |
| `data.map()` | `data.map(item => <div>{item}</div>)` | Array se JSX list banana |
| Toggle Pattern | `!prevValue` | Boolean flip karna |

---

## 09. Quick Revision Summary

```
Accordion Component
├── States (3)
│   ├── selected       → Single mode open item ID (null = koi nahi)
│   ├── enableMulti    → Mode flag (false = single, true = multi)
│   └── multiple       → Multi mode open items IDs array
│
├── Handlers (2)
│   ├── handleSingle   → Ternary: same ID? → null : newID
│   └── handleMulti    → indexOf check → push (add) ya splice (remove)
│
├── JSX
│   ├── Toggle Button  → !enablemultiselection
│   ├── data.map()     → Har item ke liye div banao
│   ├── onClick        → Mode check karke sahi handler call karo
│   └── && rendering   → Condition true ho to answer dikhao
│
└── Known Bugs
    ├── Icon logic multi-mode mein kaam nahi karta
    └── Commented code mein bracket galat jagah hai
```

---

