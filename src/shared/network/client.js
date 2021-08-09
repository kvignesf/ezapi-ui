import axios from "axios";

import { getAccessToken, setAccessToken, clearSession } from "../storage";
import routes from "../routes";

const baseUrl = process.env.REACT_APP_API_URL;

export const endpoint = Object.freeze({
  login: "/auth",
  logout: "/logout",
  project: "/project",
  projects: "/projects",
  aiMatcher: "/aiMatcher",
  resources: "/resources",
  path: "/path",
  paths: "/paths",
  operation: "/operation",
  schemasList: "/schemasList",
  subSchemaData: "/subSchemaData",
  addParameter: "/projectParams/add",
  editParameter: "/projectParams/edit",
  getParameter: "/projectParams/get",
  deleteParameter: "/projectParams/delete",
  tablesLookup: "/tablesLookup",
  tablesData: "/tablesData",
  recommendations: "/recommendations",
  schemaRecommendations: "/schemaRecommendations",
  saveAttributeMatch: "/overrideAttrMatch",
  saveSchemaMatch: "/overrideSchemaMatch",
  publishProject: "/publish",
  verifyProject: "/projectValidate",
  downloadSpec: "/download_spec",
  downloadArtifact: "/download_apiops",
  downloadCodegen: "/download_codegen",

  // Payment
  products: "/product",
  basicProduct: "/product/basic",
  payment: "/payment",
  initiatePayment: "/initiate-order",

  // Orders
  orders: "/orders",
});

const client = axios.create({
  baseURL: baseUrl,
  timeout: 10000,
  timeoutErrorMessage: "Something went wrong, please try again",
  responseType: "json",
});

// Setting token for requests
client.interceptors.request.use(
  (request) => {
    const accessToken = getAccessToken();
    const url = request.url;

    if (accessToken && url && url !== endpoint.login) {
      request.headers["Authorization"] = `Bearer ${accessToken}`;
    }
    return request;
  },
  (err) => {
    return Promise.reject(err);
  }
);

const navigateToSignin = () => {
  clearSession();
  window.location.replace(routes.signIn);
};

// Intercepting error responses
client.interceptors.response.use(
  (response) => {
    return response;
  },
  (err) => {
    const error = err?.response;

    // Logout if 401
    if (error?.status === 401) {
      navigateToSignin();
    }

    return Promise.reject(err);
  }
);

export default client;
