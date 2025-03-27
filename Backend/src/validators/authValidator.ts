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
    team_name: Joi.string()
      .messages({
        "string.base": "TeamName must be a string",
        "string.team_name": "Team_name must be a valid team_name address",
        "any.required": "Team_name is required"
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
    team_name: Joi.string()
      .messages({
        "string.base": "Team_name must be a string",
        "string.team_name": "Team_name must be a valid Team_name address",
        "any.required": "Team_name is required"
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