// @ts-ignore
// @ts-nocheck
import drawerCardAtom from '@/shared/atom/drawerCardAtom';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';

import selectedNodeAtom from '@/shared/atom/selectedNodeAtom';
import { CircularProgress, Tooltip } from '@material-ui/core';
import { Add } from '@material-ui/icons';
import _, { debounce, isEqual } from 'lodash';
import useNodeHook from '../hooks/useNodeHook';

import { TabContext, TabList, TabPanel } from '@mui/lab';
import {
    Autocomplete,
    AutocompleteRenderInputParams,
    Button,
    FormControlLabel,
    Radio,
    RadioGroup,
    Stack,
    Tab,
    TextField,
    Typography,
} from '@mui/material';
import axios, { AxiosError, AxiosRequestConfig, AxiosResponse, Method } from 'axios';
import Qs from 'qs';
import { SyntheticEvent, useContext, useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';
import ApiIcon from '../../../icons/ApiIcon.svg';
import RunIcon from '../../../icons/runIcon.svg';
import { BusinessFlowContext } from '../BusinessFlowContext';
import { checkValidJson, convertObjectToFormData, formDataToObject } from '../businessFlowHelper';
import { DEFAULT_API_RESPONSE } from '../defaults';
import { ExternalAPI, KeyValueProps } from '../interfaces';
import { CommonNodeData, NodeData } from '../interfaces/flow';
import { MyReactFlowState } from '../store';
import { ResponseTab } from './Components/ResponseTab';
import { TreeDropDown } from './Components/TreeDropDown';
import { ValueCard } from './Components/ValueCard';

interface ExternalAPIDrawerProps {
    cardId: string;
}

export const ExternalAPIDrawer = ({ cardId }: ExternalAPIDrawerProps) => {
    const { projectId, operationId, useStore } = useContext(BusinessFlowContext);

    const [cardData, setCardData] = useState<NodeData>();

    const updateNodeData = useStore((state: MyReactFlowState) => state.updateNodeData);
    const nodes = useStore((state: MyReactFlowState) => state.nodes);
    let isError: boolean | undefined;

    let initialRunData: ExternalAPI = {
        url: cardData?.runData?.url || '',
        method: cardData?.runData?.method || 'GET',
        headers: cardData?.runData?.headers || [],
        queryParams: cardData?.runData?.queryParams || [],
        pathParams: cardData?.runData?.pathParams || [],
        body: cardData?.runData?.body || '',
        output: cardData?.runData?.output || { ...DEFAULT_API_RESPONSE },
    };
    useEffect(() => {
        if (cardData) {
            initialRunData = {
                url: cardData?.runData?.url || '',
                method: cardData?.runData?.method || 'GET',
                headers: cardData?.runData?.headers || [],
                queryParams: cardData?.runData?.queryParams || [],
                pathParams: cardData?.runData?.pathParams || [],
                body: cardData?.runData?.body || '',
                output: cardData?.runData?.output || { ...DEFAULT_API_RESPONSE },
            };

            setCommonData(cardData?.commonData || {});

            isError = [undefined, 0].includes(cardData?.runData?.output?.status)
                ? undefined
                : cardData?.runData?.output?.success === false;

            setRunData(initialRunData);

            setShowResponse(
                cardData?.runData?.output?.status
                    ? cardData?.runData.output.status >= 200 && cardData?.runData?.output?.status < 300
                    : false,
            );
        }
    }, [cardData]);

    const [headers, setHeaders] = useState<KeyValueProps[]>();
    const [queryParams, setQueryParams] = useState<KeyValueProps[]>(initialRunData.queryParams || []);
    const [pathParams, setPathParams] = useState<KeyValueProps[]>(initialRunData.pathParams || []);
    const [runData, setRunData] = useState<ExternalAPI>(initialRunData);
    const [urlValue, setUrlValue] = useState<string>('');
    const [displayedUrlValue, setDisplayedUrlValue] = useState(urlValue);
    const [explicitLoading, setExplicitLoading] = useState(false);

    const [value, setValue] = useState('0');
    const [systemApis, _setSystemApis] = useState();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [apiType, setApiType] = useState<string>('api_call');
    const [_selectedCard] = useRecoilState(drawerCardAtom);
    const [intervalID, setIntervalID] = useState<number | undefined>();
    const [commonData, setCommonData] = useState<CommonNodeData>({
        name: '',
        parentNode: '',
    });

    // const [triggeredSaveDataOnServer, setTriggeredSaveDataOnServer] = useState<boolean>(false);

    const [isJsonValid, setIsJsonValid] = useState(true);
    const [_selectedNode, setSelectedNode] = useRecoilState(selectedNodeAtom);

    const [showResponse, setShowResponse] = useState(
        cardData?.runData?.output?.status
            ? cardData?.runData.output.status >= 200 && cardData?.runData?.output?.status < 300
            : false,
    );
    const [responseValue, setResponseValue] = useState<string>(cardData?.runData?.output?.success ? '1' : '0');

    const [executionNumber, setExecutionNumber] = useState<number>(0);
    const delayTimeSet = 2500;

    const { node, triggerDelayedNodeSaveOnServer, isUpdateNodeOnServerDone } = useNodeHook({
        nodeId: cardId,
        getUpdatedNodeData: getUpdatedNodeDataFn,
        collapse: true,
    });

    function getUpdatedNodeDataFn() {
        const newNodeData = (_.isEmpty(cardData) ? {} : cardData) as NodeData;
        return {
            ...newNodeData,
            commonData: commonData,
            runData: { ...runData, pathParams: pathParams, queryParams: queryParams, headers: headers },
        };
    }
    const prepareData = async () => {
        setCardData(node?.data as NodeData);
    };

    useEffect(() => {
        prepareData();
    }, [node]);
    // function triggerDelayedSaveDataOnServer() {
    //     intervalManager(
    //         true,
    //         () => {
    //             setTriggeredSaveDataOnServer(true);
    //         },
    //         2000,
    //     );
    // }

    // function intervalManager(flag: boolean, callback?: Function, time?: number) {
    //     console.log('intervalManager', flag, time);
    //     if (flag && callback && time) {
    //         if (intervalID) {
    //             clearTimeout(intervalID);
    //             console.log(`cleared interval id --> ${intervalID}`);
    //         }

    //         const newIntervalId = setTimeout(callback, time);
    //         setIntervalID(newIntervalId);

    //         console.log(`created interval id --> ${newIntervalId}. will call after ${time} ms`);
    //     } else {
    //         console.log(`clearing interval id --> ${intervalID}`);
    //         clearTimeout(intervalID);
    //     }
    // }

    // useEffect(() => {
    //     if (triggeredSaveDataOnServer) {
    //         const source: CancelTokenSource = axios.CancelToken.source();

    //         const updatedNode: any = { ...nodes.find((node: Node) => node.id === cardId) };
    //         updatedNode.data = { commonData: { ...commonData }, runData: { ...runData } };

    //         const updatedNodeRequestData: UpdateNodeAPIProps = {
    //             card: prepareAggregateCardFromNode(updatedNode, projectId, operationId),
    //             updateNodeData,
    //         };
    //         updateNodeOnServer(updatedNodeRequestData, source);

    //         setTriggeredSaveDataOnServer(false);
    //         intervalID && clearTimeout(intervalID);
    //         setExecutionNumber(executionNumber + 1);
    //     }
    // }, [triggeredSaveDataOnServer]);

    const handleChange = (_event: React.SyntheticEvent, newValue: string) => {
        nullChecker();
        if (newValue === '1') {
            updateQueryParamsFromUrl();
        }
        if (newValue === '2') {
            updatePathParamsFromUrl();
        }
        setValue(newValue);
    };
    const nullChecker = () => {
        if (headers?.length == 1 && headers[0].key === '' && headers[0].value === '') {
            setHeaders([]);
        }
        if (queryParams?.length == 1 && queryParams[0].key === '' && queryParams[0].value === '') {
            const currentUrl = new URL(displayedUrlValue ?? '');
            currentUrl.search = new URLSearchParams({}).toString();
            setDisplayedUrlValue(currentUrl.toString());
            setQueryParams([]);
        }
    };

    const handleResponseChange = (_event: React.SyntheticEvent, newValue: string) => {
        setResponseValue(newValue);
    };

    function setApiName(newApiName: string) {
        setCommonData({ ...commonData, name: newApiName });
        triggerDelayedNodeSaveOnServer(delayTimeSet);
    }

    const execute = async (event: React.MouseEvent) => {
        event.preventDefault();
        if (isLoading || !runData.url) {
            return;
        }

        setIsLoading(true);

        const headerValues: any = {};
        runData.headers?.forEach((item) => {
            headerValues[item.key] = item.value;
        });

        const queryParamsValues: any = {};
        runData.queryParams?.forEach((item) => {
            const existingValues = queryParamsValues[item.key] || [];
            existingValues.push(item.value);
            queryParamsValues[item.key] = existingValues;
        });

        const pathParamsValues: any = {};
        runData.pathParams?.forEach((item) => {
            const existingValues = pathParamsValues[item.key] || [];
            existingValues.push(item.value);
            pathParamsValues[item.key] = existingValues;
        });

        const options: AxiosRequestConfig = {
            method: runData.method as Method,
            url: runData.url,
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                ...headerValues,
            },
            paramsSerializer: (params) => Qs.stringify(params, { arrayFormat: 'repeat' }),
        };

        runData.body?.data && (options.data = runData.body.data);
        queryParamsValues && (options.params = queryParamsValues);

        axios
            .request(options)
            .then(function (response: AxiosResponse) {
                const newNodeData = {
                    ...runData,
                    output: {
                        data: response.data,
                        success: response.status >= 200 && response.status < 300,
                        status: response.status,
                        statusText: response.statusText,
                    },
                };

                setRunData(newNodeData);
            })
            .catch(function (error: any) {
                // check if the error was thrown from axios
                if (axios.isAxiosError(error)) {
                    const axiosError = error as AxiosError;
                    const newNodeData = {
                        ...runData,
                        output: {
                            data: axiosError.response?.data,
                            success: false,
                            status: axiosError.response?.status,
                            statusText: axiosError.response?.statusText,
                        },
                    };

                    setRunData(newNodeData);
                } else {
                    const newNodeData = {
                        ...runData,
                        output: {
                            data: {},
                            success: false,
                            statusText: 'Something went wrong!',
                        },
                    };

                    setRunData(newNodeData);
                }
            })
            .finally(() => {
                setIsLoading(false);
                setResponseValue('1');
                setShowResponse(true);
                triggerDelayedNodeSaveOnServer(delayTimeSet);
                setExecutionNumber(executionNumber + 1);
            });
    };

    function setActionType(newMethod: string) {
        if (newMethod && runData.method?.toUpperCase() !== newMethod.toUpperCase()) {
            setRunData({ ...runData, method: newMethod as Method, output: { ...DEFAULT_API_RESPONSE } });
            triggerDelayedNodeSaveOnServer(delayTimeSet);
        }
    }

    function setUrl(newUrl: string) {
        setRunData({
            ...runData,
            url: newUrl,
            headers: headers,
            queryParams: queryParams,
            pathParams: pathParams,
            output: { ...DEFAULT_API_RESPONSE },
        });
        triggerDelayedNodeSaveOnServer(delayTimeSet);
    }

    function setHeadersData(newHeaders: KeyValueProps[]) {
        if (newHeaders) {
            setRunData({ ...runData, headers: newHeaders, output: { ...DEFAULT_API_RESPONSE } });
            triggerDelayedNodeSaveOnServer(delayTimeSet);
        }
    }

    function setRequestData(newRequestData: string | object) {
        if (newRequestData) {
            const newRunData = {
                ...runData,
                body: {
                    data: formDataToObject(convertObjectToFormData(newRequestData)),
                },
                output: { ...DEFAULT_API_RESPONSE },
            };
            setRunData(newRunData);
            triggerDelayedNodeSaveOnServer(delayTimeSet);
        }
    }
    function isValidUrl(url: string) {
        try {
            new URL(url);
            return true;
        } catch (err) {
            setPathParams([]);
            setQueryParams([]);
            return false;
        }
    }
    useEffect(() => {
        setHeaders(runData.headers ?? []);
        if (displayedUrlValue == '') setDisplayedUrlValue(runData.url ?? '');
        if (queryParams?.length == 0) setQueryParams(runData.queryParams ?? []);
        if (pathParams?.length == 0) setPathParams(runData.pathParams ?? []);
    }, [runData]);

    const handleUrlChange = debounce(() => {
        setUrlValue(displayedUrlValue);
        // setUrl(displayedUrlValue as string);
        const inputValue = displayedUrlValue;
        if (inputValue !== '' && isValidUrl(inputValue)) {
            updateQueryParamsFromUrl();
            updatePathParamsFromUrl();
        } else {
            setPathParams([]);
            setQueryParams([]);
        }
    }, 100); // Set a debounce delay of 300ms.

    const updateQueryParamsFromUrl = () => {
        if (!displayedUrlValue || !isValidUrl(displayedUrlValue)) return;

        const currentUrl = new URL(displayedUrlValue ?? '');
        const searchParams = currentUrl.searchParams;

        const newQueryParams: KeyValueProps[] = [];

        for (const [key, value] of searchParams.entries()) {
            newQueryParams.push({ key, value });
        }

        setQueryParams(newQueryParams);
    };

    const updatePathParamsFromUrl = () => {
        if (!displayedUrlValue || !isValidUrl(displayedUrlValue)) return;

        const currentUrl = new URL(displayedUrlValue ?? '');
        const pathname = currentUrl.pathname;

        if (pathname && pathname !== '/') {
            const pathParamsData = pathname.split('/').filter((part) => part !== '');
            const clonePathParam = pathParamsData
                .map((param, index, arr) => {
                    if (param.startsWith(':') || (index > 0 && arr[index - 1] === ':')) {
                        const key = param.startsWith(':') ? param.substring(1) : param;
                        const existingParam = pathParams.find((p) => p.key === key);
                        return {
                            key: key,
                            value: existingParam ? existingParam.value : '',
                        };
                    }
                    return null;
                })
                .filter((item): item is { key: string; value: string } => item !== null);

            const uniquePathParam = Array.from(new Map(clonePathParam.map((item) => [item.key, item])).values());
            console.log('setting the new path params=> ', uniquePathParam);
            setPathParams(uniquePathParam);
        } else {
            setPathParams([]);
        }
    };

    useEffect(() => {
        if (displayedUrlValue && isValidUrl(displayedUrlValue)) {
            handleUrlChange();
        } else {
            setPathParams([]);
            setQueryParams([]);
        }
    }, [displayedUrlValue]);

    const renderAPINodeBody = () => (
        <>
            <Stack justifyContent={'space-around'} sx={{ padding: '24px 16px', height: '300px' }}>
                <RadioGroup
                    aria-labelledby="controlled-radio-buttons-group"
                    name="controlled-radio-buttons-group"
                    onChange={(e) => {
                        setApiType(e.target.value);
                    }}
                    value={apiType}
                >
                    <Stack direction={'row'} justifyContent={'space-between'}>
                        <FormControlLabel value="api_call" control={<Radio />} label={'API Call'} />
                        <FormControlLabel value="system" control={<Radio />} label={'Conektto API'} disabled />
                        <FormControlLabel
                            value="collection"
                            control={<Radio />}
                            label={'Conektto Collection'}
                            disabled
                        />
                    </Stack>
                </RadioGroup>
                {apiType === 'system' ? (
                    <TreeDropDown data={systemApis} />
                ) : (
                    <>
                        <Typography sx={{ fontSize: '14px', fontWeight: 600 }} color="text.primary" gutterBottom>
                            API endpoint
                        </Typography>
                        <TextField
                            required={true}
                            variant="outlined"
                            value={commonData.name}
                            onChange={(e) => {
                                setApiName(e.target.value);
                            }}
                            sx={{
                                width: '480px',
                            }}
                            inputProps={{ style: { height: '15px' } }}
                        />
                    </>
                )}

                <Stack direction="row" sx={{ paddingTop: '24px' }}>
                    <Stack sx={{ paddingRight: '24px' }}>
                        <Typography sx={{ fontSize: '14px', fontWeight: 600 }} color="text.primary" gutterBottom>
                            Action Type
                        </Typography>

                        <Autocomplete
                            key={runData.method}
                            onChange={(_event: SyntheticEvent, newValue: string) => setActionType(newValue)}
                            options={['GET', 'POST', 'PUT', 'DELETE', 'PATCH']}
                            renderInput={(params: AutocompleteRenderInputParams) => (
                                <TextField {...params} variant="outlined" />
                            )}
                            defaultValue={'GET'}
                            value={runData.method ? runData.method.toUpperCase() : ''}
                            clearIcon={null}
                            openOnFocus={true}
                            fullWidth={true}
                            style={{
                                width: '155px',
                            }}
                        />
                    </Stack>
                    <Stack>
                        <Typography sx={{ fontSize: '14px', fontWeight: 600 }} color="text.primary" gutterBottom>
                            URL
                        </Typography>
                        <TextField
                            required={true}
                            variant="outlined"
                            defaultValue={runData.url}
                            value={displayedUrlValue}
                            disabled={apiType === 'system' ? true : false}
                            onChange={(event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
                                const inputValue = event.target.value as string;
                                setDisplayedUrlValue(inputValue);
                                setUrl(event.target.value as string);
                            }}
                            sx={{
                                width: '301px',
                            }}
                            inputProps={{ style: { height: '15px' } }}
                        />
                    </Stack>
                </Stack>
            </Stack>

            <Stack sx={{ width: '100%' }}>
                <TabContext value={value}>
                    <Stack direction="row" sx={{ borderBottom: 1, borderColor: 'divider', width: '100%' }}>
                        <TabList
                            onChange={handleChange}
                            aria-label="lab API tabs example"
                            TabIndicatorProps={{ style: { display: 'none' } }}
                        >
                            <Tab
                                label="Headers"
                                value={'0'}
                                sx={{
                                    borderBottom: value === '0' ? '2px solid #1976d2' : '',
                                    color: value === '0' ? '#1976d2' : '',
                                }}
                                key="headers"
                            />
                            <Tab
                                label="Query Param"
                                value={'1'}
                                sx={{
                                    borderBottom: value === '1' ? '2px solid #1976d2' : '',
                                    color: value === '1' ? '#1976d2' : '',
                                }}
                                key="query"
                            />
                            <Tab
                                label="Path Params"
                                value={'2'}
                                sx={{
                                    borderBottom: value === '2' ? '2px solid #1976d2' : '',
                                    color: value === '2' ? '#1976d2' : '',
                                }}
                                key="path"
                            />
                        </TabList>
                    </Stack>
                    <TabPanel value={'0'}>
                        <ValueCard
                            value={headers}
                            disabled={apiType === 'system' ? true : false}
                            onChange={(headers: KeyValueProps[]) => {
                                if (isEqual(headers, runData.headers)) return;

                                setHeadersData(headers);
                            }}
                        />
                    </TabPanel>
                    <TabPanel
                        value={'1'}
                        key={
                            runData?.queryParams?.length
                                ? runData.queryParams[runData.queryParams.length - 1].key
                                : 'query panel'
                        }
                    >
                        <ValueCard
                            value={queryParams}
                            disabled={apiType === 'system' ? true : false}
                            onChange={(newQueryParams: KeyValueProps[]) => {
                                if (isEqual(queryParams, newQueryParams)) return;
                                if (!displayedUrlValue || !isValidUrl(displayedUrlValue)) {
                                    return;
                                } else {
                                    const currentUrl = new URL(displayedUrlValue ?? '');
                                    const queryParamObject: Record<string, string> = newQueryParams.reduce(
                                        (acc, param) => {
                                            acc[param.key] = param.value;
                                            return acc;
                                        },
                                        {} as Record<string, string>,
                                    );
                                    currentUrl.search = new URLSearchParams(queryParamObject).toString();
                                    setUrl(currentUrl.toString());
                                    setDisplayedUrlValue(currentUrl.toString());
                                    setQueryParams(newQueryParams);
                                }
                            }}
                        />
                    </TabPanel>
                    <TabPanel
                        value={'2'}
                        key={
                            runData?.pathParams?.length
                                ? runData.pathParams[runData.pathParams.length - 1].key
                                : 'path panel'
                        }
                    >
                        <ValueCard
                            disableAdd={true}
                            disableDelete={true}
                            value={pathParams}
                            disabled={apiType === 'system' ? true : false}
                            onChange={(newPathParams: KeyValueProps[]) => {
                                if (isEqual(pathParams, newPathParams)) return;
                                if (
                                    newPathParams?.length == 1 &&
                                    newPathParams[0].key === '' &&
                                    newPathParams[0].value === ''
                                ) {
                                    setPathParams([]);
                                } else {
                                    setPathParams(newPathParams);
                                }
                                if (!displayedUrlValue || !isValidUrl(displayedUrlValue)) {
                                    return;
                                } else {
                                    const currentUrl = new URL(displayedUrlValue ?? '');
                                    if (
                                        newPathParams?.length == 1 &&
                                        newPathParams[0].key === '' &&
                                        newPathParams[0].value === ''
                                    ) {
                                        currentUrl.pathname = '';
                                    } else {
                                        const newPath = newPathParams.map((param) => `/:${param.key}`).join('');
                                        currentUrl.pathname = newPath;
                                    }
                                    setUrl(currentUrl.toString());
                                    setDisplayedUrlValue(currentUrl.toString());
                                }
                            }}
                        />
                    </TabPanel>
                </TabContext>

                {!showResponse && runData.method !== 'GET' && (
                    <Stack width="100%">
                        <ResponseTab
                            onChange={(value: any) => {
                                setRequestData(value);
                                if (checkValidJson(value)) {
                                    setIsJsonValid(true);
                                } else {
                                    setIsJsonValid(false);
                                }
                            }}
                            isError={isError}
                            isResponse={false}
                            displayTitle={true}
                            value={runData.body?.data || {}}
                            disabled={apiType === 'system' ? true : false}
                        />
                    </Stack>
                )}

                <Stack sx={{ padding: '0 16px 16px' }} alignItems={'flex-start'}>
                    <Button
                        sx={{ width: 'fit-content' }}
                        onClick={() => {
                            setSelectedNode(cardId);
                        }}
                        variant="outlined"
                        startIcon={<Add />}
                    >
                        Add Mapping
                    </Button>
                </Stack>
            </Stack>
        </>
    );

    return (
        <Stack sx={{ width: '513px' }}>
            <Stack
                direction={'row'}
                sx={{ borderBottom: '1px solid #C0CCDA', height: '52px', padding: '24px 16px' }}
                justifyContent={'space-between'}
            >
                <Stack direction={'row'}>
                    <img src={ApiIcon} style={{ width: '24px', height: '24px', alignSelf: 'center' }} />
                    <Typography
                        sx={{
                            fontSize: '16px',
                            alignSelf: 'center',
                            marginBottom: '0',
                            fontWeight: 600,
                            paddingLeft: '8px',
                        }}
                        color="text.primary"
                        gutterBottom
                    >
                        {commonData.name ?? 'API'}
                    </Typography>
                </Stack>
                <Stack direction={'row'} spacing={1}>
                    {explicitLoading && !isUpdateNodeOnServerDone ? (
                        <div className="flex flex-row items-center">
                            <CircularProgress
                                style={{
                                    width: '18px',
                                    height: '18px',
                                    marginRight: '0.5rem',
                                }}
                            />

                            <p className="text-overline2 opacity-60">Saving ...</p>
                        </div>
                    ) : (
                        <div
                            style={{ width: '24px', height: '24px', alignSelf: 'center' }}
                            onClick={() => {
                                nullChecker();

                                triggerDelayedNodeSaveOnServer(1);
                                setExplicitLoading(true);
                            }}
                        >
                            <Tooltip title="Save changes">
                                <CloudUploadIcon style={{ color: '#2c71c7' }} />
                            </Tooltip>
                        </div>
                    )}
                    <img
                        src={RunIcon}
                        style={{ width: '24px', height: '24px', alignSelf: 'center' }}
                        onClick={
                            apiType === 'system'
                                ? () => {
                                      setResponseValue('1');
                                  }
                                : execute
                        }
                    />
                </Stack>
            </Stack>

            {renderAPINodeBody()}

            {isLoading && (
                <Stack>
                    <Typography
                        sx={{
                            fontSize: '16px',
                            alignSelf: 'center',
                            marginBottom: '0',
                            fontWeight: 600,
                            paddingLeft: '8px',
                        }}
                        color="text.primary"
                        gutterBottom
                    >
                        {'Loading...'}
                    </Typography>
                </Stack>
            )}

            {showResponse && (
                <Stack>
                    {runData.method !== 'GET' ? (
                        <>
                            <TabContext value={responseValue}>
                                <Stack direction="row" sx={{ borderBottom: 1, borderColor: 'divider' }}>
                                    <TabList onChange={handleResponseChange} aria-label="lab API tabs responses">
                                        <Tab label="Request" value={'0'} />
                                        <Tab label="Response" value={'1'} />
                                    </TabList>
                                </Stack>
                                <Stack width="100%">
                                    <TabPanel
                                        value={'0'}
                                        key={`request-${runData?.output?.status || 0}-${executionNumber}`}
                                    >
                                        <ResponseTab
                                            message={''}
                                            isError={isError}
                                            isResponse={false}
                                            value={runData.body?.data || {}}
                                            disabled={apiType === 'system' ? true : false}
                                            onChange={(value: any) => {
                                                setRequestData(value);
                                                if (checkValidJson(value)) {
                                                    setIsJsonValid(true);
                                                } else {
                                                    setIsJsonValid(false);
                                                }
                                            }}
                                        />
                                    </TabPanel>
                                    <TabPanel
                                        value={'1'}
                                        key={`response-${runData?.output?.status || 0}-${executionNumber}`}
                                    >
                                        <ResponseTab
                                            message={''}
                                            isError={isError}
                                            value={runData?.output?.data}
                                            disabled={apiType === 'system' ? true : false}
                                        />
                                    </TabPanel>
                                </Stack>
                            </TabContext>
                        </>
                    ) : (
                        <Stack width="100%" key={`response-${runData?.output?.status || 0}-${executionNumber}`}>
                            <ResponseTab
                                message={''}
                                isError={isError}
                                isResponse={true}
                                value={runData?.output?.data}
                                disabled={apiType === 'system' ? true : false}
                            />
                        </Stack>
                    )}
                </Stack>
            )}
        </Stack>
    );
};
