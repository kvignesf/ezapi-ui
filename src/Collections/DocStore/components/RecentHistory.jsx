import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { endpoint } from '../../../shared/network/client';
import { getUserId } from '../../../shared/storage';
import File from './File';
import { makeStyles } from '@material-ui/core/styles';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import {
    currentApi,
    currentBreadCrumbs,
    currentTab,
    currentTabs,
    recentRequest,
    requestParams,
    responseInfo,
    selectedType,
} from '../../CollectionsAtom';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

const useStyles = makeStyles((theme) => ({
    heading: {
        color: 'grey',
        fontSize: '15px',
        fontWeight: 600,
        fontStyle: 'italic',
        marginTop: '10px',
        marginBottom: '5px',
        marginLeft: '5px',
    },
    heading1: {
        color: '#2C71C7',
        fontSize: '16px',
        marginTop: '10px',
        marginBottom: '5px',
        marginLeft: '5px',
    },
}));

const RecentHistory = () => {
    const classes = useStyles();
    const [requests, setRequests] = useState([]);
    const userId = getUserId();
    const [id, setId] = useState();
    const [selected, setSelected] = useRecoilState(selectedType);
    const [open, setOpen] = useState(false);
    const [tabs, setTabs] = useRecoilState(currentTabs);
    const [value, setValue] = useRecoilState(currentTab);
    const setRequest = useSetRecoilState(requestParams);
    const setResponse = useSetRecoilState(responseInfo);
    const setCurrentApi = useSetRecoilState(currentApi);
    const setBreadCrumbs = useSetRecoilState(currentBreadCrumbs);
    const handleClose = () => {
        setOpen(false);
    };

    useEffect(() => {
        const getFiles = async () => {
            await axios
                .get(process.env.REACT_APP_API_URL + endpoint.collectionsRequest + `/${userId}`)
                .then((response) => {
                    let req = response.data;
                    req.sort((a, b) => a.id - b.id);

                    req = req.filter((obj) => obj.isRecent === true);
                    setRequests(req);
                })
                .catch((error) => {
                    console.error(error);
                });
        };
        getFiles();
    }, [userId, tabs]);

    console.log(requests);
    // Get the current date
    const today = new Date().toDateString();
    // Get the date for yesterday
    const yesterday = new Date(Date.now() - 86400000).toDateString();

    // Group the objects based on date
    let groupedData = requests.reduce((acc, obj) => {
        const dateKey = new Date(obj.id).toDateString();
        if (!acc[dateKey]) {
            acc[dateKey] = [];
        }
        acc[dateKey].push(obj);
        return acc;
    }, {});

    const handleDelete = async (id) => {
        await axios
            .delete(process.env.REACT_APP_API_URL + endpoint.collectionsRequest + `/${userId}/${id}`)
            .catch((error) => {
                console.error('Error while saving contents:', error);
            });
        let updatedRequests = [...requests];
        updatedRequests = updatedRequests.filter((tab) => tab.id !== id);
        setRequests(updatedRequests);
        const newTabs = tabs.filter((tab) => tab.id !== id);
        setTabs(newTabs);
        setValue(value - 1);
        setRequest(
            tabs[value - 1]?.request
                ? tabs[value - 1].request
                : {
                      method: 'GET',
                      proxy: 'No Proxy',
                      url: '',
                      body: { '': '' },
                      header: [],
                      queryParams: [],
                  },
        );
        setResponse(tabs[value - 1]?.response ? tabs[value - 1].response : {});
        setCurrentApi({
            id: tabs[value - 1]?.id ? tabs[value - 1].id : 0,
            name: tabs[value - 1]?.label ? tabs[value - 1].label : 'New Request',
            type: 'file',
            onSave: tabs[value - 1]?.onSave ? tabs[value - 1].onSave : false,
            parentFolderId: tabs[value - 1].parentFolderId,
        });
        setBreadCrumbs(tabs[value - 1]?.parentFolderNames ? tabs[value - 1].parentFolderNames : []);
        setOpen(false);
    };

    const handleDialog = async (parentFolderId, id) => {
        if (parentFolderId === 0) {
            setOpen(true);
            setId(id);
        } else {
            let updatedRequests = [...requests];
            updatedRequests = updatedRequests.filter((tab) => tab.id !== id);
            await axios
                .put(process.env.REACT_APP_API_URL + endpoint.collectionsRequest + `/${userId}/${id}`, {
                    isRecent: false,
                })
                .then(() => {
                    setRequests(updatedRequests);
                });
        }
    };

    return (
        <div>
            <h3 style={{ marginLeft: '10px' }} className={classes.heading1}>
                Recent Requests
            </h3>
            {groupedData[today] && (
                <div>
                    <p style={{ marginLeft: '10px' }} className={classes.heading}>
                        Today
                    </p>
                    {groupedData[today].map((obj, idx) => (
                        <File
                            key={obj.id}
                            id={obj.id}
                            name={obj.name}
                            reqMethod={obj.request.method}
                            reqUrl={obj.request.url}
                            onSelect={setSelected}
                            selected={selected}
                            handleDialog={() => handleDialog(obj.parentFolderId, obj.id)}
                        />
                    ))}
                </div>
            )}

            {groupedData[yesterday] && (
                <div>
                    <p style={{ marginLeft: '10px' }} className={classes.heading}>
                        Yesterday
                    </p>
                    {groupedData[yesterday]?.map((obj, idx) => (
                        <File
                            key={obj.id}
                            id={obj.id}
                            name={obj.name}
                            reqMethod={obj.request.method}
                            reqUrl={obj.request.url}
                            onSelect={setSelected}
                            selected={selected}
                            handleDialog={() => handleDialog(obj.parentFolderId, obj.id)}
                        />
                    ))}
                </div>
            )}

            {/* Render other dates */}
            {Object.keys(groupedData)
                .filter((date) => ![today, yesterday].includes(date)) // Exclude today and yesterday
                .map((date) => (
                    <div key={date}>
                        <p className={classes.heading} style={{ marginLeft: '10px' }}>
                            {date}
                        </p>
                        {groupedData[date].map((obj, idx) => (
                            <File
                                key={obj.id}
                                id={obj.id}
                                name={obj.name}
                                reqMethod={obj.request.method}
                                reqUrl={obj.request.url}
                                onSelect={setSelected}
                                selected={selected}
                                handleDialog={() => handleDialog(obj.parentFolderId, obj.id)}
                            />
                        ))}
                    </div>
                ))}
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle
                    style={{
                        color: 'red',
                        fontSize: '18px',
                        fontWeight: 500,
                    }}
                >
                    {'Unsaved Request'}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText
                        style={{
                            fontWeight: 500,
                            fontSize: '15px',
                        }}
                    >
                        Are you sure you want to delete? Request will not be saved.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button
                        variant="contained"
                        color="grey"
                        size="small"
                        style={{
                            margin: '2px',
                            padding: '5px 10px', // reduce the padding on the top and bottom
                            fontSize: '12px',
                            fontWeight: 600,
                            height: '31px',
                            backgroundColor: 'black',
                            color: 'white',
                            boxShadow: 'none',
                            '&:hover': {
                                backgroundColor: 'black',
                            },
                        }}
                        onClick={handleClose}
                    >
                        No
                    </Button>
                    <Button
                        variant="contained"
                        style={{
                            margin: '5px',
                            padding: '5px 10px', // reduce the padding on the top and bottom
                            fontSize: '12px',
                            fontWeight: 600,
                            height: '31px',
                            backgroundColor: '#C72C71',
                            color: 'white',
                            boxShadow: 'none',
                        }}
                        size="small"
                        onClick={() => handleDelete(id)}
                    >
                        Yes
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default RecentHistory;
