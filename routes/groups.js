const express = require("express");
const router = express.Router();
const authorization = require("../middlewares/auth");
const { createNewGroup, getAllGroups, addMembers2Group, kickMembers2Group, changeAdmin,deleteGroup } = require("../controllers/groups");

router.route("/groups").post(authorization, createNewGroup).get(authorization, getAllGroups);
router.route("/groups/addmembers").post(authorization, addMembers2Group);
router.route("/groups/kickmembers").post(authorization, kickMembers2Group);
router.route("/groups/promoteAdmin").patch(authorization, changeAdmin);
router.route("/groups/deleteGroup/:id").delete(authorization, deleteGroup);
module.exports = router;
