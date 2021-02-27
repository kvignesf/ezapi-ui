import React from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Box from '@material-ui/core/Box';
import homeImg from "../static/images/home1.png";
import visualImg from "../static/images/visual.jpg";
import { Paper } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  '@global': {
    ul: {
      margin: 0,
      padding: 0,
      listStyle: 'none',
    },
  },
  appBar: {
    borderBottom: `1px solid ${theme.palette.divider}`,
    backgroundColor: '#252525'
  },
  toolbar: {
    flexWrap: 'wrap',
  },
  toolbarTitle: {
    flexGrow: 1,
  },
  link: {
    margin: theme.spacing(1, 1.5),
  },
  heroContent: {
    padding: theme.spacing(6, 0, 4),
  },
  heroContent1: {
    padding: theme.spacing(6, 0, 0),
  },
  cardHeader: {
    backgroundColor:
      theme.palette.type === 'light' ? theme.palette.grey[200] : theme.palette.grey[700],
  },
  cardPricing: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'baseline',
    marginBottom: theme.spacing(2),
  },
  fullImage : {
    width: "100%",
    height: "250px"
  },
  fullImage1 : {
    width: "100%",
    height: "200px"
  },
  textStyle: {
    width: "100%",
    height: "100%"
  }
}));

export default function ProductComponent() {
  const classes = useStyles();

  return (
    <React.Fragment>
      <CssBaseline />
      <Container maxWidth="sm" component="main" className={classes.heroContent}>
        <Typography component="h5" variant="h5" align="center" color="textPrimary" gutterBottom>
          Get to know about Product
        </Typography>
      </Container>
      <Container maxWidth="md" component="main">
        <Grid container spacing={5} alignItems="flex-end">
        <img className={classes.fullImage}
            src={homeImg}
            alt="EZ API"
        />
        </Grid>
      </Container>

      <Container maxWidth="md" component="main" className={classes.heroContent}>
      <Typography component="h5" variant="h5" align="center" color="textPrimary" gutterBottom>
          Product
      </Typography>
      <Paper>
      <Box pt={2} pb={2}>
        
      </Box>
        
        <Grid container spacing={5} alignItems="flex-end">
          <Grid item xs={12} sm={6} md={6}>
            <Box pl={4} pr={4}>
            <Typography color="textPrimary" gutterBottom className={classes.textStyle}>
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
            </Typography>
            </Box>
            
          </Grid>
          <Grid item xs={12} sm={6} md={6}>
            <img className={classes.fullImage1}
                src={visualImg}
                alt="EZ API"
            />
            
          </Grid>
        </Grid>
      </Paper>
      </Container>
    </React.Fragment>
  );
}
