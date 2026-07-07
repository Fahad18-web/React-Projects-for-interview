import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar/Navabar';
import Home from './pages/Home/Home';
import Favorites from './pages/favorites/Favorites';
import Details from './pages/details/Details';

function App() {
  return (
    <div className="min-h-screen p-6 bg-white text-gray-600 text-lg">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/favorites" element={<Favorites />} />
        <Route path="/recipe-item/:id" element={<Details />} />
      </Routes>
    </div>
  );
}

export default App;