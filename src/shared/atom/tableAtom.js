import { atom } from "recoil";

export const defaultState = {
  selected: null,
};

const tableAtom = atom({
  key: "table",
  default: defaultState,
});

export default tableAtom;
