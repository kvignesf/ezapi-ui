import React from "react";
import { CircularProgress } from "@material-ui/core";

import classNames from "classnames";

const ErrorWithMessage = ({ message, className, contained = false }) => {
  return (
    <div
      className={classNames(
        "flex flex-col justify-center items-center",
        {
          "w-screen h-screen": !contained,
        },
        `${className}`
      )}
    >
      <p className='text-overline2'>{message}</p>
    </div>
  );
};

export default ErrorWithMessage;
