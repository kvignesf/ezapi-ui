import React, { useEffect, useState } from 'react';
import { useTheme } from '@material-ui/core/styles';
import Title from './Title';
import { Constants } from '../Constants';
import Axios from 'axios';
import { Box, Grid, Typography } from '@material-ui/core';
import DownloadList from './DownloadList';

function createData(id, name, dbname, api_ops_id, dtStamp) {
  return {id, name, dbname, api_ops_id, dtStamp};
}

export default function DownloadAPIView(props) {
  const VisualViewRef = React.useRef(null);
  const theme = useTheme();
  const [APIRecords, setAPIRecords] = useState([]);
  const [errorMessage, setErrorMessage] = useState(null);
  const [selectedAPI, setSelectedAPI] = useState(null);

  const selectAPI = async (apiID) => {
    const selItem = APIRecords.find(item=>item.id == apiID);
    setSelectedAPI(selItem);
    if (selItem) {
      props.updateVisualization(selItem.api_ops_id);
    }
  }

  const showError = async (message) => {
    setErrorMessage(message);
  }

  useEffect(() => {
    async function getUploadHistory(uToken) {
      const tokenString = "Bearer " + uToken;
      const bodyUrlParams = new URLSearchParams([
        ["limit", 5],
      ]);
      const requestOptions = {
        method: "GET",
        headers: new Headers({
          "content-type": "application/x-www-form-urlencoded",
          "Access-Control-Allow-Origin": "*",
          "Authorization": tokenString
        }),
      };
      
      let api_result = await fetch(Constants.localURL + '/upload_history?' + bodyUrlParams, requestOptions);

      if (api_result.status == 401) {
        setErrorMessage(api_result.statusText)
      } else {
        var res = await api_result.text();
        var result = await JSON.parse(res);
        api_result = result.data;

        if (api_result.length > 0) {
          const data = api_result.map(item => {
            return createData(item._id, item.filename, item.dbname, item.api_ops_id, item.dtstamp);
          });
          setAPIRecords(data);
        }
        else {
          setErrorMessage(api_result.message)
        }
      }
    }

    setErrorMessage('');
    getUploadHistory(props.token);
  }, [props.isUploaded]);

  return (
    <React.Fragment>
      <Title>Download Ez API / History</Title>
      <Grid container spacing={1}>
      
        <Grid item xs={12} md={12} lg={12}>
          {errorMessage && errorMessage !='' ? (
              <Box
                display="flex"
                justifyContent="center"
                bgcolor="background.paper"
              >
                <Typography
                  variant="subheading1"
                  display="block"
                  gutterBottom
                  color="secondary"
                  pt={20}
                >
                  {errorMessage}
                </Typography>
              </Box>
            ) : (
              ""
          )}
          <DownloadList apiList={APIRecords} selectAPI={selectAPI} throwError={showError}/>
        </Grid>
      </Grid>
    </React.Fragment>
  );
}
