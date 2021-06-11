import React, { useEffect, useState } from "react";
import { Fade, Tab, Tabs } from "@material-ui/core";
import { useRecoilValue, useRecoilState } from "recoil";
import _ from "lodash";
import AddIcon from "@material-ui/icons/Add";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import { Menu, MenuItem } from "@material-ui/core/index";

import Headers from "../Headers/Headers";
import operationAtom from "../../operationAtom";
import Body from "../Body/Body";
import TabLabel from "../../../shared/components/TabLabel";
import LoaderWithMessage from "../../../shared/components/LoaderWithMessage";
import AppIcon from "../../../shared/components/AppIcon";
import Colors from "../../../shared/colors";
import classNames from "classnames";
import Constants from "../../../shared/constants";

const Response = ({
  getDetailsMutation: {
    isLoading: isLoadingOperationResponse,
    data: operationData,
    mutate: getOperationDetails,
  },
}) => {
  const operationState = useRecoilValue(operationAtom);
  const [selectedResponseCode, setSelectedResponseCode] = useState(
    operationState?.operationResponse[0]?.responseCode ??
      Constants.mandatoryResponseCode
  );

  const changeResponseCode = (value) => {
    setSelectedResponseCode(value);
  };

  if (isLoadingOperationResponse) {
    return (
      <div className='mt-24'>
        <LoaderWithMessage message={"Fetching details"} contained />
      </div>
    );
  }

  return (
    <div className='h-full'>
      <div className='flex flex-row w-min mb-2 m-3'>
        <ResponseCodeSelection
          onChange={changeResponseCode}
          selectedCode={selectedResponseCode}
        />

        <AddResponseCode />
      </div>

      <ResponseContent selectedCode={selectedResponseCode} />
    </div>
  );
};

const ResponseContent = ({ selectedCode }) => {
  const [currentTab, setTab] = useState(0);
  const [operationState, setOperationState] = useRecoilState(operationAtom);
  const [responseData, setData] = useState(null);

  useEffect(() => {
    const responseContent = operationState.operationResponse.find(
      (item) => item.responseCode === selectedCode
    );

    setData(responseContent);
  }, [selectedCode]);

  if (!responseData) {
    return null;
  }

  return (
    <div>
      <Tabs
        value={currentTab}
        onChange={(_, index) => {
          setTab(index);
        }}
        aria-label='add project tabs'
        indicatorColor='primary'
        textColor='primary'
        style={{ width: "min-content" }}
      >
        <Tab
          label={<TabLabel label={"Headers"} />}
          style={{
            outline: "none",
          }}
        />

        <Tab
          label={<TabLabel label={"Response Body"} />}
          style={{
            outline: "none",
          }}
        />
      </Tabs>

      {currentTab === 0 && (
        <Headers
          key={selectedCode}
          request={false}
          responseCode={selectedCode}
        />
      )}
      {currentTab === 1 && (
        <Body key={selectedCode} request={false} responseCode={selectedCode} />
      )}
    </div>
  );
};

const AddResponseCode = () => {
  const [profileMenuAnchorEl, setProfilemenuAnchorEl] = useState(null);
  const [operationState, setOperationState] = useRecoilState(operationAtom);

  const getAvailableResponseCodes = () => {
    return _.difference(
      Constants.allResponseCodes,
      operationState?.operationResponse?.map((item) => {
        return item.responseCode;
      }) ?? []
    );
  };

  const onAdd = (code) => {
    setOperationState((operationState) => {
      const clonedOperationState = _.cloneDeep(operationState);

      clonedOperationState.operationResponse.push({
        responseCode: code,
        headers: [],
        body: [],
      });

      return clonedOperationState;
    });
  };

  return (
    <div className='p-1 pl-2 pr-2  flex flex-row items-center rounded-r-md border-2'>
      <AppIcon
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setProfilemenuAnchorEl(e?.currentTarget);
        }}
      >
        <AddIcon style={{ fontSize: "18px", color: Colors.neutral.gray5 }} />
      </AppIcon>

      <Menu
        id='edit-response-code-menu'
        anchorEl={profileMenuAnchorEl}
        keepMounted
        open={Boolean(profileMenuAnchorEl)}
        onClose={() => {
          setProfilemenuAnchorEl(null);
        }}
        TransitionComponent={Fade}
        style={{ borderRadius: "1rem", zIndex: "100" }}
      >
        {getAvailableResponseCodes().map((code) => {
          return (
            <MenuItem
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setProfilemenuAnchorEl(null);

                onAdd(code);
              }}
            >
              {code}
            </MenuItem>
          );
        })}
      </Menu>
    </div>
  );
};

const ResponseCodeSelection = ({ selectedCode, onChange }) => {
  const [profileMenuAnchorEl, setProfilemenuAnchorEl] = useState(null);
  const [operationState, setOperationState] = useRecoilState(operationAtom);

  const getResponseCodes = () => {
    return (
      operationState?.operationResponse?.map((item) => {
        return item?.responseCode;
      }) ?? []
    );
  };

  const onDelete = (code) => {
    if (code !== Constants.mandatoryResponseCode) {
      setOperationState((operationState) => {
        const clonedOperationState = _.cloneDeep(operationState);
        const itemIndex = clonedOperationState.operationResponse.findIndex(
          (item) => item.responseCode === code
        );

        if (itemIndex >= 0) {
          clonedOperationState.operationResponse.splice(itemIndex, 1);

          onChange(clonedOperationState.operationResponse[0].responseCode);
        }

        return clonedOperationState;
      });
    }
  };

  return (
    <>
      {getResponseCodes()?.map((code, index) => {
        return (
          <div
            className={classNames(
              "p-1 pl-2 pr-2 flex flex-row items-center cursor-pointer",
              {
                "rounded-l-md": index === 0,

                "bg-brand-primary": code === selectedCode,
                "border-2": code !== selectedCode,
              },
              "border-r-0"
            )}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();

              onChange(code);
            }}
          >
            <p
              className={classNames("text-overline2", {
                "text-white": code === selectedCode,
                "text-neutral-gray4": code !== selectedCode,
              })}
            >
              {code}
            </p>

            {code !== Constants.mandatoryResponseCode && code === selectedCode && (
              <div
                className='ml-1 flex flex-row items-center'
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setProfilemenuAnchorEl(e?.currentTarget);
                }}
              >
                <AppIcon>
                  <MoreVertIcon style={{ fontSize: "18px", color: "white" }} />
                </AppIcon>

                <Menu
                  id='edit-response-code-menu'
                  anchorEl={profileMenuAnchorEl}
                  keepMounted
                  open={Boolean(profileMenuAnchorEl)}
                  onClose={() => {
                    setProfilemenuAnchorEl(null);
                  }}
                  TransitionComponent={Fade}
                  style={{ borderRadius: "1rem", zIndex: "100" }}
                >
                  <MenuItem
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setProfilemenuAnchorEl(null);

                      onDelete(code);
                    }}
                  >
                    <p className='text-accent-red'>Delete</p>
                  </MenuItem>
                </Menu>
              </div>
            )}
          </div>
        );
      })}
    </>
  );
};

export default Response;
