const cache = {};

function set(key, value, ttl) {
  const expireAt = Date.now() + ttl * 1000;
  cache[key] = { value, expireAt };
}

function get(key) {
  const cachedItem = cache[key];
  if (!cachedItem) return null;

  if (cachedItem.expireAt < Date.now()) {
    delete cache[key];
    return null;
  }
  return cachedItem.value;
}

module.exports = {
  set,
  get,
};
