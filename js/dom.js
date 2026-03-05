import { capitalize } from "./script.js";

export const createLoader = () => {
  const loader = document.createElement("div");
  loader.setAttribute("class", "loader");
  return loader;
};

const createPokemonName = (
  name,
) => [
  "div",
  { "class": "name" },
  ["h1", { "class": "name" }, name],
];

const createTypeBadges = (types) =>
  types.map((type) => {
    const p = [
      "p",
      { "class": `type ${type.type.name}` },
      type.type.name,
    ];

    return p;
  });

const createTypeBadgeContainer = (
  types,
) => ["div", { "class": "types" }, ...createTypeBadges(types)];

const createCardHeader = (
  name,
  types,
) => [
  "div",
  { "class": "header" },
  createPokemonName(name),
  createTypeBadgeContainer(types),
];

const createStatRows = (stats) =>
  stats.map((
    { stat, base_stat },
  ) => [
    "div",
    { "class": "name-power" },
    ["p", { "class": "name" }, stat.name],
    ["p", { "class": "power" }, base_stat],
  ]);

const createStatsSection = (
  stats,
) => ["div", { "class": "stats" }, ...createStatRows(stats)];

const createCardMetadata = (name, types, stats) => [
  "div",
  { "class": "meta-data" },
  createCardHeader(name, types),
  createStatsSection(stats),
];

const createImageSection = (pokeUrl, name, types) => {
  const attributes = {
    "class": "img-container",
    "style": `background-image: linear-gradient(${
      createImageGradient(types)
    },white)`,
  };

  const imageTag = ["img", {
    "src": pokeUrl,
    "alt": `${name} image`,
    "class": "poke-image",
  }, ""];

  return ["div", attributes, imageTag];
};

const createPokemonCardTemplates = (pokemon) =>
  pokemon.map(({ sprites, name, types, stats }) => {
    const card = ["div", { "class": "card" }];

    const imageContainer = createImageSection(
      sprites.other["official-artwork"].front_default,
      name,
      types,
    );
    const metaDataContainer = createCardMetadata(name, types, stats);
    card.push(imageContainer, metaDataContainer);

    return card;
  });

const addAttributes = (element, attributes) =>
  Object.entries(attributes).forEach(([key, value]) => {
    element.setAttribute(key, value);
  });

const createCards = ([tag, attributes, ...contents]) => {
  const element = document.createElement(tag);
  addAttributes(element, attributes);

  if (contents.length === 1 && !Array.isArray(contents[0])) {
    element.textContent = capitalize(contents.toString());
    return element;
  }

  const nestedChildren = contents.map((c) => createCards(c));
  element.append(...nestedChildren);

  return element;
};

export const renderPokemonCards = (container, pokemon) => {
  const fragments = createPokemonCardTemplates(pokemon);
  const cards = fragments.map((fragment) => createCards(fragment));
  container.replaceChildren(...cards);
};

export const createImageGradient = (types) =>
  types.map((t) => `var(--${t.type.name})`).join(",");

export const setInputAccentColor = (type) => {
  const input = document.querySelector(".search-bar>input");
  input.style.setProperty("--type", `var(--${type})`);
};
