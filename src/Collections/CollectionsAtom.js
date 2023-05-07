import { atom } from "recoil";
import ApiCall from "./CollectionTabs/ApiCall/ApiCall";

export const accessToken = atom({
  key: "accessToken",
  default: "",
});

export const authFormData = atom({
  key: "authFormData",
  default: {
    authType: "No Auth",
    grantType: "Grant Type",
    baseAuthUsername: "",
    baseAuthPassword: "",
    authCodeClientID: "",
    authCodeClientSecret: "",
    authEndpoint: "",
    authCodeScope: "",
    authCodeCode: "",
    authCodeRedirUri: "",
    implicitClientID: "",
    implicitAuthEndpoint: "",
    implicitRedirUri: "",
    implicitState: "",
    implicitScope: "",
    ccClientID: "",
    ccClientSecret: "",
    ccTokenEndpoint: "",
    bearerToken: "",
    apiKey: "",
    ccScope: "",
    pcClientID: "",
    pcClientSecret: "",
    pcTokenEndpoint: "",
    pcUsername: "",
    pcPassword: "",
    pcScope: "",
  },
});

export const requestParams = atom({
  key: "requestParams",
  default: {
    method: "GET",
    proxy: "No Proxy",
    url: "",
    body: { "": "" },
    header: [],
    queryParams: [],
  },
});

export const responseInfo = atom({
  key: "responseInfo",
  default: {},
});

export const currentApi = atom({
  key: "currentApi",
  default: { id: 0, name: "", type: "file" },
});

export const currentTab = atom({
  key: "currentTab",
  default: 0,
});
export const selectedType = atom({
  key: "selectedType",
  default: "",
});

export const currentBreadCrumbs = atom({
  key: "currentBreadCrumbs",
  default: [],
});
export const currentTabs = atom({
  key: "currentTabs",
  default: [
    {
      id: 0,
      request: { method: "GET", proxy: "No Proxy", url: "", body: { "": "" }, header: [], queryParams: [] },
      response: {},
      label: "New Request",
      content: <ApiCall />,
      breadCrumbs: "",
    },
  ],
});
