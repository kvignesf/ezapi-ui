import { Constants } from "../Constants";
import { LocalStorageService } from "../common/services/LocalStorageService";

const logInWithLinkedin = (linkedinCode) => {
  const loginUrl = Constants.linkedinApiUrl + "/accessToken";
  const bodyUrlParams = new URLSearchParams([
    ['grant_type', 'authorization_code'],
    ['code', linkedinCode],
    ['redirect_uri', encodeURIComponent(Constants.redirectUri)],
    ['client_id', Constants.linkedClientId],
    ['client_secret', Constants.linkedClientSecret]
  ]);
  const requestOptions = {
    method: "POST",
    headers: new Headers({
      "content-type": "application/x-www-form-urlencoded",
      "Access-Control-Allow-Origin": "*"
    }),
    body: bodyUrlParams,
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

      const error = (data && data.message) || response.statusText;
      console.log("resp2 error: ", error);
      return Promise.reject(error);
    }

    return data;
  });
}

export const AuthService = {
  logInWithLinkedin,
  logIn,
  logOut
};
