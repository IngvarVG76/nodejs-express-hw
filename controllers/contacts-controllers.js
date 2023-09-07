import HttpError from '../helpers/HttpError.js';
import contactSchema from '../schemas/contacts-schemas.js';

import contactsService from '../models/contacts.js';

const getAll = async (req, res, next) => {
    try {
        const contacts = await contactsService.listContacts();
        res.json(contacts);
    } catch (error) {
        next(error);
    }
};

const getById = async (req, res, next) => {
    try {
        const { contactId } = req.params;
        const contact = await contactsService.getContactById(contactId);

        if (contact) {
            res.json(contact);
        } else {
            throw HttpError(404, 'Contact not found');
        }
    } catch (error) {
        next(error);
    }
};

const add = async (req, res, next) => {
    try {
        const { error } = contactSchema.validate(req.body);
        if (error) {
            throw HttpError(400, 'Validation error: ' + error.details[0].message);
        }

        const { name, email, phone } = req.body;
        const newContact = await contactsService.addContact(name, email, phone);
        res.status(201).json(newContact);
    } catch (error) {
        next(error);
    }
};

const deliteById = async (req, res, next) => {
    try {
        const { contactId } = req.params;
        const removedContact = await contactsService.removeContact(contactId);

        if (removedContact) {
            res.json({ message: 'Contact deleted' });
        } else {
            throw HttpError(404, 'Contact not found');
        }
    } catch (error) {
        next(error);
    }
};

const updateById = async (req, res, next) => {
    try {
        const { contactId } = req.params;
        const updatedContact = req.body;

        const { error } = contactSchema.validate(updatedContact);
        if (error) {
            throw HttpError(400, 'Validation error: ' + error.details[0].message);
        }

        const updated = await contactsService.updateContact(contactId, updatedContact);

        if (updated) {
            res.json(updated);
        } else {
            throw HttpError(404, 'Contact not found');
        }
    } catch (error) {
        next(error);
    }
};

export default {
    getAll,
    getById,
    add,
    deliteById,
    updateById
};
