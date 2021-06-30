import * as Yup from "yup";
import apiNameSchema from "../../../shared/schemas/apiNameSchema";

const schema = () =>
  Yup.object().shape({
    name: apiNameSchema("Operation Name is required"),
    type: Yup.string().required("Type is required"),
    desc: Yup.string().required("Please enter description"),
  });

export default schema;
