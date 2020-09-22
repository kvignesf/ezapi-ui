import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import LockOutlined from "@material-ui/icons/LockOutlined";
import {
  Typography,
  Avatar,
  TextField,
  Checkbox,
  Button,
  FormControlLabel,
  Paper,
  Box, Link
} from "@material-ui/core";

import ezLogo from "../static/images/ez-logo.png";
import { Container, CssBaseline } from "@material-ui/core";
import DividerWithText from "../common/components/DividerWithText";

const useStyles = makeStyles(theme => ({
  paper: {
    marginTop: theme.spacing(8),
    padding: "20px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
  },
  avatar: {
    paddingBottom: "10px",
    width: "100px",
    height: "100px"
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1)
  },
  submit: {
    margin: theme.spacing(3, 0, 2)
  },
  forgotLink: {
    paddingLeft: "80px"
  }
}));

export default function LoginView(props) {
  const classes = useStyles();

  const [user, setUser] = useState("result");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleLogin(e) {
    e.preventDefault();
    if (email == 'test' && password == 'test') {
        props.authenticateUser(true);
    } else {
        props.authenticateUser(false);
    }
    
    /*  
    var headers = {
      'Content-Type': 'application/x-www-form-urlencoded'
    };
    var requestUrl = "http://localhost:4000/auth";    
    var request = {
      method: 'POST',
      headers: headers,
      body: formData
    };    
    fetch(requestUrl, request)
    .then(res => {
      res.json();
    })
    .then((data) => {
      setUser("loggedin successfully");
    })
    .catch(error => {
      setUser("login failed");
    })
     */
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
          <img src={ezLogo} alt="EZ API" className={classes.avatar} className={classes.avatar} />
          <form className={classes.form} noValidate onSubmit={handleLogin}>
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
            <Link href="/" className={classes.forgotLink}>Forgot Password?</Link>
            <Button
              type="submit"
              className={classes.submit}
              variant="contained"
              color="primary"
              fullWidth
            >
              SIGN IN
            </Button>
            {/* <div>{JSON.stringify(props.errorMessage)}</div>
            <pre>{JSON.stringify(props)}</pre> */}
            <DividerWithText>Or</DividerWithText>
            <Button
              type="submit"
              className={classes.submit}
              variant="contained"
              color="secondary"
              fullWidth
            >Sign In with Linkedin</Button>
          </form>
        </div>
      </Paper>
    </Container>
  );
}
