import { useState, useCallback } from "react";

// ─────────────────────────────────────────────
// Helper — weather code → label + emoji
// Open-Meteo WMO codes:
// https://open-meteo.com/en/docs#weathervariables
// ─────────────────────────────────────────────
function getCondition(code) {
  if (code === 0) return { label: "Clear sky", icon: "☀️" };
  if (code <= 2)  return { label: "Partly cloudy", icon: "⛅" };
  if (code === 3) return { label: "Overcast", icon: "☁️" };
  if (code <= 67) return { label: "Rain", icon: "🌧️" };
  if (code <= 77) return { label: "Snow", icon: "❄️" };
  if (code <= 82) return { label: "Showers", icon: "🌦️" };
  return          { label: "Thunderstorm", icon: "⛈️" };
}

// ─────────────────────────────────────────────
// Custom Hook — useWeather
// Encapsulates: state + API calls + error handling
// ─────────────────────────────────────────────
export function useWeather() {
  const [weather, setWeather] = useState(null);
  const [hourly, setHourly]   = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");

  const fetchWeather = useCallback(async (city) => {
    if (!city.trim()) return;

    // Reset state before new fetch
    setLoading(true);
    setError("");
    setWeather(null);
    setHourly([]);

    try {
      // Step 1 — Geocoding: city name → lat/lon
      const geoRes = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`
      );
      const geoData = await geoRes.json();

      if (!geoData.results?.length) {
        setError(`City "${city}" not found. Try another name.`);
        setLoading(false);
        return;
      }

      const { latitude, longitude, name, country } = geoData.results[0];

      // Step 2 — Weather data: lat/lon → current + hourly weather
      const wRes = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}` +
        `&current=temperature_2m,apparent_temperature,relative_humidity_2m,wind_speed_10m,weathercode` +
        `&hourly=temperature_2m,weathercode&timezone=auto&forecast_days=1`
      );
      const wData = await wRes.json();

      const c = wData.current;
      const condition = getCondition(c.weathercode);

      setWeather({
        city:      name,
        country:   country,
        temp:      Math.round(c.temperature_2m),
        feels:     Math.round(c.apparent_temperature),
        humidity:  Math.round(c.relative_humidity_2m),
        wind:      Math.round(c.wind_speed_10m),
        condition: condition.label,
        icon:      condition.icon,
      });

      // Take first 12 hours for hourly forecast
      const hours = wData.hourly.time.slice(0, 12).map((t, i) => ({
        time: new Date(t).getHours(),
        temp: Math.round(wData.hourly.temperature_2m[i]),
      }));
      setHourly(hours);

    } catch (err) {
      setError("Could not fetch weather. Check your connection.");
    }

    setLoading(false);
  }, []); // empty deps — function never needs to be recreated

  return { weather, hourly, loading, error, fetchWeather };
}