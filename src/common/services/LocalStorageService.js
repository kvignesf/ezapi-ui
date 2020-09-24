const get = key => {
  return localStorage.getItem(key);
};

const put = (key, value) => {
  localStorage.setItem(key, value);
};

const clear = key => {
  localStorage.removeItem(key);
};

const clearAll = key => {
  localStorage.clear();
};

export const LocalStorageService = {
  get,
  put,
  clear,
  clearAll
};
