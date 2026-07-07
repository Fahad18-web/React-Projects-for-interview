import { useState, useEffect } from "react";
import "./styles.css";

const slides = [
  {
    id: 1,
    url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800",
    title: "Beautiful Mountains",
  },
  {
    id: 2,
    url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800",
    title: "Ocean Waves",
  },
  {
    id: 3,
    url: "https://images.unsplash.com/photo-1476231682828-37e571bc172f?w=800",
    title: "Forest Path",
  },
  {
    id: 4,
    url: "https://images.unsplash.com/photo-1518173946687-a4c8892bbd9f?w=800",
    title: "Desert Dunes",
  },
];

export default function ImageSlider({ autoPlay = true, interval = 3000 }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  useEffect(() => {
    if (!autoPlay) return;

    const timer = setInterval(() => {
      handleNext();
    }, interval);

    return () => clearInterval(timer);
  }, [currentIndex, autoPlay, interval]);

  return (
    <div className="slider-container">

      {/* Image + Title */}
      <div className="slider-image-wrapper">
        <img
          src={slides[currentIndex].url}
          alt={slides[currentIndex].title}
          className="slider-image"
        />
        <div className="slider-title">{slides[currentIndex].title}</div>
      </div>

      {/* Prev Button */}
      <button
        className="slider-btn slider-btn-prev"
        onClick={handlePrev}
      >
        ‹
      </button>

      {/* Next Button */}
      <button
        className="slider-btn slider-btn-next"
        onClick={handleNext}
      >
        ›
      </button>

      {/* Dot Indicators */}
      <div className="slider-dots">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`slider-dot ${index === currentIndex ? "active" : ""}`}
          />
        ))}
      </div>

      {/* Counter */}
      <div className="slider-counter">
        {currentIndex + 1} / {slides.length}
      </div>

    </div>
  );
}