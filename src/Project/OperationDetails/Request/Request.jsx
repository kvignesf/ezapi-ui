import React, { useEffect, useState } from "react";
import { Tab, Tabs, Tooltip } from "@material-ui/core";
import { useRecoilValue, useRecoilState } from "recoil";
import { useGetRecoilValueInfo_UNSTABLE } from "recoil";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
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
import AppIcon from "../../../shared/components/AppIcon";
import { TextField } from "@material-ui/core";
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
  const [pathValidator, setPathValidator] = useState(true);
  const [pathParam, setPathParam] = useState();
  const [firstTime, setFirstTime] = useState(true);
  const [tempPath, setTempPath] = useState();

  const [customPath, setCustomPath] = useState(
    operationState?.operationRequest?.endpoint
  );

  function buildcustomPath(e) {
    var c_name = e;

    var path_name = "/" + operationState.path.pathName;
    //path
    if (c_name?.includes(path_name + "/") && path_name[1] == c_name?.[1]) {
      console.log("path exists" + c_name);
    } else {
      c_name = path_name;
      console.log("path doesnt exists" + c_name);
    }
    //adding
    paramNameArr.map((paramItem, index) => {
      if (c_name.includes("{" + paramItem + "}")) {
        console.log("2" + c_name);
      } else {
        c_name = c_name?.concat("/{" + paramItem + "}");
        console.log("3" + c_name);
      }
    });
    console.log("4 " + c_name);
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
    console.log(paramsToDelete);
    paramsToDelete.map((deleteItem) => {
      c_name = c_name?.replace("/{" + deleteItem + "}", "");
    });
    console.log(c_name);
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
    console.log("inside 1");
    if (operationState?.operationRequest?.endpoint) {
      console.log("inside 1.1" + operationState?.operationRequest?.endpoint);
      setTempPath(operationState?.operationRequest?.endpoint);
    }
  }, [operationState?.operationRequest?.endpoint]);
  useEffect(() => {
    console.log("inside 2");

    let pathParamArray = operationState.operationRequest.pathParams;
    var tempArr = [];
    if (pathParamArray.length == 0) {
      tempArr = [];
    } else {
      pathParamArray.map((item) => {
        tempArr.push(item["name"]);
      });
    }
    // console.log(tempArr, pathParam);
    if (
      (JSON.stringify(pathParam) != JSON.stringify(tempArr) && pathParam) ||
      firstTime
    ) {
      setFirstTime(false);
      setParamNameArr(tempArr);
      setPathParam(tempArr);
    }
  }, [operationState.operationRequest.pathParams]);

  useEffect(() => {
    console.log("whyy ->" + paramNameArr);
    if (operationState?.operationRequest?.endpoint && paramNameArr.length > 0) {
      console.log("inside 3" + paramNameArr + "...... " + tempPath);
      buildcustomPath(tempPath);

      setPathValidator(validateBrackets(customPath));
    }
  }, [paramNameArr, tempPath, customPath]);

  const [currentTab, setTab] = useState(0);

  // const operationState = useRecoilValue(operationAtomWithMiddleware);

  if (isLoadingOperationRequest) {
    return (
      <div className='mt-24'>
        <LoaderWithMessage message={"Fetching details"} contained />
      </div>
    );
  }

  function customPathSave() {
    setOperationState((operationState) => {
      const newOperationDetails = _.cloneDeep(operationState);
      const clonedCustomPat = _.cloneDeep(customPath);
      newOperationDetails.operationRequest["endpoint"] = clonedCustomPat;
      return newOperationDetails;
    });
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
                setTempPath(e?.currentTarget?.value);
              }}
            />
          ) : (
            <p className='h-5 my-2 mr-44  self-center'>{customPath}</p>
          )}
          <AppIcon
            onClick={(e) => {
              e?.preventDefault();
              e?.stopPropagation();

              customPathSave();
            }}
          >
            <Tooltip title='Save changes'>
              <CloudUploadIcon style={{ color: "lightblue" }} />
            </Tooltip>
          </AppIcon>
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
