import React, { useState, useEffect } from "react";
import TabLabel from "../shared/components/TabLabel";
import Colors from "../shared/colors";
import { Tab, Tabs, makeStyles } from "@material-ui/core";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { PrimaryButton } from "../shared/components/AppButton";
import TextField from "@mui/material/TextField";

const Simulate = () => {
  return (
    <div className='flex-1 relative w-full p-2'>
      <div className='h-1/2'>
        <div className=' flex flex-row'>
          <Button variant='outlined'>GET</Button>
          <TextField fullWidth id='fullWidth' />
          <PrimaryButton>SEND</PrimaryButton>
        </div>
        <div className=' flex flex-row'>
          {" "}
          <Tabs
            value={0}
            aria-label='add project tabs'
            indicatorColor='primary'
            textColor='primary'
            style={{ width: "min-content" }}
          >
            <Tab
              label={<TabLabel label={"Form Data"} />}
              style={{ outline: "none", border: "none" }}
              value={0}
            />

            <Tab
              label={<TabLabel label={"Headers"} />}
              style={{ outline: "none", border: "none" }}
              value={"param"}
            />

            <Tab
              label={<TabLabel label={"Request Body"} />}
              style={{ outline: "none", border: "none" }}
              value={"db"}
            />
          </Tabs>
        </div>
        <Card className='p-2 h-40' sx={{ minWidth: 275 }}>
          form data details
        </Card>
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
            <Card className='p-2 h-40' sx={{ minWidth: 275 }}>
              response data details
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Simulate;
