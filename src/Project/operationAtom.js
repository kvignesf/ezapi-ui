import { atom } from "recoil";

export const defaultState = {
  operation: null,
  resource: null,
  path: null,
  operationIndex: null,

  headers: [],
  operationRequest: {
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
