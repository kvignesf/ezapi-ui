import * as Yup from "yup";

const schema = Yup.object().shape({
  name: Yup.string()
    .required("API name is required")
    .matches(
      `^(?=[a-zA-Z0-9-_]*$)`,
      "Only - and _ are allowed as special characters"
    ),
});

export default schema;
