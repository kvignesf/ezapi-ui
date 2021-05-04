import axios from "axios";

import { getAccessToken, setAccessToken, clearSession } from "../storage";
import routes from "../routes";

const baseUrl = "node";

export const endpoint = Object.freeze({
  login: "/auth",
  logout: "/auth",
  projects: "/projects",
});

const client = axios.create({
  baseURL: baseUrl,
  timeout: 10000,
  responseType: "json",
});

console.log("client.defaults.baseURL", client.defaults.baseURL);

// Setting token for requests
client.interceptors.request.use((request) => {
  const accessToken = getAccessToken();
  const url = request.url;

  if (accessToken && url && url !== endpoint.login) {
    request.headers["Authorization"] = `Bearer ${accessToken}`;
  }
  return request;
});

// // Token refresh
// const navigateToSignin = () => {
//   clearSession();
//   window.location.replace(routes.signIn);
// };
// const refreshToken = async (failedRequest) => {
//   try {
//     const refreshToken = getRefreshToken();

//     if (refreshToken) {
//       const { data } = await client.post(endpoint.refreshToken, {
//         data: {
//           refreshToken,
//         },
//       });

//       const {
//         accessToken: newAccessToken,
//         refreshToken: newRefreshToken,
//       } = data;

//       // Update the new tokens
//       setAccessToken(newAccessToken);
//       setRefreshToken(newRefreshToken);

//       // Update the failed request with new token
//       failedRequest.response.config.headers[
//         'Authorization'
//       ] = `Bearer ${newAccessToken}`;
//     } else {
//       navigateToSignin();
//     }
//   } catch (error) {
//     navigateToSignin();
//   }
// };
// createAuthRefreshInterceptor(client, refreshToken);

export default client;
