import { promises as fsPromises } from 'fs';
import path from 'path';
import { nanoid } from 'nanoid';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const { readFile, writeFile } = fsPromises;

const currentDir = dirname(fileURLToPath(import.meta.url));
const contactsPath = path.join(currentDir, 'contacts.json');

const listContacts = async () => {
  try {
    const data = await readFile(contactsPath, 'utf-8');
    const contacts = JSON.parse(data);
    return contacts;
  } catch (error) {
    throw error;
  }
};

const getContactById = async (contactId) => {
  try {
    const contacts = await listContacts();
    const contact = contacts.find((c) => c.id === contactId);
    return contact || null;
  } catch (error) {
    throw error;
  }
};

const removeContact = async (contactId) => {
  try {
    const contacts = await listContacts();
    const index = contacts.findIndex((c) => c.id === contactId);
    if (index === -1) {
      return null;
    }
    const [removedContact] = contacts.splice(index, 1);
    await writeFile(contactsPath, JSON.stringify(contacts, null, 2));
    return removedContact;
  } catch (error) {
    throw error;
  }
};

const addContact = async (name, email, phone) => {
  try {
    const newContact = {
      id: nanoid(),
      name,
      email,
      phone,
    };
    const contacts = await listContacts();
    contacts.push(newContact);
    await writeFile(contactsPath, JSON.stringify(contacts, null, 2));
    return newContact;
  } catch (error) {
    throw error;
  }
};

const updateContact = async (contactId, updatedContact) => {
  try {
    const contacts = await listContacts();
    const index = contacts.findIndex((c) => c.id === contactId);
    if (index === -1) {
      return null;
    }
    const updated = { ...contacts[index], ...updatedContact, id: contactId };
    contacts[index] = updated;
    await writeFile(contactsPath, JSON.stringify(contacts, null, 2));
    return updated;
  } catch (error) {
    throw error;
  }
};

export default {
  listContacts, getContactById, removeContact, addContact, updateContact
};
