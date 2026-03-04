export const fetchPokemonData = () =>
  fetch("../pokemons.json").then((res) => res.json()).catch(() => []);
