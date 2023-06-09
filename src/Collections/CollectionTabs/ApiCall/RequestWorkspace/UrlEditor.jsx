import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { FormControl, Select, MenuItem, Input, Button } from '@material-ui/core';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';

import SendIcon from '@material-ui/icons/Send';
import SaveOutlinedIcon from '@material-ui/icons/SaveOutlined';
import {
    currentApi,
    currentBreadCrumbs,
    currentTab,
    currentTabs,
    isSaveModalOpen,
    requestName,
    requestParams,
    responseInfo,
    selectedType,
} from '../../../CollectionsAtom';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import DocStore from '../../../DocStore/DocStore';
import { endpoint } from '../../../../shared/network/client';
import axios from 'axios';
import { getUserId } from '../../../../shared/storage';

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
    const setCurrentApi = useSetRecoilState(currentApi);
    const setBreadCrumbs = useSetRecoilState(currentBreadCrumbs);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setRequest((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };
    const handleSendClick = (event) => {
        onInputSend(event);
    };
    const handleSave = async (event) => {
        const newId = Date.now();
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
            await axios.post(process.env.REACT_APP_API_URL + endpoint.collectionsRequest + `/${userId}/${newId}`, {
                name: fileName ? fileName : 'New Request',
                request: request
                    ? request
                    : { method: 'GET', proxy: 'No Proxy', url: '', body: { '': '' }, header: [], queryParams: [] },
                response: response ? response : { status: null, headers: {}, data: {}, time: 0, size: 0 },
                onSave: true,
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
                                };
                            }
                            // For other indices, return the tab object as is
                            return tab;
                        });
                    });

                    setRequest(data.request);
                    setResponse(data.response);
                    setCurrentApi({ id: data.id, name: data.name, onSave: data.onSave });
                    setBreadCrumbs(parentFolderNames);
                });
        }

        setOpen(false);
    };

    const handleSaveClickOpen = () => {
        setOpen(true);
    };
    const handleSaveClose = () => {
        setOpen(false);
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
                <DialogActions>
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
                </DialogActions>
            </Dialog>
        </div>
    );
}
