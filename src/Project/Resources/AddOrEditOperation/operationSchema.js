import * as Yup from "yup";

const schema = () =>
  Yup.object().shape({
    name: Yup.string()
      .required("Operation name is required")
      .matches(
        `^(?=[a-zA-Z0-9-_]*$)`,
        "Only - and _ are allowed as special characters"
      ),
    type: Yup.string().required("Type is required"),
    desc: Yup.string().required("Please enter description"),
  });

export default schema;
