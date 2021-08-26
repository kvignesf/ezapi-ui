const Messages = {
  UNKNOWN: "Something went wrong, please try again.",
  DB_REQUIRED: "Atleast one spec or db file must be uploaded.",
  NAME_REQUIRED: "Name is required",
  TYPE_REQUIRED: "Type is required",
  DESC_REQUIRED: "Description is required",
  TABLE_REQUIRED: "Please select a table name",
  COLUMN_REQUIRED: "Please select a column name",
  FIELD_REQUIRED: "Please fill this field",
  TABLE_COLUMN_EXISTS: "Table/Column with this name already exists",
  INVALID_EMAIL: "Please enter valid email",
  NO_USER_DETAILS: "Failed to get the user details, please try again.",
  INVALID_DATA: "Invalid data provided, please check and retry",
  LINKEDIN_REQUIRED: "Need to login using LinkedIn",
  PAYMENT_FAILURE: "Something went wrong during payment",
  PAYMENT_RETRY: "Something went wrong during payment, please try again.",

  VALIDATE_RETRY: "Failed to validate project, please try again.",
  PUBLISH_RETRY: "Failed to publish the project, please try again.",
  publishSuccess: (projectName) =>
    `Project ${sprojectName} successfully published. You can now download the specs and artifacts.`,
};

export default Messages;
