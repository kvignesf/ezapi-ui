import { Tabs, Tab, IconButton } from '@material-ui/core';
import { Close, Add } from '@material-ui/icons';
import { TabContext, TabPanel } from '@material-ui/lab';
import { useRecoilState, useSetRecoilState } from 'recoil';
import {
    currentApi,
    currentBreadCrumbs,
    currentTab,
    currentTabs,
    requestParams,
    responseInfo,
} from '../CollectionsAtom';
import ApiCall from './ApiCall/ApiCall';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import Typography from '@material-ui/core/Typography';
import { NavigateNext } from '@material-ui/icons';
import { makeStyles } from '@material-ui/core/styles';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { endpoint } from '../../shared/network/client';
import { getUserId } from '../../shared/storage';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
const useStyles = makeStyles((theme) => ({
    tabPanel: {
        margin: '-25px',
    },
    breadCrumbs: {
        margin: theme.spacing(2),
        marginLeft: theme.spacing(1),
    },
    root: {
        borderBottom: '3px solid #F0F0F0',
        marginTop: '-2px',
    },
    tab: {
        zIndex: '1',
        fontWeight: 'semibold',
        textTransform: 'none',
    },
    selectedTab: {
        backgroundColor: 'rgba(128, 128, 128, 0.2)',
        fontWeight: 600,
    },
    tabButton: {
        zIndex: '2',
    },
    closeButton: {
        zIndex: '2',
        marginRight: '6px',
    },
    modalButton: {
        margin: theme.spacing(1),
        padding: '5px 12px', // reduce the padding on the top and bottom
        fontSize: '12px',
        fontWeight: 600,
        height: '33px',
    },
}));
function CollectionTabs() {
    const userId = getUserId();
    const classes = useStyles();
    const [tabs, setTabs] = useRecoilState(currentTabs);
    const [index, setIndex] = useState();
    const [value, setValue] = useRecoilState(currentTab);
    const setRequest = useSetRecoilState(requestParams);
    const setResponse = useSetRecoilState(responseInfo);
    const setCurrentApi = useSetRecoilState(currentApi);
    const [breadCrumbs, setBreadCrumbs] = useRecoilState(currentBreadCrumbs);
    const [open, setOpen] = useState(false);

    const handleClickOpen = (index) => {
        setIndex(index);
        if (tabs[index].onSave === false) {
            setOpen(true);
        } else {
            handleDelete(index);
        }
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleChange = (event, newValue) => {
        setValue(newValue);
        setRequest(tabs[newValue].request);
        setResponse(tabs[newValue].response);
        setCurrentApi({
            id: tabs[newValue].id,
            name: tabs[newValue].label,
            type: 'file',
            onSave: tabs[newValue].onSave,
        });
        setBreadCrumbs(tabs[newValue].parentFolderNames);
    };
    const handleDelete = async (index) => {
        if (tabs[index]?.onSave === false) {
            await axios
                .delete(process.env.REACT_APP_API_URL + endpoint.collectionsRequest + `/${userId}/${tabs[index].id}`)
                .catch((error) => {
                    console.error('Error while saving contents:', error);
                });
        }
        const newTabs = tabs.filter((_, i) => i !== index);
        setTabs(newTabs);
        if (tabs.length > 0) {
            if (index === value - 1 || index <= value) {
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
                });
                setBreadCrumbs(tabs[value - 1]?.parentFolderNames ? tabs[value - 1].parentFolderNames : []);
            } else {
                setValue(value);
                setRequest(
                    tabs[value]?.request
                        ? tabs[value].request
                        : {
                              method: 'GET',
                              proxy: 'No Proxy',
                              url: '',
                              body: { '': '' },
                              header: [],
                              queryParams: [],
                          },
                );
                setResponse(tabs[value]?.response ? tabs[value].response : {});
                setCurrentApi({
                    id: tabs[value]?.id ? tabs[value].id : 0,
                    name: tabs[value]?.label ? tabs[value].label : 'New Request',
                    type: 'file',
                    onSave: tabs[value]?.onSave ? tabs[value].onSave : false,
                });
                setBreadCrumbs(tabs[value]?.parentFolderNames ? tabs[value].parentFolderNames : []);
            }
        } else {
            setValue();
            setRequest({
                method: 'GET',
                proxy: 'No Proxy',
                url: '',
                body: { '': '' },
                header: [],
                queryParams: [],
            });
            setResponse({});
            setCurrentApi({ id: 0, name: '', type: 'file', onSave: false });
            setBreadCrumbs([]);
        }

        setOpen(false);
    };

    const handleAdd = async () => {
        const newId = Date.now();
        const newTab = {
            id: newId,
            request: { method: 'GET', proxy: 'No Proxy', url: '', body: { '': '' }, header: [], queryParams: [] },
            response: {},
            parentFolderNames: [''],
            label: 'New Request',
            content: <ApiCall />,
            onSave: false,
            type: 'file',
        };
        setTabs([...tabs, newTab]);
        setValue(tabs.length);
        setRequest({ method: 'GET', proxy: 'No Proxy', url: '', body: { '': '' }, header: [], queryParams: [] });
        setResponse({});
        setCurrentApi({ id: newId, name: 'New Request', type: 'file', onSave: false });
        setBreadCrumbs([]);

        await axios.post(process.env.REACT_APP_API_URL + endpoint.collectionsRequest + `/${userId}/${newId}`, {
            name: 'New Request',
            request: {
                method: 'GET',
                proxy: 'No Proxy',
                url: '',
                body: {},
                header: [],
                queryParams: [],
            },
            response: { status: null, headers: {}, data: {}, time: 0, size: 0 },
            onSave: true,
        });
    };
    return (
        <div>
            <TabContext value={value}>
                <Tabs
                    value={value}
                    onChange={handleChange}
                    variant="scrollable"
                    scrollButtons="auto"
                    aria-label="scrollable"
                    className={classes.root}
                >
                    {tabs.map((tab, index) => (
                        <div key={index} className={`${value === index ? classes.selectedTab : ''}`}>
                            <Tab
                                label={tab.label}
                                value={index}
                                onClick={(e) => handleChange(e, index)}
                                className={`${classes.tab}`}
                            />

                            <IconButton
                                size="small"
                                onClick={() => handleClickOpen(index)}
                                className={classes.closeButton}
                            >
                                <Close fontSize="small" />
                            </IconButton>
                        </div>
                    ))}
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',

                            margin: '11px 7px',
                        }}
                    >
                        <IconButton size="small" onClick={handleAdd} className={classes.tabButton}>
                            <Add fontSize="small" />
                        </IconButton>
                    </div>
                </Tabs>
                <Breadcrumbs
                    separator={<NavigateNext fontSize="small" />}
                    aria-label="breadcrumb"
                    className={classes.breadCrumbs}
                >
                    {breadCrumbs && breadCrumbs.length > 0
                        ? breadCrumbs.map((item, index) => {
                              const isLast = index === breadCrumbs.length - 1;
                              return isLast ? (
                                  <Typography
                                      color="textPrimary"
                                      style={{ fontSize: '14px', fontWeight: 600 }}
                                      key={item}
                                  >
                                      {item}
                                  </Typography>
                              ) : (
                                  <Typography color="inherit" style={{ fontSize: '13px', fontWeight: 600 }} key={item}>
                                      {item}
                                  </Typography>
                              );
                          })
                        : null}
                </Breadcrumbs>
                {tabs.map((tab, index) => (
                    <TabPanel key={index} value={index} className={classes.tabPanel}>
                        <p>{tab.content}</p>
                    </TabPanel>
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
                            onClick={() => handleDelete(index)}
                        >
                            Yes
                        </Button>
                    </DialogActions>
                </Dialog>
            </TabContext>
        </div>
    );
}

export default CollectionTabs;
