import { Button, Checkbox, FormControl, FormControlLabel, Input, MenuItem, Select } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { useState } from 'react';

import LoadingDialog from '@/Collections/components/LoadingDialog';
import SaveOutlinedIcon from '@material-ui/icons/SaveOutlined';
import SendIcon from '@material-ui/icons/Send';
import axios from 'axios';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { v4 as uuidv4 } from 'uuid';
import { endpoint } from '../../../../shared/network/client';
import { getUserId } from '../../../../shared/storage';
import {
    currentApi,
    currentBreadCrumbs,
    currentTab,
    currentTabs,
    folderContentLoading,
    isSaveModalOpen,
    requestName,
    requestParams,
    responseInfo,
    selectedType,
} from '../../../CollectionsAtom';
import DocStore from '../../../DocStore/DocStore';

const requestMethods = [
    {
        slug: 'get',
        method: 'GET',
    },
    {
        slug: 'post',
        method: 'POST',
    },
    {
        slug: 'put',
        method: 'PUT',
    },
    {
        slug: 'patch',
        method: 'PATCH',
    },
    {
        slug: 'delete',
        method: 'DELETE',
    },
];

const useStyles = makeStyles((theme) => ({
    formControl: {
        margin: theme.spacing(1),
        minWidth: 100,
    },
    input: {
        flex: 1,
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
        border: '1px solid #e6e6e6',
        borderRadius: '4px',
        padding: '8px 12px', // reduce the padding on the top and bottom
        fontSize: '14px',
        height: '35px',
    },
    button: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
        padding: '8px 16px', // reduce the padding on the top and bottom
        fontSize: '14px',
        fontWeight: 600,
        height: '45px',
    },
    modalButton: {
        margin: theme.spacing(1),
        padding: '5px 12px', // reduce the padding on the top and bottom
        fontSize: '12px',
        fontWeight: 600,
        height: '33px',
        boxShadow: 'none',
    },
    label: {
        fontSize: '12px',
        padding: '2px 4px',
        marginTop: '-5px',
    },
    select: {
        fontSize: '13px',
        padding: '8px',
        height: '35px',
        fontWeight: 400,
        marginTop: '-7px',
    },
    sendButton: {
        width: '100px',
        height: '35px',
        fontSize: '12px',
        fontWeight: 500,
    },
    cancel: {
        backgroundColor: 'black',
        color: 'white',
        '&:hover': {
            backgroundColor: 'black',
        },
    },
    saveButton: {
        width: '100px',
        height: '35px',
        fontSize: '12px',
        fontWeight: 500,
        backgroundColor: 'black',
        color: 'white',
        '&:hover': {
            backgroundColor: 'black',
        },
    },
}));

