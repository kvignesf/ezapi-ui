import { CircularProgress, Tooltip } from '@material-ui/core';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import { ExpandLess, ExpandMore } from '@mui/icons-material';
import {
    Autocomplete,
    AutocompleteRenderInputParams,
    Button,
    Card,
    FormControlLabel,
    Radio,
    RadioGroup,
    Stack,
    Tab,
    TextField,
    Typography,
} from '@mui/material';
import axios, { AxiosError, AxiosRequestConfig, AxiosResponse, Method } from 'axios';
import _ from 'lodash';
import Qs from 'qs';
import { SyntheticEvent, useContext, useEffect, useState } from 'react';
import { Handle, Position, useNodeId } from 'reactflow';
import LoaderWithMessage from '../../../shared/components/LoaderWithMessage';
// @ts-ignore
import { SocketContext } from '@/Context/socket';
import drawerCardAtom from '@/shared/atom/drawerCardAtom';
import selectedNodeAtom from '@/shared/atom/selectedNodeAtom';
import ErrorWithMessage from '@/shared/components/ErrorWithMessage';
import { Add } from '@material-ui/icons';
import { TabContext, TabList, TabPanel } from '@mui/lab';
// @ts-ignore
import buildURL from 'axios/lib/helpers/buildURL';
import { useRecoilState } from 'recoil';
import ApiIcon from '../../../icons/ApiIcon.svg';
import Collapse from '../../../icons/collapse.svg';
import DialogIcon from '../../../icons/dialogIcon.svg';
import RunIcon from '../../../icons/runIcon.svg';
import { checkValidJson, convertObjectToFormData, formDataToObject } from '../businessFlowHelper';
import { DEFAULT_API_RESPONSE } from '../defaults';
import useNodeHook from '../hooks/useNodeHook';
import { ExternalAPI, KeyValueProps, NodeProps } from '../interfaces';
import { CommonNodeData, NodeData } from '../interfaces/flow';
import { ResponseTab } from './Components/ResponseTab';
import { TreeDropDown } from './Components/TreeDropDown';
import { ValueCard } from './Components/ValueCard';
const NON_PROXY_HOST_NAMES = ['localhost', '127.0.0.1'];

function getExternalAPIRequestAxiosOptions(
    runData: ExternalAPI,
    displayedUrlValue: String,
    headers: KeyValueProps[],
    queryParams: KeyValueProps[],
    pathParams: KeyValueProps[],
    requestBodyData: KeyValueProps[],
): AxiosRequestConfig {
    const headerValues: any = {};
    headers?.forEach((item) => {
        if (item.key) {
            headerValues[item.key] = item.value;
        }
    });

    const queryParamsValues: any = {};
    queryParams?.forEach((item) => {
        const existingValues = queryParamsValues[item.key] || [];
        existingValues.push(item.value);
        queryParamsValues[item.key] = existingValues;
    });

    const pathParamsValues: any = {};
    pathParams?.forEach((item) => {
        if (item.key) {
            pathParamsValues[item.key] = item.value;
        }
    });

    const paramsSerializer = (params: any) => Qs.stringify(params, { arrayFormat: 'repeat' });
    let url = buildURL(displayedUrlValue, queryParamsValues, paramsSerializer);

    Object.keys(pathParamsValues).forEach((key) => {
        url = url.replace(`:${key}`, pathParamsValues[key]);
    });

    const apiCardRequestData: any = {
        url: url,
        method: runData.method,
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            ...headerValues,
        },
        data: !_.isEmpty(requestBodyData)
            ? typeof requestBodyData === 'object'
                ? requestBodyData
                : formDataToObject(convertObjectToFormData(requestBodyData))
            : {},
        //params: paramsSerializer(queryParamsValues),
    };

    let isValidProxyRequest = true;

    if (
        /* NON_PROXY_HOST_NAMES.includes(location.hostname) || */ NON_PROXY_HOST_NAMES.includes(new URL(url).hostname)
    ) {
        isValidProxyRequest = false;
    }

    if (!isValidProxyRequest) {
        return apiCardRequestData;
    }

    const options: AxiosRequestConfig = {
        url: 'https://proxy.ezapi.ai',
        method: 'post',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        data: apiCardRequestData,
    };

    return options;
}

