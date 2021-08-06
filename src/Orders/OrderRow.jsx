import React from "react";

const OrderRow = ({ order }) => {
  const orderCreatedDate = new Date(order?.createdAt)
    .toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    })
    .replace(/ /g, "-");

  return (
    <tr className='text-overline2'>
      <td className='py-2'>{order?.projectId}</td>
      <td>{order?.productName}</td>
      <td>{order?.productName}</td>
      <td>${order?.productPrice}</td>
      <td>{order?.status}</td>
      <td>{order?.orderId}</td>
      <td>{orderCreatedDate}</td>
    </tr>
  );
};

export default OrderRow;
