import { atom } from "recoil";
import Constants from "../shared/constants";

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

  operationResponse: [
    {
      responseCode: Constants.mandatoryResponseCode,
      description: null,
      headers: [],
      body: [],
    },
  ],

  isModified: false,
};

const operationAtom = atom({
  key: "operation",
  default: defaultState,
});

export default operationAtom;
