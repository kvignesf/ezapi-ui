import React from "react";
import { useHistory } from "react-router-dom";

import OrderStatus from "./OrderStatus";
import routes, { generateRoute } from "../shared/routes";
import { isOrderInOtherState } from "../shared/utils";
import classNames from "classnames";

const OrderRow = ({ order }) => {
  const history = useHistory();

  const orderCreatedDate = new Date(order?.createdAt)
    .toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    })
    .replace(/ /g, "-");

  const navigateToProject = () => {
    history.push(generateRoute(routes.projects, order?.projectData?.projectId));
  };

  const navigateToOrderRetry = () => {
    history.push(
      // generateRoute(routes.paymentForOrder, {
      //   projectId: order?.projectData?.projectId,
      //   orderId: order?.orderId,
      // })
      generateRoute(routes.payment, order?.projectData?.projectId)
    );
  };

  return (
    <tr className='text-overline2'>
      {/* <td className='py-2'>{order?.projectData?.projectId}</td> */}
      <td
        className='py-3 hover:opacity-75 cursor-pointer text-brand-secondary'
        onClick={(e) => {
          e?.preventDefault();
          e?.stopPropagation();

          navigateToProject();
        }}
      >
        {order?.projectData?.projectName}
      </td>
      <td className='py-3'>{order?.productName}</td>
      <td className='py-3'>${order?.productPrice}</td>
      <td
        className={classNames({
          "hover:opacity-75 cursor-pointer": isOrderInOtherState(order),
        })}
        onClick={(e) => {
          e?.preventDefault();
          e?.stopPropagation();

          if (isOrderInOtherState(order)) {
            navigateToOrderRetry();
          }
        }}
      >
        <OrderStatus order={order} />
      </td>
      <td>{order?.orderId}</td>
      <td>{orderCreatedDate}</td>
    </tr>
  );
};

export default OrderRow;
