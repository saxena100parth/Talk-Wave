const express = require("express");
const { protect } = require("../middlewares/authMiddleware");
const {
  accessChat,
  fetchChats,
  createGroupChat,
  renameGroup,
  addToGroup,
  removeFromGroup,
} = require("../controllers/chatControllers");
const router = express.Router();

router.route("/").post(protect, accessChat); // creating or accessing one to one chat
router.route("/").get(protect, fetchChats); // fetching all chats of a user
router.route("/group").post(protect, createGroupChat); // creating a group chat
router.route("/rename").put(protect, renameGroup); // renaming a group chat
router.route("/groupadd").put(protect, addToGroup); // adding a user to group chat
router.route("/groupremove").put(protect, removeFromGroup); // removing a user from group chat

module.exports = router;
