import {
  AUTHENTICATION_REQUEST,
  AUTHENTICATION_SUCCESS,
  AUTHENTICATION_FAILURE,
  AUTH_USER_LOGOUT
} from "./AuthAction";
import { LocalStorageService } from "../common/services/LocalStorageService";
import { Constants } from "../Constants";

let user = JSON.parse(LocalStorageService.get(Constants.USER_DETAILS));
const initialState = user ? { user, isLoggedIn: false, token: "", selectedAPI:null, } : {isLoggedIn: false};

export default (state = initialState, action) => {
  switch (action.type) {
    case AUTHENTICATION_REQUEST:
      return {
        loggingIn: false,
        userName: action.payload
      };

    case AUTHENTICATION_SUCCESS:
      return {
        isLoggedIn: true,
        user: action.payload.user,
        token: action.payload.token
      };

    case AUTHENTICATION_FAILURE:
      return {
        isLoggedIn: false,
        erronMessage: action.payload
      };

    case AUTH_USER_LOGOUT:
      return {
        isLoggedIn: false,
        user: action.payload.user,
        token: action.payload.token
      };

    default:
      return state;
  }
};
