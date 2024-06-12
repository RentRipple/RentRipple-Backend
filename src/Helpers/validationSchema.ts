import * as Joi from "joi";
import { REGEX_PASSWORD } from "./constants";

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
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  //userName: Joi.string().alphanum().min(3).max(30).required(),
  email: Joi.string().email().lowercase().required(),
  password: Joi.string().min(8).pattern(new RegExp(REGEX_PASSWORD)).required(),
  confirmPassword: Joi.string().valid(Joi.ref("password")).required(),
  gender: Joi.string().valid("Male", "Female", "Other").required(),
  number: Joi.string().required(),
  accountType: Joi.string().valid("Tenant", "Landlord", "user").required(),
  securityQuestions: Joi.array()
    .items(securityQuestionSchema)
    .length(3)
    .required(),
});

export const loginSchema = Joi.object({
  email: Joi.string().email().lowercase().required(),
  password: Joi.string().min(8).pattern(new RegExp(REGEX_PASSWORD)).required(),
});

export const newPasswordSchema = Joi.object({
  password: Joi.string().min(8).pattern(new RegExp(REGEX_PASSWORD)).required(),
});
