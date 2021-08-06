import React from "react";
import { CircularProgress, Dialog, Tooltip } from "@material-ui/core";
import _ from "lodash";
import ReplayIcon from "@material-ui/icons/Replay";

import Dashboard from "../Dashboard";
import { useGetOrders } from "./ordersQueries";
import EmptyLogo from "../static/images/empty-state.svg";
import Colors from "../shared/colors";
import OrderRow from "./OrderRow";

const Content = () => {
  const {
    data: ordersData,
    isLoading: isFetchingOrders,
    error: fetchOrdersError,
    isFetching: isFetchingOrdersBg,
    refetch: refetchOrders,
  } = useGetOrders();

  return (
    <div className='p-3 h-full'>
      {/* <Dialog
        onClose={handleCloseDialog}
        aria-labelledby='projects-dialog'
        open={dialog?.show ?? false}
        fullWidth
        PaperProps={{
          style: { borderRadius: 8 },
        }}
        disableBackdropClick
      >
        {dialog?.type === "members" && (
          <ModifyCollaborators
            projectId={dialog?.data?.projectId}
            onClose={handleCloseDialog}
            invitedCollaborators={dialog?.data?.members}
          />
        )}

        {dialog?.type === "rename-project" && (
          <RenameProject onClose={handleCloseDialog} project={dialog?.data} />
        )}

        {dialog?.type === "del-project" && (
          <DeleteProject onClose={handleCloseDialog} project={dialog?.data} />
        )}
      </Dialog> */}

      {!_.isEmpty(ordersData?.orders) && (
        <table className='w-full'>
          <tr className='mr-16 bg-neutral-gray6 w-full text-left text-neutral-gray4 text-mediumLabel'>
            <th className='p-2 w-64 rounded-tl-md rounded-bl-md uppercase'>
              Project Id
            </th>
            <th className='uppercase'>Project Name</th>
            <th className='uppercase'>Product</th>
            <th className='uppercase'>Price</th>
            <th className='uppercase'>Status</th>
            <th className='uppercase'>Order Id</th>
            <th className='uppercase'>Order Date</th>
            <th className='rounded-tr-md rounded-br-md text-center'>
              {isFetchingOrdersBg ? (
                <CircularProgress size='20px' />
              ) : (
                <Tooltip title='Refresh list'>
                  <ReplayIcon
                    style={{
                      width: "20px",
                      height: "20px",
                      color: Colors.brand.primary,
                      cursor: "pointer",
                    }}
                    onClick={(e) => {
                      e?.preventDefault();
                      e?.stopPropagation();
                      refetchOrders();
                    }}
                  />
                </Tooltip>
              )}
            </th>
          </tr>

          {ordersData?.orders.map((order) => {
            return <OrderRow order={order} />;
          })}
        </table>
      )}

      {/* Empty state */}
      {_.isEmpty(ordersData?.orders) && (
        <div className='h-full flex flex-col items-center justify-center'>
          <img
            src={EmptyLogo}
            className='mb-4'
            style={{ width: "100px", height: "100px" }}
          />

          <h5 className='mb-3'>There are no orders</h5>
        </div>
      )}
    </div>
  );
};

const Orders = () => {
  return (
    <Dashboard selectedIndex={2}>
      <Content />
    </Dashboard>
  );
};

export default Orders;
