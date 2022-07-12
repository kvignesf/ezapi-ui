import { atom } from "recoil";

export const defaultState = {
  selected: null,
};

const storedProcedureAom = atom({
  key: "storedProcedure",
  default: defaultState,
});

export default storedProcedureAom;
