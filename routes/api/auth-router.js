import express from "express";

import authController from "../../controllers/auth-controller.js";

import * as userSchemas from "../../models/User.js";

import { validateBody } from "../../decorators/index.js";

import { authenticate, upload } from "../../middlewares/index.js";

const authRouter = express.Router();

const userSignupValidate = validateBody(userSchemas.userSignupSchema);
const userSigninValidate = validateBody(userSchemas.userSigninSchema);
const userEmailValidate = validateBody(userSchemas.userEmailSchema);

authRouter.post("/signup", upload.single("avatar"), userSignupValidate, authController.signup);

authRouter.get("/verify/:verificationToken", authController.verify); 

authRouter.post("/verify", userEmailValidate, authController.resendVerifyEmail);

authRouter.post("/signin", userSigninValidate, authController.signin);

authRouter.get("/current", authenticate, authController.getCurrent);

authRouter.post("/signout", authenticate, authController.signout);

export default authRouter;  