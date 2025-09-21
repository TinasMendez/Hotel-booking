// Utility: safe shuffle and pick unique slices from arrays
export function shuffleArray(source) {
  // Fisher–Yates shuffle to ensure uniform randomness
  const arr = [...source];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(cryptoRandom() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export function takeFirst(arr, n) {
  // Returns the first n elements or shorter if array length < n
  return arr.slice(0, Math.max(0, Math.min(n, arr.length)));
}

function cryptoRandom() {
  // Uses Web Crypto if available to avoid predictable patterns
  if (typeof crypto !== "undefined" && crypto.getRandomValues) {
    const buffer = new Uint32Array(1);
    crypto.getRandomValues(buffer);
    return buffer[0] / (0xffffffff + 1);
  }
  return Math.random();
}
