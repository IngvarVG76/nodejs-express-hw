import path from "path";
import fs from "fs/promises";
import User from "../models/User.js";
import Jimp from "jimp";
import { ctrlWrapper } from "../decorators/index.js";

const avatarPath = path.resolve("public", "avatars");

const updateAvatar = async (req, res) => {
    const { _id } = req.user;

    if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
    }

    const { path: oldPath, filename } = req.file;
    const newPath = path.join(avatarPath, filename);

    try {
        const image = await Jimp.read(oldPath);
        await image.resize(250, 250).write(newPath);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Avatar resize failed" });
    }

    const avatar = path.join("avatars", filename);

    await User.findOneAndUpdate(_id, { avatar });

    res.status(200).json({ avatar });
};

export default ctrlWrapper(updateAvatar);
