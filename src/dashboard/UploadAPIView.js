import React, { useState } from 'react';
import Link from '@material-ui/core/Link';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Title from './Title';
import { Box, Button, Grid } from '@material-ui/core';
import { useForm } from 'react-hook-form';

function preventDefault(event) {
  event.preventDefault();
}

const useStyles = makeStyles({
  depositContext: {
    flex: 1,
  },
});

export default function UploadAPIView(props) {
  const { register, handleSubmit } = useForm();
  const [ fileName, setFileName ] = useState("");

  const onChange = (data) => {
    let file = data["swaggerAPI"][0];
    if (file && file.name) {
      setFileName(file.name);
    }
    
    props.uploadFile(file);
  }
  
  const classes = useStyles();
  return (
    <React.Fragment>
      <Title>Upload API Spec</Title>
      
      <form onChange={handleSubmit(onChange)}>
      <Box display="flex" justifyContent="center" bgcolor="background.paper">
        <Grid container spacing={1}>
          <Grid item xs={12} md={12} lg={12}>
            <input
              required
              name="swaggerAPI"
              ref={register}
              accept=".json"
              className={classes.input}
              style={{ display: 'none' }}
              id="raised-button-file"
              multiple
              type="file"
            />
            <label htmlFor="raised-button-file">
              {/* <Button variant="raised" component="span" className={classes.button}>
                Upload
              </Button> */}
              <Button variant="contained" component="span" className={classes.submit} size="small" color="primary">
                Upload
              </Button>
            </label>
          </Grid>
          <Grid item xs={12} md={12} lg={12}>
            {(fileName != "" ? 
              <Typography> {fileName} </Typography>
              :
              ""
            )}
          </Grid>
        </Grid>
      </Box>
      </form>
      <div>
        <Link color="primary" href="#" onClick={preventDefault}>
        </Link>
      </div>
    </React.Fragment>
  );
}
