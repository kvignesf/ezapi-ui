import * as Yup from "yup";

const schema = Yup.object().shape({
  attribute: Yup.string().required("Please fill this field"),
  description: Yup.string().required("Please fill this field"),
  possibleValues: Yup.string().required("Please fill this field"),
  dataType: Yup.string().required("Please fill this field"),
  required: Yup.bool(),
});

export default schema;
