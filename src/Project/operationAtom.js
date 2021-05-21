import { atom } from "recoil";

export const defaultState = {
  operation: null,
  resource: null,
  path: null,
  operationIndex: null,
};

const operationAtom = atom({
  key: "operation",
  default: defaultState,
});

export default operationAtom;
