import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import fs from "fs/promises";
import path from "path";
import gravatar from "gravatar";


import User from "../models/User.js";

import { HttpError } from "../helpers/index.js";

import { ctrlWrapper } from "../decorators/index.js";

const avatarPath = path.resolve("public", "avatars");

const { JWT_SECRET } = process.env;

const signup = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (user) {
        throw HttpError(409, "Email already exist");
    }

    const hashPassword = await bcrypt.hash(password, 10);
    // Cloudinary
    // const { path: oldPath } = req.file;
    // const { url: avatar } = await cloudinary.uploader.upload(oldPath, {
    //     folder: "avatars"
    // })
    // await fs.unlink(oldPath);

    // local storage
    let avatar = "";

    if (req.file) {
        const { path: oldPath, filename } = req.file;
        const newPath = path.join(avatarPath, filename);

        await fs.rename(oldPath, newPath);
        avatar = path.join("avatars", filename);
    } else {
        // avatar = generateAvatarFromGravatar(email, avatarPath);
        avatar = gravatar.url(email, { protocol: 'https', s: '200', d: "robohash" });
    }
    const newUser = await User.create({ ...req.body, avatar, password: hashPassword });
    console.log(newUser);

    res.status(201).json({
        username: newUser.username,
        email: newUser.email,
        avatar: newUser.avatar
    })
}


const signin = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
        throw HttpError(401, "Email or password invalid");
    }

    const passwordCompare = await bcrypt.compare(password, user.password);
    if (!passwordCompare) {
        throw HttpError(401, "Email or password invalid");
    }

    const { _id: id } = user;

    const payload = {
        id,
    }

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "23h" });
    await User.findByIdAndUpdate(id, { token });

    res.json({
        token,
    })
}

const getCurrent = (req, res) => {
    const { username, email } = req.user;

    res.json({
        username,
        email,
    })
}

const signout = async (req, res) => {
    const { _id } = req.user;
    await User.findByIdAndUpdate(_id, { token: "" });

    res.json({
        message: "Signout success"
    })
}

export default {
    signup: ctrlWrapper(signup),
    signin: ctrlWrapper(signin),
    getCurrent: ctrlWrapper(getCurrent),
    signout: ctrlWrapper(signout),
}