export const saveToStorage = (key, value) =>
  localStorage.setItem(key, JSON.stringify(value));

export const getFromStorage = (key) =>
  JSON.parse(localStorage.getItem(key)) || null;
