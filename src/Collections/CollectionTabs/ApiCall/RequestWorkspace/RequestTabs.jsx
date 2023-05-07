import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Tabs, Tab, Typography, Select, MenuItem } from "@material-ui/core";
import KeyValue from "./KeyValue/KeyValuePanel";
import JsonEditor from "../components/JsonEditor/JsonEditor";
import AuthTab from "./AuthenticationTab/AuthTab";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { currentApi, currentTabs, requestParams, responseInfo } from "../../../CollectionsAtom";
import { getUserId } from "../../../../shared/storage";
import axios from "axios";
import { endpoint } from "../../../../shared/network/client";
import ApiCall from "../ApiCall";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
  },
  tab: {
    minWidth: 100,
    fontWeight: 500,
    fontSize: "14px",
    textTransform: "none",
    "&.Mui-selected": {
      borderBottom: "none",
    },
  },
  panel: {
    borderBottom: "1px solid #ddd",
    marginTop: "-2px",
    borderTop: "1px solid #ddd",
  },
  select: {
    fontWeight: 500,
    fontSize: "14px",
    width: 107,
    "&:focus": {
      backgroundColor: "transparent",
      outline: "none",
    },
    "& .MuiOutlinedInput-notchedOutline": {
      border: "none",
    },
  },
  container: {
    display: "flex",
    alignItems: "center",
  },
}));

export default function RequestTabs() {
  const userId = getUserId();
  const file = useRecoilValue(currentApi);
  const requestData = useRecoilValue(requestParams);
  const responseData = useRecoilValue(responseInfo);
  const setTabs = useSetRecoilState(currentTabs);

  useEffect(() => {
    async function ApiUpdate() {
      if (file.id !== 0) {
        await axios
          .put(process.env.REACT_APP_API_URL + endpoint.collectionsRequest + `/${userId}/${file.id}`, {
            name: file.name,
            request: requestData,
            response: responseData,
          })
          .then((response) => {})
          .catch((error) => {
            console.error("Error while saving contents:", error);
          });
        await axios
          .get(process.env.REACT_APP_API_URL + `${endpoint.collectionsRequest}/${userId}/${file.id}`)
          .then((response) => {
            const data = response.data;
            setTabs((prev) => {
              const isTabExists = prev.some((tab) => tab.id === data.id);
              if (isTabExists) {
                // If the tab already exists, update the existing tab with new data
                return prev.map((tab) => {
                  if (tab.id === data.id) {
                    return {
                      ...tab,
                      request: data.request,
                      response: data.response,
                      label: data.name,
                      content: <ApiCall />,
                    };
                  }
                  return tab;
                });
              } else {
                return [...prev];
              }
            });
          })
          .catch((error) => {
            console.error("Error:", error);
          });
      }
    }
    ApiUpdate();
  }, [file.id, file.name, requestData, responseData, setTabs, userId]);
  const classes = useStyles();
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const [request, setRequest] = useRecoilState(requestParams);

  const handleSelect = (event) => {
    const { name, value } = event.target;
    setRequest((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const requestTabs = [
    {
      slug: "query-params",
      title: "Query Params",
      panel: <KeyValue tab={0} />,
    },
    {
      slug: "headers",
      title: "Headers",
      panel: <KeyValue tab={1} />,
    },
    {
      slug: "body",
      title: "Body",
      panel: <JsonEditor value={request.body} type={"reqBody"} readOnly={false} tab={2} />,
    },
    {
      slug: "authorization",
      title: "Authorization",
      panel: <AuthTab tab={3} />,
    },
  ];

  return (
    <div className={classes.root}>
      <div className={classes.container}>
        <Select
          className={classes.select}
          value={request.proxy}
          onChange={handleSelect}
          variant="outlined"
          name="proxy"
        >
          <MenuItem value="No Proxy">No Proxy</MenuItem>
          <MenuItem value="Proxy">Proxy</MenuItem>
        </Select>
        <Tabs
          value={value}
          onChange={handleChange}
          variant="standard"
          indicatorColor="transparent"
          textColor="primary"
          style={{
            borderBottom: "none",
          }}
        >
          {requestTabs.map((tab) => (
            <Tab className={classes.tab} key={tab.slug} label={tab.title} />
          ))}
        </Tabs>
      </div>
      {requestTabs.map((tab, index) => (
        <TabPanel className={classes.panel} value={value} index={index} key={tab.slug}>
          {tab.panel}
        </TabPanel>
      ))}
    </div>
  );
}

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && (
        <Typography component="div" variant="body1">
          {children}
        </Typography>
      )}
    </div>
  );
}
