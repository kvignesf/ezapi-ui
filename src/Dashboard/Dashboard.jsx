import React, { useState, useEffect } from "react";
import classNames from "classnames";
import { useHistory } from "react-router-dom";
import {
  Dialog,
  Fade,
  makeStyles,
  Menu,
  MenuItem,
} from "@material-ui/core/index";
import client, { endpoint } from "../shared/network/client";
import { getAccessToken } from "../shared/storage";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ListItemIcon from "@material-ui/core/ListItemIcon";
// import DashboardSharpIcon from "@material-ui/icons/DashboardSharp";
import { ReactComponent as DashboardSharpIcon } from "../static/images/dashboard_logo.svg";
import { List, ListItem } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";

import imageLogo from "../static/images/logo/newconnectLogoOnlyWhite.svg";
import { ReactComponent as OrderHistoryIcon } from "../static/images/order-history.svg";
import { ReactComponent as PricingPageIcon } from "../static/images/pricing-page.svg";
import { ReactComponent as ProductTourIcon } from "../static/images/product_tour2.svg";
import PricingPageLogo from "../icons/pricingPage_logo.png";
import Colors from "../shared/colors";
import routes, { generateRoute } from "../shared/routes";
import { useMutation, useQuery } from "react-query";
import AppIcon from "../shared/components/AppIcon";
import AddProject from "../AddProject";
import projectAtom, { defaultState } from "../AddProject/projectAtom";
import InitialsAvatar from "../shared/components/InitialsAvatar";
import { useLogout } from "../shared/query/authQueries";
import { getFirstName, getLastName } from "../shared/storage";
import EzapiLogo from "../shared/components/EzapiLogo";
import Logo from "../static/images/logo/logoText.svg";

import ProfileMenu from "../shared/components/ProfileMenuWithIcon";
import ProfileMenuWithIcon from "../shared/components/ProfileMenuWithIcon";
import EzapiFooter from "../shared/components/EzapiFooter";
import { fetchEventSource } from "@microsoft/fetch-event-source";
import { useRecoilState } from "recoil";
import { downloadIconSts, downloadIconProj } from "./dwnDataGenAtom";

import _ from "lodash";

const acc_token = getAccessToken();
const baseUrl = process.env.REACT_APP_API_URL;

const useStyles = makeStyles({
  selectedItem: {
    background: Colors.brand.primarySubtle,
    borderLeft: `5px solid ${Colors.brand.primary}`,
    borderLeftWidth: "5px",
    borderTopRightRadius: "5px",
    borderBottomRightRadius: "5px",
  },
  root: {
    "&$selected": {
      backgroundColor: Colors.brand.primarySubtle,
      "&:hover": {
        backgroundColor: "none",
      },
    },
  },
  selected: {},
});

