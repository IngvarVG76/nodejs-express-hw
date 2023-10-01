import express from "express";
import updateAvatar from "../../controllers/avatar-controller.js";
import { authenticate, upload } from "../../middlewares/index.js";

const avatarsRouter = express.Router();

avatarsRouter.patch(
    "/avatars",
    authenticate,
    upload.single("avatar"),
    updateAvatar
);

export default avatarsRouter;
