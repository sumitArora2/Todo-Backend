import express from "express";
const router = express.Router();
import {
  getContacts,
  getContactById,
  deleteContact,
  sendContact,
} from "../controllers/contactController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

router.route("/").get(protect, admin, getContacts).post(sendContact);
router.route("/:id").get(getContactById).delete(deleteContact);

export default router;
