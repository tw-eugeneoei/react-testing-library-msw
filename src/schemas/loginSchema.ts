import * as yup from "yup";

const loginSchema = yup
.object({
    email: yup.string().required("Email is required."),
    password: yup.string().required("Password is required.")
})
.required();

export { loginSchema }