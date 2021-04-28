const StorageKey = Object.freeze({
  linkedInToken: 'linkedin_token',
});

export const setLinkedInToken = (token) => {
  sessionStorage.setItem(StorageKey.linkedInToken, token);
};

export const getLinkedInToken = () =>
  sessionStorage.getItem(StorageKey.linkedInToken);

export const clearSession = () => sessionStorage.clear();
