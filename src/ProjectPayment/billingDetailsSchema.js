import * as Yup from "yup";

const schema = Yup.object().shape({
  fullName: Yup.string().required("Please fill this field"),
  company: "",
  country: Yup.string().required("Please fill this field"),
  addressLine1: Yup.string().required("Please fill this field"),
  addressLine2: "",
  zip: Yup.string().required("Please fill this field"),
  city: Yup.string().required("Please fill this field"),
  state: Yup.string().required("Please fill this field"),
  email: Yup.string()
    .email("Please enter a valid email")
    .required("Please fill this field"),
  phone: "",
});

export default schema;
