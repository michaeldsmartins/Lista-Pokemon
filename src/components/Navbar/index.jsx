import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './index.css';

export default function Navbar({ onSearch }) {
    const [searchTerm, setSearchTerm] = useState('');

    const handleSearch = (e) => {
        const value = e.target.value;
        setSearchTerm(value);
        onSearch(value); 
    };

    return (
        <div className="navbar">
        <div className="title">
          <Link to="/" className="h5">
            <h5>Pokemons</h5>  
          </Link>
        </div>
            <input
                type="text"
                placeholder="Pesquise um Pokémon..."
                value={searchTerm}
                onChange={handleSearch}
            />
        </div>
    );
}
