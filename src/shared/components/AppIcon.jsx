import React from "react";
import { IconButton } from "@material-ui/core";

const AppIcon = ({ children, style, ...rest }) => {
  return (
    <IconButton
      disableTouchRipple
      style={{ ...style, border: "none", outline: "none" }}
      {...rest}
    >
      {children}
    </IconButton>
  );
};
export default AppIcon;
