const cache = new Map();
const MAX = 500;

function normalize(text) {
  return text.trim().toLowerCase();
}

function get(key) {
  return cache.get(normalize(key));
}

function set(key, value) {
  const k = normalize(key);
  if (cache.size >= MAX) {
    const first = cache.keys().next().value;
    cache.delete(first); // simple eviction (FIFO)
  }
  cache.set(k, value);
}

module.exports = { get, set };