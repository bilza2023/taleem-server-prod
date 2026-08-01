// routes/user.js

import express from "express";
import kernel from "../src/serverKernel/ServerKernel.js";

const router = express.Router();

// --------------------------------------------------
// POST /api/user/register
// --------------------------------------------------

router.post("/register", async (req, res) => {

	try {

		const user = await kernel.user.register(req.body);

		res.status(201).json(user);

	}
	catch (error) {

		res.status(400).json({
			error: error.message
		});

	}

});

// --------------------------------------------------
// POST /api/user/login
// --------------------------------------------------

router.post("/login", async (req, res) => {

	try {

		const { email, password } = req.body;

		const token = await kernel.user.login(email, password);

		res.json({ token });

	}
	catch (error) {

		res.status(401).json({
			error: error.message
		});

	}

});

// --------------------------------------------------
// POST /api/user/verify
// --------------------------------------------------
// --------------------------------------------------
// POST /api/user/verify
// --------------------------------------------------

router.post("/verify", async (req, res) => {

	try {

		const { token } = req.body;

		const user = await kernel.auth.authenticate(token);

		res.json(user);

	}
	catch (error) {

		res.status(401).json({
			error: error.message
		});

	}

});

export default router;