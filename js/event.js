import { renderPokemonCards, setInputAccentColor } from "./dom.js";
import { filterPokemon } from "./filterPokemon.js";
import { state } from "./state.js";

const handleSidebarFilter = (container) => {
  const sidebar = document.querySelector(".side-bar");

  sidebar.addEventListener("click", (e) => {
    e.preventDefault();
    const activatedClass = document.querySelector(".active");
    activatedClass.classList.remove("active");
    e.target.classList.add("active");

    state.filter.type = e.target.dataset.type;
    setInputAccentColor(state.filter.type);
    const filteredPokemon = filterPokemon();

    renderPokemonCards(container, filteredPokemon);
  });
};

const setupSearchFilter = (container) => {
  const input = document.querySelector(".search-bar>input");

  input.addEventListener("input", () => {
    state.filter.search = input.value.toLowerCase();
    const filteredPokemon = filterPokemon();

    renderPokemonCards(container, filteredPokemon);
  });
};

export const handleFiltering = (container) => {
  handleSidebarFilter(container);
  setupSearchFilter(container);
};
