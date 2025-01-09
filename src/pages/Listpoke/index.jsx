import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './index.css';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import Pagination from '../../components/Pagination';
import { Link } from 'react-router-dom';

export default function Listpoke() {
    const [pokemon, setPokemon] = useState([]);
    const [filteredPokemon, setFilteredPokemon] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const pokemonPerPage = 28;
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        GetPokemon();
    }, []);

    const GetPokemon = async () => {
        try {
            const { data } = await axios.get('https://pokeapi.co/api/v2/pokemon?limit=1302&offset=0');
            const pokemonData = await Promise.all(
                data.results.map(async (pokemon) => {
                    const res = await axios.get(pokemon.url);
                    return { ...pokemon, image: res.data.sprites.front_default };
                })
            );
            setPokemon(pokemonData);
            setFilteredPokemon(pokemonData); // Inicialmente, exibe todos os Pokémon
            setIsLoading(false);
        } catch (erro) {
            console.error('Erro:', erro);
            setIsLoading(false);
        }
    };

    const handleSearch = (searchTerm) => {
        if (searchTerm === '') {
            setFilteredPokemon(pokemon); // Exibe todos os Pokémon quando o campo está vazio
        } else {
            const filtered = pokemon.filter((p) =>
                p.name.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setFilteredPokemon(filtered);
        }
        setCurrentPage(1); // Reinicia para a primeira página ao pesquisar
    };

    const dataToDisplay = filteredPokemon;
    const indexOfLastPokemon = currentPage * pokemonPerPage;
    const indexOfFirstPokemon = indexOfLastPokemon - pokemonPerPage;
    const currentPokemon = dataToDisplay.slice(indexOfFirstPokemon, indexOfLastPokemon);
    const totalPages = Math.ceil(dataToDisplay.length / pokemonPerPage);

    const handlePageChange = (page) => setCurrentPage(page);
    const handleNextPage = () => currentPage < totalPages && setCurrentPage(currentPage + 1);
    const handlePrevPage = () => currentPage > 1 && setCurrentPage(currentPage - 1);
    const handleFirstPage = () => setCurrentPage(1);
    const handleLastPage = () => setCurrentPage(totalPages);

    return (
        <div>
            <Navbar onSearch={handleSearch} />

            {isLoading ? (
                <div className="loading">Carregando Pokémon...</div>
            ) : (
                <>
                    <ul className="list">
                        {currentPokemon.map((pokemon) => (
                            <li key={pokemon.name} className="lista">
                                <Link to={`/pokemon/${pokemon.name}`} className="pokemon-card">
                                    <p className="name">{pokemon.name}</p>
                                    <img className="img" src={pokemon.image} alt={pokemon.name} />
                                </Link>
                            </li>
                        ))}
                    </ul>

                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                        onFirstPage={handleFirstPage}
                        onLastPage={handleLastPage}
                        onNextPage={handleNextPage}
                        onPrevPage={handlePrevPage}
                    />
                </>
            )}

            <Footer />
        </div>
    );
}
