import { capitalize } from "./script.js";
import { state } from "./state.js";

export const createLoader = () => {
  const loader = document.createElement("div");
  loader.setAttribute("class", "loader");
  return loader;
};

export const createElementTemplate = (tag, attributes, contents) => ({
  tag,
  attributes,
  contents,
});

const createPokemonName = (name) =>
  createElementTemplate("div", [["class", "name"]], [
    createElementTemplate("h1", [["class", "name"]], capitalize(name)),
  ]);

const createTypeBadges = (types) =>
  types.map((type) => {
    const p = createElementTemplate(
      "p",
      [["class", `type ${type.type.name}`]],
      capitalize(type.type.name),
    );

    return p;
  });

const createTypeBadgeContainer = (types) =>
  createElementTemplate("div", [["class", "types"]], createTypeBadges(types));

const createCardHeader = (name, types) =>
  createElementTemplate("div", [["class", "header"]], [
    createPokemonName(name),
    createTypeBadgeContainer(types),
  ]);

const createStatRows = (stats) =>
  stats.map((stat) => {
    const div = createElementTemplate("div", [["class", "name-power"]], [
      createElementTemplate(
        "p",
        [["class", "name"]],
        capitalize(stat.stat.name),
      ),
      createElementTemplate("p", [["class", "power"]], stat.base_stat),
    ]);

    return div;
  });

const createStatsSection = (stats) =>
  createElementTemplate("div", [["class", "stats"]], createStatRows(stats));

const createCardMetadata = (name, types, stats) =>
  createElementTemplate("div", [["class", "meta-data"]], [
    createCardHeader(name, types),
    createStatsSection(stats),
  ]);

const createImageSection = (pokeUrl, name, types) =>
  createElementTemplate(
    "div",
    [[
      "class",
      "img-container",
    ], [
      "style",
      `background-image: linear-gradient(${createImageGradient(types)},white)`,
    ]],
    [createElementTemplate("img", [["src", pokeUrl], ["alt", `${name} image`], [
      "class",
      "poke-image",
    ]], "")],
  );

const createPokemonCardTemplates = (pokemon) =>
  pokemon.map(({ sprites, name, types, stats }) => {
    const card = createElementTemplate("div", [["class", "card"]], []);

    const imageContainer = createImageSection(
      sprites.other["official-artwork"].front_default,
      name,
      types,
    );
    const metaDataContainer = createCardMetadata(name, types, stats);
    card.contents.push(imageContainer, metaDataContainer);

    return card;
  });

const addAttributes = (element, attributes) =>
  attributes.forEach(([key, value]) => {
    element.setAttribute(key, value);
  });

const createCards = (fragments) =>
  fragments.map(({ tag, attributes, contents }) => {
    const element = document.createElement(tag);
    addAttributes(element, attributes);

    if (Array.isArray(contents)) {
      const nestedChildren = createCards(contents);
      element.append(...nestedChildren);
      return element;
    }

    element.textContent = contents;
    return element;
  });

export const renderPokemonCards = (container, pokemon) => {
  const fragments = createPokemonCardTemplates(pokemon);
  const cards = createCards(fragments);
  container.replaceChildren(...cards);
};

export const createImageGradient = (types) =>
  types.map((t) => `var(--${t.type.name})`).join(",");

export const setInputAccentColor = (type) => {
  const input = document.querySelector(".search-bar>input");
  input.style.setProperty("--type", `var(--${type})`);
};
