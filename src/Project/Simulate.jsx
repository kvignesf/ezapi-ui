import React, { useState, useEffect } from "react";
import TabLabel from "../shared/components/TabLabel";
import Colors from "../shared/colors";
import { Tab, Tabs, makeStyles } from "@material-ui/core";
import Box from "@mui/material/Box";
import { withStyles } from "@material-ui/core/styles";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import classNames from "classnames";
import Button from "@mui/material/Button";
import { MuiThemeProvider } from "@material-ui/core/styles";
import Typography from "@mui/material/Typography";
import { PrimaryButton } from "../shared/components/AppButton";
import TextField from "@mui/material/TextField";

import { createTheme, ThemeProvider } from "@mui/material/styles";

const styles = (theme) => ({
  root: {
    marginRight: 8,
    "& .MuiInputBase-root.Mui-disabled": {
      color: "green", // (default alpha is 0.38)
    },
  },
});
const Simulate = ({ simulateData }, props) => {
  const [currentTab, setCurrentTab] = useState(0);
  const [textBoxValue, setTextBoxValue] = useState();
  const [responseData, setResponseData] = useState("");

  useEffect(() => {
    // console.log(currentTab);

    switch (currentTab) {
      case 0:
        setTextBoxValue(JSON.stringify(simulateData?.formData, null, 4));
        break;
      case 1:
        setTextBoxValue(JSON.stringify(simulateData?.headers, null, 4));
        break;
      case 2:
        setTextBoxValue(JSON.stringify(simulateData?.requestBody, null, 4));
        break;
      default:
        setTextBoxValue(JSON.stringify(simulateData?.formData, null, 4));
    }
  }, [currentTab, simulateData]);
  const height = 42;

  const labelOffset = -6;

  const focused = true;
  return (
    <div className='flex-1 relative w-full p-2'>
      <div className=' flex flex-row gap-2'>
        <Button variant='outlined' size='small'>
          {simulateData ? simulateData?.httpMethod.toUpperCase() : "GET"}
        </Button>

        <TextField
          // inputProps={{ readOnly: true }}
          placeholder='Endpoint'
          className={styles("").root}
          key={simulateData}
          fullWidth
          variant='outlined'
          /* styles the wrapper */
          style={{ height }}
          /* styles the label component */
          InputLabelProps={{
            style: {
              height,
              ...(!focused && { top: `${labelOffset}px` }),
            },
          }}
          /* styles the input component */
          inputProps={{
            readOnly: true,
            style: {
              height,
              padding: "0 14px",
            },
          }}
          value={simulateData?.endpoint}
        />
        <PrimaryButton
          onClick={() =>
            setResponseData(JSON.stringify(simulateData?.responseBody, null, 4))
          }
        >
          SEND
        </PrimaryButton>
      </div>
      <div className='h-1/2'>
        <div className=' flex flex-row mb-3'>
          {" "}
          <Tabs
            value={currentTab}
            onChange={(_, index) => {
              setCurrentTab(index);
            }}
            aria-label='add project tabs'
            indicatorColor='primary'
            textColor='primary'
          >
            <Tab
              label={<TabLabel label={"Form Data"} />}
              style={{ outline: "none", border: "none" }}
            />

            <Tab
              label={<TabLabel label={"Headers"} />}
              style={{ outline: "none", border: "none" }}
            />

            <Tab
              label={<TabLabel label={"Request Body"} />}
              style={{ outline: "none", border: "none" }}
            />
          </Tabs>
        </div>

        <TextField
          inputProps={{ readOnly: true }}
          key={simulateData}
          fullWidth
          id='outlined-multiline-static'
          multiline
          rows={6}
          value={textBoxValue}
        />
      </div>

      <div className='h-1/2'>
        {" "}
        <div className='border-t-2 h-full '>
          <div className=' flex flex-row'>
            <Tabs
              value={0}
              aria-label='add project tabs'
              indicatorColor='primary'
              textColor='primary'
              style={{ width: "min-content" }}
            >
              <Tab
                label={<TabLabel label={"Response Body"} />}
                style={{
                  borderRight: `2px solid ${Colors.neutral.gray6}`,
                  outline: "none",
                }}
              />
            </Tabs>
          </div>
          <div className='p-2 h-full'>
            {" "}
            <p className='p-2'>Status : 200</p>
            <TextField
              inputProps={{ readOnly: true }}
              key={simulateData}
              fullWidth
              id='outlined-multiline-static'
              multiline
              rows={6}
              value={responseData}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Simulate;
