import { Schema, model } from "mongoose";
import Joi from "joi";

import { handleSaveError, runValidateAtUpdate } from "./hooks.js";

const emailRegexp = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const subscriptionTypes = ["starter", "pro", "business"];

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        match: emailRegexp,
        unique: true,
        required: true,
    },
    password: {
        type: String,
        minlength: 6,
        required: true,
    },
    subscription: {
        type: String,
        enum: subscriptionTypes,
        default: "starter"
    },
    token: {
        type: String,
    },
    avatar: {
        type: String,
        required: false,
    },
    verify: {
        type: Boolean,
        default: false,
    },
    verificationToken: {
        type: String,
        // required: [true, 'Verify token is required'],
    }
}, { versionKey: false, timestamps: true })

userSchema.post("save", handleSaveError);

userSchema.pre("findOneAndUpdate", runValidateAtUpdate);

userSchema.post("findOneAndUpdate", handleSaveError);

export const userSignupSchema = Joi.object({
    username: Joi.string().required(),
    email: Joi.string().pattern(emailRegexp).required(),
    password: Joi.string().min(6).required(),
    subscription: Joi.string().valid(...subscriptionTypes).required(),
    avatar: Joi.string()
})

export const userSigninSchema = Joi.object({
    email: Joi.string().pattern(emailRegexp).required(),
    password: Joi.string().min(6).required(),
})

export const userEmailSchema = Joi.object({
    email: Joi.string().pattern(emailRegexp).required()
})

const User = model("user", userSchema);

export default User;