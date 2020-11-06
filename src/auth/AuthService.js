import { Constants } from "../Constants";
import { LocalStorageService } from "../common/services/LocalStorageService";

const logInWithToken = (token) => {
  const loginUrl = Constants.localURL + "/auth/verify";
  const tokenString = "Bearer " + token;
  const requestOptions = {
    method: "GET",
    headers: new Headers({
      "content-type": "application/x-www-form-urlencoded",
      "Access-Control-Allow-Origin": "*",
      "Authorization": tokenString
    }),
  };

  return fetch(loginUrl, requestOptions)
    .then(handleResponse)
    .then(
      user => {
        console.log("token success data: ", user);
        return user;
      },
      error => {
        console.log("token Error data: ", error)
        return error;
      }
    );
};

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

const logInWithCode = (code) => {
  const loginUrl = Constants.localURL + "/auth";
  const requestOptions = {
    method: "POST",
    headers: new Headers({
      "content-type": "application/json"
    }),
    body: JSON.stringify({ code })
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

const logOut = () => {
  LocalStorageService.clear(Constants.USER_DETAILS);
};

function handleResponse(response) {
  console.log("resp1: ", response)
  return response.text().then(text => {
    console.log("resp2 text: ", text)
    const data = text && JSON.parse(text);
    if (!response.ok) {
      if (response.status === 401) {
        // auto logout if 401 response returned from api
        //logout();
        //location.reload(true);
      }

      const error = (data) || response.statusText;
      console.log("resp2 error: ", error);
      return Promise.reject(error);
    }

    return data;
  });
}

export const AuthService = {
  logInWithCode,
  logInWithToken,
  logIn,
  logOut
};
