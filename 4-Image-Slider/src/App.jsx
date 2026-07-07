import ImageSlider from "./components/ImageSlider";

export default function App() {
  return (
    <div>
      <h1 style={{ textAlign: "center" }}>🖼️ React Image Slider</h1>
      <ImageSlider autoPlay={true} interval={3000} />
    </div>
  );
}