import { atom } from "recoil";

export const defaultState = {
  operation: null,
  resource: null,
  path: null,
  operationIndex: null,

  operationRequest: {
    headers: [],
    formData: [],
    pathParams: [],
    queryParams: [],
    body: [],
  },

  operationResponse: {
    headers: [],
    formData: [],
    pathParams: [],
    queryParams: [],
    body: [],
  },
};

const operationAtom = atom({
  key: "operation",
  default: defaultState,
});

export default operationAtom;
