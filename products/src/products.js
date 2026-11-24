// Self-contained SVG thumbnails keep the demo images available without an image CDN.
function makeArtwork(name, color, symbol) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 420"><rect width="600" height="420" fill="${color}"/><circle cx="300" cy="185" r="115" fill="#ffffff" fill-opacity=".42"/><text x="300" y="220" text-anchor="middle" font-size="110">${symbol}</text><text x="300" y="365" text-anchor="middle" font-family="Arial,sans-serif" font-size="22" letter-spacing="3" fill="#344034">${name.toUpperCase()}</text></svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

export const products = [
  {
    id: "headphones",
    name: "Studio headphones",
    description: "For slow mornings and long playlists.",
    price: 89,
    image: makeArtwork("Headphones", "#e7d8c6", "🎧"),
  },
  {
    id: "lamp",
    name: "Little table lamp",
    description: "A softer kind of evening light.",
    price: 64,
    image: makeArtwork("Table lamp", "#e7e8d8", "💡"),
  },
  {
    id: "mug",
    name: "Everyday ceramic mug",
    description: "Hand-finished, ready for a refill.",
    price: 28,
    image: makeArtwork("Ceramic mug", "#ead9d2", "☕"),
  },
  {
    id: "tote",
    name: "Market day tote",
    description: "Room for the little things you find.",
    price: 35,
    image: makeArtwork("Canvas tote", "#d9e3d6", "👜"),
  },
];
