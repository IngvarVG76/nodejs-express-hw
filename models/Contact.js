import { Schema, model } from 'mongoose';

import Joi from "joi";

import { handleSaveError, runValidateAtUpdate } from "./hooks.js";

const phoneRegexp = /^\(\d{3}\) \d{3}-\d{4}$/;
const emailRegexp = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

const contactSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Set name for contact'],
  },
  email: {
    type: String,
    match: emailRegexp,
    required: true,
  },
  favorite: {
    type: Boolean,
    default: false,
  },
  phone: {
    type: String,
    match: phoneRegexp,
    required: true,
  },
}, { versionKey: false, timestamps: true });

contactSchema.post("save", handleSaveError);

contactSchema.pre("findOneAndUpdate", runValidateAtUpdate);

contactSchema.post("findOneAndUpdate", handleSaveError);

export const contactAddSchema = Joi.object({
  name: Joi.string().required().messages({
    "any.required": `Set name for contact`
  }),
  phone: Joi.string().pattern(phoneRegexp).required(),
  email: Joi.string().pattern(emailRegexp).required(),
  favorite: Joi.boolean(),
})

export const contactUpdateFavoriteSchema = Joi.object({
  favorite: Joi.boolean().required(),
})

const Contact = model("contact", contactSchema);

export default Contact;
