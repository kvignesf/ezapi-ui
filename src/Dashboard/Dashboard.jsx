import React, { useState } from "react";
import classNames from "classnames";
import { useHistory } from "react-router-dom";
import {
  Dialog,
  Fade,
  makeStyles,
  Menu,
  MenuItem,
} from "@material-ui/core/index";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import DashboardSharpIcon from "@material-ui/icons/DashboardSharp";
import { List, ListItem } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import { useRecoilState } from "recoil";

import Logo from "../static/images/logo/svg.svg";
import Colors from "../shared/colors";
import routes from "../shared/routes";
import AppIcon from "../shared/components/AppIcon";
import AddProject from "../AddProject";
import projectAtom, { defaultState } from "../AddProject/projectAtom";
import InitialsAvatar from "../shared/components/InitialsAvatar";
import { useLogout } from "../shared/query/authQueries";
import { getFirstName, getLastName } from "../shared/storage";

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

const Dashboard = ({ selectedIndex, children }) => {
  const styles = useStyles();
  const history = useHistory();
  const [dialog, setDialog] = useState({
    show: false,
    type: null,
    data: null,
  });
  const [profileMenuAnchorEl, setProfilemenuAnchorEl] = useState(false);
  const [projectState, setProjectState] = useRecoilState(projectAtom);
  const { isLoading: isLoggingOut, mutate: logout } = useLogout();
  const firstName = getFirstName();
  const lastName = getLastName();

  const handleSideMenuItemClick = (index) => {
    if (index !== selectedIndex) {
      if (index === 0) {
        // Show add new project dialog
        showAddProjectDialog();
      } else if (index === 1) {
        history.push(routes.projects);
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

  return (
    <div className='flex flex-col'>
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
          <AddProject onClose={handleCloseDialog} />
        )}

        {isLoggingOut && <div className='p-4'>Logging you out ...</div>}
      </Dialog>

      <header
        className='fixed w-full top-0 bg-brand-primary flex flex-row p-4 items-center'
        style={{ height: "56px", zIndex: "99" }}
      >
        {/* EZAPI logo */}
        <div className='w-full'>
          <img
            src={Logo}
            alt='ezapi logo'
            className='bg-white'
            style={{ height: "28px", width: "28px" }}
          />
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
        <AppIcon
          aria-label='profile options'
          style={{ color: "white" }}
          onClick={handleProfileMenuClick}
        >
          <ExpandMoreIcon />
        </AppIcon>

        <Menu
          id='profile-menu'
          anchorEl={profileMenuAnchorEl}
          keepMounted
          open={Boolean(profileMenuAnchorEl)}
          onClose={() => {
            setProfilemenuAnchorEl(null);
          }}
          TransitionComponent={Fade}
          style={{ borderRadius: "1rem", zIndex: "100" }}
        >
          <MenuItem
            onClick={() => {
              setProfilemenuAnchorEl(null);
              handleOnLogout();
            }}
            style={{ color: Colors.accent.red }}
          >
            Logout
          </MenuItem>
        </Menu>
      </header>

      <section className='h-full flex flex-row' style={{ marginTop: "56px" }}>
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
                  className={`${classNames({
                    "text-brand-primary": selectedIndex === 1,
                    "text-neutral-gray2": selectedIndex !== 1,
                  })}`}
                />
              </ListItemIcon>
              <p
                className={`text-overline2 ${classNames({
                  "text-brand-primary": selectedIndex === 1,
                  "text-neutral-gray2": selectedIndex !== 1,
                })}`}
              >
                Dashboard
              </p>
            </ListItem>
          </List>
        </div>
        <div className='ml-52 w-full' style={{ height: `calc(100vh)` }}>
          {React.cloneElement(children, {
            showCreateProjectDialog: showAddProjectDialog,
          })}
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
