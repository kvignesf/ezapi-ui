import * as Yup from "yup";

const schema = (error = "") =>
  Yup.object().shape({
    name: Yup.string()
      .required(error)
      .matches(
        `^(?=[a-zA-Z0-9-_]*$)`,
        "Only - and _ are allowed as special characters"
      ),
  });

export default schema;
