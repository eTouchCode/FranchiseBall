import Joi from "joi";

export const validateRegisterInput = (data: any) => {
  const schema = Joi.object({
    username: Joi.string()
      .min(3)
      .max(30)
      .required()
      .messages({
        "string.base": "User must be a string",
        "string.min": `Username should have at least {#limit} characters`,
        "string.max": `Username should have at most {#limit} characters`,
        "any.required": "Username is required"
      }),
    email: Joi.string()
      .email()
      .required()
      .messages({
        "string.base": "Email must be a string",
        "string.email": "Email must be a valid email address",
        "any.required": "Email is required"
      }),
    password: Joi.string()
      .min(6)
      .required()
      .messages({
        "string.base": "Password must be a string",
        "string.min": `Password should have at least {#limit} characters`,
        "any.required": "Password is required"
      }),
  });

  return schema.validate(data, { abortEarly: false });
};

export const validateLoginInput = (data: any) => {
  const schema = Joi.object({
    email: Joi.string()
      .email()
      .required()
      .messages({
        "string.base": "Email must be a string",
        "string.email": "Email must be a valid email address",
        "any.required": "Email is required"
      }),
    password: Joi.string()
      .required()
      .messages({
        "string.base": "Password must be a string",
        "any.required": "Password is required"
      }),
  });

  return schema.validate(data, { abortEarly: false });
};