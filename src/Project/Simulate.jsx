import React, { useState, useEffect } from "react";
import TabLabel from "../shared/components/TabLabel";
import Colors from "../shared/colors";
import { Tab, Tabs, makeStyles } from "@material-ui/core";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import classNames from "classnames";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { PrimaryButton } from "../shared/components/AppButton";
import TextField from "@mui/material/TextField";
import { createTheme, ThemeProvider } from "@mui/material/styles";
// const theme = createTheme({
//   palette: {
//     custom: {
//       green: "#71C72C",
//     },
//   },
// });

const Simulate = ({ simulateData }) => {
  const [currentTab, setCurrentTab] = useState(0);
  const [textBoxValue, setTextBoxValue] = useState(0);
  const [responseData, setResponseData] = useState("");

  useEffect(() => {
    console.log(currentTab);

    switch (currentTab) {
      case 0:
        setTextBoxValue(JSON.stringify(simulateData?.formData));
        break;
      case 1:
        setTextBoxValue(JSON.stringify(simulateData?.headers));
        break;
      case 2:
        setTextBoxValue(JSON.stringify(simulateData?.requestBody));
        break;
      default:
        setTextBoxValue(JSON.stringify(simulateData?.formData));
    }
  }, [currentTab, simulateData]);
  const height = 42;

  // magic number which must be set appropriately for height
  const labelOffset = -6;

  // get this from your form library, for instance in
  // react-final-form it's fieldProps.meta.active
  // or provide it yourself - see notes below
  const focused = true;
  return (
    <div className='flex-1 relative w-full p-2'>
      <div className=' flex flex-row gap-2'>
        <Button variant='outlined' size='small'>
          {simulateData?.httpMethod.toUpperCase()}
        </Button>

        <TextField
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
            style: {
              height,
              padding: "0 14px",
            },
          }}
          value={simulateData?.endpoint}
        />
        <PrimaryButton
          onClick={() =>
            setResponseData(JSON.stringify(simulateData?.responseBody))
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
        {/* <Card className='p-2 h-40' sx={{ minWidth: 275 }}>
          form data details
        </Card> */}
        <TextField
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