const Dashboard = ({ selectedIndex, children, pricingDefaultCheck }) => {
  // console.log(acc_token);
  const styles = useStyles();
  const history = useHistory();
  const [dialog, setDialog] = useState({
    show: false,
    type: null,
    data: null,
  });
  const [counter, setCounter] = useState(() => {
    return 0;
  });
  const [profileMenuAnchorEl, setProfilemenuAnchorEl] = useState(false);
  const [projectState, setProjectState] = useRecoilState(projectAtom);

  const { isLoading: isLoggingOut, mutate: logout } = useLogout();
  const firstName = getFirstName();
  const lastName = getLastName();

  const handleSideMenuItemClick = (index) => {
    // console.log(index);
    if (index !== selectedIndex) {
      if (index === 0) {
        // Show add new project dialog
        showAddProjectDialog();
      } else if (index === 1) {
        history.push({
          pathname: routes.projects,
          state: { allow: true },
        });
        // history.push(routes.projects);
      } else if (index === 2) {
        history.push(routes.orders);
      } else if (index === 3) {
        history.push(routes.pricing);
      } else if (index === 4) {
        history.push(routes.productTour);
      }
    }
  };

  const showAddProjectDialog = () => {
    setDialog({
      show: true,
      type: "add-project",
    });
  };

  const handleCloseDialog = () => {
    setProjectState(defaultState);

    setDialog({
      show: false,
      data: null,
    });
  };

  const handleProfileMenuClick = (event) => {
    setProfilemenuAnchorEl(event?.currentTarget);
  };

  const handleOnLogout = () => {
    logout();
  };
  const [enableIcon, setEnableIcon] = useRecoilState(downloadIconSts);
  const [projectIden, setProjectIden] = useRecoilState(downloadIconProj);

  return (
    <div className='flex flex-col h-screen overflow-hidden'>
      <Dialog
        onClose={handleCloseDialog}
        aria-labelledby='dashboard-dialog'
        open={isLoggingOut || (dialog?.show ?? false)}
        fullWidth
        PaperProps={{
          style: { borderRadius: 8 },
        }}
        disableBackdropClick
      >
        {dialog?.type === "add-project" && (
          <AddProject
            onClose={handleCloseDialog}
            onSuccess={(projectId) => {
              handleCloseDialog();

              if (!_.isEmpty(projectId)) {
                history.push(generateRoute(routes.projects, projectId));
              }
            }}
          />
        )}

        {isLoggingOut && <div className='p-4'>Logging you out ...</div>}
      </Dialog>

      <div
        className='flex fixed w-screen place-items-center bg-brand-primary'
        style={{ height: "8vh", zIndex: "99" }}
      >
        <header className='fixed w-full align-middle self-center flex flex-row items-center'>
          {/* EZAPI logo */}
          <div className='w-full flex flex-row'>
            {/* <EzapiLogo
            style={{
              marginRight: "0.5rem",
            }}
          /> */}
            <img
              src={imageLogo}
              alt='conektto logo'
              className='p-1'
              style={{ maxWidth: "128px", maxHeight: "50px" }}
            />

            {/*<img src={Logo} alt='conektto logo' style={{ maxWidth: "128px" }} />*/}

            {/* <h6 className="text-white whitespace-nowrap ml-1 mt-1">
          CONEKTTO
          </h6> */}
          </div>

          {/* Initials logo */}
          <InitialsAvatar
            firstName={firstName}
            lastName={lastName}
            style={{
              marginRight: "0.5rem",
            }}
          />

          {/* Name */}
          <p className='text-overline2 text-white whitespace-nowrap mr-2'>
            {firstName} {lastName}
          </p>

          {/* Options */}
          <ProfileMenuWithIcon logout={logout} />
        </header>
      </div>

      <section className='flex flex-row my-14' style={{ height: "70vh" }}>
        <div className='h-full w-52 fixed left-0 border-r-2 border-gray-100'>
          <List>
            <ListItem
              button
              selected={selectedIndex === 0}
              onClick={() => {
                handleSideMenuItemClick(0);
              }}
              style={{
                padding: "1rem",
                background:
                  selectedIndex === 0 ? Colors.brand.primarySubtle : "white",
              }}
              className={selectedIndex === 0 ? styles.selectedItem : null}
              disableTouchRipple
            >
              <ListItemIcon
                style={{
                  minWidth: "0",
                  marginRight: "1rem",
                }}
              >
                <AddIcon
                  className={`${classNames({
                    "text-brand-primary": selectedIndex === 0,
                    "text-neutral-gray2": selectedIndex !== 0,
                  })}`}
                  style={selectedIndex === 0 ? {} : { color: "grey" }}
                />
              </ListItemIcon>
              <p
                className={`text-overline2 ${classNames({
                  "text-brand-primary": selectedIndex === 0,
                  "text-neutral-gray2": selectedIndex !== 0,
                })}`}
              >
                Create New API
              </p>
            </ListItem>

            <ListItem
              button
              selected={selectedIndex === 1}
              onClick={() => {
                handleSideMenuItemClick(1);
              }}
              style={{
                padding: "1rem",
              }}
              className={selectedIndex === 1 ? styles.selectedItem : null}
              classes={{ root: styles.root, selected: styles.selected }}
              disableTouchRipple
            >
              <ListItemIcon style={{ minWidth: "0", marginRight: "1rem" }}>
                <DashboardSharpIcon
                  fill={
                    selectedIndex === 1
                      ? Colors.brand.primary
                      : Colors.neutral.gray4
                  }
                />
              </ListItemIcon>
              <p
                className={`text-overline2 ${classNames({
                  "text-brand-primary": selectedIndex === 1,
                  "text-neutral-gray4": selectedIndex !== 1,
                })}`}
              >
                Dashboard
              </p>
            </ListItem>

            <ListItem
              button
              selected={selectedIndex === 2}
              onClick={() => {
                handleSideMenuItemClick(2);
              }}
              style={{
                padding: "1rem",
              }}
              className={selectedIndex === 2 ? styles.selectedItem : null}
              classes={{ root: styles.root, selected: styles.selected }}
              disableTouchRipple
            >
              <ListItemIcon style={{ minWidth: "0", marginRight: "1rem" }}>
                <OrderHistoryIcon
                  fill={
                    selectedIndex === 2
                      ? Colors.brand.primary
                      : Colors.neutral.gray4
                  }
                />
              </ListItemIcon>
              <p
                className={`text-overline2 ${classNames({
                  "text-brand-primary": selectedIndex === 2,
                  "text-neutral-gray4": selectedIndex !== 2,
                })}`}
              >
                Order History
              </p>
            </ListItem>

            <ListItem
              button
              selected={selectedIndex === 3}
              onClick={() => {
                handleSideMenuItemClick(3);
              }}
              style={{
                padding: "1rem",
              }}
              className={selectedIndex === 3 ? styles.selectedItem : null}
              classes={{ root: styles.root, selected: styles.selected }}
              disableTouchRipple
            >
              <ListItemIcon style={{ minWidth: "0", marginRight: "1rem" }}>
                <PricingPageIcon
                  fill={
                    selectedIndex === 3
                      ? Colors.brand.primary
                      : Colors.neutral.gray4
                  }
                />
              </ListItemIcon>
              <p
                className={`text-overline2 ${classNames({
                  "text-brand-primary": selectedIndex === 3,
                  "text-neutral-gray4": selectedIndex !== 3,
                })}`}
              >
                Pricing Plan
              </p>
            </ListItem>
            <ListItem
              button
              selected={selectedIndex === 4}
              onClick={() => {
                handleSideMenuItemClick(4);
              }}
              style={{
                padding: "1rem",
              }}
              className={selectedIndex === 4 ? styles.selectedItem : null}
              classes={{ root: styles.root, selected: styles.selected }}
              disableTouchRipple
            >
              <ListItemIcon style={{ minWidth: "0", marginRight: "1rem" }}>
                <ProductTourIcon
                  fill={
                    selectedIndex === 4
                      ? Colors.brand.primary
                      : Colors.neutral.gray4
                  }
                />
              </ListItemIcon>
              <p
                className={`text-overline2 ${classNames({
                  "text-brand-primary": selectedIndex === 4,
                  "text-neutral-gray4": selectedIndex !== 4,
                })}`}
              >
                Product Tour
              </p>
            </ListItem>
          </List>
        </div>

        <div
          className='ml-52 w-full'

          // style={{ height: `calc(100vh - 180px)` }}
        >
          {React.cloneElement(children, {
            showCreateProjectDialog: showAddProjectDialog,
          })}
        </div>
      </section>

      <EzapiFooter />
    </div>
  );
};

export default Dashboard;
