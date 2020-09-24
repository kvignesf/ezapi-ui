import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import LockOutlined from "@material-ui/icons/LockOutlined";
import { connect } from "react-redux";
import { authenticateUser } from "./AuthAction";
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

  const [user, setUser] = useState("result");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleLogin(e) {
    e.preventDefault();
    // if (email == 'test' && password == 'test') {
    //   props.authenticateUser(true);
    // } else {
    //   props.authenticateUser(false);
    // }
    props.authenticateUser(email, password);
  }

  function handleEmail(e) {
    e.preventDefault();
    setEmail(e.target.value);
  }

  function handlePassword(e) {
    e.preventDefault();
    setPassword(e.target.value);
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
              <Button
                type="submit"
                className={classes.submit}
                variant="contained"
                color="primary"
                className={classes.button}
                startIcon={<LinkedIn />}
              >
                SIGN IN WITH LINKEDIN
              </Button>
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
                  Error Occured: {props.errorMessage}
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
});

export default connect(mapStateToProps, mapDispatchToProps)(LoginView);
