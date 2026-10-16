import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import Predict from './pages/Predict';
import About from './pages/About';
import Features from './pages/Features';
import { warmUpBackend } from './services/warmup';

function App() {
  useEffect(() => {
    // Non-blocking warmup ping to wake Render backend on initial visit
    warmUpBackend();
  }, []);
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/predict" element={<Predict />} />
            <Route path="/about" element={<About />} />
            <Route path="/features" element={<Features />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
