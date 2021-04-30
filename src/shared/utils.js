import _ from 'lodash';
import { getLinkedInToken } from './storage';

export const isEmailValid = (email) => {
  var re = /\S+@\S+\.\S+/;
  return re.test(email);
};

export const isUserLoggedIn = () => {
  const token = getLinkedInToken();

  return token && !_.isEmpty(token);
};
