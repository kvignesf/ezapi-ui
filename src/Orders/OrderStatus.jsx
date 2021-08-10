import classNames from "classnames";
import React from "react";

const OrderStatus = ({ status }) => {
  const isSuccess = () => {
    return status?.toLowerCase() === "succeeded";
  };

  const isInitiated = () => {
    return status?.toLowerCase() === "initiated";
  };

  const isOther = () => {
    return !isSuccess() && !isInitiated();
  };

  return (
    <div
      className={classNames("p-1", {
        "bg-accent-redSubtle": isOther(),
        "bg-accent-greenSubtle": isSuccess(),
        "bg-accent-orangeSubtle": isInitiated(),
      })}
      style={{ width: "70px", borderRadius: "4px" }}
    >
      <p
        className={classNames("text-capitalised text-center", {
          "text-accent-green": isSuccess(),
          "text-accent-red": isOther(),
          "text-accent-orange": isInitiated(),
        })}
      >
        {isSuccess() ? "Sucesss" : isInitiated() ? "Initiated" : "Failure"}
      </p>
    </div>
  );
};

export default OrderStatus;
