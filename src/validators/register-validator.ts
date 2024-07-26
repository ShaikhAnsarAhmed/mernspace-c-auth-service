import { checkSchema } from "express-validator";

export default checkSchema({
  email: {
    errorMessage: "Email is required",
    notEmpty: true,
    trim: true,
    isEmail: {
      errorMessage: "Email should be a valid email",
    },
  },
  firstName: {
    errorMessage: "firstName is required",
    notEmpty: true,
  },
  lastName: {
    errorMessage: "lastName is required",
    notEmpty: true,
  },
  password: {
    errorMessage: "password is required",
    notEmpty: true,
    trim: true,
    isLength: {
      options: {
        min: 8,
      },
      errorMessage: "Password length should be at least 8 chars!",
    },
  },
});

// export default [body("email").notEmpty().withMessage("Email is required")];
