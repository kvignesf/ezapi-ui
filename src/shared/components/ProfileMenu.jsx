import React from "react";
import { Fade, Menu, MenuItem } from "@material-ui/core";
import Colors from "../colors";
import { useHistory } from "react-router-dom";
import routes from "../routes";

const ProfileMenu = ({
  onLogout,
  profileMenuAnchorEl,
  setProfilemenuAnchorEl,
}) => {
  const history = useHistory();

  const navigateToContactUs = () => {
    history.push(routes.contact);
  };

  return (
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
          navigateToContactUs();
        }}
      >
        Contact Us
      </MenuItem>

      <MenuItem
        onClick={() => {
          setProfilemenuAnchorEl(null);
          onLogout();
        }}
        style={{
          color: Colors.accent.red,
        }}
      >
        Logout
      </MenuItem>
    </Menu>
  );
};

export default ProfileMenu;
