import { Constants } from "../Constants";
import { LocalStorageService } from "../common/services/LocalStorageService";

const logIn = (email, password) => {
  const loginUrl = Constants.apiURL + "/auth";
  const requestOptions = {
    method: "POST",
    headers: new Headers({
      "content-type": "application/json"
    }),
    body: JSON.stringify({ email, password })
  };

  return fetch(loginUrl, requestOptions)
    .then(handleResponse)
    .then(
      user => {
        LocalStorageService.put(Constants.USER_DETAILS, JSON.stringify(user));
        return user;
      },
      error => {
        return error;
      }
    );
};

const logOut = () => {};

function handleResponse(response) {
  return response.text().then(text => {
    const data = text && JSON.parse(text);
    if (!response.ok) {
      if (response.status === 401) {
        // auto logout if 401 response returned from api
        //logout();
        //location.reload(true);
      }

      const error = (data && data.message) || response.statusText;
      return Promise.reject(error);
    }

    return data;
  });
}

export const AuthService = {
  logIn,
  logOut
};
