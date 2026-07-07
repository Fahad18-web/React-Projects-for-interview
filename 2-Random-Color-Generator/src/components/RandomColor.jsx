import React, { useState } from 'react'

function RandomColor() {
    const [typeofcolor, setTypeOfColor] = useState('hex')
    const [color, setColor] = useState('teal')

    const handleColorUtility = function (length) {
        return Math.floor(Math.random() * length)  // ✅ Fixed typo
    }

    const handleRandomHexColor = function () {
        const hex = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, "A", "B", "C", "D", "E", "F"]
        let hexColor = '#'
        for (let i = 0; i < 6; i++) {
            hexColor += hex[handleColorUtility(hex.length)]
        }
        setColor(hexColor)  // ✅ Loop ke baad
    }

    const handleRandomRgbColor = function () {
        const r = handleColorUtility(256)
        const g = handleColorUtility(256)
        const b = handleColorUtility(256)
        setColor(`rgb(${r}, ${g}, ${b})`)
    }

    return (
        <div style={{ width: '100vw', height: '100vh', background: color,
            display: "flex", flexDirection: "column", alignItems: "center",
            justifyContent: "center", position: "relative", fontFamily: "Arial, sans-serif" }}>

            <div style={{ position: "absolute", top: "20px", display: "flex", gap: "12px",
                background: "rgba(255,255,255,0.9)", padding: "12px 16px",
                borderRadius: "10px", boxShadow: "0 4px 12px rgba(0,0,0,0.15)" }}>
                <button onClick={() => setTypeOfColor('hex')}>Create Hex Color</button>
                <button onClick={() => setTypeOfColor('rgb')}>Create RGB Color</button>
                <button onClick={typeofcolor === 'hex' ? handleRandomHexColor : handleRandomRgbColor}>
                    Create Random Color
                </button>
            </div>

            <div style={{ background: "rgba(255,255,255,0.85)", padding: "40px 60px",
                borderRadius: "16px", textAlign: "center", boxShadow: "0 8px 20px rgba(0,0,0,0.2)" }}>
                <h3 style={{ marginBottom: "16px" }}>
                    {typeofcolor === 'rgb' ? "RGB Color" : "HEX Color"}  {/* ✅ Colon add kiya */}
                </h3>
                <h1 style={{ fontSize: "48px", margin: 0 }}>{color}</h1>
            </div>
        </div>
    )
}

export default RandomColor