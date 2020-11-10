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

const cards = [1, 2, 3, 4];

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © '}
      <Link color="inherit" href="https://material-ui.com/">
        Your Website
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

export default function HomeComponent() {
  const classes = useStyles();

  return (
    <React.Fragment>
      <CssBaseline />
      <Container maxWidth="sm" component="main" className={classes.heroContent}>
        <Typography component="h5" variant="h5" align="center" color="textPrimary" gutterBottom>
          Get to know about EZAPI
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

      
      <Container maxWidth="sm" component="main" className={classes.heroContent1}>
        <Grid container spacing={5} alignItems="flex-end">
          <Grid item xs={12} sm={6} md={6}>
            <TextField id="outlined-basic" label="Enter you email address" variant="outlined" size="small"/>
          </Grid>
          <Grid item xs={12} sm={6} md={6}>
            <Button fullWidth variant="contained" color="primary">
              Request Early Access
            </Button>
          </Grid>
        </Grid>
      </Container>

      <Container maxWidth="md" component="main" className={classes.heroContent}>
      <Typography component="h5" variant="h5" align="center" color="textPrimary" gutterBottom>
          Visualization
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


      {/* End hero unit */}
      <Container maxWidth="md" component="main">
        <Box pt={2} pb={2}>
        
        </Box>
        <Typography component="h5" variant="h5" align="center" color="textPrimary" gutterBottom>
          Pricing
        </Typography>
        <Grid container spacing={5} alignItems="flex-end">
          {tiers.map((tier) => (
            // Enterprise card is full width at sm breakpoint
            <Grid item key={tier.title} xs={12} sm={tier.title === 'Enterprise' ? 12 : 6} md={4}>
              <Card>
                <CardHeader
                  title={tier.title}
                  subheader={tier.subheader}
                  titleTypographyProps={{ align: 'center' }}
                  subheaderTypographyProps={{ align: 'center' }}
                  action={tier.title === 'Pro' ? <StarIcon /> : null}
                  className={classes.cardHeader}
                />
                <CardContent>
                  <div className={classes.cardPricing}>
                    <Typography component="h2" variant="h3" color="textPrimary">
                      ${tier.price}
                    </Typography>
                    <Typography variant="h6" color="textSecondary">
                      /mo
                    </Typography>
                  </div>
                  <ul>
                    {tier.description.map((line) => (
                      <Typography component="li" variant="subtitle1" align="center" key={line}>
                        {line}
                      </Typography>
                    ))}
                  </ul>
                </CardContent>
                <CardActions>
                  <Button fullWidth variant={tier.buttonVariant} color="primary">
                    {tier.buttonText}
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </React.Fragment>
  );
}
