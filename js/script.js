import { createLoader, renderPokemonCards } from "./dom.js";
import { fetchPokemonData } from "./fetchPokemonData.js";
import { handleFiltering } from "./event.js";
import { state } from "./state.js";

export const capitalize = (str) =>
  str ? str[0].toUpperCase() + str.slice(1) : "";

window.onload = async () => {
  const loader = createLoader();
  document.body.appendChild(loader);
  state.pokemon = await fetchPokemonData();
  document.body.removeChild(loader);

  const container = document.querySelector(".container");
  renderPokemonCards(container, state.pokemon);
  handleFiltering(container);
};
