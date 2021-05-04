const StorageKey = Object.freeze({
  accToken: "acc_token",
});

export const setAccessToken = (token) =>
  sessionStorage.setItem(StorageKey.accToken, token);

export const getAccessToken = () => sessionStorage.getItem(StorageKey.accToken);

export const clearSession = () => sessionStorage.clear();
