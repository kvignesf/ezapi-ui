import * as Yup from "yup";
import apiNameSchema from "../../../../shared/schemas/apiNameSchema";

const schema = Yup.object().shape({
  attribute: apiNameSchema("Please fill this field"),
  description: Yup.string().required("Please fill this field"),
  possibleValues: Yup.string().required("Please fill this field"),
  dataType: Yup.string().required("Please fill this field"),
  required: Yup.bool(),
});

export default schema;
