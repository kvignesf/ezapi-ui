import { AuthService } from "./AuthService";

export const AUTH_USER_LOGIN = "AUTH-USER-LOGIN";
export const AUTH_USER_LOGOUT = "AUTH-USER-LOGOUT";

export const AUTHENTICATION_REQUEST = "AUTH-USER-REQUEST";
export const AUTHENTICATION_SUCCESS = "AUTH-USER-SUCCESS";
export const AUTHENTICATION_FAILURE = "AUTH-USER-FAILURE";

export function authenticateUser(userName, userPassword) {
  return dispatch => {
    dispatch(authRequest());
    //var loggedInUser = {fullName:'Anoop Kumar', designation: 'Sr. Developer', userPassword};
    AuthService.logIn(userName, userPassword).then(
      authData => {
        if (authData.token) {
          dispatch({ type: AUTHENTICATION_SUCCESS, payload: authData });
        } else {
          dispatch({ type: AUTHENTICATION_FAILURE, payload: authData.message });
        }
      },
      error => {
        dispatch({ type: AUTHENTICATION_FAILURE });
      }
    );
  };
}

export function authenticateWithToken(user) {
  console.log("step0 token: ", user.token)
  return dispatch => {
    dispatch(authRequest());
    AuthService.logInWithToken(user.token).then(
      authData => {
        console.log("token resp3: ", authData);
        if (authData.auth === false) {
          dispatch({ type: AUTHENTICATION_FAILURE, payload: authData.message });
        } else {
          dispatch({ type: AUTHENTICATION_SUCCESS, payload: user });
        }
      },
      error => {
        console.log("token resp3 error: ", error);
        dispatch({ type: AUTHENTICATION_FAILURE });
      }
    );
  };
}

export function authenticateWithLinkedinCode(code) {
  console.log("step0 code: ", code)
  return dispatch => {
    dispatch(authRequest());
    AuthService.logInWithCode(code).then(
      authData => {
        console.log("auth token with user: ", authData);
        if (authData.token) {
          dispatch({ type: AUTHENTICATION_SUCCESS, payload: authData });
        }
      },
      error => {
        console.log("resp3 error: ", error);
        dispatch({ type: AUTHENTICATION_FAILURE });
      }
    );
  };
}

export const logoutUser = () => dispatch => {
  AuthService.logOut();
  dispatch({
    type: AUTH_USER_LOGOUT,
    payload: {
      user: null,
      token: null
    }
  });
};

const authRequest = () => ({
  type: AUTHENTICATION_REQUEST
});
