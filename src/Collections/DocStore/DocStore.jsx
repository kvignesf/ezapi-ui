import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import { endpoint } from '../../shared/network/client';
import { getUserId } from '../../shared/storage';
import { makeStyles } from '@material-ui/core/styles';
import CreateNewFolderOutlinedIcon from '@material-ui/icons/CreateNewFolderOutlined';
import InsertDriveFileOutlinedIcon from '@material-ui/icons/InsertDriveFileOutlined';
import FolderIcon from '@material-ui/icons/Folder';
import FolderOpenIcon from '@material-ui/icons/FolderOpen';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import AppIcon from '../../shared/components/AppIcon';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useHistory } from 'react-router-dom';
import routes from '../../shared/routes';
import AddIcon from '@mui/icons-material/Add';
import { Button } from '@mui/material';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
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
    loadingState,
} from '../CollectionsAtom';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { Menu, MenuItem, styled } from '@material-ui/core';
import imageLogo from '../../static/images/logo/newconnectoLogo.svg';
import ApiCall from '../CollectionTabs/ApiCall/ApiCall';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import CloseIcon from '@mui/icons-material/Close';
import Typography from '@mui/material/Typography';

const useStyles = makeStyles((theme) => ({
    app: {
        height: '100vh',
        overflow: 'auto',
        '&::-webkit-scrollbar': {
            width: '5px',
            height: '0px',
        },
        '&::-webkit-scrollbar-track': {
            backgroundColor: '#f2f2f2',
            borderRadius: '10px',
        },
        '&::-webkit-scrollbar-thumb': {
            backgroundColor: '#c9c9c9',
            borderRadius: '10px',
        },
        '&::-webkit-scrollbar-thumb:hover': {
            backgroundColor: '#a6a6a6',
        },
    },
    root: {
        display: 'flex',
        alignItems: 'center',
        padding: '3px',
        cursor: 'pointer',
        minWidth: '12rem',
        justifyContent: 'space-between',
        '&:hover': {
            backgroundColor: theme.palette.action.hover,
        },
    },
    searchBar: {
        border: '1px solid #E6E7E5',
        borderRadius: '4px',
        outline: 'none',
        marginLeft: '5px',
        marginRight: '8px',
        background: 'transparent',
        width: '100%',
        height: '30px',
        padding: '5px 10px',
        boxSizing: 'border-box',
        color: '#000',
        fontSize: '13px',
        marginBottom: '10px',
        marginTop: '-8px',
    },
    folderIcon: {
        fontSize: '17px',
    },
    fileIcon: {
        fontSize: '17px',
    },
    deleteIcon: {
        fontSize: '17px',
    },
    folderOpenIcon: {
        fontSize: '17px',
    },
    fileName: {
        flexGrow: 1,
        fontWeight: 600,
        fontSize: '12px',
        marginLeft: '5px',
        whiteSpace: 'nowrap', // prevent wrapping of text
        overflow: 'hidden', // hide overflow text
        textOverflow: 'ellipsis', // add ellipsis when text overflows
    },
    renamingInputBox: {
        flexGrow: 1,
        fontSize: '13px',
        marginLeft: '5px',
        padding: '3px',
    },
    iconButton: {
        padding: '5px',
    },
    icons: {
        display: 'flex',
        width: '32%',
    },
    selectedFile: {
        display: 'flex',
        alignItems: 'center',
        padding: '2px',
        cursor: 'pointer',
        justifyContent: 'space-between',
        backgroundColor: 'rgba(128, 128, 128, 0.2)',
    },
    newfileClass: {
        display: 'flex',
        alignItems: 'center',
        padding: '2px',
        cursor: 'pointer',
        justifyContent: 'space-between',
        overflow: 'auto',
        width: '100vw',
        '&::-webkit-scrollbar': {
            width: '5px',
            height: '5px',
        },
        '&::-webkit-scrollbar-track': {
            backgroundColor: '#f2f2f2',
            borderRadius: '10px',
        },
        '&::-webkit-scrollbar-thumb': {
            backgroundColor: '#c9c9c9',
            borderRadius: '10px',
        },
        '&::-webkit-scrollbar-thumb:hover': {
            backgroundColor: '#a6a6a6',
        },
    },
}));

