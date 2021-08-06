import * as Yup from "yup";

const schema = Yup.object().shape({
  cardHolderName: Yup.string().required("Please fill this field"),
  card: Yup.boolean().isTrue("Please fill this field"),
});

export default schema;
