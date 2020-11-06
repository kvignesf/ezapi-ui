import React, { useRef, useState,useEffect } from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Drawer from '@material-ui/core/Drawer';
import Box from '@material-ui/core/Box';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import Badge from '@material-ui/core/Badge';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Link from '@material-ui/core/Link';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import NotificationsIcon from '@material-ui/icons/Notifications';
import { mainListItems } from './listItems';
import Header from './Header';
import UploadAPIView from './UploadAPIView';
import DownloadAPIView from './DownloadAPIView';
import { AccountCircle, Fullscreen } from '@material-ui/icons';
import InputIcon from '@material-ui/icons/Input';

import Title from './Title';
import VisualizeView from './visualize/VisualizeView';
import Axios from 'axios';
import { Constants } from '../Constants';
import ezLogo from "../static/images/logo/png.png";
import { Avatar, Button } from '@material-ui/core';
import VisualizeAPIFullView from './visualize/VisualizeAPIFullView';

const styles = {
  'tooltip': {
    'display': 'flex',
    'justifyContent': 'center',
    'alignItems': 'center',
    'position': 'absolute',
    'textAlign': 'center',
    'width': '200px',
    'height': '28px',
    'padding': '2px',
    'font': '12px sans-serif',
    'background': 'rgb(222, 224, 227)',
    'border': '0px',
    'borderRadius': '8px',
    'pointerEvents': 'none',
    'visibility': 'hidden'
  }
}

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © '}
      <Link color="inherit" href="http://ezapi.ai/">
        EzAPI
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  toolbar: {
    paddingRight: 24, // keep right padding when drawer closed
  },
  toolbarIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '0 8px',
    ...theme.mixins.toolbar,
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: 36,
  },
  menuButtonHidden: {
    display: 'none',
  },
  title: {
    flexGrow: 1,
  },
  drawerPaper: {
    position: 'relative',
    whiteSpace: 'nowrap',
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerPaperClose: {
    overflowX: 'hidden',
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    width: theme.spacing(7),
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing(9),
    },
  },
  appBarSpacer: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    height: '100vh',
    overflow: 'auto',
  },
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
  paper: {
    padding: theme.spacing(2),
    display: 'flex',
    overflow: 'auto',
    flexDirection: 'column',
  },
  fixedHeight: {
    height: 240,
  },
  uploadHeight: {
    height: 120,
  },
  downloadHeight: {
    height: 360,
  },
  fullHeight: {
    height: "500px",
  },
  bigAvatar: {
    width: 50,
    height: 50,
    backgroundColor: "#ffffff",
  },
  button: {
    textTransform: 'capitalize',
  },
}));

