import express from 'express';
import contactsControllers from '../../controllers/contacts-controllers.js';

import * as contactSchemas from "../../models/Contact.js";

import { validateBody } from "../../decorators/index.js";

import { isValidId } from "../../middlewares/index.js";

const contactAddValidate = validateBody(contactSchemas.contactAddSchema);
const contactUpdateFavoriteValidate = validateBody(contactSchemas.contactUpdateFavoriteSchema);


const contactsRouter = express.Router();

contactsRouter.get('/', contactsControllers.getAll);

contactsRouter.get('/:contactId', isValidId, contactsControllers.getById);

contactsRouter.post('/', contactAddValidate, contactsControllers.add);

contactsRouter.put('/:contactId', isValidId, contactAddValidate, contactsControllers.updateById);

contactsRouter.patch('/:contactId/favorite', isValidId, contactUpdateFavoriteValidate, contactsControllers.updateById);

contactsRouter.delete('/:contactId', isValidId, contactsControllers.deleteById);

export default contactsRouter;