function Folder({ id, parentId, onDelete, selected, onSelect, onRename, name, isModal, saveModalOpen }) {
    const classes = useStyles();
    const [childComponents, setChildComponents] = useState([]);
    const [collapsed, setCollapsed] = useState(true);
    const [folderName, setFolderName] = useState(name);
    const [editing, setEditing] = useState(false); // Add editing state
    const userId = getUserId();
    const [anchorEl, setAnchorEl] = useState(null);
    const inputRef = useRef(null);
    const isMountedRef = useRef(true);
    const [loading, setLoading] = useRecoilState(loadingState);
    const handleOptionClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleOptionClose = () => {
        setAnchorEl(null);
    };
    const addFile = async () => {
        const parentId = id;
        const newId = Date.now();
        const newFile = (
            <File
                key={newId}
                id={newId}
                parentId={parentId}
                onDelete={deleteChild}
                selected={selected}
                onSelect={onSelect}
                onRename={onRename}
                editable={true}
                name="New Request"
            /> // Pass onSelect prop to child components
        );
        await axios.post(process.env.REACT_APP_API_URL + endpoint.collectionDirectory, {
            userId: userId,
            id: newId,
            name: 'New Request',
            type: 'File',
            parentFolderId: parentId,
        });

        axios.post(process.env.REACT_APP_API_URL + endpoint.collectionsRequest + `/${userId}/${newId}`, {
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
            parentFolderId: parentId,
        });
        setChildComponents([...childComponents, newFile]);
    };

    const addFolder = async () => {
        const newId = Date.now();
        const parentId = id;
        const newFolder = (
            <Folder
                key={newId}
                id={newId}
                parentId={parentId}
                onDelete={deleteChild}
                selected={selected}
                onSelect={onSelect}
                onRename={onRename}
                editable={true}
                name="New Folder"
            />
        );

        await axios.post(process.env.REACT_APP_API_URL + endpoint.collectionDirectory, {
            userId: userId,
            id: newId,
            name: 'New Folder',
            type: 'Folder',
            parentFolderId: parentId,
        });

        setChildComponents([...childComponents, newFolder]);
    };

    const toggleCollapsed = async (event) => {
        // Check if the click target is one of the icon buttons
        const isIconButton =
            event.target.tagName === 'BUTTON' || event.target.tagName === 'svg' || event.target.tagName === 'path';
        if (!isIconButton) {
            if (!collapsed === false) {
                const type = selected.type;
                if (type === 'folder') {
                    await axios
                        .get(process.env.REACT_APP_API_URL + endpoint.collectionDirectory + `/${userId}/${type}/${id}`)
                        .then((response) => {
                            const children = response['data'].data;
                            const childComponents = children.map((child) => {
                                if (child.type === 'File') {
                                    return (
                                        <File
                                            key={child.id}
                                            id={child.id}
                                            parentId={id}
                                            onDelete={deleteChild}
                                            selected={selected}
                                            onSelect={onSelect}
                                            name={child.name}
                                            onRename={onRename}
                                        />
                                    );
                                } else if (child.type === 'Folder') {
                                    return (
                                        <Folder
                                            key={child.id}
                                            id={child.id}
                                            parentId={id}
                                            onDelete={deleteChild}
                                            selected={selected}
                                            onSelect={onSelect}
                                            name={child.name}
                                            onRename={onRename}
                                        />
                                    );
                                }
                            });
                            setChildComponents(childComponents);
                        });
                }
                setCollapsed(false);
            } else {
                setCollapsed(!collapsed);
            }
        }
    };

    const deleteChild = (childId) => {
        const newChildComponents = childComponents.filter((child) => child.props.id !== childId);
        setChildComponents(newChildComponents);
        onDelete(childId);
    };

    const handleDelete = async () => {
        setLoading(true);
        handleOptionClose();
        deleteChild(id);
    };
    useEffect(() => {
        if (loading === false) {
            const handleSelect = async () => {
                const type = selected.type;
                if (loading === false) {
                    await axios
                        .get(process.env.REACT_APP_API_URL + endpoint.collectionDirectory + `/${userId}/${type}/${id}`)
                        .then((response) => {
                            const children = response['data'].data;
                            const childComponents = children.map((child) => {
                                if (child.type === 'File') {
                                    return (
                                        <File
                                            key={child.id}
                                            id={child.id}
                                            parentId={id}
                                            onDelete={deleteChild}
                                            selected={selected}
                                            onSelect={onSelect}
                                            name={child.name}
                                            onRename={onRename}
                                        />
                                    );
                                } else if (child.type === 'Folder') {
                                    return (
                                        <Folder
                                            key={child.id}
                                            id={child.id}
                                            parentId={id}
                                            onDelete={deleteChild}
                                            selected={selected}
                                            onSelect={onSelect}
                                            name={child.name}
                                            onRename={onRename}
                                        />
                                    );
                                }
                            });
                            setChildComponents(childComponents);
                        });
                }
            };
            handleSelect();
        }
    }, [userId, isModal, setChildComponents, selected, saveModalOpen, loading]);

    const handleSelect = async (event) => {
        event.stopPropagation();
        onSelect({ type: 'folder', id: id });
    };

    const handleRename = (event) => {
        event.stopPropagation();
        setEditing(true); // Set editing state to true
        handleOptionClose();
    };

    const handleInputChange = (event) => {
        event.stopPropagation();
        setFolderName(event.target.value); // Update folderName state with input value
    };

    const handleInputKeyPress = (event) => {
        if (event.key === 'Enter') {
            // Check if Enter key is pressed
            handleInputBlur(); // Call handleInputBlur to update folder name
            setEditing(false);
        }
    };

    const handleInputBlur = async () => {
        if (folderName) {
            await onRename(id, folderName);
            const folderData = {
                name: folderName,
            };

            await axios.put(
                process.env.REACT_APP_API_URL + `${endpoint.collectionDirectory}/${userId}/${id}`,
                folderData,
            );
        } else {
            setFolderName(name);
        }
    };
    const downloadJson = (data, filename) => {
        const jsonContent = JSON.stringify(data);
        const element = document.createElement('a');
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(jsonContent));
        element.setAttribute('download', filename);
        element.style.display = 'none';
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    };
    const handleExport = async () => {
        await axios
            .get(process.env.REACT_APP_API_URL + `${endpoint.collectionDirectory}/${userId}/${id}`)
            .then((response) => {
                console.log(response['data'].exportData);
                downloadJson(response['data'].exportData, `conektto_collection_${name}.json`);
            });

        handleOptionClose();
    };
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (inputRef.current && !inputRef.current.contains(event.target)) {
                if (isMountedRef.current) {
                    setEditing(false);
                }
            }
        };
        document.addEventListener('click', handleClickOutside);

        return () => {
            document.removeEventListener('click', handleClickOutside);
            isMountedRef.current = false;
        };
    }, []);

    const fileClass = id === selected.id ? classes.selectedFile : classes.root;

    return (
        <div onClick={isModal === false && saveModalOpen === true ? null : handleSelect} ref={inputRef}>
            <div onClick={saveModalOpen === true ? null : handleSelect} className={fileClass} ref={inputRef}>
                <div className={classes.newfileClass} onClick={editing === false ? toggleCollapsed : null}>
                    {collapsed === true && (editing === true || editing === false) ? (
                        <FolderIcon className={classes.folderIcon} />
                    ) : (
                        <FolderOpenIcon className={classes.folderOpenIcon} />
                    )}
                    {editing === true ? (
                        <input
                            className={classes.renamingInputBox}
                            type="text"
                            value={folderName}
                            onChange={handleInputChange}
                            onBlur={handleInputBlur}
                            onKeyPress={handleInputKeyPress} // Add onKeyPress event
                        />
                    ) : (
                        <span className={classes.fileName}>{folderName}</span>
                    )}
                </div>

                {isModal === false ? (
                    <div className={classes.icons}>
                        {' '}
                        <Tooltip title="Add File">
                            <IconButton className={classes.iconButton} onClick={addFile}>
                                <InsertDriveFileOutlinedIcon className={classes.fileIcon} />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Add Folder">
                            <IconButton className={classes.iconButton} onClick={addFolder}>
                                <CreateNewFolderOutlinedIcon className={classes.folderIcon} />
                            </IconButton>
                        </Tooltip>
                        <>
                            <Tooltip title="Options">
                                <IconButton className={classes.iconButton} onClick={handleOptionClick}>
                                    <MoreVertIcon fontSize="small" />
                                </IconButton>
                            </Tooltip>
                            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleOptionClose}>
                                <MenuItem onClick={handleRename} style={{ fontSize: '14px', fontWeight: 500 }}>
                                    Rename
                                </MenuItem>
                                {parentId === 0 ? (
                                    <MenuItem onClick={handleExport} style={{ fontSize: '14px', fontWeight: 500 }}>
                                        Export
                                    </MenuItem>
                                ) : null}
                                <MenuItem
                                    style={{ color: 'red', fontSize: '14px', fontWeight: 500 }}
                                    onClick={handleDelete}
                                >
                                    Delete
                                </MenuItem>
                            </Menu>
                        </>
                    </div>
                ) : (
                    <div className={classes.icons}>
                        <Tooltip title="Add Folder">
                            <IconButton className={classes.iconButton} onClick={addFolder}>
                                <CreateNewFolderOutlinedIcon className={classes.folderIcon} />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Rename">
                            <IconButton className={classes.iconButton} onClick={handleRename}>
                                <EditIcon fontSize="small" />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                            <IconButton className={classes.iconButton} onClick={handleDelete}>
                                <DeleteIcon style={{ color: 'crimson' }} fontSize="small" />
                            </IconButton>
                        </Tooltip>
                    </div>
                )}
            </div>
            {collapsed === true && (editing === true || editing === false) ? null : (
                <div style={{ paddingLeft: '20px' }}>
                    {childComponents.map((component) => (
                        <div key={component.props.id}>
                            {React.cloneElement(component, {
                                onDelete: deleteChild,
                                onSelect: onSelect,
                                selected: selected,
                                onRename: onRename,
                                isModal: isModal,
                                saveModalOpen: saveModalOpen,
                            })}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

function File({ id, parentId, onDelete, onSelect, selected, onRename, name, isModal, saveModalOpen }) {
    const classes = useStyles();
    const [fileName, setFileName] = useState(name);
    const [editing, setEditing] = useState(false); // Add editing state
    const userId = getUserId();
    const [anchorEl, setAnchorEl] = useState(null);
    const inputRef = useRef(null);
    const isMountedRef = useRef(true);
    let [tabs, setTabs] = useRecoilState(currentTabs);
    const [currenttab, setCurrentTab] = useRecoilState(currentTab);
    const setRequest = useSetRecoilState(requestParams);
    const setResponse = useSetRecoilState(responseInfo);
    const [api, setCurrentApi] = useRecoilState(currentApi);
    const setBreadCrumbs = useSetRecoilState(currentBreadCrumbs);
    const setLoading = useSetRecoilState(loadingState);

    const handleOptionClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleOptionClose = () => {
        setAnchorEl(null);
    };
    const handleDelete = async () => {
        setLoading(true);
        onDelete(id);
        const index = tabs.findIndex((child) => child.id === id);
        tabs = tabs.filter((child) => child.id !== id);
        setTabs(tabs);

        if (tabs.length > 0 && index !== -1) {
            if (index === currenttab - 1 || index <= currenttab) {
                setCurrentTab(currenttab - 1);

                setRequest(
                    tabs[currenttab - 1]?.request
                        ? tabs[currenttab - 1].request
                        : {
                              method: 'GET',
                              proxy: 'No Proxy',
                              url: '',
                              body: { '': '' },
                              header: [],
                              queryParams: [],
                          },
                );
                setResponse(tabs[currenttab - 1]?.response ? tabs[currenttab - 1].response : {});
                setCurrentApi({
                    id: tabs[currenttab - 1]?.id ? tabs[currenttab - 1].id : 0,
                    name: tabs[currenttab - 1]?.label ? tabs[currenttab - 1].label : 'New Request',
                    type: 'file',
                    onSave: tabs[currenttab - 1]?.onSave ? tabs[currenttab - 1].onSave : false,
                });
                setBreadCrumbs(tabs[currenttab - 1]?.parentFolderNames ? tabs[currenttab - 1].parentFolderNames : []);
            } else {
                setCurrentTab(currenttab);
                setRequest(
                    tabs[currenttab]?.request
                        ? tabs[currenttab].request
                        : {
                              method: 'GET',
                              proxy: 'No Proxy',
                              url: '',
                              body: { '': '' },
                              header: [],
                              queryParams: [],
                          },
                );
                setResponse(tabs[currenttab]?.response ? tabs[currenttab].response : {});
                setCurrentApi({
                    id: tabs[currenttab]?.id ? tabs[currenttab].id : 0,
                    name: tabs[currenttab]?.label ? tabs[currenttab].label : 'New Request',
                    type: 'file',
                    onSave: tabs[currenttab]?.onSave ? tabs[currenttab].onSave : false,
                });
                setBreadCrumbs(tabs[currenttab]?.parentFolderNames ? tabs[currenttab].parentFolderNames : []);
            }
        } else if (tabs.length === 0) {
            setCurrentTab();
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

        await axios
            .delete(process.env.REACT_APP_API_URL + `${endpoint.collectionsRequest}/${userId}/${id}`)
            .then((res) => {
                setLoading(false);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const handleSelect = async (event) => {
        event.stopPropagation();
        onSelect({ type: 'file', id: id });
        if (editing === false) {
            const isTabExists = tabs.some((tab) => tab.id === id);
            let index = tabs.findIndex((tab) => tab.id === id);
            if (isTabExists) {
                setCurrentTab(index);
                setRequest(tabs[index].request);
                setResponse(tabs[index].response);
                setCurrentApi({
                    id: tabs[index].id,
                    name: tabs[index].label,
                    onSave: tabs[index].onSave,
                    type: tabs[index].type,
                });
                setBreadCrumbs(tabs[index].parentFolderNames);
                return [...tabs];
            } else {
                const type = 'file';
                let parentFolderNames;

                await axios
                    .get(process.env.REACT_APP_API_URL + endpoint.collectionDirectory + `/${userId}/${type}/${id}`)
                    .then((response) => {
                        parentFolderNames = response['data'].result;
                        parentFolderNames = parentFolderNames.reverse();
                    })
                    .catch((err) => {
                        console.log(err);
                    });
                await axios
                    .get(process.env.REACT_APP_API_URL + `${endpoint.collectionsRequest}/${userId}/${id}`)
                    .then(async (response) => {
                        const data = response.data;
                        setTabs((prev) => {
                            return [
                                ...prev,
                                {
                                    id: data.id,
                                    parentFolderNames: parentFolderNames,
                                    request: data.request,
                                    response: data.response,
                                    label: data.name,
                                    onSave: data.onSave,
                                    type: 'file',
                                    content: <ApiCall />,
                                },
                            ];
                        });

                        setCurrentTab(tabs.length);
                        setRequest(data.request);
                        setResponse(data.response);
                        setCurrentApi({ id: data.id, name: data.name, onSave: data.onSave, type: 'file' });
                        setBreadCrumbs(parentFolderNames);
                    })
                    .catch((error) => {
                        console.error('Error:', error);
                    });
            }
        }
    };
    const handleRename = (event) => {
        event.stopPropagation();
        setEditing(true); // Set editing state to true
        handleOptionClose();
    };

    const handleInputChange = (event) => {
        event.stopPropagation();
        setFileName(event.target.value); // Update folderName state with input value
    };

    const handleInputKeyPress = (event) => {
        if (event.key === 'Enter') {
            // Check if Enter key is pressed
            handleInputBlur(); // Call handleInputBlur to update folder name
            setEditing(false);
        }
    };

    const handleInputBlur = async (event) => {
        if (fileName) {
            let parentFolderNames;
            await onRename(id, fileName);
            const fileData = {
                name: fileName,
            };

            await axios
                .put(process.env.REACT_APP_API_URL + `${endpoint.collectionDirectory}/${userId}/${id}`, fileData)
                .catch((error) => {
                    console.error('Error:', error);
                });

            await axios
                .put(process.env.REACT_APP_API_URL + `${endpoint.collectionsRequest}/${userId}/${id}`, fileData)
                .catch((error) => {
                    console.error('Error:', error);
                });

            await axios
                .get(process.env.REACT_APP_API_URL + endpoint.collectionDirectory + `/${userId}/${'file'}/${id}`)
                .then((response) => {
                    parentFolderNames = response['data'].result;
                    parentFolderNames = parentFolderNames.reverse();
                })
                .catch((err) => {
                    console.log(err);
                });
            setTabs((prev) => {
                const isTabExists = prev.some((tab) => tab.id === id);
                if (isTabExists) {
                    // If the tab already exists, update the existing tab with new data
                    return prev.map((tab) => {
                        if (tab.id === id) {
                            return {
                                ...tab,
                                parentFolderNames: parentFolderNames,
                                label: fileName,
                            };
                        }
                        return tab;
                    });
                } else {
                    return [...prev];
                }
            });
            if (selected.id === api.id)
                setBreadCrumbs((prev) => {
                    const newArray = [...prev];
                    if (newArray.length > 0) {
                        newArray[newArray.length - 1] = fileName;
                    }
                    return newArray;
                });
        } else {
            setFileName(name);
        }
    };
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (inputRef.current && !inputRef.current.contains(event.target)) {
                if (isMountedRef.current) {
                    setEditing(false);
                }
            }
        };

        document.addEventListener('click', handleClickOutside);

        return () => {
            document.removeEventListener('click', handleClickOutside);
            isMountedRef.current = false;
        };
    }, []);

    const fileClass = id === selected.id ? classes.selectedFile : classes.root;
    return (
        <div className={fileClass}>
            <div onClick={saveModalOpen === true ? null : handleSelect} className={classes.newfileClass} ref={inputRef}>
                <InsertDriveFileOutlinedIcon className={classes.fileIcon} />
                {editing === true ? (
                    <input
                        className={classes.renamingInputBox}
                        type="text"
                        value={fileName}
                        onChange={handleInputChange}
                        onBlur={handleInputBlur}
                        onKeyPress={handleInputKeyPress} // Add onKeyPress event
                    />
                ) : (
                    <span className={classes.fileName}>{fileName}</span>
                )}
            </div>
            {saveModalOpen === true ? null : (
                <>
                    <Tooltip title="Options">
                        <IconButton className={classes.iconButton} onClick={handleOptionClick}>
                            <MoreVertIcon fontSize="small" />
                        </IconButton>
                    </Tooltip>
                    <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleOptionClose}>
                        <MenuItem onClick={handleRename} style={{ fontSize: '14px', fontWeight: 500 }}>
                            Rename
                        </MenuItem>
                        <MenuItem style={{ color: 'red', fontSize: '14px', fontWeight: 500 }} onClick={handleDelete}>
                            Delete
                        </MenuItem>
                    </Menu>
                </>
            )}
        </div>
    );
}

export default function DocStore({ isModal }) {
    const history = useHistory();
    const navigateBack = () => {
        history.replace({
            pathname: routes.projects,
            state: { allow: true },
        });
    };
    const classes = useStyles();
    let [folders, setFolders] = useState([]);
    let [requests, setRequests] = useState([]);
    const [fileName, setFileName] = useRecoilState(requestName);
    const [searchQuery, setSearchQuery] = useState('');
    let [filteredFiles, setFilteredFiles] = useState([]);
    const [selected, setSelected] = useRecoilState(selectedType); // Add selected state variable
    const saveModalOpen = useRecoilValue(isSaveModalOpen);
    const [values, setValues] = useState([]);
    const [loading, setLoading] = useRecoilState(loadingState);
    const userId = getUserId();

    const addFolder = async () => {
        const newId = Date.now();
        const newFolder = (
            <Folder
                key={newId}
                id={newId}
                parentId={0}
                onDelete={handleDelete}
                selected={selected}
                onSelect={setSelected}
                onRename={handleRename}
                editable={true}
                name="New Collection"
            /> // Pass onSelect prop to child components
        );
        await axios
            .post(process.env.REACT_APP_API_URL + endpoint.collectionDirectory, {
                userId: userId,
                id: newId,
                name: 'New Collection',
                type: 'Collection',
                parentFolderId: 0,
            })
            .catch((error) => {
                // Handle error
                console.error('Error:', error);
            });
        setFolders([...folders, newFolder]);
    };

    const deleteChild = (childId) => {
        folders = folders.filter((child) => child.props.id !== childId);
        setFolders(folders);
        if (searchQuery.length > 0) {
            requests = requests.filter((child) => child.props.id !== childId);
            setRequests(requests);
            filteredFiles = filteredFiles.filter((child) => child.props.id !== childId);
            setFilteredFiles(filteredFiles);
        }
    };

    const handleDelete = async (componentId) => {
        setLoading(true);
        deleteChild(componentId);
        setSelected({
            type: '',
            id: '',
        }); // Clear selected if the selected component is deleted
        await axios
            .delete(process.env.REACT_APP_API_URL + `${endpoint.collectionDirectory}/${userId}/${componentId}`)
            .then(() => {
                setLoading(false);
            });
    };
    const handleRename = (id, newName) => {
        const updatedFolders = [...folders];
        const folderIndex = updatedFolders.findIndex((folder) => folder.props.id === id);
        if (folderIndex !== -1) {
            updatedFolders[folderIndex] = React.cloneElement(updatedFolders[folderIndex], {
                id: id,
                parentId: updatedFolders[folderIndex].props.parentId,
                selected: updatedFolders[folderIndex].props.selected,
                onSelect: updatedFolders[folderIndex].props.onSelect,
                onRename: updatedFolders[folderIndex].props.onRename,
                name: newName,
            });
            setFolders(updatedFolders);
        }
    };

    useEffect(() => {
        const getFilesAndFolders = async () => {
            await axios
                .get(process.env.REACT_APP_API_URL + endpoint.collectionDirectory + `/${userId}`)
                .then((response) => {
                    const parentFolders = response['data'].data.map((data) => (
                        <Folder key={data.id} id={data.id} parentId={0} name={data.name} /> // Pass onSelect prop to child components
                    ));

                    setFolders(parentFolders);
                })
                .catch((error) => {
                    console.error(error);
                });
            await axios
                .get(process.env.REACT_APP_API_URL + endpoint.collectionDirectory + `/${userId}`)
                .then((response) => {
                    const requests = response['data'].files.map((data) => (
                        <File key={data.id} id={data.id} parentId={0} name={data.name} /> // Pass onSelect prop to child components
                    ));
                    setRequests(requests);
                })
                .catch((error) => {
                    console.error(error);
                });
        };
        getFilesAndFolders();
    }, [userId, loading]);

    const handleSearchChange = (event) => {
        const query = event.target.value;
        setSearchQuery(query);

        // Filter the data based on the search query
        const filtered = requests.filter((item) => item.props.name.toLowerCase().includes(query.toLowerCase()));
        setFilteredFiles(filtered);
    };

    //Import Dialog box components
    const [open, setOpen] = useState(false);
    const [postOpen, setPostOpen] = useState(false);
    const [connectOpen, setConnectOpen] = useState(false);
    const [file, setFile] = useState({});

    const handleClickOpen = () => {
        setConnectOpen(false);
        setPostOpen(false);
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };

    const handlePostOpen = () => {
        setPostOpen(!postOpen);
    };

    const hanldePostFile = (event) => {
        if (file) {
            const reader = new FileReader();
            reader.onload = async (e) => {
                const contents = e.target.result;
                const jsonData = JSON.parse(contents);

                // Extract the name from the "info" object
                const collectionName = jsonData?.info?.name ? jsonData.info.name : 'New Collection';

                // Assign the extracted name to the top-level "name" property
                jsonData.name = collectionName;
                // Remove unnecessary properties from the "info" object
                delete jsonData.info;
                // Modify the root-level property name from "item" to "items"
                jsonData.items = jsonData.item;
                delete jsonData.item;

                // Modify the property names to match the required structure recursively
                function modifyRequests(item) {
                    delete item.response;
                    if (item.request) {
                        if (item.name === item.request?.raw) {
                            item.name = 'New Request';
                        }
                        const request = item.request;
                        const url = request?.url;

                        // Retain only the "raw" URL and remove "host" and "path" details
                        request.url = url?.raw;
                        delete url?.host;
                        delete url?.path;
                    }
                    if (item.item) {
                        // Change the property name from "item" to "items"
                        item.items = item.item;
                        delete item.item;
                    }

                    if (item.items && item.items.length > 0) {
                        item.items.forEach(modifyRequests);
                    }
                }

                jsonData.items.forEach(modifyRequests);
                setLoading(true);
                await axios
                    .post(process.env.REACT_APP_API_URL + endpoint.collectionDirectory + '/upload', {
                        jsonData,
                        userId,
                    })
                    .catch((error) => {
                        console.error('Error uploading file:', error);
                        // Handle the error if needed
                    });
                setLoading(false);
            };
            reader.readAsText(file);
        }
        setOpen(false);
        setFile({});
    };

    const hanldeConnectFile = (event) => {
        if (file) {
            const reader = new FileReader();
            reader.onload = async (e) => {
                const contents = e.target.result;
                const jsonData = JSON.parse(contents);
                setLoading(true);
                await axios
                    .post(process.env.REACT_APP_API_URL + endpoint.collectionDirectory + '/upload', {
                        jsonData,
                        userId,
                    })
                    .catch((error) => {
                        console.error('Error uploading file:', error);
                        // Handle the error if needed
                    });
                setLoading(false);
            };
            reader.readAsText(file);
        }

        setOpen(false);
        setFile({});
    };

    const handleConnectOpen = () => {
        setConnectOpen(!connectOpen);
    };

    const handleExport = () => {
        setOpen(false);
    };

    const handleChange = (event) => {
        if (event.target.files[0]) {
            const file = event.target.files[0];
            setFile(file);
        }
    };

    return (
        <div className={classes.app}>
            {isModal === false ? (
                <div className="flex flex-row py-2 justify-between m-2 items-center">
                    <div className="flex flex-row justify-between  items-center">
                        <AppIcon
                            style={{ marginRight: '1rem', color: 'black' }}
                            onClick={() => {
                                navigateBack();
                            }}
                        >
                            <ArrowBackIcon />
                        </AppIcon>
                        <div className="w-full flex flex-row">
                            <img
                                src={imageLogo}
                                alt="conektto logo"
                                className="p-1"
                                style={{ maxWidth: '128px', maxHeight: '40px' }}
                            />
                        </div>
                    </div>

                    <div>
                        <label
                            for="specs"
                            className="bg-black
            opacity-90  rounded px-2 py-1 text-white text-smallLabel cursor-pointer"
                            onClick={handleClickOpen}
                        >
                            Import
                        </label>
                        <BootstrapDialog onClose={handleClose} aria-labelledby="customized-dialog-title" open={open}>
                            <BootstrapDialogTitle id="customized-dialog-title" onClose={handleClose}>
                                Import
                            </BootstrapDialogTitle>
                            <DialogContent dividers>
                                {!connectOpen ? (
                                    <Typography
                                        gutterBottom
                                        sx={{
                                            margin: '15px',
                                            padding: '5px',
                                            display: !postOpen ? 'hidden' : 'none',
                                        }}
                                    >
                                        <Button
                                            variant="outlined"
                                            style={{
                                                color: '#C72C71',
                                                borderColor: '#C72C71',
                                            }}
                                            onClick={handleConnectOpen}
                                        >
                                            Import from Conektto
                                        </Button>
                                    </Typography>
                                ) : (
                                    <Typography>
                                        <input onChange={handleChange} type="file" placeholder="select a file" />
                                        <Button
                                            variant="outlined"
                                            style={{
                                                color: '#C72C71',
                                                borderColor: '#C72C71',
                                            }}
                                            onClick={hanldeConnectFile}
                                        >
                                            Import
                                        </Button>
                                    </Typography>
                                )}
                                {!postOpen ? (
                                    <Typography
                                        gutterBottom
                                        sx={{
                                            margin: '15px',
                                            padding: '5px',
                                            display: !connectOpen ? 'hidden' : 'none',
                                        }}
                                    >
                                        <Button
                                            variant="outlined"
                                            style={{
                                                color: '#C72C71',
                                                borderColor: '#C72C71',
                                            }}
                                            onClick={handlePostOpen}
                                        >
                                            Import from PostMan
                                        </Button>
                                    </Typography>
                                ) : (
                                    <Typography>
                                        <input type="file" placeholder="select a file" onChange={handleChange} />
                                        <Button
                                            variant="outlined"
                                            style={{
                                                color: '#C72C71',
                                                borderColor: '#C72C71',
                                            }}
                                            onClick={hanldePostFile}
                                        >
                                            Import
                                        </Button>
                                    </Typography>
                                )}
                            </DialogContent>
                        </BootstrapDialog>
                    </div>
                </div>
            ) : null}

            <div className="flex flex-row  justify-between mb-2 items-center border-b-1 border-gray-200">
                <Button
                    variant="outlined"
                    startIcon={<AddIcon fontSize="small" sx={{ marginRight: '-6px', marginLeft: '-10px' }} />}
                    sx={{ textTransform: 'none' }}
                    onClick={addFolder}
                    style={{
                        marginBottom: '10px',
                        background: 'transparent',
                        color: 'black',
                        height: '30px',
                        border: '1px solid #E6E7E5',
                        fontSize: '13px',
                        display: 'flex',
                        justifyContent: 'flex-start',
                        alignItems: 'center',
                        marginTop: isModal ? '0px' : '-8px',
                        marginLeft: '5px',
                    }}
                >
                    New
                </Button>
                {isModal === false ? (
                    <input
                        type="text"
                        placeholder="Search Request"
                        className={classes.searchBar}
                        value={searchQuery}
                        onChange={handleSearchChange}
                    />
                ) : (
                    <input
                        type="text"
                        placeholder="Enter the Request Name"
                        style={{
                            marginTop: isModal ? '0px' : '-8px',
                        }}
                        className={classes.searchBar}
                        value={fileName}
                        onChange={(e) => setFileName(e.target.value)}
                    />
                )}
            </div>

            {searchQuery.length > 0
                ? filteredFiles.map((request) => (
                      <div key={request.props.id}>
                          {React.cloneElement(request, {
                              onDelete: handleDelete,
                              onSelect: setSelected,
                              selected: selected,
                              onRename: handleRename,
                          })}
                      </div>
                  ))
                : folders.map((folder) => (
                      <div key={folder.props.id}>
                          {React.cloneElement(folder, {
                              onDelete: handleDelete,
                              onSelect: setSelected,
                              selected: selected,
                              onRename: handleRename,
                              parentId: 0,
                              isModal: isModal,
                              saveModalOpen: saveModalOpen,
                          })}
                      </div>
                  ))}
        </div>
    );
}

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialogContent-root': {
        padding: theme.spacing(2),
    },
    '& .MuiDialogActions-root': {
        padding: theme.spacing(1),
    },
}));

function BootstrapDialogTitle(props) {
    const { children, onClose, ...other } = props;

    return (
        <DialogTitle {...other}>
            {children}
            {onClose ? (
                <IconButton
                    aria-label="close"
                    onClick={onClose}
                    style={{
                        position: 'absolute',
                        right: 8,
                        top: 8,
                        color: (theme) => theme.palette.grey[500],
                    }}
                >
                    <CloseIcon />
                </IconButton>
            ) : null}
        </DialogTitle>
    );
}
