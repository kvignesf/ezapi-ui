import * as Yup from "yup";

import Messages from "../../../../shared/messages";
import apiNameSchema from "../../../../shared/schemas/apiNameSchema";

const schema = Yup.object().shape({
  name: apiNameSchema(Messages.NAME_REQUIRED),
  type: Yup.string().required(Messages.TYPE_REQUIRED),
  tableName: Yup.string().required(Messages.TABLE_REQUIRED),
  columnName: Yup.string().required(Messages.COLUMN_REQUIRED),
  functionName: Yup.string().required(Messages.FUNCTION_REQUIRED),
  filters: Yup.array(),
  filtersRelation: Yup.array(),
});

export default schema;
