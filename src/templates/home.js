import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import CssBaseline from '@material-ui/core/CssBaseline';
import Grid from '@material-ui/core/Grid';
import StarIcon from '@material-ui/icons/StarBorder';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Box from '@material-ui/core/Box';
import flowImg from "../static/images/logo/flow.jpg";
import homeImg from "../static/images/home1.png";
import visualImg from "../static/images/visual.jpg";
import { Avatar, CardMedia, Paper, TextField } from '@material-ui/core';
import ezLogo from "../static/images/logo/jpg.jpg";
import HomeComponent from './HomeComponent';
import ProductComponent from './ProductComponent';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

const cards = [1, 2, 3, 4];

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © '}
      <Link color="inherit">
        EzAPI
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

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
  footer: {
    borderTop: `1px solid ${theme.palette.divider}`,
    marginTop: theme.spacing(8),
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3),
    [theme.breakpoints.up('sm')]: {
      paddingTop: theme.spacing(6),
      paddingBottom: theme.spacing(6),
    },
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

const tiers = [
  {
    title: 'Free',
    price: '0',
    description: ['10 users included', '2 GB of storage', 'Help center access', 'Email support'],
    buttonText: 'Sign up for free',
    buttonVariant: 'outlined',
  },
  {
    title: 'Pro',
    subheader: 'Most popular',
    price: '15',
    description: [
      '20 users included',
      '10 GB of storage',
      'Help center access',
      'Priority email support',
    ],
    buttonText: 'Get started',
    buttonVariant: 'contained',
  },
  {
    title: 'Enterprise',
    price: '30',
    description: [
      '50 users included',
      '30 GB of storage',
      'Help center access',
      'Phone & email support',
    ],
    buttonText: 'Contact us',
    buttonVariant: 'outlined',
  },
];
const footers = [
  {
    title: 'Company',
    description: ['Team', 'History',],
  },
  {
    title: 'Features',
    description: ['Team feature', 'Developer stuff'],
  },
  {
    title: 'Legal',
    description: ['Privacy policy', 'Terms of use'],
  },
];

export default function Home() {
  const classes = useStyles();

  return (
    <React.Fragment>
      <CssBaseline />
      <AppBar
        position="static"
        color="primary"
        elevation={0}
        className={classes.appBar}
        style={{ background: '#C72C71' }}
      >
        <Toolbar className={classes.toolbar}>
        <Avatar
            className={classes.bigAvatar}
            src={ezLogo}
            variant="rounded"
          ></Avatar>
          <Typography
            variant="h8"
            color="inherit"  
            WrappedComponent          
            className={classes.link}
          >      
          </Typography>
          <Typography
            variant="h6"
            color="inherit"
            noWrap
            className={classes.toolbarTitle}
          >
            EzAPI
          </Typography>
          <Typography
            variant="h6"
            color="inherit"
            noWrap
            className={classes.toolbarTitle}            
          >
            
            {/* <Avatar
            className={classes.bigAvatar}
            src={ezLogo}
            variant="rounded"
          >  </Avatar> */}
          </Typography>

          <nav>
            <Link
              variant="button"
              color="inherit"
              
              className={classes.link}
            >
              Product
            </Link>
            <Link
              variant="button"
              color="inherit"
              
              className={classes.link}
            >
              Company
            </Link>
            <Link
              variant="button"
              color="inherit"
              href="#"
              className={classes.link}
            >
              Contact Us
            </Link>
            {/* <Link
              variant="button"
              color="inherit"
              href="#"
              className={classes.link}
            >
              Pricing
            </Link> */}
          </nav>
          <Button
            href="/app"
            color="inherit"
            variant="outlined"
            className={classes.link}
          >
            Login
          </Button>
        </Toolbar>
      </AppBar>
      {/* Hero unit */}

      {/* <BrowserRouter>
        <Switch>
          <Route path="/" component={HomeComponent} />
          
          <Route path="/product" component={ProductComponent} />
          
          <Route path="/home" component={HomeComponent} />
          
        </Switch>
      </BrowserRouter> */}
      <HomeComponent></HomeComponent>
      
      {/* <ProductComponent /> */}

      {/* Footer */}
      <Container maxWidth="md" component="footer" className={classes.footer}>
        <Grid container spacing={4} justify="space-evenly">
          {footers.map((footer) => (
            <Grid item xs={6} sm={3} key={footer.title}>
              <Typography variant="h6" color="textPrimary" gutterBottom>
                {footer.title}
              </Typography>
              <ul>
                {footer.description.map((item) => (
                  <li key={item}>
                    <Link href="#" variant="subtitle1" color="textSecondary">
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </Grid>
          ))}
        </Grid>
        <Box mt={5}>
          <Copyright />
        </Box>
      </Container>
      {/* End footer */}
    </React.Fragment>
  );
}
