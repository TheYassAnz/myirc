const express = require("express");

import {
    registerUser,
    updateUser,
    deleteUser
} from "../controllers/user";

import { auth } from "../middleware/auth";

const router = express.Router();

router.post("/register", registerUser);
router.put("/:userId", auth, updateUser);
router.delete("/:userId", auth, deleteUser);

export default router;