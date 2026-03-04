const fetchPokemonData = () =>
  fetch("./pokemons.json").then((res) => res.json());

const filterPokemon = (pokemons, searchedPokemon, type) =>
  pokemons.filter((pokemon) => {
    const matchesType = type === "all" ||
      pokemon.types.some((t) => t.type.name === type);

    const matchesSearch = !searchedPokemon ||
      pokemon.name.toLowerCase().includes(searchedPokemon);

    return matchesType && matchesSearch;
  });

const updateInputStyle = (type) => {
  const input = document.querySelector(".search-bar>form>input");
  input.style.setProperty("--type", `var(--${type})`);
};

const handleSideBarNavigation = (pokemons, filterMetaData, container) => {
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

    displayPokemons(filteredPokemon, container);
  });
};

const handleSearch = (pokemons, filterMetaData, container) => {
  const input = document.querySelector(".search-bar>form>input");

  input.addEventListener("input", () => {
    filterMetaData.search = input.value.toLowerCase();

    const filteredPokemon = filterPokemon(
      pokemons,
      filterMetaData.search,
      filterMetaData.type,
    );

    displayPokemons(filteredPokemon, container);
  });
};

const handleFiltering = (pokemons, container) => {
  const filterMetaData = { type: "all", search: "" };
  handleSideBarNavigation(pokemons, filterMetaData, container);
  handleSearch(pokemons, filterMetaData, container);
};

const createLoader = () => {
  const loader = document.createElement("div");
  loader.setAttribute("class", "loader");
  return loader;
};

const capitalize = (str) => str ? str[0].toUpperCase() + str.slice(1) : "";

const createImageGradient = (types) =>
  types.map((t) => `var(--${t.type.name})`).join(",");

const createBasicElements = (tag, attributes, contents) => ({
  tag,
  attributes,
  contents,
});

const createNameContainer = (name) =>
  createBasicElements("div", [["class", "name"]], [
    createBasicElements("h1", [["class", "name"]], capitalize(name)),
  ]);

const createTypesContainer = (types) =>
  createBasicElements(
    "div",
    [["class", "types"]],
    types.map((type) => {
      const p = createBasicElements("p", [[
        "class",
        `type ${type.type.name}`,
      ]], capitalize(type.type.name));
      return p;
    }),
  );

const createHeaderContainer = (name, types) =>
  createBasicElements("div", [["class", "header"]], [
    createNameContainer(name),
    createTypesContainer(types),
  ]);

const createStatsContainer = (stats) =>
  createBasicElements(
    "div",
    [["class", "stats"]],
    stats.map((stat) => {
      const div = createBasicElements("div", [["class", "name-power"]], [
        createBasicElements(
          "p",
          [["class", "name"]],
          capitalize(stat.stat.name),
        ),
        createBasicElements("p", [["class", "power"]], stat.base_stat),
      ]);

      return div;
    }),
  );

const createMetaDataContainer = (name, types, stats) =>
  createBasicElements("div", [["class", "meta-data"]], [
    createHeaderContainer(name, types),
    createStatsContainer(stats),
  ]);

const createImageContainer = (pokeUrl, types) =>
  createBasicElements(
    "div",
    [[
      "class",
      "img-container",
    ], [
      "style",
      `background-image: linear-gradient(${createImageGradient(types)},white)`,
    ]],
    [createBasicElements("img", [["src", pokeUrl], ["alt", "pokemon image"], [
      "class",
      "poke-image",
    ]], "")],
  );

const createFregmentTemplate = (allPokemon) =>
  allPokemon.map(({ sprites, name, types, stats }) => {
    const card = createBasicElements("div", [["class", "card"]], []);

    const imageContainer = createImageContainer(
      sprites.other["official-artwork"].front_default,
      types,
    );
    const metaDataContainer = createMetaDataContainer(name, types, stats);
    card.contents.push(imageContainer, metaDataContainer);

    return card;
  });

const addAttributes = (element, attributes) =>
  attributes.forEach(([key, value]) => {
    element.setAttribute(key, value);
  });

const createFragment = (fragments) =>
  fragments.map(({ tag, attributes, contents }) => {
    const element = document.createElement(tag);
    addAttributes(element, attributes);

    if (Array.isArray(contents)) {
      const nestedChildren = createFragment(contents);
      element.append(...nestedChildren);
      return element;
    }

    element.textContent = contents;
    return element;
  });

const displayPokemons = (allPokemon, container) => {
  const fragments = createFregmentTemplate(allPokemon);
  const children = createFragment(fragments);
  container.replaceChildren(...children);
};

window.onload = async () => {
  const loader = createLoader();
  document.body.appendChild(loader);
  const allPokemon = await fetchPokemonData();
  document.body.removeChild(loader);
  const container = document.querySelector(".container");
  displayPokemons(allPokemon, container);
  handleFiltering(allPokemon, container);
};
