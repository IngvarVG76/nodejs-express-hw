import Contact from "../models/Contact.js";

import { HttpError } from "../helpers/index.js";

import { ctrlWrapper } from "../decorators/index.js";

const getAll = async (req, res) => {
    const { _id: owner } = req.user;
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;
    const result = await Contact.find({ owner }, "-createdAt -updatedAt", { skip, limit }).populate("owner", "username email");
    res.json(result);
};

const getById = async (req, res) => {
    const { contactId } = req.params;
    // const result = await Contact.findOne({_id: contactId});
    const result = await Contact.findById(contactId);
    // const {_id: owner} = req.user;
    // const result = await Contact.findOne({_id: contactId, owner})
    if (!result) {
        throw HttpError(404, `Contact with id=${contactId} not found`);
    }

    res.json(result);
}

const add = async (req, res) => {
    const { _id: owner } = req.user;
    const contactData = { ...req.body, owner };
    const result = await Contact.create(contactData);
    res.status(201).json(result);
}

const updateById = async (req, res) => {
    const { contactId } = req.params;
    const result = await Contact.findByIdAndUpdate(contactId, { ...req.body }, { new: true });
    if (!result) {
        throw HttpError(404, `Contact with id=${contactId} not found`);
    }

    res.json(result);
}

const deleteById = async (req, res) => {
    const { contactId } = req.params;
    const result = await Contact.findByIdAndDelete(contactId);
    if (!result) {
        throw HttpError(404, `Contact with id=${contactId} not found`);
    }

    res.json({
        message: "Delete success"
    })
}

export default {
    getAll: ctrlWrapper(getAll),
    getById: ctrlWrapper(getById),
    add: ctrlWrapper(add),
    updateById: ctrlWrapper(updateById),
    deleteById: ctrlWrapper(deleteById),
}
