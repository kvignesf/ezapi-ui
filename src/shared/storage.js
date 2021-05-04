const StorageKey = Object.freeze({
  linkedInToken: 'linkedin_token',
  accToken: 'acc_token',
});

export const setLinkedInToken = (token) => {
  sessionStorage.setItem(StorageKey.linkedInToken, token);
};

export const getLinkedInToken = () =>
  sessionStorage.getItem(StorageKey.linkedInToken);

export const setAccessToken = (token) =>
  sessionStorage.setItem(StorageKey.accToken, token);

export const getAccessToken = () => sessionStorage.getItem(StorageKey.accToken);

export const clearSession = () => sessionStorage.clear();
