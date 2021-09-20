import React from "react";
import { Fade, Menu, MenuItem } from "@material-ui/core";
import Colors from "../colors";
import { Link, useHistory } from "react-router-dom";
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
      style={{ borderRadius: "1rem", zIndex: "1100" }}
    >
      <MenuItem>
        <Link
          to='/contact'
          target='_blank'
          rel='noopener noreferrer'
          className='text-overline2 text-brand-secondary hover:opacity-80'
        >
          Contact Us
        </Link>
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
