import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { FormControl, Select, MenuItem, Input, Button } from "@material-ui/core";
import SendIcon from "@material-ui/icons/Send";
import SaveOutlinedIcon from "@material-ui/icons/SaveOutlined";
import { requestParams } from "../../../CollectionsAtom";
import { useRecoilState } from "recoil";
const requestMethods = [
  {
    slug: "get",
    method: "GET",
  },
  {
    slug: "post",
    method: "POST",
  },
  {
    slug: "put",
    method: "PUT",
  },
  {
    slug: "patch",
    method: "PATCH",
  },
  {
    slug: "delete",
    method: "DELETE",
  },
];

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 100,
  },
  input: {
    flex: 1,
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    border: "1px solid #e6e6e6",
    borderRadius: "4px",
    padding: "8px 12px", // reduce the padding on the top and bottom
    fontSize: "14px",
    height: "35px",
  },
  button: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    padding: "8px 16px", // reduce the padding on the top and bottom
    fontSize: "14px",
    fontWeight: 600,
    height: "45px",
  },
  label: {
    fontSize: "12px",
    padding: "2px 4px",
    marginTop: "-5px",
  },
  select: {
    fontSize: "13px",
    padding: "8px",
    height: "35px",
    fontWeight: 400,
    marginTop: "-7px",
  },
  sendButton: {
    width: "100px",
    height: "35px",
    fontSize: "12px",
    fontWeight: 500,
  },
  saveButton: {
    width: "100px",
    height: "35px",
    fontSize: "12px",
    fontWeight: 500,
    backgroundColor: "black",
    color: "white",
    "&:hover": {
      backgroundColor: "black",
    },
  },
}));

export default function UrlEditor({ onInputSend }) {
  const [request, setRequest] = useRecoilState(requestParams);

  const classes = useStyles();

  const handleChange = (event) => {
    const { name, value } = event.target;
    setRequest((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  const handleSendClick = (event) => {
    onInputSend(event);
  };
  const handleSaveClick = (event) => {
    onInputSend(event);
  };
  return (
    <form className="flex">
      <FormControl variant="outlined" className={classes.formControl}>
        <Select
          className={classes.select}
          labelId="req-method-label"
          id="req-method-select"
          value={request.method}
          onChange={handleChange}
          variant="outlined"
          name="method"
        >
          {requestMethods.map((option) => (
            <MenuItem key={option.slug} value={option.method}>
              {option.method}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <Input
        className={classes.input}
        placeholder="URL"
        value={request.url}
        onChange={handleChange}
        inputProps={{
          "aria-label": "URL",
        }}
        name="url"
      />
      <Button
        className={`${classes.button} ${classes.sendButton}`}
        variant="contained"
        color="primary"
        size="small"
        startIcon={<SendIcon />}
        onClick={handleSendClick}
      >
        Send
      </Button>
      <Button
        className={`${classes.button} ${classes.saveButton}`}
        variant="contained"
        color="grey"
        size="small"
        startIcon={<SaveOutlinedIcon />}
        onClick={handleSaveClick}
      >
        Save
      </Button>
    </form>
  );
}
