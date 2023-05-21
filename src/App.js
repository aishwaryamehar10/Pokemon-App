import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const App = () => {
  const [pokemonList, setPokemonList] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const fetchPokemons = async (page) => {
    setIsLoading(true);

    try {
      const response = await axios.get(`https://api.pokemontcg.io/v2/cards`, {
        params: {
          q: 'supertype:pokemon',
          pageSize: 20,
          page: page,
        },
      });
      const pokemonData = response.data.data;
      const updatedPokemonList = pokemonData.map((pokemon) => {
        return {
          id: pokemon.id,
          name: pokemon.name,
          image: pokemon.images.small,
        };
      });
      setPokemonList((prevPokemonList) => [...prevPokemonList, ...updatedPokemonList]);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPokemons(currentPage);
  }, [currentPage]);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1);
  };

  const filteredPokemonList = searchTerm
    ? pokemonList.filter((pokemon) =>
      pokemon.name.toLowerCase() === searchTerm.toLowerCase()
    )
    : pokemonList;




  const handleLoadMore = () => {
    setCurrentPage(currentPage + 1);
  };

  return (
    <div className="app">
      <nav className="navbar">
        <h1>Pokemon App</h1>
        <div className="search-bar">
          <input type="text" placeholder="Search Pokemon" value={searchTerm} onChange={handleSearch} />
        </div>
      </nav>
      <div className="container">
        <div className="pokemon-list">
          {filteredPokemonList.map((pokemon) => (
            <div className="pokemon" key={pokemon.id}>
              <img src={pokemon.image} alt={`Pokemon ${pokemon.name}`} />
              <p>{pokemon.name}</p>
            </div>
          ))}
        </div>
        {isLoading && <div className="loading">Loading...</div>}
        {filteredPokemonList.length === 0 && !isLoading && <div className="no-results">No results found.</div>}
        <div className="load-more">
          <button onClick={handleLoadMore}>Load More</button>
        </div>
      </div>
      <footer className="footer">
        <p>© 2023 Pokemon App. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default App;




