import { Tabs, Tab, IconButton } from "@material-ui/core";
import { Close, Add } from "@material-ui/icons";
import { TabContext, TabPanel } from "@material-ui/lab";
import { useRecoilState, useSetRecoilState } from "recoil";
import {
  currentApi,
  currentBreadCrumbs,
  currentTab,
  currentTabs,
  requestParams,
  responseInfo,
} from "../CollectionsAtom";
import ApiCall from "./ApiCall/ApiCall";
import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import Typography from "@material-ui/core/Typography";
import { NavigateNext } from "@material-ui/icons";
import { makeStyles } from "@material-ui/core/styles";
import { useEffect } from "react";
import axios from "axios";
import { endpoint } from "../../shared/network/client";
import { getUserId } from "../../shared/storage";

const useStyles = makeStyles((theme) => ({
  tabPanel: {
    margin: "-25px",
  },
  breadCrumbs: {
    margin: theme.spacing(2),
    marginLeft: theme.spacing(1),
  },
  root: {
    borderBottom: "3px solid #F0F0F0",
    marginTop: "-2px",
  },
  tab: {
    zIndex: "1",
    fontWeight: "semibold",
    textTransform: "none",
  },
  selectedTab: {
    backgroundColor: "rgba(128, 128, 128, 0.2)",
    fontWeight: 600,
  },
  tabButton: {
    zIndex: "2",
  },
  closeButton: {
    zIndex: "2",
  },
}));
function CollectionTabs() {
  const userId = getUserId();
  const classes = useStyles();
  const [tabs, setTabs] = useRecoilState(currentTabs);

  const [value, setValue] = useRecoilState(currentTab);
  const setRequest = useSetRecoilState(requestParams);
  const setResponse = useSetRecoilState(responseInfo);
  const setCurrentApi = useSetRecoilState(currentApi);
  const [breadCrumbs, setBreadCrumbs] = useRecoilState(currentBreadCrumbs);

  const handleChange = (event, newValue) => {
    setValue(newValue);
    setRequest(tabs[newValue].request);
    setResponse(tabs[newValue].response);
    setCurrentApi({ id: tabs[newValue].id, name: tabs[newValue].label, type: "file" });
    setBreadCrumbs(tabs[newValue].parentFolderNames);
  };
  const handleDelete = async (index) => {
    console.log(tabs[index]);
    await axios
      .put(process.env.REACT_APP_API_URL + endpoint.collectionsRequest + `/${userId}/${tabs[index].id}`, {
        active: "false",
      })
      .catch((error) => {
        console.error("Error while saving contents:", error);
      });
    const newTabs = tabs.filter((_, i) => i !== index);
    setTabs(newTabs);
    if (index === value - 1 || index < value) {
      setValue(value - 1);
    } else {
      setValue(value);
    }
  };

  const handleAdd = () => {
    const newTab = {
      id: 0,
      request: { method: "GET", proxy: "No Proxy", url: "", body: { "": "" }, header: [], queryParams: [] },
      response: {},
      parentFolderNames: [""],
      label: "New Request",
      content: <ApiCall />,
    };
    setTabs([...tabs, newTab]);
    setValue(tabs.length);
    setRequest({ method: "GET", proxy: "No Proxy", url: "", body: { "": "" }, header: [], queryParams: [] });
    setResponse({});
    setCurrentApi({ id: 0, name: "" });
    setBreadCrumbs([]);
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
            <div key={index}>
              <Tab
                label={tab.label}
                value={index}
                onClick={(e) => handleChange(e, index)}
                className={`${classes.tab} ${value === index ? classes.selectedTab : ""}`}
              />
              {tabs.length > 1 && value !== index && (
                <IconButton size="small" onClick={() => handleDelete(index)} className={classes.closeButton}>
                  <Close fontSize="small" />
                </IconButton>
              )}
            </div>
          ))}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginLeft: "16px",
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
                  <Typography color="textPrimary" style={{ fontSize: "14px", fontWeight: 600 }} key={item}>
                    {item}
                  </Typography>
                ) : (
                  <Typography color="inherit" style={{ fontSize: "13px", fontWeight: 600 }} key={item}>
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
      </TabContext>
    </div>
  );
}

export default CollectionTabs;
