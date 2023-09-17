import { isValidObjectId } from "mongoose";

import { HttpError } from "../helpers/index.js";

const isValidId = (req, res, next) => {
    console.log("isValidId.js", req.params);
    const { contactId } = req.params;
    console.log("isValidId.js", contactId);
    if (!isValidObjectId(contactId)) {
        return next(HttpError(404, `${contactId} not valid id`))
    }
    next();
}

export default isValidId;