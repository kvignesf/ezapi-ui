import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import LockOutlined from "@material-ui/icons/LockOutlined";
import { connect } from "react-redux";
import { authenticateUser, authenticateWithToken, authenticateWithLinkedinCode } from "./AuthAction";
import {
  Typography,
  Avatar,
  TextField,
  Checkbox,
  Button,
  FormControlLabel,
  Paper,
  Box,
  Link,
  Grid,
} from "@material-ui/core";

import ezLogo from "../static/images/ez-logo.png";
import { Container, CssBaseline } from "@material-ui/core";
import DividerWithText from "../common/components/DividerWithText";
import { LinkedIn } from "@material-ui/icons";
import LoginWithLinkedin from './Linkedin/LoginWithLinkedIn';

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    padding: "20px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    backgroundColor: "white",
  },
  avatar: {
    paddingBottom: "10px",
    width: "100px",
    height: "100px",
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  forgotLink: {
    paddingLeft: "80px",
  },
}));

function LoginView(props) {
  const classes = useStyles();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [linkCode, setLinkCode] = useState("");
  const [linkError, setLinkError] = useState("");

  function handleLogin(e) {
    e.preventDefault();
    // if (email == 'test' && password == 'test') {
    //   props.authenticateUser(true);
    // } else {
    //   props.authenticateUser(false);
    // }
    props.authenticateUser(email, password);
  }

  function handleLinkedLogin() {
    // if (email == 'test' && password == 'test') {
    //   props.authenticateUser(true);
    // } else {
    //   props.authenticateUser(false);
    // }
    props.authenticateWithToken(props.user);
  }

  function handleEmail(e) {
    e.preventDefault();
    setEmail(e.target.value);
  }

  function handlePassword(e) {
    e.preventDefault();
    setPassword(e.target.value);
  }

  function handleSuccess(data){
    setLinkCode(data.code);
    props.authenticateWithLinkedinCode(data.code);
    // this.setState({
    //   code: data.code
    // });
  }

  function handleFailure(error){
    setLinkError(error.errorMessage);
    // this.setState({
    //   code: '',
    //   errorMessage: error.errorMessage,
    // });
  }

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Paper className={classes.root}>
        <div className={classes.paper}>
          <img
            src={ezLogo}
            alt="EZ API"
            className={classes.avatar}
            className={classes.avatar}
          />

          <form className={classes.form} noValidate onSubmit={handleLogin}>
            <Box
              display="flex"
              justifyContent="center"
              m={1}
              p={1}
              bgcolor="background.paper"
            >
              {props.user && props.user.token ? (
                <Button
                  type="button"
                  className={classes.submit}
                  variant="contained"
                  color="primary"
                  className={classes.button}
                  startIcon={<LinkedIn />}
                  onClick={handleLinkedLogin}
                >
                  SIGN IN WITH LINKEDIN
                </Button>
              ) : (
                <LoginWithLinkedin
                  clientId="77hqgq6vt20utk"
                  redirectUri="http://instance-1.ezapi.ai:3000/linkedin"
                  scope="r_liteprofile"
                  state="987654321"
                  onFailure={handleFailure}
                  onSuccess={handleSuccess}
                  redirectPath="/linkedin"
                ></LoginWithLinkedin>
              )}
              {/* <Button
                type="button"
                className={classes.submit}
                variant="contained"
                color="primary"
                className={classes.button}
                startIcon={<LinkedIn />}
                onClick={handleLinkedLogin}
              >
                SIGN IN WITH LINKEDIN
              </Button> 
              <LoginWithLinkedin
                  clientId="77hqgq6vt20utk"
                  redirectUri="http://localhost:3000/linkedin"
                  scope="r_liteprofile"
                  state="987654321"
                  onFailure={handleFailure}
                  onSuccess={handleSuccess}
                  redirectPath='/linkedin'
                >
              </LoginWithLinkedin>*/}
            </Box>
            <DividerWithText>Or</DividerWithText>
            <TextField
              id="userName"
              name="userName"
              label="User Name"
              onChange={handleEmail}
              autoComplete="userName"
              variant="outlined"
              margin="normal"
              required
              fullWidth
              autoFocus
            />
            <TextField
              id="userPassword"
              name="userPassword"
              label="Password"
              type="Password"
              onChange={handlePassword}
              autoComplete="current-password"
              variant="outlined"
              margin="normal"
              fullWidth
              required
            />
            <FormControlLabel
              label="Remember me"
              control={<Checkbox value="remember" color="primary" />}
            ></FormControlLabel>
            <Link href="/" className={classes.forgotLink}>
              Forgot Password?
            </Link>
            <Button
              type="submit"
              className={classes.submit}
              variant="contained"
              color="primary"
              fullWidth
            >
              SIGN IN
            </Button>
            <Box
              display="flex"
              justifyContent="center"
              bgcolor="background.paper"
            >
              <Typography variant="subheading1" display="block" gutterBottom>
                Don't have an account <Link href="/">SIGN UP NOW?</Link>
              </Typography>
            </Box>
            {props.errorMessage && !props.isLoggedIn ? (
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
                  {props.errorMessage}
                </Typography>
              </Box>
            ) : (
              ""
            )}
            {linkError != "" || linkCode != "" ? (
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
                  Linkedin Error: {linkError} Linkedin code: {linkCode}
                </Typography>
              </Box>
            ) : (
              ""
            )}

            {/* <div>{JSON.stringify(props.errorMessage)}</div>
            <pre>{JSON.stringify(props.isLoggedIn)}</pre> */}
          </form>
        </div>
      </Paper>
    </Container>
  );
}

const mapStateToProps = (state) => {
  return {
    isLoggedIn: state.authReducer.isLoggedIn,
    errorMessage: state.authReducer.erronMessage,
  };
};

const mapDispatchToProps = (dispatch) => ({
  authenticateUser: (userName, userPassword) =>
    dispatch(authenticateUser(userName, userPassword)),
  authenticateWithLinkedinCode: (code) =>
    dispatch(authenticateWithLinkedinCode(code)),
  authenticateWithToken: (user) =>
    dispatch(authenticateWithToken(user)),
});

export default connect(mapStateToProps, mapDispatchToProps)(LoginView);
