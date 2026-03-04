import { state } from "./state.js";

export const filterPokemon = () =>
  state.pokemon.filter((pokemon) => {
    const matchesType = state.filter.type === "all" ||
      pokemon.types.some((t) => t.type.name === state.filter.type);

    const matchesSearch = !state.filter.search ||
      pokemon.name.toLowerCase().includes(state.filter.search);

    return matchesType && matchesSearch;
  });
