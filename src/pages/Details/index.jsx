import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Footer from '../../components/Footer';
import Navbar from '../../components/Navbar';

import './index.css';

function PokemonDetails() {
  const { id } = useParams();
  const [pokemon, setPokemon] = useState(null);
  const [selectedPokemon, setSelectedPokemon] = useState(null);
  const [evolutions, setEvolutions] = useState([]);
  const [ability, setAbility] = useState(null);
  const navigate = useNavigate(); // Para redirecionamento

  useEffect(() => {
    const fetchPokemonDetails = async () => {
      try {
        const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${id}`);
        setPokemon(response.data);
        setSelectedPokemon(response.data);

        const speciesResponse = await axios.get(response.data.species.url);
        const evolutionChainUrl = speciesResponse.data.evolution_chain.url;
        const evolutionResponse = await axios.get(evolutionChainUrl);

        let current = evolutionResponse.data.chain;
        const evolutionsList = [];

        while (current) {
          const speciesName = current.species.name;
          const speciesData = await axios.get(current.species.url);
          const pokemonId = speciesData.data.id;
          evolutionsList.push({ name: speciesName, id: pokemonId });
          current = current.evolves_to[0];
        }

        setEvolutions(evolutionsList);

        const abilityResponse = await axios.get(
          `https://pokeapi.co/api/v2/ability/${response.data.abilities[0].ability.name}`
        );
        setAbility(abilityResponse.data);

        // Atualiza o fundo da página com base no tipo do Pokémon
        if (response.data.types && response.data.types.length > 0) {
          const pokemonType = response.data.types[0].type.name;
          document.body.className = pokemonType; // Aplica a classe do tipo ao body
        }

      } catch (error) {
        console.error('Erro ao buscar detalhes do Pokémon', error);
      }
    };

    fetchPokemonDetails();
  }, [id]);

  const handleSelectPokemon = async (pokemonId) => {
    try {
      const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`);
      setSelectedPokemon(response.data);

      const abilityResponse = await axios.get(
        `https://pokeapi.co/api/v2/ability/${response.data.abilities[0].ability.name}`
      );
      setAbility(abilityResponse.data);

      // Atualiza o fundo da página com base no tipo do Pokémon
      if (response.data.types && response.data.types.length > 0) {
        const pokemonType = response.data.types[0].type.name;
        document.body.className = pokemonType; // Aplica a classe do tipo ao body
      }
    } catch (error) {
      console.error('Erro ao alternar para o Pokémon selecionado', error);
    }
  };

  const handleSearch = (searchTerm) => {
    if (searchTerm) {
      navigate(`/pokemon/${searchTerm.toLowerCase()}`); // Redireciona para o Pokémon pesquisado
    }
  };

  if (!pokemon || !selectedPokemon) return <div>Carregando...</div>;

  return (
    <div>
      <Navbar onSearch={handleSearch} />
      <div className="pokemon-details-container">
        <Link to="/" className="back-button">
          <button>Voltar para a Lista</button>
        </Link>
        
        <div className="pokemon-details-card">
          <h1>{selectedPokemon.name}</h1>
          <img src={selectedPokemon.sprites.front_default} alt={selectedPokemon.name} />
          <p>
            <strong>Tipo:</strong>{' '}
            {selectedPokemon.types.map((type) => type.type.name).join(', ')}
          </p>
          <p>
            <strong>Peso:</strong> {selectedPokemon.weight}
          </p>
          <p>
            <strong>Altura:</strong> {selectedPokemon.height}
          </p>
          <p>
            <strong>Habilidades:</strong>{' '}
            {selectedPokemon.abilities.map((ability) => ability.ability.name).join(', ')}
          </p>
          <p>
            <strong>Habilidade Especial:</strong> {ability ? ability.name : 'Carregando...'}
          </p>
        </div>

        <div className="evolution-container">
          {Array.isArray(evolutions) &&
            evolutions.map((evolution) => (
              <div
                key={evolution.id}
                className="pokemon-details-card"
                onClick={() => handleSelectPokemon(evolution.id)}
              >
                <h2>{evolution.name}</h2>
                <img
                  src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${evolution.id}.png`}
                  alt={evolution.name}
                />
              </div>
            ))}
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default PokemonDetails;
