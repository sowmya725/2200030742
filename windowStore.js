const WINDOW_SIZE = 10;
let window = [];

function updateWindow(newNumbers) {
  const uniqueNewNumbers = newNumbers.filter(n => !window.includes(n));
  const updated = [...window, ...uniqueNewNumbers];

  if (updated.length > WINDOW_SIZE) {
    window = updated.slice(updated.length - WINDOW_SIZE);
  } else {
    window = updated;
  }

  return window;
}

function getWindow() {
  return [...window];
}

function getAverage() {
  if (window.length === 0) return 0;
  const sum = window.reduce((a, b) => a + b, 0);
  return parseFloat((sum / window.length).toFixed(2));
}

module.exports = { updateWindow, getWindow, getAverage };