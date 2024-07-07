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

export const propertySchema = Joi.object({
  address_line1: Joi.string().required(),
  address_line2: Joi.string().optional(),
  city: Joi.string().required(),
  state: Joi.string().required(),
  country: Joi.string().required(),
  postal_code: Joi.string().required(),
  description: Joi.string().required(),
  price: Joi.string().required(),
  leaseLength: Joi.string().optional(),
  deposit: Joi.string().optional(),
  location: Joi.string().required(),
  imageUrl: Joi.array().items(Joi.string()).optional(),
  utilities: Joi.object({
    electricity: Joi.boolean().required(),
    water: Joi.boolean().required(),
    gas: Joi.boolean().required(),
    internet: Joi.boolean().required(),
    cable: Joi.boolean().required(),
    heat: Joi.boolean().required(),
    airConditioning: Joi.boolean().required(),
  }).required(),
  features: Joi.object({
    parking: Joi.boolean().required(),
    laundry: Joi.boolean().required(),
    dishwasher: Joi.boolean().required(),
    refrigerator: Joi.boolean().required(),
    stove: Joi.boolean().required(),
    microwave: Joi.boolean().required(),
    garbageDisposal: Joi.boolean().required(),
    fireplace: Joi.boolean().required(),
    balcony: Joi.boolean().required(),
    pool: Joi.boolean().required(),
    hotTub: Joi.boolean().required(),
    gym: Joi.boolean().required(),
    elevator: Joi.boolean().required(),
    furnished: Joi.boolean().required(),
    wheelchairAccessible: Joi.boolean().required(),
    petFriendly: Joi.boolean().required(),
  }).required(),
  extraFeatures: Joi.string().optional(),
});
