import { atom } from 'recoil';

export const accessToken = atom({
    key: 'accessToken',
    default: '',
});

export const toggle = atom({
    key: 'toggle',
    default: 'folders',
});

export const authFormData = atom({
    key: 'authFormData',
    default: {
        authType: 'No Auth',
        grantType: 'Grant Type',
        baseAuthUsername: '',
        baseAuthPassword: '',
        authCodeClientID: '',
        authCodeClientSecret: '',
        authEndpoint: '',
        authCodeScope: '',
        authCodeCode: '',
        authCodeRedirUri: '',
        implicitClientID: '',
        implicitAuthEndpoint: '',
        implicitRedirUri: '',
        implicitState: '',
        implicitScope: '',
        ccClientID: '',
        ccClientSecret: '',
        ccTokenEndpoint: '',
        bearerToken: '',
        apiKey: '',
        ccScope: '',
        pcClientID: '',
        pcClientSecret: '',
        pcTokenEndpoint: '',
        pcUsername: '',
        pcPassword: '',
        pcScope: '',
    },
});

export const requestParams = atom({
    key: 'requestParams',
    default: {
        method: 'GET',
        proxy: 'No Proxy',
        url: '',
        body: { '': '' },
        header: [],
        queryParams: [],
    },
});

export const responseInfo = atom({
    key: 'responseInfo',
    default: {},
});

export const currentApi = atom({
    key: 'currentApi',
    default: {},
});

export const currentTab = atom({
    key: 'currentTab',
    default: null,
});
export const selectedType = atom({
    key: 'selectedType',
    default: '',
});
export const requestName = atom({
    key: 'requestName',
    default: '',
});
export const currentBreadCrumbs = atom({
    key: 'currentBreadCrumbs',
    default: [],
});
export const currentTabs = atom({
    key: 'currentTabs',
    default: [],
});
export const isSaveModalOpen = atom({
    key: 'isSaveModalOpen',
    default: false,
});
export const recentRequest = atom({
    key: 'recentRequest',
    default: [],
});
