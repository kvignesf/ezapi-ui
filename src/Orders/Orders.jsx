import React from 'react';
import { CircularProgress, Dialog, Tooltip } from '@material-ui/core';
import _ from 'lodash';
import { getAccessToken } from '../shared/storage';
import client, { endpoint } from '../shared/network/client';
import ReplayIcon from '@material-ui/icons/Replay';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import AppIcon from '../shared/components/AppIcon';
import Dashboard from '../Dashboard';
import { useGetOrders } from './ordersQueries';
import EmptyLogo from '../static/images/empty-state.svg';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Colors from '../shared/colors';
import OrderRow from './OrderRow';
import ErrorWithMessage from '../shared/components/ErrorWithMessage';
import LoaderWithMessage from '../shared/components/LoaderWithMessage';

const Content = () => {
  const acc_token = getAccessToken();
  const handleUnsubscribe = async () => {
    const { UnsubscribeData } = await client.post(endpoint.unSubscribe, {
      headers: {
        Authorization: acc_token,
      },
    });
  };
  const [anchorEl, setAnchorEl] = React.useState(null);
  const {
    data: ordersData,
    isLoading: isFetchingOrders,
    error: fetchOrdersError,
    isFetching: isFetchingOrdersBg,
    refetch: refetchOrders,
  } = useGetOrders();
  const handleOnOptionsClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  return (
    <div className="p-3 h-full">
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

      {isFetchingOrders && <LoaderWithMessage message="Fetching orders" />}

      {fetchOrdersError && <ErrorWithMessage message="Failed to load orders" />}

      {!_.isEmpty(ordersData) && (
        <table className="w-full table-fixed">
          <tr className=" bg-neutral-gray6  text-left w-full text-neutral-gray4 text-mediumLabel ">
            {/* <th className="p-2 rounded-tl-md rounded-bl-md uppercase">
              Project Id
            </th> */}
            {/* <th className="p-2 rounded-tl-md rounded-bl-md uppercase">
              Project Name
            </th> */}
            <th className="p-2 w-36 uppercase">Subscription</th>
            <th className="uppercase w-22">Price</th>
            <th className="uppercase w-40 ">Payment Status</th>
            <th className="  uppercase w-72 ">Order Id</th>
            <th className=" uppercase w-40">Order Date</th>
            <th className=" uppercase w-40">Invoice</th>
            <td align="center">
              <AppIcon onClick={handleOnOptionsClick}>
                <MoreVertIcon />
              </AppIcon>
            </td>

            {/* <th className="rounded-tr-md rounded-br-md text-center">
              {isFetchingOrdersBg ? (
                <CircularProgress size="20px" />
              ) : (
                <Tooltip title="Refresh list">
                  <ReplayIcon
                    style={{
                      width: '20px',
                      height: '20px',
                      color: Colors.brand.primary,
                      cursor: 'pointer',
                    }}
                    onClick={(e) => {
                      e?.preventDefault();
                      e?.stopPropagation();
                      refetchOrders();
                    }}
                  />
                </Tooltip>
              )}
            </th> */}
            <Menu
              anchorEl={anchorEl}
              keepMounted
              open={Boolean(anchorEl)}
              onClose={() => {
                setAnchorEl(null);
              }}
              // TransitionComponent={Fade}
              style={{ borderRadius: '1rem' }}
            >
              <MenuItem
                onClick={(e) => {
                  e?.preventDefault();
                  e?.stopPropagation();
                  refetchOrders();
                  setAnchorEl(null);
                  // handleOnView(project);
                }}
              >
                Refresh
              </MenuItem>
              <MenuItem
                onClick={() => {
                  handleUnsubscribe();
                  setAnchorEl(null);
                  // handleOnView(project);
                }}
              >
                Unsubscribe
              </MenuItem>
            </Menu>
          </tr>

          {ordersData.map((order) => {
            return <OrderRow order={order} />;
          })}
        </table>
      )}

      {/* Empty state */}
      {_.isEmpty(ordersData) && (
        <div className="h-full flex flex-col items-center justify-center">
          <img
            src={EmptyLogo}
            className="mb-4"
            style={{ width: '100px', height: '100px' }}
          />

          <h5 className="mb-3">There are no orders</h5>
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