const ExternalAPINodeComponent = (props: NodeProps): React.ReactElement => {
    const cardId: string = useNodeId() || '';

    const socket = useContext(SocketContext);

    /* useEffect(() => {
        if (socket) {

            console.log("socket..", socket);
            console.log("socket connected...", socket.connected);
            socket.on('filterUpdateDone', (data: any) => {
                console.log("filterupdateDoneData....", data);
            });
        }
    }, []); */

    const initialCommonData: CommonNodeData = {
        name: props.data.commonData.name,
        parentNode: props.data.commonData.parentNode,
        inputNodeIds: props.data.commonData.inputNodeIds,
        nonDeletable: props.data.commonData.nonDeletable,
    };

    const initialRunData: ExternalAPI = {
        url: props.data.runData?.url || '',
        method: props.data.runData?.method || 'GET',
        headers: props.data.runData?.headers || [],
        queryParams: props.data.runData?.queryParams || [],
        pathParams: props.data.runData?.pathParams || [],
        body: props.data.runData?.body || '',
        output: props.data.runData?.output || { ...DEFAULT_API_RESPONSE },
    };

    const [headers, setHeaders] = useState<KeyValueProps[]>();
    const [queryParams, setQueryParams] = useState<KeyValueProps[]>(initialRunData.queryParams || []);
    const [pathParams, setPathParams] = useState<KeyValueProps[]>(initialRunData.pathParams || []);
    const [requestBodyData, setRequestBodyData] = useState<any>(initialRunData.body?.data || {});
    const [commonData, setCommonData] = useState<CommonNodeData>(initialCommonData);
    const [runData, setRunData] = useState<ExternalAPI>(initialRunData);

    //const [urlValue, setUrlValue] = useState<string>('');
    const [displayedUrlValue, setDisplayedUrlValue] = useState(initialRunData.url ?? '');
    const [isFocused, setIsFocused] = useState(false);

    const [isExecuting, setIsExecuting] = useState<boolean>(false);
    const [iconSelector, setIconSelector] = useState('delete');

    const [value, setValue] = useState('0');
    const [systemApis, _setSystemApis] = useState();
    // const [pathParamsKey, setPathParamsKey] = useState('emptyPathParams');
    // const [queryParamsKey, setQueryParamsKey] = useState('emptyQueryParams');
    // const [headersKey, setHeadersKey] = useState('emptyHeaders');

    const [apiType, setApiType] = useState<string>('api_call');
    const [_selectedCard, setSelectedCard] = useRecoilState(drawerCardAtom);
    const [drawerSelected, setDrawerSelected] = useState(false);
    const [explicitLoading, setExplicitLoading] = useState(false);

    const [isJsonValid, setIsJsonValid] = useState(true);
    const [_selectedNode, setSelectedNode] = useRecoilState(selectedNodeAtom);

    const [collapse, setCollapse] = useState(props.data.runData?.output?.success || false);
    const [showResponse, setShowResponse] = useState(
        props.data.runData?.output?.status
            ? props.data.runData.output.status >= 200 && props.data.runData?.output?.status < 300
            : false,
    );
    const [responseValue, setResponseValue] = useState<string>(props.data.runData?.output?.success ? '1' : '0');
    const [viewMore, setViewMore] = useState<boolean>(false);
    const [executionNumber, setExecutionNumber] = useState<number>(0);
    const delayTimeSet = 2500;
    const {
        node,
        isLoading,
        isNodeDataLoaded,
        isUpdateNodeOnServerDone,
        setTriggerNodeSaveOnServer,
        triggerDelayedNodeSaveOnServer,
        loadNodeDataFromServer,
    } = useNodeHook({
        nodeId: cardId,
        getUpdatedNodeData: getUpdatedNodeDataFn,
        collapse: collapse,
    });
    const isError = [undefined, 0].includes(props.data.runData?.output?.status)
        ? undefined
        : props.data.runData?.output?.success === false;

    const handleChange = (_event: React.SyntheticEvent, newValue: string) => {
        nullChecker();
        /* if (newValue === '1') {
            updateQueryParamsFromUrl();
        }
        if (newValue === '2') {
            updatePathParamsFromUrl();
        } */
        setValue(newValue);
    };
    const nullChecker = () => {
        if (headers?.length == 1 && headers[0].key === '' && headers[0].value === '') {
            setHeaders([]);
        }
        if (queryParams?.length == 1 && queryParams[0].key === '' && queryParams[0].value === '') {
            //const currentUrl = new URL(displayedUrlValue ?? '');
            //currentUrl.search = new URLSearchParams({}).toString();
            //setDisplayedUrlValue(currentUrl.toString());
            setQueryParams([]);
        }
    };
    const handleResponseChange = (_event: React.SyntheticEvent, newValue: string) => {
        setResponseValue(newValue);
    };

    /* useEffect(() => {
        console.log(executionNumber, 'numbr');
    }, [executionNumber]); */

    function getUpdatedNodeDataFn() {
        const newNodeData = (_.isEmpty(props.data) ? {} : props.data) as NodeData;
        return {
            ...newNodeData,
            commonData: commonData,
            runData: {
                ...runData,
                url: displayedUrlValue,
                pathParams: pathParams,
                queryParams: queryParams,
                headers: headers,
                body: {
                    data:
                        typeof requestBodyData === 'object'
                            ? requestBodyData
                            : formDataToObject(convertObjectToFormData(requestBodyData)),
                },
                output: runData.output,
            },
        };
    }

    function isValidUrl(url: string) {
        try {
            new URL(url);
            return true;
        } catch (err) {
            setPathParams([]);
            //setQueryParams([]);
            return false;
        }
    }

    function setApiName(newApiName: string) {
        setCommonData({ ...commonData, name: newApiName });
        triggerDelayedNodeSaveOnServer(delayTimeSet);
    }

    function setActionType(newMethod: string) {
        if (newMethod && runData.method?.toUpperCase() !== newMethod.toUpperCase()) {
            setRunData({ ...runData, method: newMethod as Method, output: { ...DEFAULT_API_RESPONSE } });
            triggerDelayedNodeSaveOnServer(delayTimeSet);
        }
    }

    /* function setUrl(newUrl: string) {
        setRunData({
            ...runData,
            url: newUrl,
            headers: headers,
            queryParams: queryParams,
            pathParams: pathParams,
            body: {
                data:
                    typeof requestBodyData === 'object'
                        ? requestBodyData
                        : formDataToObject(convertObjectToFormData(requestBodyData)),
            },
            output: { ...DEFAULT_API_RESPONSE },
        });
        //nullChecker();

        triggerDelayedNodeSaveOnServer(delayTimeSet);
    }

    function setHeadersData(newHeaders: KeyValueProps[]) {
        if (newHeaders) {
            setRunData({ ...runData, headers: newHeaders, output: { ...DEFAULT_API_RESPONSE } });
            triggerDelayedNodeSaveOnServer(delayTimeSet);
        }
    } */

    /* function setRequestData(newRequestData: string | object) {
        if (newRequestData) {
            setRunData({
                ...runData,
                body: {
                    data: formDataToObject(convertObjectToFormData(newRequestData)),
                },
                output: { ...DEFAULT_API_RESPONSE },
            });
            triggerDelayedNodeSaveOnServer(delayTimeSet);
        }
    } */

    function toggleCollapse() {
        setCollapse(!collapse);
    }

    const execute = async (event: React.MouseEvent) => {
        event.preventDefault();
        if (!isNodeDataLoaded || isLoading || isExecuting || !runData.url) {
            return;
        }

        setIsExecuting(true);
        const options: AxiosRequestConfig = getExternalAPIRequestAxiosOptions(
            runData,
            displayedUrlValue,
            headers ?? [],
            queryParams,
            pathParams,
            requestBodyData,
        );

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
                triggerDelayedNodeSaveOnServer(delayTimeSet);
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
                setCollapse(true);
                setIsExecuting(false);
                setResponseValue('1');
                setShowResponse(true);
                nullChecker();

                triggerDelayedNodeSaveOnServer(delayTimeSet);
                setExecutionNumber(executionNumber + 1);
            });
    };

    useEffect(() => {
        if (node && !_.isEmpty(node.data.commonData)) {
            setCommonData({
                ...node.data.commonData,
            });
        }
        if (node && !_.isEmpty(node.data.runData)) {
            setRunData({
                ...node.data.runData,
            });
            setDisplayedUrlValue(node.data.runData.url ?? '');
            setHeaders(node.data.runData.headers ?? []);
            setQueryParams(node.data.runData.queryParams ?? []);
            console.log('setting initial values=> ', node.data.runData.pathParams);
            setPathParams(node.data.runData.pathParams ?? []);
            setRequestBodyData(node.data.runData.body?.data ?? {});
            const outputInfo = node.data.runData?.output;
            const hasResponse = Boolean(outputInfo && outputInfo.status && outputInfo.status > 0);
            if (hasResponse) {
                setShowResponse(hasResponse);
                setResponseValue('1');
            }
            setExecutionNumber(executionNumber + 1);
        }
    }, [node]);

    useEffect(() => {
        if (!_selectedNode && collapse) {
            loadNodeDataFromServer();
        }
    }, [_selectedNode]);

    useEffect(() => {
        if (props && !_.isEmpty(props.data.commonData)) {
            setCommonData({
                ...props.data.commonData,
            });
        }
        if (props && !_.isEmpty(props.data.runData)) {
            setRunData({
                ...props.data.runData,
            });
            const outputInfo = props.data.runData?.output;
            const hasResponse = Boolean(outputInfo && outputInfo.status && outputInfo.status > 0);
            if (hasResponse) {
                setShowResponse(hasResponse);
                setResponseValue('1');
            }
            //setExecutionNumber(executionNumber + 1);
            setRequestBodyData(props.data.runData?.body?.data);
        }
    }, [props]);

    useEffect(() => {
        if (!displayedUrlValue || !isValidUrl(displayedUrlValue) || !isFocused) return;

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
    }, [displayedUrlValue]);

    /*const handleUrlChange = () => {
        setUrlValue(displayedUrlValue);
    }

    useEffect(() => {
        if (displayedUrlValue && isValidUrl(displayedUrlValue)) {
            handleUrlChange();
        } else {
            setPathParams([]);
            setQueryParams([]);
        }
    }, [displayedUrlValue]);*/

    const renderAPINodeBody = () => (
        <>
            <Stack justifyContent={'space-around'} sx={{ padding: '24px 16px', height: '300px' }}>
                <RadioGroup
                    aria-labelledby="controlled-radio-buttons-group"
                    name="controlled-radio-buttons-group"
                    onChange={(e: any) => {
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
                            onChange={(e: any) => {
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
                            onChange={(_event: SyntheticEvent, newValue: string) => {
                                console.log(newValue);
                                if (newValue === 'GET') setResponseValue('0');
                                setActionType(newValue);
                            }}
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
                                //const inputValue = event.target.value as string;
                                //setDisplayedUrlValue(inputValue);
                                setDisplayedUrlValue(event.target.value as string);
                                triggerDelayedNodeSaveOnServer(delayTimeSet);
                            }}
                            onFocus={() => setIsFocused(true)}
                            onBlur={() => setIsFocused(false)}
                            sx={{
                                width: '301px',
                            }}
                            inputProps={{ style: { height: '15px' } }}
                        />
                    </Stack>
                </Stack>
                <Button
                    color={'primary'}
                    variant="contained"
                    sx={{ marginTop: '24px', height: '30px', textTransform: 'none' }}
                    onClick={() => {
                        setViewMore(!viewMore);
                    }}
                    startIcon={!viewMore ? <ExpandMore /> : <ExpandLess />}
                >
                    {viewMore ? 'View Less' : ' View More'}
                </Button>
            </Stack>
            {viewMore && (
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
                                isHeader={true}
                                value={headers}
                                disabled={apiType === 'system' ? true : false}
                                /* onSubmit={() => {
                                    if (headers) setHeadersData(headers);
                                }} */
                                onChange={(headers: KeyValueProps[]) => {
                                    if (!headers) return;
                                    setHeaders(headers);
                                    triggerDelayedNodeSaveOnServer(delayTimeSet);
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
                                /* onSubmit={() => {
                                    const currentUrl = new URL(displayedUrlValue ?? '');
                                    const queryParamObject: Record<string, string> = queryParams.reduce(
                                        (acc, param) => {
                                            acc[param.key] = param.value;
                                            return acc;
                                        },
                                        {} as Record<string, string>,
                                    );
                                    currentUrl.search = new URLSearchParams(queryParamObject).toString();
                                    setUrl(currentUrl.toString());
                                    setDisplayedUrlValue(currentUrl.toString());
                                }} */
                                onChange={(newQueryParams: KeyValueProps[]) => {
                                    if (!newQueryParams) return;
                                    setQueryParams(newQueryParams);
                                    triggerDelayedNodeSaveOnServer(delayTimeSet);
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
                                //disableAdd={true}
                                //disableDelete={true}
                                value={pathParams}
                                disabled={apiType === 'system' ? true : false}
                                /* onSubmit={() => {
                                    if (!displayedUrlValue || !isValidUrl(displayedUrlValue)) {
                                        return;
                                    } else {
                                        const currentUrl = new URL(displayedUrlValue ?? '');
                                        if (
                                            pathParams?.length == 1 &&
                                            pathParams[0].key === '' &&
                                            pathParams[0].value === ''
                                        ) {
                                            currentUrl.pathname = '';
                                        } else {
                                            const newPath = pathParams.map((param) => `/:${param.key}`).join('');
                                            currentUrl.pathname = newPath;
                                        }
                                        setUrl(currentUrl.toString());
                                        setDisplayedUrlValue(currentUrl.toString());
                                    }
                                }} */
                                onChange={(newPathParams: KeyValueProps[]) => {
                                    if (!newPathParams) return;
                                    setPathParams(newPathParams);
                                    triggerDelayedNodeSaveOnServer(delayTimeSet);
                                }}
                            />
                        </TabPanel>
                    </TabContext>

                    {!showResponse && runData.method !== 'GET' && (
                        <Stack width="100%">
                            <ResponseTab
                                onChange={(value: any) => {
                                    setRequestBodyData(value);
                                    //setRequestData(value);
                                    triggerDelayedNodeSaveOnServer(delayTimeSet);
                                    if (checkValidJson(value)) {
                                        setIsJsonValid(true);
                                    } else {
                                        setIsJsonValid(false);
                                    }
                                }}
                                isError={isError}
                                isResponse={false}
                                displayTitle={true}
                                value={requestBodyData || {}}
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
            )}
        </>
    );
    useEffect(() => {
        if (drawerSelected) {
            setCollapse(false);

            if (isUpdateNodeOnServerDone) {
                setSelectedCard(cardId);
                setDrawerSelected(false);
            }
        }
    }, [drawerSelected, isUpdateNodeOnServerDone]);

    return (
        <Card sx={{ width: '513px' }}>
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
                        src={DialogIcon}
                        style={{ width: '24px', height: '24px', alignSelf: 'center' }}
                        onClick={() => {
                            setDrawerSelected(true);
                        }}
                    />

                    <img
                        src={Collapse}
                        style={{ width: '24px', height: '24px', alignSelf: 'center' }}
                        onClick={toggleCollapse}
                    />

                    <img
                        src={RunIcon}
                        style={{ width: '24px', height: '24px', alignSelf: 'center' }}
                        onClick={
                            apiType === 'system'
                                ? () => {
                                      setCollapse(true);
                                      setResponseValue('1');
                                  }
                                : execute
                        }
                    />
                </Stack>
            </Stack>

            {collapse && isNodeDataLoaded && renderAPINodeBody()}

            {(isLoading || isExecuting) && (
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
            {!collapse && !isUpdateNodeOnServerDone && drawerSelected && (
                <div className="my-7">
                    <LoaderWithMessage message={'Saving Data'} contained={true} className="" />
                </div>
            )}
            {showResponse && (
                <Stack>
                    {runData.method !== 'GET' ? (
                        <>
                            <TabContext value={responseValue}>
                                <Stack direction="row" sx={{ borderBottom: 1, borderColor: 'divider' }}>
                                    <TabList
                                        onChange={handleResponseChange}
                                        aria-label="lab API tabs responses"
                                        TabIndicatorProps={{ style: { display: 'none' } }}
                                    >
                                        <Tab
                                            label="Request"
                                            value={'0'}
                                            sx={{
                                                borderBottom: responseValue === '0' ? '2px solid #1976d2' : '',
                                                color: responseValue === '0' ? '#1976d2' : '',
                                            }}
                                        />
                                        <Tab
                                            label="Response"
                                            value={'1'}
                                            sx={{
                                                borderBottom: responseValue === '1' ? '2px solid #1976d2' : '',
                                                color: responseValue === '1' ? '#1976d2' : '',
                                            }}
                                        />
                                    </TabList>
                                </Stack>
                                <Stack width="100%">
                                    <TabPanel
                                        sx={{ padding: 0 }}
                                        value={'0'}
                                        key={`request-${runData?.output?.status || 0}-${executionNumber}`}
                                    >
                                        <ResponseTab
                                            message={''}
                                            isError={isError}
                                            isResponse={false}
                                            value={requestBodyData || {}}
                                            disabled={apiType === 'system' ? true : false}
                                            onChange={(value: any) => {
                                                setRequestBodyData(value);
                                                //setRequestData(value);
                                                if (checkValidJson(value)) {
                                                    setIsJsonValid(true);
                                                } else {
                                                    setIsJsonValid(false);
                                                }
                                            }}
                                        />
                                    </TabPanel>
                                    <TabPanel
                                        sx={{ padding: 0 }}
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
                        <TabContext value={'0'}>
                            <Stack direction="row" sx={{ borderBottom: 1, borderColor: 'divider' }}>
                                <TabList
                                    onChange={handleResponseChange}
                                    aria-label="lab API tabs responses"
                                    TabIndicatorProps={{ style: { display: 'none' } }}
                                >
                                    <Tab
                                        label="Response"
                                        value={'0'}
                                        sx={{
                                            borderBottom: responseValue === '0' ? '2px solid #1976d2' : '',
                                            color: responseValue === '0' ? '#1976d2' : '',
                                        }}
                                    />
                                </TabList>
                            </Stack>
                            <Stack width="100%" key={`response-${runData?.output?.status || 0}-${executionNumber}`}>
                                <ResponseTab
                                    message={''}
                                    isError={isError}
                                    isResponse={true}
                                    value={runData?.output?.data}
                                    disabled={apiType === 'system' ? true : false}
                                />
                            </Stack>
                        </TabContext>
                    )}
                </Stack>
            )}
            {!isJsonValid && !collapse && (
                <ErrorWithMessage message={'invalid JSON'} className={'mb-3'} contained isError />
            )}
        </Card>
    );
};

const ExternalAPINode = (props: NodeProps): React.ReactElement => (
    <>
        <Handle
            type="target"
            position={Position.Left}
            style={{ background: '#555' }}
            onConnect={(params) => console.log('handle onConnect', params)}
            isConnectable={props.isConnectable}
        />
        <Handle
            type="source"
            position={Position.Right}
            style={{ background: '#555' }}
            onConnect={(params) => console.log('handle onConnect', params)}
            isConnectable={props.isConnectable}
        />
        <ExternalAPINodeComponent {...props} />
    </>
);

export { ExternalAPINode };
