import classNames from "classnames";
import React from "react";
import {
  isOrderInitiated,
  isOrderInOtherState,
  isOrderSuccess,
} from "../shared/utils";

const OrderStatus = ({ order }) => {
  return (
    <div
      className={classNames("p-1", {
        "bg-accent-redSubtle": isOrderInOtherState(order),
        "bg-accent-greenSubtle": isOrderSuccess(order),
        "bg-accent-orangeSubtle": isOrderInitiated(order),
      })}
      style={{ width: "70px", borderRadius: "4px" }}
    >
      <p
        className={classNames("text-capitalised text-center", {
          "text-accent-green": isOrderSuccess(order),
          "text-accent-red": isOrderInOtherState(order),
          "text-accent-orange": isOrderInitiated(order),
        })}
      >
        {isOrderSuccess(order)
          ? "Sucesss"
          : isOrderInitiated(order)
          ? "Initiated"
          : "Failure"}
      </p>
    </div>
  );
};

export default OrderStatus;
