import axios from "axios";

import { getAccessToken, setAccessToken, clearSession } from "../storage";
import routes from "../routes";
import Messages from "../messages";

const baseUrl = process.env.REACT_APP_API_URL;

export const endpoint = Object.freeze({
  login: "/auth",
  sso: "/sso_url",
  auth_workos: "/auth_workos",
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
  tableRelations: "/getTablesRelations",
  operationDataTables: "/getOperationDataTables",
  tableMappings: "/tableMappings",
  verifyProject: "/projectValidate",
  downloadSpec: "/download_spec",
  downloadArtifact: "/download_apiops",
  downloadDatabase: "/download_gendata",
  downloadCodegen: "/download_codegen",
  downloadApigee: "/download_apigee",
  testDBConnection: "/testDBConnection",
  exportDBSchema: "/db_to_python",
  getCustomParameter: "/customParameters/get",
  addCustomParameter: "/customParameters/add",
  editCustomParameter: "/customParameters/edit",
  deleteCustomParameter: "/customParameters/delete",
  storedProcedures: "/storedProcedures",
  downloadDotNetCodegen:"/download_dotnet_codegen",
  mandMappingTableData: "/listAllAttributes",


  // Payment
  products2: "/products",
  products: "/product",
  userProfile: "/userProfile",
  basicProduct: "/product/basic",
  billingDetails: "/billing-details",
  payment: "/payment",
  initiatePayment: "/initiate-order",
  addCard: "/addCard",
  defaultCard: "/makeDefaultCard",
  subscribe: "/subscribe",
  unSubscribe: "/cancelSubscription",
  // initiatePayment: "/subscribe",

  // Orders
  orders: "/orders",

  //ProductTour
  productVideos: "/productVideos",
});

const client = axios.create({
  baseURL: baseUrl,
  timeout: 50000,
  timeoutErrorMessage: Messages.UNKNOWN,
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
