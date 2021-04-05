import asyncHandler from "express-async-handler";
import Contact from "../models/contactModel.js";

// @desc    Create a contact
// @route   POST /api/contacts
// @access  Public
const sendContact = asyncHandler(async (req, res) => {
  const contact = new Contact({
    name: req.body.message,
    email: req.body.email,
    subject: req.body.subject,
    message: req.body.message,
  });

  const newContact = await contact.save();
  if (newContact) {
    res
      .status(201)
      .json({ contact, message: "You Query has been sent successfully" });
  } else {
    res.status(404).json({ message: "You Query failed to send" });
    throw new Error("Error while saving your message");
  }
});

// @desc    Fetch all contacts
// @route   GET /api/contacts
// @access  Private/Admin
const getContacts = asyncHandler(async (req, res) => {
  const pageSize = 10;
  const page = Number(req.query.pageNumber) || 1;

  if (req.query.pageNumber == "No Pagination") {
    const contacts = await Contact.find({});
    res.json({ contact });
  } else {
    const count = await Contact.countDocuments({});
    const contacts = await Contact.find({})
      .limit(pageSize)
      .skip(pageSize * (page - 1));
    res.json({ contacts, page, pages: Math.ceil(count / pageSize) });
  }
});

// @desc    Fetch single contact
// @route   GET /api/contacts/:id
// @access  Public
const getContactById = asyncHandler(async (req, res) => {
  const contact = await Contact.findById(req.params.id);

  if (contact) {
    res.json(contact);
  } else {
    res.status(404);
    throw new Error("Contact not found");
  }
});

// @desc    Delete a contact
// @route   DELETE /api/contacts/:id
// @access  Public
const deleteContact = asyncHandler(async (req, res) => {
  const contact = await Contact.findById(req.params.id);

  if (contact) {
    await contact.remove();
    res.json({ message: "Contact removed" });
  } else {
    res.status(404);
    throw new Error("Contact not found");
  }
});

export { getContacts, getContactById, deleteContact, sendContact };
