import classNames from "classnames";
import React from "react";
import ReactHoverObserver from "react-hover-observer";
import ReplayIcon from "@material-ui/icons/Replay";

import {
  isOrderInitiated,
  isOrderInOtherState,
  isOrderSuccess,
} from "../shared/utils";
import Colors from "../shared/colors";

const OrderStatus = ({ order, onRetry }) => {
  if (isOrderInOtherState(order)) {
    return (
      <ReactHoverObserver>
        {({ isHovering }) => {
          return (
            <div className='flex flex-row items-center'>
              {isHovering ? (
                <p
                  className='text-capitalised text-brand-secondary text-center mr-1 p-1 bg-brand-secondarySubtle cursor-pointer'
                  style={{ width: "70px", borderRadius: "4px" }}
                  onClick={(e) => {
                    e?.preventDefault();
                    e?.stopPropagation();

                    if (isOrderInOtherState(order)) {
                      onRetry();
                    }
                  }}
                >
                  Retry
                </p>
              ) : (
                <p
                  className='text-capitalised text-accent-red text-center mr-1 p-1 bg-accent-redSubtle'
                  style={{ width: "70px", borderRadius: "4px" }}
                >
                  Failure
                </p>
              )}

              <ReplayIcon
                style={{
                  width: "17px",
                  height: "17px",
                  color: Colors.brand.secondary,
                  cursor: "pointer",
                }}
                onClick={(e) => {
                  e?.preventDefault();
                  e?.stopPropagation();

                  onRetry();
                }}
              />
            </div>
          );
        }}
      </ReactHoverObserver>
    );
  }

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
