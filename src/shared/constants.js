const Constants = {
  linkedClientId: process.env.REACT_APP_LINKEDIN_CLIENT_ID,
  allResponseCodes: [200, 201, 400, 401, 404, 500],
  mandatoryResponseCode: 200,
  parameterDataTypes: [
    "integer",
    "long",
    "float",
    "double",
    "string",
    "byte",
    "binary",
    "boolean",
    "date",
    "dateTime",
    "password",
  ],
};

export default Constants;
