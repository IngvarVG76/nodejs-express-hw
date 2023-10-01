import gravatar from "gravatar"; 
import path from "path";

const generateAvatarFromGravatar = (email, avatarPath) => {
    const gravatarUrl = gravatar.url(email, { s: "200", d: "retro" });
    const gravatarFileName = `${Date.now()}_gravatar.png`;
    const gravatarPath = path.join(avatarPath, gravatarFileName);

    return path.join("avatars", gravatarFileName);
}

export default generateAvatarFromGravatar; 