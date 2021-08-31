import * as Yup from "yup";
import Messages from "../../../../shared/messages";
import apiNameSchema from "../../../../shared/schemas/apiNameSchema";

const schema = Yup.object().shape({
  attribute: apiNameSchema(Messages.FIELD_REQUIRED),
  description: Yup.string().required(Messages.FIELD_REQUIRED),
  possibleValues: Yup.string().required(Messages.FIELD_REQUIRED),
  dataType: Yup.string().required(Messages.FIELD_REQUIRED),
  required: Yup.bool(),
});

export default schema;
