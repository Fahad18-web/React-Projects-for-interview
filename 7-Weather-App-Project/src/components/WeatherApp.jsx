import { useState, useEffect, useCallback, useRef } from "react";
import { useWeather } from "../hooks/useWeather";
import "./styles.css";

// ─────────────────────────────────────────────
// Helper — Celsius to Fahrenheit
// ─────────────────────────────────────────────
function toFahrenheit(celsius) {
  return Math.round((celsius * 9) / 5 + 32);
}

// ─────────────────────────────────────────────
// Sub-component — Skeleton loader
// ─────────────────────────────────────────────
function Skeleton() {
  return (
    <div className="skeleton">
      <div className="sk-line" style={{ width: "60%" }} />
      <div className="sk-line" style={{ width: "35%" }} />
      <div className="sk-line" style={{ width: "50%" }} />
    </div>
  );
}

// ─────────────────────────────────────────────
// Sub-component — Weather main card
// ─────────────────────────────────────────────
function WeatherCard({ weather, display }) {
  return (
    <div className="main-card">
      <div className="city-name">{weather.city}</div>
      <div className="country">{weather.country}</div>
      <div className="temp-big">{display(weather.temp)}</div>
      <div className="feels">Feels like {display(weather.feels)}</div>
      <div className="condition">
        {weather.icon} {weather.condition}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// Sub-component — Stats grid (humidity + wind)
// ─────────────────────────────────────────────
function StatsGrid({ weather }) {
  return (
    <div className="stats-grid">
      <div className="stat-card">
        <div className="stat-label">Humidity</div>
        <div className="stat-value">
          {weather.humidity}<span className="stat-unit"> %</span>
        </div>
      </div>
      <div className="stat-card">
        <div className="stat-label">Wind speed</div>
        <div className="stat-value">
          {weather.wind}<span className="stat-unit"> km/h</span>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// Sub-component — Hourly forecast strip
// ─────────────────────────────────────────────
function HourlyForecast({ hourly, display }) {
  const formatHour = (h) => {
    if (h === 0)  return "12am";
    if (h < 12)   return `${h}am`;
    if (h === 12) return "12pm";
    return `${h - 12}pm`;
  };

  return (
    <div>
      <div className="hourly-label">Hourly forecast</div>
      <div className="hourly-scroll">
        {hourly.map((item, i) => (
          <div key={i} className="hourly-item">
            <div className="h-time">{formatHour(item.time)}</div>
            <div className="h-temp">{display(item.temp)}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// Main App Component
// ─────────────────────────────────────────────
function WeatherApp() {
  const [query, setQuery] = useState("");
  const [unit, setUnit]   = useState("C"); // "C" or "F"
  const inputRef          = useRef(null);

  // Custom hook handles all API logic
  const { weather, hourly, loading, error, fetchWeather } = useWeather();

  // Display helper — picks unit
  const display = useCallback(
    (celsius) =>
      unit === "C" ? `${celsius}°C` : `${toFahrenheit(celsius)}°F`,
    [unit]
  );

  // Search handler
  const handleSearch = useCallback(() => {
    fetchWeather(query);
  }, [query, fetchWeather]);

  // Enter key support
  const handleKeyDown = useCallback(
    (e) => { if (e.key === "Enter") handleSearch(); },
    [handleSearch]
  );

  // Load default city on mount
  useEffect(() => {
    fetchWeather("Lahore");
  }, []); // runs once — empty dependency array

  return (
    <div className="app">
      {/* Search bar */}
      <div className="search-row">
        <input
          ref={inputRef}
          type="text"
          placeholder="Search city — e.g. Karachi, London, Tokyo"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button onClick={handleSearch}>Search</button>
      </div>

      {/* Unit toggle — only visible when data loaded */}
      {weather && (
        <div className="unit-toggle">
          <button
            className={`unit-btn ${unit === "C" ? "active" : ""}`}
            onClick={() => setUnit("C")}
          >
            °C
          </button>
          <button
            className={`unit-btn ${unit === "F" ? "active" : ""}`}
            onClick={() => setUnit("F")}
          >
            °F
          </button>
        </div>
      )}

      {/* Error message */}
      {error && <div className="error-msg">{error}</div>}

      {/* Loading skeleton */}
      {loading && <Skeleton />}

      {/* Weather content */}
      {weather && !loading && (
        <div>
          <WeatherCard weather={weather} display={display} />
          <StatsGrid weather={weather} />
          {hourly.length > 0 && (
            <HourlyForecast hourly={hourly} display={display} />
          )}
        </div>
      )}

      {/* Empty state */}
      {!weather && !loading && !error && (
        <div className="empty-state">
          <p>Enter a city name to check the weather.</p>
        </div>
      )}
    </div>
  );
}

export default WeatherApp;