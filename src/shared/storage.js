const StorageKey = Object.freeze({
  accToken: "acc_token",
  firstName: "first_name",
  lastName: "last_name",
  userId: "user_id",
});

export const setAccessToken = (value) =>
  sessionStorage.setItem(StorageKey.accToken, value);

export const getAccessToken = () => sessionStorage.getItem(StorageKey.accToken);

export const setFirstName = (value) =>
  sessionStorage.setItem(StorageKey.firstName, value);

export const getFirstName = () => sessionStorage.getItem(StorageKey.firstName);

export const setLastName = (value) =>
  sessionStorage.setItem(StorageKey.lastName, value);

export const getLastName = () => sessionStorage.getItem(StorageKey.lastName);

export const setUserId = (value) =>
  sessionStorage.setItem(StorageKey.userId, value);

export const getUserId = () => sessionStorage.getItem(StorageKey.userId);

export const clearSession = () => sessionStorage.clear();
