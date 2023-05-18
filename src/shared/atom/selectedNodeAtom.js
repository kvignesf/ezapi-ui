import { atom } from 'recoil';

export const defaultState = '';

const selectedNodeAtom = atom({
    key: 'selectedNode',
    default: defaultState,
});

export default selectedNodeAtom;
