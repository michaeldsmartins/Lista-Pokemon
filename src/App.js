import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Listpoke from './pages/Listpoke';
import PokemonDetails from './pages/Details';



function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Listpoke />} />
        <Route path="/pokemon/:id" element={<PokemonDetails />} />
      </Routes>
    </Router>
  );
}

export default App;
