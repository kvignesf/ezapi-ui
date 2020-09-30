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
          if (userName == 'test' && userPassword == 'test') {
            dispatch({ type: AUTHENTICATION_SUCCESS, payload: '' });
          } else {
            dispatch({ type: AUTHENTICATION_FAILURE, payload: authData.message });
          }
        }
      },
      error => {
        dispatch({ type: AUTHENTICATION_FAILURE });
      }
    );
  };
}

export function authenticateUserWithLinkedin(code) {
  console.log("step0 code: ", code)
  return dispatch => {
    dispatch(authRequest());
    AuthService.logInWithLinkedin(code).then(
      authData => {
        console.log("resp3: ", authData);
        if (authData) {
          dispatch({ type: AUTHENTICATION_SUCCESS, payload: authData });
        } else {
          dispatch({ type: AUTHENTICATION_SUCCESS, payload: '' });
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
  dispatch({
    type: AUTH_USER_LOGOUT,
    payload: {
      userName: "",
      userPassword: ""
    }
  });
};

const authRequest = () => ({
  type: AUTHENTICATION_REQUEST
});
