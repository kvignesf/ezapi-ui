import React from "react";
import { useHistory } from "react-router-dom";

import OrderStatus from "./OrderStatus";
import routes, { generateRoute } from "../shared/routes";

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
      <td>
        <OrderStatus status={order?.status} />
      </td>
      <td>{order?.orderId}</td>
      <td>{orderCreatedDate}</td>
    </tr>
  );
};

export default OrderRow;