export default function UrlEditor({ onInputSend }) {
    const [request, setRequest] = useRecoilState(requestParams);
    const [response, setResponse] = useRecoilState(responseInfo);
    const fileName = useRecoilValue(requestName);
    const selectedFolder = useRecoilValue(selectedType);
    const [open, setOpen] = useRecoilState(isSaveModalOpen);
    const classes = useStyles();
    const userId = getUserId();
    let setTabs = useSetRecoilState(currentTabs);
    const currenttab = useRecoilValue(currentTab);
    const [api, setCurrentApi] = useRecoilState(currentApi);
    const setBreadCrumbs = useSetRecoilState(currentBreadCrumbs);
    const [checked, setChecked] = useState(false);
    const [loading, setLoading] = useRecoilState(folderContentLoading);

    const handleCheckChange = (event) => {
        setChecked(event.target.checked);
    };

    const handleChange = (event) => {
        const { name, value } = event.target;
        setRequest((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };
    const handleSendClick = async (event) => {
        onInputSend(event);
    };
    const handleSave = async (event) => {
        const newId = uuidv4();

        if (checked) {
            setLoading(true);
            if (selectedFolder.id) {
                const type = 'file';
                let parentFolderNames;
                await axios.post(process.env.REACT_APP_API_URL + endpoint.collectionDirectory, {
                    userId: userId,
                    id: newId,
                    name: fileName ? fileName : 'New Request',
                    type: 'File',
                    parentFolderId: selectedFolder.id,
                });
                const currentDate = new Date();
                const formattedDateTime = currentDate.toLocaleString('en-GB', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                });

                await axios.post(process.env.REACT_APP_API_URL + endpoint.collectionsRequest + `/${userId}/${newId}`, {
                    name: fileName ? fileName : 'New Request',
                    request: request
                        ? request
                        : { method: 'GET', proxy: 'No Proxy', url: '', body: { '': '' }, header: [], queryParams: [] },
                    response: response ? response : { status: null, headers: {}, data: {}, time: 0, size: 0 },
                    onSave: true,
                    parentFolderId: selectedFolder.id,
                    createdAt: formattedDateTime,
                    modifiedAt: formattedDateTime,
                });
                await axios
                    .get(process.env.REACT_APP_API_URL + endpoint.collectionDirectory + `/${userId}/${type}/${newId}`)
                    .then((response) => {
                        parentFolderNames = response['data'].result;
                        parentFolderNames = parentFolderNames.reverse();
                    })
                    .catch((err) => {
                        console.log(err);
                    });

                await axios
                    .get(process.env.REACT_APP_API_URL + `${endpoint.collectionsRequest}/${userId}/${newId}`)
                    .then(async (response) => {
                        const data = response.data;
                        setTabs((prev) => {
                            return prev.map((tab, index) => {
                                if (index === currenttab) {
                                    // Modify the object at the target index
                                    return {
                                        ...tab,
                                        id: data.id,
                                        parentFolderNames: parentFolderNames,
                                        request: data.request,
                                        response: data.response,
                                        label: data.name,
                                        onSave: data.onSave,
                                        type: 'file',
                                        parentFolderId: data.parentFolderId,
                                    };
                                }
                                // For other indices, return the tab object as is
                                return tab;
                            });
                        });

                        setRequest(data.request);
                        setResponse(data.response);
                        setCurrentApi({
                            id: data.id,
                            name: data.name,
                            onSave: data.onSave,
                            type: 'file',
                            parentFolderId: data.parentFolderId,
                        });
                        setBreadCrumbs(parentFolderNames);
                    });
            }
            setLoading(false);
            setOpen(false);
        } else {
            setLoading(true);
            if (api.parentFolderId === '0') {
                await axios.post(process.env.REACT_APP_API_URL + endpoint.collectionDirectory, {
                    userId: userId,
                    id: api.id,
                    name: fileName ? fileName : 'New Request',
                    type: 'File',
                    parentFolderId: selectedFolder.id,
                });
            } else {
                await axios.put(process.env.REACT_APP_API_URL + endpoint.collectionDirectory + `/${userId}/${api.id}`, {
                    name: fileName ? fileName : 'New Request',
                    parentFolderId: selectedFolder.id,
                });
            }
            const type = 'file';
            let parentFolderNames;
            const currentDate = new Date();
            const formattedDateTime = currentDate.toLocaleString('en-GB', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
            });
            await axios.put(process.env.REACT_APP_API_URL + endpoint.collectionsRequest + `/${userId}/${api.id}`, {
                parentFolderId: selectedFolder.id,
                name: fileName ? fileName : 'New Request',
                onSave: true,
                modifiedAt: formattedDateTime,
            });

            await axios
                .get(process.env.REACT_APP_API_URL + endpoint.collectionDirectory + `/${userId}/${type}/${api.id}`)
                .then((response) => {
                    parentFolderNames = response['data'].result;
                    parentFolderNames = parentFolderNames.reverse();
                })
                .catch((err) => {
                    console.log(err);
                });
            await axios
                .get(process.env.REACT_APP_API_URL + `${endpoint.collectionsRequest}/${userId}/${api.id}`)
                .then(async (response) => {
                    const data = response.data;
                    setTabs((prev) => {
                        return prev.map((tab, index) => {
                            if (index === currenttab) {
                                // Modify the object at the target index
                                return {
                                    ...tab,
                                    id: data.id,
                                    parentFolderNames: parentFolderNames,
                                    request: data.request,
                                    response: data.response,
                                    label: data.name,
                                    onSave: data.onSave,
                                    type: 'file',
                                };
                            }
                            // For other indices, return the tab object as is
                            return tab;
                        });
                    });

                    setRequest(data.request);
                    setResponse(data.response);
                    setCurrentApi({
                        id: data.id,
                        name: data.name,
                        onSave: data.onSave,
                        type: 'file',
                        parentFolderId: data.parentFolderId,
                    });
                    setBreadCrumbs(parentFolderNames);
                });
            setLoading(false);
            setOpen(false);
        }
    };

    const handleSaveClickOpen = () => {
        setOpen(true);
    };
    const handleSaveClose = () => {
        setOpen(false);
    };

    const handleKeyPress = (event) => {
        if (event.keyCode === 13) {
            // Call your function here
            handleSendClick(event);
        }
    };
    return (
        <div>
            <form className="flex">
                <FormControl variant="outlined" className={classes.formControl}>
                    <Select
                        className={classes.select}
                        labelId="req-method-label"
                        id="req-method-select"
                        value={request.method}
                        onChange={handleChange}
                        variant="outlined"
                        name="method"
                    >
                        {requestMethods.map((option) => (
                            <MenuItem key={option.slug} value={option.method}>
                                {option.method}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <Input
                    className={classes.input}
                    placeholder="URL"
                    value={request.url}
                    onChange={handleChange}
                    inputProps={{
                        'aria-label': 'URL',
                    }}
                    name="url"
                    onKeyUp={handleKeyPress}
                />
                <Button
                    className={`${classes.button} ${classes.sendButton}`}
                    variant="contained"
                    color="primary"
                    size="small"
                    startIcon={<SendIcon />}
                    onClick={handleSendClick}
                >
                    Send
                </Button>
                <Button
                    className={`${classes.button} ${classes.saveButton}`}
                    variant="contained"
                    color="grey"
                    size="small"
                    startIcon={<SaveOutlinedIcon />}
                    onClick={handleSaveClickOpen}
                >
                    Save
                </Button>
            </form>
            <Dialog
                open={open}
                onClose={handleSaveClose}
                scroll={'paper'}
                aria-labelledby="scroll-dialog-title"
                aria-describedby="scroll-dialog-description"
            >
                <DialogTitle id="scroll-dialog-title">Save Request</DialogTitle>
                <DialogContent dividers style={{ height: '60vh', width: '37rem', overflow: 'hidden' }}>
                    <DocStore isModal={true} />
                </DialogContent>
                <DialogActions style={{ display: 'flex', justifyContent: 'space-between' }}>
                    {api.parentFolderId === '0' ? (
                        <div></div>
                    ) : (
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={checked}
                                    onChange={handleCheckChange}
                                    inputProps={{ 'aria-label': 'controlled' }}
                                />
                            }
                            label={<span style={{ fontWeight: 500, fontSize: '15px' }}>Save as duplicate</span>}
                        />
                    )}

                    <div>
                        <Button
                            className={`${classes.modalButton} ${classes.cancel}`}
                            variant="contained"
                            color="grey"
                            size="small"
                            onClick={handleSaveClose}
                        >
                            Cancel
                        </Button>
                        <Button
                            className={`${classes.modalButton}`}
                            variant="contained"
                            color="primary"
                            size="small"
                            onClick={handleSave}
                        >
                            Save
                        </Button>
                    </div>
                </DialogActions>
            </Dialog>
            {loading && <LoadingDialog />}
        </div>
    );
}
