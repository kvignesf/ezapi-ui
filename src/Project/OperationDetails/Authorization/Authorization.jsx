import * as React from "react";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import _ from "lodash";
import Select from "@mui/material/Select";
import {
  getApiError,
  operationAtomWithMiddleware,
  parseGetOperationRequestResponse,
  parseGetOperationResponseResponse,
} from "../../../shared/utils";
import { useRecoilValue, useRecoilState } from "recoil";
export default function Authorization({ request = true, responseCode }) {
  const [authtype, setAuthtype] = React.useState("No Auth");
  const [tokentype, setTokentype] = React.useState("");
  let [operationData, setOperationDetails] = useRecoilState(
    operationAtomWithMiddleware
  );

  const handleChange = (event) => {
    setAuthtype(event.target.value);
    // console.log(operationData);
    // setOperationDetails((operationDetails) => {
    //   if (request) {
    //     console.log("operationDetails");
    //     // let authObj = operationDetails.operationRequest;
    //     // const clonedAuthObj = _.cloneDeep(authObj);
    //     // const clonedOperationDetails = _.cloneDeep(operationDetails);
    //     // clonedAuthObj["authorization"] = {
    //     //   authType: authtype,
    //     //   tokenType: tokentype,
    //     // };

    //     // clonedOperationDetails.operationRequest = clonedAuthObj;
    //   }
    // });
  };
  const handleChangeTokenType = (event) => {
    setTokentype(event.target.value);
    // setOperationDetails((operationDetails) => {
    //   const clonedOperationDetails = _.cloneDeep(operationDetails);
    //   clonedOperationDetails.operationRequest["authorization"]["authType"] =
    //     authtype;
    //   clonedOperationDetails.operationRequest["authorization"]["tokenType"] =
    //     tokentype;
    // });
  };

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
