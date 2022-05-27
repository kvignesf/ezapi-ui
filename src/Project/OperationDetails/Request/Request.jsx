import React, { useEffect, useState } from "react";
import { Tab, Tabs } from "@material-ui/core";
import { useRecoilValue, useRecoilState } from "recoil";
import { useGetRecoilValueInfo_UNSTABLE } from "recoil";
import { useParams } from "react-router";
import _ from "lodash";
import client from "../../../shared/network/client";
import {
  getApiError,
  operationAtomWithMiddleware,
  parseGetOperationRequestResponse,
  parseGetOperationResponseResponse,
} from "../../../shared/utils";
import {
  Box,
  Button,
  Card,
  Container,
  FormControlLabel,
  Grid,
  makeStyles,
  TextField,
  Typography,
} from "@material-ui/core";
// import { useParams } from "react-router";
// import { useGetOperation } from "../../../shared/query/operationDetailsQuery";
import Headers from "../Headers/Headers";
import Authorization from "../Authorization/Authorization";
import PathParams from "../PathParams/PathParams";
import QueryParams from "../QueryParams/QueryParams";
import FormData from "../FormData/FormData";
import operationAtom from "../../operationAtom";
import Body from "../Body/Body";
import TabLabel from "../../../shared/components/TabLabel";
import LoaderWithMessage from "../../../shared/components/LoaderWithMessage";
// import { operationAtomWithMiddleware } from "../../../shared/utils";

const Request = ({
  getDetailsMutation: { isLoading: isLoadingOperationRequest },
  projectType = "schema",
}) => {
  const [operationDetails, setOperationDetails] = useRecoilState(
    operationAtomWithMiddleware
  );

  const [paramNameArr, setParamNameArr] = useState([]);
  const [pathValidator, setPathValidator] = useState();
  const [count, setCount] = useState(0);

  const [customPath, setCustomPath] = useState(
    "/" + operationDetails.path.pathName + ""
  );

  function buildcustomPath(e) {
    // setCustomPath(e?.currentTarget?.value);
    var c_name = e;

    var path_name = "/" + operationDetails.path.pathName;
    //path
    if (c_name?.includes(path_name + "/") && path_name[1] == c_name?.[1]) {
    } else {
      c_name = path_name;
    }
    //adding
    paramNameArr.map((paramItem, index) => {
      if (c_name.includes("{" + paramItem + "}")) {
      } else {
        c_name = c_name?.concat("/{" + paramItem + "}");
      }
    });
    //deleting
    var paramsToDelete = [];
    var pattern = /\{(.*?)\}/g;
    var match;
    while ((match = pattern.exec(c_name)) != null) {
      paramsToDelete.push(match[1]);
    }
    var paramsToDelete = paramsToDelete.filter(
      (paramItem) => !paramNameArr.includes(paramItem)
    );

    paramsToDelete.map((deleteItem) => {
      c_name = c_name?.replace("/{" + deleteItem + "}", "");
    });
    setCustomPath(c_name);
  }

  const validateBrackets = (str = "") => {
    const strArr = str.split("");
    let counter = 0;
    for (let i = 0, len = strArr.length; i < len; i++) {
      if (strArr[i] === "{") {
        counter++;
      } else if (strArr[i] === "}") {
        counter--;
      }
      if (counter < 0) {
        return false;
      }
    }
    if (counter === 0) {
      return true;
    }
    return false;
  };

  useEffect(() => {
    let pathParamArray = operationDetails.operationRequest.pathParams;

    var tempArr = [];
    if (pathParamArray.length == 0) {
      tempArr = [];
    } else {
      pathParamArray.map((item) => {
        tempArr.push(item["name"]);
      });
    }

    setParamNameArr(tempArr);
  }, [operationDetails.operationRequest.pathParams]);
  useEffect(() => {
    buildcustomPath(customPath);
  }, [paramNameArr, customPath]);
  useEffect(() => {
    setPathValidator(validateBrackets(customPath));
    // setOperationDetails((operationDetails) => {
    //   const clonedOperationDetails = _.cloneDeep(operationDetails);

    //   clonedOperationDetails.endpoint = customPath;

    //   return clonedOperationDetails;
    // });
  }, [customPath]);

  const [currentTab, setTab] = useState(0);

  const operationState = useRecoilValue(operationAtomWithMiddleware);

  if (isLoadingOperationRequest) {
    return (
      <div className='mt-24'>
        <LoaderWithMessage message={"Fetching details"} contained />
      </div>
    );
  }
  // console.log(currentTab);
  return (
    <div>
      <div className='border-b-2 mx-3 h-full'>
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
            label={<TabLabel label={"Authorization"} />}
            style={{
              outline: "none",
            }}
          />
          <Tab
            label={<TabLabel label={"Headers"} />}
            style={{
              outline: "none",
            }}
          />

          <Tab
            label={<TabLabel label={"Form Data"} />}
            style={{
              outline: "none",
            }}
          />
          <Tab
            label={<TabLabel label={"Path Params"} />}
            style={{
              outline: "none",
            }}
          />
          <Tab
            label={<TabLabel label={"Query Params"} />}
            style={{
              outline: "none",
            }}
          />
          {operationState?.operation?.operationType?.toLowerCase() !==
            "get" && (
            <Tab
              label={<TabLabel label={"Request Body"} />}
              style={{
                outline: "none",
              }}
            />
          )}
        </Tabs>
      </div>
      {currentTab == 3 && (
        <div className='flex flex-row justify-end mr-2 '>
          {" "}
          <p className='  self-center mr-5'>Path: </p>
          <TextField
            defaultValue={customPath}
            className='path'
            error={!pathValidator}
            helperText={!pathValidator ? "Invalid Path" : null}
            id='outlined-basic'
            variant='outlined'
            size='small'
            style={{ width: "75%" }}
            value={customPath}
            onChange={(e) => {
              buildcustomPath(e?.currentTarget?.value);
            }}
          />
        </div>
      )}
      {currentTab === 0 && <Authorization request={true} />}
      {currentTab === 1 && <Headers request={true} />}
      {currentTab === 2 && <FormData request={true} />}
      {currentTab === 3 && <PathParams request={true} />}
      {currentTab === 4 && <QueryParams request={true} />}
      {currentTab === 5 && <Body request={true} projectType={projectType} />}
    </div>
  );
};

export default Request;
