import express from 'express';
import Joi from 'joi';
import contactsService from '../../models/contacts.js';
import { HttpError } from '../../helpers/index.js';

const contactsRouter = express.Router();

const contactSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  phone: Joi.string().required(),
});

contactsRouter.get('/', async (req, res, next) => {
  try {
    const contacts = await contactsService.listContacts();
    res.json(contacts);
  } catch (error) {
    next(error);
  }
});

contactsRouter.get('/:contactId', async (req, res, next) => {
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
});

contactsRouter.post('/', async (req, res, next) => {
  console.log(req.body);
  try {
    const { error } = contactSchema.validate(req.body);
    if (error) {
      throw HttpError(400, 'Validation error: ' + error.details[0].message);
    }

    const { name, email, phone } = req.body;
    const newContact = await contactsService.addContact(name, email, phone);
    console.log(newContact);
    res.status(201).json(newContact);
  } catch (error) {
    next(error);
  }
});

contactsRouter.delete('/:contactId', async (req, res, next) => {
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
});

contactsRouter.put('/:contactId', async (req, res, next) => {
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
});

export default contactsRouter;
