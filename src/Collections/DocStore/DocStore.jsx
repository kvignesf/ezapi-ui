import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { endpoint } from "../../shared/network/client";
import { getUserId } from "../../shared/storage";
import { makeStyles } from "@material-ui/core/styles";
import CreateNewFolderOutlinedIcon from "@material-ui/icons/CreateNewFolderOutlined";
import InsertDriveFileOutlinedIcon from "@material-ui/icons/InsertDriveFileOutlined";
import FolderIcon from "@material-ui/icons/Folder";
import FolderOpenIcon from "@material-ui/icons/FolderOpen";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import AppIcon from "../../shared/components/AppIcon";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import { useHistory } from "react-router-dom";
import routes from "../../shared/routes";
import AddIcon from "@mui/icons-material/Add";
import { Button } from "@mui/material";
import { useRecoilState, useSetRecoilState } from "recoil";
import {
  currentApi,
  currentBreadCrumbs,
  currentCrumbs,
  currentTab,
  currentTabs,
  requestParams,
  responseInfo,
  selectedType,
} from "../CollectionsAtom";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { Menu, MenuItem } from "@material-ui/core";
import imageLogo from "../../static/images/logo/newconnectoLogo.svg";
import ApiCall from "../CollectionTabs/ApiCall/ApiCall";
const useStyles = makeStyles((theme) => ({
  app: {
    height: "100vh",
    overflow: "auto",
    "&::-webkit-scrollbar": {
      width: "5px",
      height: "8px",
    },
    "&::-webkit-scrollbar-track": {
      backgroundColor: "#f2f2f2",
      borderRadius: "10px",
    },
    "&::-webkit-scrollbar-thumb": {
      backgroundColor: "#c9c9c9",
      borderRadius: "10px",
    },
    "&::-webkit-scrollbar-thumb:hover": {
      backgroundColor: "#a6a6a6",
    },
  },
  root: {
    display: "flex",
    alignItems: "center",
    padding: "3px",
    cursor: "pointer",
    minWidth: "12rem",
    justifyContent: "space-between",
    "&:hover": {
      backgroundColor: theme.palette.action.hover,
    },
  },
  searchBar: {
    border: "1px solid #E6E7E5",
    borderRadius: "4px",
    outline: "none",
    marginLeft: "5px",
    marginRight: "8px",
    background: "transparent",
    width: "100%",
    height: "30px",
    padding: "5px 10px",
    boxSizing: "border-box",
    color: "#000",
    fontSize: "13px",
    marginBottom: "10px",
    marginTop: "-8px",
  },
  folderIcon: {
    fontSize: "17px",
  },
  fileIcon: {
    fontSize: "17px",
  },
  deleteIcon: {
    fontSize: "17px",
  },
  folderOpenIcon: {
    fontSize: "17px",
  },
  fileName: {
    flexGrow: 1,
    fontWeight: "bold",
    fontSize: "13px",
    marginLeft: "5px",
    whiteSpace: "nowrap", // prevent wrapping of text
    overflow: "hidden", // hide overflow text
    textOverflow: "ellipsis", // add ellipsis when text overflows
  },
  renamingInputBox: {
    flexGrow: 1,
    fontSize: "13px",
    marginLeft: "5px",
    padding: "3px",
  },
  iconButton: {
    padding: "5px",
  },
  selectedFile: {
    display: "flex",
    alignItems: "center",
    padding: "2px",
    cursor: "pointer",
    justifyContent: "space-between",
    backgroundColor: "rgba(128, 128, 128, 0.2)",
    overflow: "auto",
    "&::-webkit-scrollbar": {
      width: "5px",
      height: "5px",
    },
    "&::-webkit-scrollbar-track": {
      backgroundColor: "#f2f2f2",
      borderRadius: "10px",
    },
    "&::-webkit-scrollbar-thumb": {
      backgroundColor: "#c9c9c9",
      borderRadius: "10px",
    },
    "&::-webkit-scrollbar-thumb:hover": {
      backgroundColor: "#a6a6a6",
    },
  },
  newfileClass: {
    display: "flex",
    alignItems: "center",
    padding: "2px",
    cursor: "pointer",
    justifyContent: "space-between",
    overflow: "auto",
    "&::-webkit-scrollbar": {
      width: "5px",
      height: "5px",
    },
    "&::-webkit-scrollbar-track": {
      backgroundColor: "#f2f2f2",
      borderRadius: "10px",
    },
    "&::-webkit-scrollbar-thumb": {
      backgroundColor: "#c9c9c9",
      borderRadius: "10px",
    },
    "&::-webkit-scrollbar-thumb:hover": {
      backgroundColor: "#a6a6a6",
    },
  },
}));

