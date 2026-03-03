const fetchPokemonData = () =>
  fetch("./pokemons.json").then((res) => res.json());

const dbg = (x) => console.log(x) || x;

const capitalize = (str) => str ? str[0].toUpperCase() + str.slice(1) : "";

const createLoader = () => {
  const loader = document.createElement("div");
  loader.classList.add("loader");
  return loader;
};

const createPokemonImage = (imageUrl) => {
  const image = document.createElement("img");
  image.src = imageUrl;
  image.alt = "pokemon-image";
  image.classList.add("poke-image");

  return image;
};

const createImageGradient = (types) =>
  types.map((t) => `var(--${t.type.name})`).join(",");

const createNamePowerStats = (s) => {
  const name = document.createElement("p");
  const power = document.createElement("p");
  name.classList.add("name");
  power.classList.add("power");

  name.innerText = capitalize(s.stat.name);
  power.innerText = s.base_stat;
  return { name, power };
};

const createStats = (stats) => {
  const statsDiv = document.createElement("div");
  statsDiv.classList.add("stats");

  stats.forEach((s) => {
    const namePowerDiv = document.createElement("div");
    namePowerDiv.classList.add("name-power");

    const { name, power } = createNamePowerStats(s);

    namePowerDiv.append(name, power);
    statsDiv.appendChild(namePowerDiv);
  });

  return statsDiv;
};

const createImageContainer = (imageUrl, types) => {
  const div = document.createElement("div");
  div.classList.add("img-container");
  div.style.backgroundImage = `linear-gradient(${
    createImageGradient(types)
  }, white)`;

  const image = createPokemonImage(imageUrl);
  div.appendChild(image);
  return div;
};

const createHeaderName = (pokemonName) => {
  const name = document.createElement("div");
  name.classList.add("name");
  const h1 = document.createElement("h1");
  h1.classList.add("name");
  h1.innerText = capitalize(pokemonName);

  name.appendChild(h1);
  return name;
};

const createHeaderTypes = (pokemonTypes) => {
  const types = document.createElement("div");
  types.classList.add("types");
  pokemonTypes.forEach((t) => {
    const p = document.createElement("p");
    p.classList.add("type", t.type.name);
    p.innerText = capitalize(t.type.name);

    types.appendChild(p);
  });

  return types;
};

const createMetaDataHeader = (name, types) => {
  const header = document.createElement("div");
  header.classList.add("header");
  const headerName = createHeaderName(name);
  const headerTypes = createHeaderTypes(types);

  header.append(headerName, headerTypes);
  return header;
};

const createMetaDataDiv = (name, types, stats) => {
  const metaData = document.createElement("div");
  metaData.classList.add("meta-data");

  const metaDataHeader = createMetaDataHeader(name, types);
  const metaDataStats = createStats(stats);

  metaData.append(metaDataHeader, metaDataStats);
  return metaData;
};

const createCard = ({ sprites, name, types, stats }) => {
  const card = document.createElement("div");
  card.classList.add("card");

  const imageContainer = createImageContainer(
    sprites.other["official-artwork"].front_default,
    types,
  );

  const metaData = createMetaDataDiv(name, types, stats);

  card.append(imageContainer, metaData);
  return card;
};

const createCards = (pokemons) =>
  pokemons.map((pokemon) => createCard(pokemon));

const filterPokemon = (pokemons, searchedPokemon, type) =>
  pokemons.filter((pokemon) => {
    const matchesType = type === "all" ||
      pokemon.types.some((t) => t.type.name === type);

    const matchesSearch = !searchedPokemon ||
      pokemon.name.toLowerCase().includes(searchedPokemon);

    return matchesType && matchesSearch;
  });

const displayCards = (pokemons) => {
  const container = document.querySelector(".container");
  container.innerHTML = "";
  const cards = createCards(pokemons);
  container.append(...cards);
};

const updateInputStyle = (type) => {
  const input = document.querySelector(".search-bar>form>input");
  input.style.setProperty("--type", `var(--${type})`);
};

const handleSideBarNavigation = (pokemons, filterMetaData) => {
  const sidebar = document.querySelector(".side-bar");

  sidebar.addEventListener("click", (e) => {
    e.preventDefault();
    const activatedClass = document.querySelector(".active");
    activatedClass.classList.remove("active");
    e.target.classList.add("active");

    filterMetaData.type = e.target.dataset.type;
    updateInputStyle(filterMetaData.type);
    const filteredPokemon = filterPokemon(
      pokemons,
      filterMetaData.search,
      filterMetaData.type,
    );

    displayCards(filteredPokemon);
  });
};

const handleSearch = (pokemons, filterMetaData) => {
  const input = document.querySelector(".search-bar>form>input");

  input.addEventListener("input", () => {
    filterMetaData.search = input.value.toLowerCase();

    const filteredPokemon = filterPokemon(
      pokemons,
      filterMetaData.search,
      filterMetaData.type,
    );

    displayCards(filteredPokemon);
  });
};

const handleFiltering = (pokemons) => {
  const filterMetaData = { type: "all", search: "" };
  handleSideBarNavigation(pokemons, filterMetaData);
  handleSearch(pokemons, filterMetaData);
};

window.onload = async () => {
  const loader = createLoader();
  document.body.appendChild(loader);
  const pokemons = await fetchPokemonData();
  document.body.removeChild(loader);

  displayCards(pokemons);
  handleFiltering(pokemons);
};
