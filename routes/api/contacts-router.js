// Привіт! Я би виніс JOI у папку schemas. Колбеки які відпрацьовують в роутах це контроллери. Їх можна винести окремо у папку controllers

import express from 'express';
import contactsControllers from '../../controllers/contacts-controllers.js';

const contactsRouter = express.Router();

contactsRouter.get('/', contactsControllers.getAll);

contactsRouter.get('/:contactId', contactsControllers.getById);

contactsRouter.post('/', contactsControllers.add);

contactsRouter.delete('/:contactId', contactsControllers.deliteById);

contactsRouter.put('/:contactId', contactsControllers.updateById);

export default contactsRouter;