function Folder({ id, parentId, onDelete, selectedId, onSelect, onRename, name }) {
  const classes = useStyles();
  const [childComponents, setChildComponents] = useState([]);
  const [collapsed, setCollapsed] = useState(true);
  const [folderName, setFolderName] = useState(name);
  const [editing, setEditing] = useState(false); // Add editing state
  const userId = getUserId();
  const [anchorEl, setAnchorEl] = useState(null);
  const inputRef = useRef(null);
  const isMountedRef = useRef(true);
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
        selectedId={selectedId}
        onSelect={onSelect}
        onRename={onRename}
        editable={true}
        name="New Request"
      /> // Pass onSelect prop to child components
    );
    await axios.post(process.env.REACT_APP_API_URL + endpoint.collectionDirectory, {
      userId: userId,
      id: newId,
      name: "New Request",
      type: "File",
      parentFolderId: parentId,
    });

    axios.post(process.env.REACT_APP_API_URL + endpoint.collectionsRequest + `/${userId}/${newId}`, {
      name: "New Request",
      request: {
        method: "GET",
        proxy: "No Proxy",
        url: "",
        body: {},
        header: [],
        queryParams: [],
      },
      response: { status: null, headers: {}, data: {}, time: 0, size: 0 },
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
        selectedId={selectedId}
        onSelect={onSelect}
        onRename={onRename}
        editable={true}
        name="New Folder"
      />
    );

    await axios.post(process.env.REACT_APP_API_URL + endpoint.collectionDirectory, {
      userId: userId,
      id: newId,
      name: "New Folder",
      type: "Folder",
      parentFolderId: parentId,
    });

    setChildComponents([...childComponents, newFolder]);
  };

  const toggleCollapsed = (event) => {
    // Check if the click target is one of the icon buttons
    const isIconButton =
      event.target.tagName === "BUTTON" || event.target.tagName === "svg" || event.target.tagName === "path";
    if (!isIconButton) {
      setCollapsed(!collapsed);
    }
  };

  const deleteChild = (childId) => {
    const newChildComponents = childComponents.filter((child) => child.props.id !== childId);
    setChildComponents(newChildComponents);
    onDelete(childId);
  };

  const handleDelete = async () => {
    setAnchorEl(null);
    deleteChild(id);
  };

  const handleSelect = async (event) => {
    event.stopPropagation();
    onSelect({ type: "folder", id: id });
    const type = selectedId.type;
    const response = await axios.get(
      process.env.REACT_APP_API_URL + endpoint.collectionDirectory + `/${userId}/${type}/${id}`
    );

    const children = response["data"].data;
    const childComponents = children.map((child) => {
      if (child.type === "File") {
        return (
          <File
            key={child.id}
            id={child.id}
            parentId={id}
            onDelete={deleteChild}
            selectedId={selectedId}
            onSelect={onSelect}
            name={child.name}
            onRename={onRename}
          />
        );
      } else if (child.type === "Folder") {
        return (
          <Folder
            key={child.id}
            id={child.id}
            parentId={id}
            onDelete={deleteChild}
            selectedId={selectedId}
            onSelect={onSelect}
            name={child.name}
            onRename={onRename}
          />
        );
      }
    });
    setChildComponents(childComponents);
  };

  const handleRename = (event) => {
    event.stopPropagation();
    setEditing(true); // Set editing state to true
    setAnchorEl(null);
  };

  const handleInputChange = (event) => {
    event.stopPropagation();
    setFolderName(event.target.value); // Update folderName state with input value
  };

  const handleInputKeyPress = (event) => {
    if (event.key === "Enter") {
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
        folderData
      );
    } else {
      setFolderName(`New Folder`);
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

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
      isMountedRef.current = false;
    };
  }, []);

  const fileClass = id === selectedId.id ? classes.selectedFile : classes.root;
  return (
    <div onClick={handleSelect} ref={inputRef}>
      <div onClick={toggleCollapsed} className={fileClass}>
        {collapsed ? (
          <FolderIcon className={classes.folderIcon} />
        ) : (
          <FolderOpenIcon className={classes.folderOpenIcon} />
        )}
        {editing ? (
          <input
            className={classes.renamingInputBox}
            type="text"
            value={folderName}
            onChange={handleInputChange}
            onBlur={handleInputBlur}
            onKeyPress={handleInputKeyPress} // Add onKeyPress event
            autoFocus
          />
        ) : (
          <span className={classes.fileName}>{folderName}</span>
        )}
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
            <MenuItem onClick={handleRename}>Rename</MenuItem>
            <MenuItem style={{ color: "red" }} onClick={handleDelete}>
              Delete
            </MenuItem>
          </Menu>
        </>
      </div>
      {collapsed ? null : (
        <div style={{ paddingLeft: "20px" }}>
          {childComponents.map((component) => (
            <div key={component.props.id}>
              {React.cloneElement(component, {
                onDelete: deleteChild,
                onSelect: onSelect,
                selectedId: selectedId,
                onRename: onRename,
              })}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function File({ id, parentId, onDelete, onSelect, selectedId, onRename, name }) {
  const classes = useStyles();
  const [fileName, setFileName] = useState(name);
  const [editing, setEditing] = useState(false); // Add editing state
  const userId = getUserId();
  const [anchorEl, setAnchorEl] = useState(null);
  const inputRef = useRef(null);
  const isMountedRef = useRef(true);
  const [tabs, setTabs] = useRecoilState(currentTabs);
  const setCurrentTab = useSetRecoilState(currentTab);
  const setRequest = useSetRecoilState(requestParams);
  const setResponse = useSetRecoilState(responseInfo);
  const setCurrentApi = useSetRecoilState(currentApi);
  const setBreadCrumbs = useSetRecoilState(currentBreadCrumbs);

  const handleOptionClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleOptionClose = () => {
    setAnchorEl(null);
  };
  const handleDelete = () => {
    onDelete(id);
  };
  const handleSelect = async (event) => {
    event.stopPropagation();
    onSelect({ type: "file", id: id });
    setCurrentApi({ id: 0, name: "" });
    if (editing === false) {
      const isTabExists = tabs.some((tab) => tab.id === id);
      let index = tabs.findIndex((tab) => tab.id === id);
      if (isTabExists) {
        setCurrentTab(index);
        setRequest(tabs[index].request);
        setResponse(tabs[index].response);
        setCurrentApi({ id: tabs[index].id, name: tabs[index].name });
        setBreadCrumbs(tabs[index].parentFolderNames);
        return [...tabs];
      } else {
        const type = "file";
        let parentFolderNames;
        await axios
          .put(process.env.REACT_APP_API_URL + endpoint.collectionsRequest + `/${userId}/${id}`, {
            active: "true",
          })
          .catch((error) => {
            console.error("Error while saving contents:", error);
          });
        await axios
          .get(process.env.REACT_APP_API_URL + endpoint.collectionDirectory + `/${userId}/${type}/${id}`)
          .then((response) => {
            parentFolderNames = response["data"].result;
            parentFolderNames = parentFolderNames.reverse();
          })
          .catch((err) => {
            console.log(err);
          });
        await axios
          .get(process.env.REACT_APP_API_URL + `${endpoint.collectionsRequest}/${userId}/${id}`)
          .then((response) => {
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
                  content: <ApiCall />,
                },
              ];
            });
            setCurrentTab(tabs.length);
            setRequest(data.request);
            setResponse(data.response);
            setCurrentApi({ id: data.id, name: data.name });
            setBreadCrumbs(parentFolderNames);
          })
          .catch((error) => {
            console.error("Error:", error);
          });
      }
    }
  };
  const handleRename = (event) => {
    event.stopPropagation();
    setEditing(true); // Set editing state to true
    setAnchorEl(null);
  };

  const handleInputChange = (event) => {
    event.stopPropagation();
    setFileName(event.target.value); // Update folderName state with input value
  };

  const handleInputKeyPress = (event) => {
    if (event.key === "Enter") {
      // Check if Enter key is pressed
      handleInputBlur(); // Call handleInputBlur to update folder name
      setEditing(false);
    }
  };

  const handleInputBlur = async () => {
    if (fileName) {
      await onRename(id, fileName);
      const fileData = {
        name: fileName,
      };

      await axios
        .put(process.env.REACT_APP_API_URL + `${endpoint.collectionDirectory}/${userId}/${id}`, fileData)
        .then((response) => {
          console.log("Response:", response.data);
        })
        .catch((error) => {
          console.error("Error:", error);
        });

      await axios
        .put(process.env.REACT_APP_API_URL + `${endpoint.collectionsRequest}/${userId}/${id}`, fileData)
        .then((response) => {
          console.log("Response:", response.data);
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    } else {
      setFileName(`New Request`);
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

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
      isMountedRef.current = false;
    };
  }, []);

  const fileClass = id === selectedId.id ? classes.selectedFile : classes.root;
  return (
    <div className={fileClass}>
      <div onClick={handleSelect} className={classes.newfileClass} ref={inputRef} style={{ width: "90%" }}>
        <InsertDriveFileOutlinedIcon className={classes.fileIcon} />

        {editing ? (
          <input
            className={classes.renamingInputBox}
            type="text"
            value={fileName}
            onChange={handleInputChange}
            onBlur={handleInputBlur}
            onKeyPress={handleInputKeyPress} // Add onKeyPress event
            autoFocus
          />
        ) : (
          <span className={classes.fileName}>{fileName}</span>
        )}
      </div>
      <>
        <Tooltip title="Options">
          <IconButton className={classes.iconButton} onClick={handleOptionClick}>
            <MoreVertIcon fontSize="small" />
          </IconButton>
        </Tooltip>
        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleOptionClose}>
          <MenuItem onClick={handleRename}>Rename</MenuItem>
          <MenuItem style={{ color: "red" }} onClick={handleDelete}>
            Delete
          </MenuItem>
        </Menu>
      </>
    </div>
  );
}

export default function DocStore() {
  const history = useHistory();
  const navigateBack = () => {
    history.replace({
      pathname: routes.projects,
      state: { allow: true },
    });
  };
  const classes = useStyles();
  let [folders, setFolders] = useState([]);
  const [selectedId, setSelectedId] = useRecoilState(selectedType); // Add selectedId state variable
  const userId = getUserId();

  const addFolder = async () => {
    const newId = Date.now();
    const newFolder = (
      <Folder
        key={newId}
        id={newId}
        parentId={0}
        onDelete={handleDelete}
        selectedId={selectedId}
        onSelect={setSelectedId}
        onRename={handleRename}
        editable={true}
        name="New Collection"
      /> // Pass onSelect prop to child components
    );
    await axios
      .post(process.env.REACT_APP_API_URL + endpoint.collectionDirectory, {
        userId: userId,
        id: newId,
        name: "New Collection",
        type: "Collection",
        parentFolderId: 0,
      })
      .then((response) => {
        // Handle success
        // console.log("Response:", response.data);
      })
      .catch((error) => {
        // Handle error
        console.error("Error:", error);
      });
    setFolders([...folders, newFolder]);
  };

  const deleteChild = (childId) => {
    folders = folders.filter((child) => child.props.id !== childId);
    setFolders(folders);
  };

  const handleDelete = async (componentId) => {
    deleteChild(componentId);

    await axios
      .delete(process.env.REACT_APP_API_URL + `${endpoint.collectionsRequest}/${userId}/${componentId}`)
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });

    await axios.delete(
      process.env.REACT_APP_API_URL + `${endpoint.collectionDirectory}/${userId}/${componentId}`
    );
    setSelectedId({
      type: "",
      id: "",
    }); // Clear selectedId if the selected component is deleted
  };
  const handleRename = (id, newName) => {
    const updatedFolders = [...folders];
    const folderIndex = updatedFolders.findIndex((folder) => folder.props.id === id);
    if (folderIndex !== -1) {
      updatedFolders[folderIndex] = React.cloneElement(updatedFolders[folderIndex], {
        id: id,
        parentId: updatedFolders[folderIndex].props.parentId,
        selectedId: updatedFolders[folderIndex].props.selectedId,
        onSelect: updatedFolders[folderIndex].props.onSelect,
        onRename: updatedFolders[folderIndex].props.onRename,
        name: newName,
      });
      setFolders(updatedFolders);
    }
  };
  useEffect(() => {
    axios
      .get(process.env.REACT_APP_API_URL + endpoint.collectionDirectory + `/${userId}`)
      .then((response) => {
        const parentFolders = response.data.map((data) => (
          <Folder
            key={data.id}
            id={data.id}
            parentId={0}
            onDelete={handleDelete}
            selectedId={selectedId}
            onSelect={setSelectedId}
            name={data.name}
          /> // Pass onSelect prop to child components
        ));

        setFolders(parentFolders);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [selectedId, userId, setFolders]);
  return (
    <div className={classes.app}>
      <div className="flex flex-row py-2 justify-between m-2 items-center">
        <div className="flex flex-row justify-between  items-center">
          <AppIcon
            style={{ marginRight: "1rem", color: "black" }}
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
              style={{ maxWidth: "128px", maxHeight: "40px" }}
            />
          </div>
        </div>
        <input id="specs" type="file" accept=".json" hidden />

        {/* <label
            for="specs"
            className="bg-black
            opacity-90  rounded px-2 py-1 text-white text-smallLabel"
          >
            Import
          </label> */}
      </div>
      <div className="flex flex-row  justify-between mb-2 items-center border-b-1 border-gray-200">
        <Button
          variant="outlined"
          startIcon={<AddIcon fontSize="small" sx={{ marginRight: "-6px", marginLeft: "-10px" }} />}
          sx={{ textTransform: "none" }}
          onClick={addFolder}
          style={{
            marginBottom: "10px",
            background: "transparent",
            color: "black",
            height: "30px",
            border: "1px solid #E6E7E5",
            fontSize: "13px",
            display: "flex",
            justifyContent: "flex-start",
            alignItems: "center",
            marginTop: "-8px",
            marginLeft: "5px",
          }}
        >
          New
        </Button>
        <input type="text" placeholder="Search" className={classes.searchBar} />
      </div>

      {folders.map((folder) => (
        <div key={folder.props.id}>
          {React.cloneElement(folder, {
            onDelete: handleDelete,
            onSelect: setSelectedId,
            selectedId: selectedId,
            onRename: handleRename,
          })}
        </div>
      ))}
    </div>
  );
}
