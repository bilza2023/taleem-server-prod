// routes/communication.js
import { getToken } from "./utils/getToken.js";
import express from "express";
import kernel from "../src/serverKernel/ServerKernel.js";

const router = express.Router();

// --------------------------------------------------
// POST /api/communication
// --------------------------------------------------

router.post("/", async (req, res) => {

	try {
// debugger;
		const token = getToken(req);

		const user = await kernel.auth.authenticate(token);
		const librarySlug = req.body.librarySlug;
		const libraryId = await kernel.library.slugToId(librarySlug);
		// throw if no library id
		if (!libraryId) {
			return res.status(404).json({
				error: "library_not_found"
			});
		}
		
		
		req.body.libraryId = libraryId;
		delete req.body.librarySlug  // why because the  slug should not be over written .

		const item = await kernel.communication.create({

			...req.body,

			userId: user.id

		});

		res.status(201).json(item);

	}
	catch (error) {

		const message = error.message.toLowerCase();
		 console.error(error);
		if (
			message.includes("authenticate") ||
			message.includes("token")
		) {

			return res.status(401).json({
				error: "login_required"
			});

		}

		return res.status(500).json({
			error: "server_error"
		});

	}

});

// --------------------------------------------------
// GET /api/communication/me
// --------------------------------------------------

router.get("/me", async (req, res) => {

	try {

		const token = getToken(req);

		const user = await kernel.auth.authenticate(token);

		const items = await kernel.communication.list({

			userId: user.id

		});

		res.json(items);

	}
	catch (error) {
//  console.error(error);
		const message = error.message.toLowerCase();

		if (
			message.includes("authenticate") ||
			message.includes("token")
		) {

			return res.status(401).json({
				error: "login_required"
			});

		}

		return res.status(500).json({
			error: "server_error"
		});

	}

});

export default router;