export default function DashboardAPIView(props) {
  const ref = React.useRef(null);
  const downloadRef = React.useRef(null);
  const classes = useStyles();
  const [open, setOpen] = React.useState(true);
  const handleDrawerOpen = () => {
    setOpen(true);
  };
  const handleDrawerClose = () => {
    setOpen(false);
  };
  const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);
  const fullHeightPaper = clsx(classes.paper, classes.fullHeight);
  const uploadHeight = clsx(classes.paper, classes.uploadHeight);
  const downloadHeight = clsx(classes.paper, classes.downloadHeight);
  const sections = [
    { title: 'Visualize', url: '#' },
    { title: 'Virtualize', url: '#' },
    { title: 'Test', url: '#' },
    { title: 'Data', url: '#' },
    { title: 'Security', url: '#' },
    { title: 'Performance', url: '#' },
    { title: 'Monitor', url: '#' }
  ];

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isNewUpload, setIsNewUpload] = useState(true);
  const [inputFile, setInputFile] = useState(null);
  const [isFullScreen, setIsFullScreen] = React.useState(false);
  const [selectedAPI, setSelectedAPI] = React.useState(null);

  const uploadFile = async (file) => {
    const formData = new FormData();
    formData.append('file', file);

    let headers = { 'Content-Type': 'multipart/form-data' }
    if (props.token) {
      headers['Authorization'] = "Bearer " + props.token;
    }

    const config = {headers:headers};

    let parsed_result = await Axios.post(Constants.localURL + '/upload_file', formData, config);
    parsed_result = parsed_result.data;
    if (parsed_result.success) {
      let api_ops_id = parsed_result.data['api_ops_id'];
      //ref.current.parseFile(api_ops_id);
      setIsNewUpload(!isNewUpload);
    }
    else {
      //setErrorMessage(parsed_result.message)
    }
  }

  const updateVisualization = (api) => {
    setSelectedAPI(api);
    ref.current.parseFile(api.api_ops_id);
  }
  
  const handleOpenFullscreen = () => {
    setIsFullScreen(true);
  };

  const handleCloseFullscreen = () => {
    setIsFullScreen(false);
    ref.current.parseFile(selectedAPI.api_ops_id);
  };

  useEffect(() => {
    if (inputFile) {
      ref.current.parseFile(inputFile);
    }
  }, [])


  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar
        position="absolute"
        className={clsx(classes.appBar, open && classes.appBarShift)}
      >
        <Toolbar className={classes.toolbar}>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            className={clsx(
              classes.menuButton,
              open && classes.menuButtonHidden
            )}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            component="h1"
            variant="h6"
            color="inherit"
            noWrap
            className={classes.title}
          >
            <Avatar
            className={classes.bigAvatar}
            src={ezLogo}
            variant="rounded"
          ></Avatar>
            {/* <img src={ezLogo} height={50} width={50}/> */}
          </Typography>
          {/* <img
            src={ezLogo}
            alt="EZ API"
            className={classes.avatar}
            className={classes.avatar}
          /> */}
          
          <IconButton color="inherit">
            <Badge badgeContent={4} color="secondary">
              <NotificationsIcon />
            </Badge>
          </IconButton>
          <IconButton
            edge="end"
            aria-label="account of current user"
            aria-haspopup="true"
            color="inherit"
          >
            <AccountCircle />
            {props.user ? (
              <Typography
                component="h6"
                variant="h6"
                color="inherit"
                noWrap
                className={classes.title}
              >
                {"  "}
                {(props.user.firstName)}
              </Typography>
            ) : (
              ""
            )}
          </IconButton>
          <IconButton color="inherit"  onClick={props.logout}>
            <InputIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        classes={{
          paper: clsx(classes.drawerPaper, !open && classes.drawerPaperClose),
        }}
        open={open}
      >
        <div className={classes.toolbarIcon}>
          <IconButton onClick={handleDrawerClose}>
            <ChevronLeftIcon />
          </IconButton>
        </div>
        <Divider />
        <List>{mainListItems}</List>
        <Divider />

        {open ? (
          <Grid
          container
          spacing={4}
          container
          direction="column"
          justify="center"
        >
          <Grid item xs={12} md={12} lg={12}>

          </Grid>
          <Grid item xs={12} md={12} lg={12}>
            <Paper className={uploadHeight}>
              <UploadAPIView uploadFile={uploadFile} />
            </Paper>
          </Grid>
          <Grid item xs={12} md={12} lg={12}>
            <Paper className={downloadHeight}>
              <DownloadAPIView token={props.token} isUploaded={isNewUpload} updateVisualization={updateVisualization}/>
            </Paper>
          </Grid>
        </Grid>
        ) : (
          ""
        )}
        
        <Divider />
      </Drawer>
      <main className={classes.content}>
        <div className={classes.appBarSpacer} />
        <Container maxWidth="lg" className={classes.container}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={12} lg={12}>
              <Header title="sections" sections={sections} />
            </Grid>
            <Grid item xs={12} md={12} lg={12}>
              <Paper className={fullHeightPaper}>
                <Grid
                  justify="space-between" // Add it here :)
                  container 
                  spacing={24}
                >
                  <Grid item>
                    <Title>Visualize API {selectedAPI && selectedAPI.name != '' ? ": " + selectedAPI.name:""}</Title>
                  </Grid>
                  <Grid item>
                    <Button
                      variant="contained"
                      color="primary"
                      size="small"
                      className={classes.button}
                      startIcon={<Fullscreen/>} 
                      onClick={handleOpenFullscreen}>
                        Full Screen
                    </Button>
                  </Grid>
                </Grid>
                <VisualizeView ref={ref}/>
              </Paper>
            </Grid>
          </Grid>
          <Box pt={4}>
            <Copyright/>
          </Box>
          <VisualizeAPIFullView selectedAPI={selectedAPI} isFullScreen={isFullScreen} handleCloseFullscreen={handleCloseFullscreen}/>
        </Container>
      </main>
    </div>
  );
}
