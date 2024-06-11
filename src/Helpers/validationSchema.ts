import * as Joi from "joi";

const securityQuestionSchema = Joi.object({
  question: Joi.string()
    .valid(
      "What was your childhood nickname?",
      "What is the name of your favorite childhood friend?",
      "In what city or town did your mother and father meet?",
      "What is your favorite team?",
      "What is your favorite movie?",
      "What was the name of your first pet?",
    )
    .required(),
  answer: Joi.string().trim().required(),
});

export const registerationSchema = Joi.object({
  userName: Joi.string().alphanum().min(3).max(30).required(),
  email: Joi.string().email().lowercase().required(),
  password: Joi.string()
    .min(8)
    .pattern(new RegExp("^[a-zA-Z0-9]{8,}$"))
    .required(),
  securityQuestions: Joi.array()
    .items(securityQuestionSchema)
    .length(3)
    .required(),
});

export const loginSchema = Joi.object({
  email: Joi.string().email().lowercase().required(),
  password: Joi.string()
    .min(8)
    .pattern(new RegExp("^[a-zA-Z0-9]{8,}$"))
    .required(),
});

export const newPasswordSchema = Joi.object({
  password: Joi.string()
    .min(8)
    .pattern(new RegExp("^[a-zA-Z0-9]{8,}$"))
    .required(),
});