const pokemonLinks = [
  {
    title: "Official Pokemon",
    category: "News",
    description: "Official games, news, videos, and character pages.",
    url: "https://www.pokemon.com/uk",
  },
  {
    title: "Pokedex",
    category: "Stats",
    description: "Fast Pokemon stats, evolutions, moves, and type data.",
    url: "https://pokemondb.net/pokedex/all",
  },
  {
    title: "Bulbapedia",
    category: "Wiki",
    description: "Detailed community encyclopedia for games, anime, cards, and lore.",
    url: "https://bulbapedia.bulbagarden.net/wiki/Main_Page",
  },
  {
    title: "Serebii",
    category: "Updates",
    description: "Game guides, event details, news, and deep reference pages.",
    url: "https://www.serebii.net/",
  },
  {
    title: "Pokemon Showdown",
    category: "Battles",
    description: "Team building and online battle simulator for competitive play.",
    url: "https://play.pokemonshowdown.com/",
  },
  {
    title: "Pokemon TCG",
    category: "Cards",
    description: "Official trading card game resources, products, and updates.",
    url: "https://tcg.pokemon.com/en-gb/",
  },
];

const linkGrid = document.getElementById("link-grid");
const linkCount = document.getElementById("link-count");
const searchForm = document.getElementById("search-form");
const searchTerm = document.getElementById("search-term");

function createLinkCard(link) {
  const card = document.createElement("article");
  card.className = "link-card";

  const topLine = document.createElement("div");
  topLine.className = "link-card-top";

  const category = document.createElement("span");
  category.className = "category-pill";
  category.textContent = link.category;

  const arrow = document.createElement("span");
  arrow.className = "arrow-icon";
  arrow.setAttribute("aria-hidden", "true");
  arrow.textContent = "->";

  topLine.append(category, arrow);

  const title = document.createElement("h3");
  title.textContent = link.title;

  const description = document.createElement("p");
  description.textContent = link.description;

  const button = document.createElement("a");
  button.className = "card-button";
  button.href = link.url;
  button.target = "_blank";
  button.rel = "noreferrer";
  button.textContent = "Visit site";

  card.append(topLine, title, description, button);
  return card;
}

function renderLinks() {
  linkGrid.innerHTML = "";
  pokemonLinks.forEach((link) => {
    linkGrid.appendChild(createLinkCard(link));
  });
  linkCount.textContent = String(pokemonLinks.length);
}

function buildSearchUrl(site, query) {
  const encodedQuery = encodeURIComponent(query.trim());

  if (site === "bulbapedia") {
    return `https://bulbapedia.bulbagarden.net/w/index.php?search=${encodedQuery}`;
  }

  return `https://pokemondb.net/search?q=${encodedQuery}`;
}

searchForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const submitter = event.submitter;
  const query = searchTerm.value.trim();

  if (!query) {
    searchTerm.focus();
    return;
  }

  window.open(buildSearchUrl(submitter.dataset.site, query), "_blank", "noreferrer");
});

renderLinks();
