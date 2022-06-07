import React, { useEffect, useState } from "react";
import { Tab, Tabs } from "@material-ui/core";
import { useRecoilValue, useRecoilState } from "recoil";
import { useGetRecoilValueInfo_UNSTABLE } from "recoil";
import { useParams } from "react-router";
import { getOperation } from "../../../shared/query/operationDetailsQuery";
import _ from "lodash";
import { useSetRecoilState } from "recoil";
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
  ...props
}) => {
  const { projectId } = useParams();
  const [operationState, setOperationState] = useRecoilState(
    operationAtomWithMiddleware
  );

  const [paramNameArr, setParamNameArr] = useState([]);
  const [pathValidator, setPathValidator] = useState();
  const [pathParam, setPathParam] = useState();
  const [endpoint, setEndpoint] = useState();
  const [firstTime, setFirstTime] = useState(true);

  const [customPath, setCustomPath] = useState(
    "/" + operationState.path.pathName + ""
  );
  useEffect(() => {
    getOperation({
      operationId: operationState.operation.operationId,
      pathId: operationState.path.pathId,
      resourceId: operationState.resource.resourceId,
      projectId: projectId,
    }).then((x) => {
      // console.log(x?.getRequestApiData?.endpoint);
      setEndpoint(x?.getRequestApiData?.endpoint);
      setCustomPath(x?.getRequestApiData?.endpoint);
    });
  }, []);

  function buildcustomPath(e) {
    // setCustomPath(e?.currentTarget?.value);
    var c_name = e;

    var path_name = "/" + operationState.path.pathName;
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
    return c_name;
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
    let pathParamArray = operationState.operationRequest.pathParams;
    // console.log(operationState);
    var tempArr = [];
    if (pathParamArray.length == 0) {
      tempArr = [];
    } else {
      pathParamArray.map((item) => {
        tempArr.push(item["name"]);
      });
    }
    // console.log(pathParam, tempArr, firstTime);

    if (
      (JSON.stringify(pathParam) != JSON.stringify(tempArr) && pathParam) ||
      firstTime
    ) {
      // console.log("in");
      setFirstTime(false);
      setParamNameArr(tempArr);
      setPathParam(tempArr);
    }
  }, [operationState.operationRequest.pathParams]);

  useEffect(() => {
    // console.log("changed");
    buildcustomPath(customPath);
    setPathValidator(validateBrackets(customPath));
  }, [paramNameArr]);
  useEffect(() => {
    // console.log("userManipulated");
    buildcustomPath(customPath);
    setPathValidator(validateBrackets(customPath));
  }, [customPath]);
  useEffect(() => {
    setOperationState((operationState) => {
      const newOperationDetails = _.cloneDeep(operationState);
      const clonedCustomPat = _.cloneDeep(customPath);
      newOperationDetails.operationRequest["endpoint"] = clonedCustomPat;
      return newOperationDetails;
    });
    // console.log(customPath);
  }, [customPath]);

  const [currentTab, setTab] = useState(0);

  // const operationState = useRecoilValue(operationAtomWithMiddleware);

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
          {props.canEdit ? (
            <TextField
              defaultValue={customPath}
              className='path'
              disabled={!props.canEdit}
              error={!pathValidator}
              helperText={!pathValidator ? "Invalid Path" : null}
              id='outlined-basic'
              variant='outlined'
              size='small'
              style={{ width: "75%", color: "red", textColor: "red" }}
              value={customPath}
              onChange={(e) => {
                buildcustomPath(e?.currentTarget?.value);
              }}
            />
          ) : (
            <p className='h-5 my-2 mr-44  self-center'>{customPath}</p>
          )}
        </div>
      )}
      {currentTab === 0 && (
        <Authorization canEdit={props.canEdit} request={true} />
      )}
      {currentTab === 1 && <Headers request={true} />}
      {currentTab === 2 && <FormData request={true} />}
      {currentTab === 3 && (
        <PathParams canEdit={props.canEdit} request={true} />
      )}
      {currentTab === 4 && <QueryParams request={true} />}
      {currentTab === 5 && <Body request={true} projectType={projectType} />}
    </div>
  );
};

export default Request;
