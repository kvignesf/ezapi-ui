import React from "react";
import { CircularProgress } from "@material-ui/core";

import Colors from "../colors";
import Text, { TextStyle } from "./Text";
import classNames from "classnames";

const ErrorWithMessage = ({ message, contained = false }) => {
  return (
    <div
      className={classNames("flex flex-col justify-center items-center", {
        "w-screen h-screen": !contained,
      })}
    >
      <Text variant={TextStyle.largeLabel}>{message}</Text>
    </div>
  );
};

export default ErrorWithMessage;
