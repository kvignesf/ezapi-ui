import React, { useEffect } from "react";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import _ from "lodash";
import Select from "@mui/material/Select";
import { getOperation } from "../../../shared/query/operationDetailsQuery";
import { useParams } from "react-router";
import {
  getApiError,
  operationAtomWithMiddleware,
  parseGetOperationRequestResponse,
  parseGetOperationResponseResponse,
} from "../../../shared/utils";
import { useRecoilValue, useRecoilState } from "recoil";
export default function Authorization({ request = true, responseCode }) {
  const [operationState, setOperationState] = useRecoilState(
    operationAtomWithMiddleware
  );
  const { projectId } = useParams();
  const [authtype, setAuthtype] = React.useState("No Auth");
  const [tokentype, setTokentype] = React.useState("");
  let [operationDetails, setOperationDetails] = useRecoilState(
    operationAtomWithMiddleware
  );

  const handleChange = (event) => {
    setAuthtype(event.target.value);
  };
  const handleChangeTokenType = (event) => {
    setTokentype(event.target.value);
  };
  useEffect(() => {
    getOperation({
      operationId: operationState.operation.operationId,
      pathId: operationState.path.pathId,
      resourceId: operationState.resource.resourceId,
      projectId: projectId,
    }).then((x) => {
      setAuthtype(x?.getRequestApiData?.requestBody?.authorization?.authType);
      setTokentype(x?.getRequestApiData?.requestBody?.authorization?.tokenType);
    });
  }, []);
  useEffect(() => {
    if (authtype == "Bearer Token" && tokentype != "JWT") setTokentype("JWT");
    setOperationDetails((operationDetails) => {
      if (request) {
        const newOperationDetails = _.cloneDeep(operationDetails);
        const clonedAuthType = _.cloneDeep(authtype);
        const clonedTokenType = _.cloneDeep(tokentype);
        newOperationDetails.operationRequest["authorization"] = {
          "authType": clonedAuthType,
          "tokenType": clonedTokenType,
        };
        return newOperationDetails;
      }
    });
  }, [authtype, tokentype]);

  return (
    <div className='w-1/2 m-6'>
      {" "}
      <div className='grid  grid-cols-2 gap-1 '>
        {" "}
        <div className='grid items-center grid-cols-1 gap-2 '>
          <p className=''>Auth Type: </p>

          <FormControl style={{ width: "200px" }}>
            <Select value={authtype} label='Age' onChange={handleChange}>
              <MenuItem value={"No Auth"}>No Auth</MenuItem>
              <MenuItem value={"Bearer Token"}>Bearer Token</MenuItem>
            </Select>
          </FormControl>
        </div>
        {authtype == "Bearer Token" && (
          <div className='grid items-center grid-cols-1 col-start-2 gap-1'>
            <p className='mr-4 self-center'>Token Type: </p>
            <Box>
              <FormControl style={{ width: "200px" }}>
                <Select
                  labelId='demo-simple-select-label'
                  id='demo-simple-select'
                  value={tokentype}
                  onChange={handleChangeTokenType}
                >
                  <MenuItem value='JWT'>JWT</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </div>
        )}
      </div>
    </div>
  );
}
