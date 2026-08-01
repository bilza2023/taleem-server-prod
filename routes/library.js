// /routes/library.js

import express from "express";
import kernel from "../src/serverKernel/ServerKernel.js";
import getToken from "../content/js/getToken.js";
const router = express.Router();



// --------------------------------------------------
// GET /api/library/discussion?article=open-page2
// --------------------------------------------------

router.get("/discussion", async (req, res) => {

	try {

		const slug = req.query.article;

		const id = await kernel.library.slugToId(slug);

		const item = await kernel.library.get(id);

		if (!item) {

			return res.status(404).json({
				error: "library_not_found"
			});

		}

		const access = item.course.access;

		if (access !== "OPEN") {

			const token = getToken(req);
			// const token = req.headers.authorization?.replace(
			// 	"Bearer ",
			// 	""
			// );

			const user = await kernel.auth.authenticate(token);

			if (access === "SUBSCRIPTION") {

				await kernel.subscription.authorize(
					user.id,
					item.course.id
				);

			}

		}

		const discussion = await kernel.communication.list({

			libraryId: item.id

		});

		res.json(discussion);

	}
	catch (error) {

		console.error(error);

		const message = error.message.toLowerCase();

		if (
			message.includes("authenticate") ||
			message.includes("token")
		) {

			return res.status(401).json({
				error: "login_required"
			});

		}

		if (message.includes("subscription")) {

			return res.status(403).json({
				error: "subscription_required"
			});

		}

		if (message.includes("not found")) {

			return res.status(404).json({
				error: "library_not_found"
			});

		}

		return res.status(500).json({
			error: "server_error"
		});

	}

});
// --------------------------------------------------
// GET /api/library/:slug
// --------------------------------------------------

router.get("/:slug", async (req, res) => {

	try {

		const id = await kernel.library.slugToId(
			req.params.slug
		);

		const item = await kernel.library.get(id);

		if (!item) {

			return res.status(404).json({
				error: "library_not_found"
			});

		}

		const access = item.course.access;

		if (access !== "OPEN") {

			const token = req.headers.authorization?.replace(
				"Bearer ",
				""
			);

			const user = await kernel.auth.authenticate(token);

			if (access === "SUBSCRIPTION") {

				await kernel.subscription.authorize(
					user.id,
					item.course.id
				);

			}

		}

		res.json(item);

	}
	catch (error) {

		console.error(error);

		const message = error.message.toLowerCase();

		if (
			message.includes("authenticate") ||
			message.includes("token")
		) {

			return res.status(401).json({
				error: "login_required"
			});

		}

		if (message.includes("subscription")) {

			return res.status(403).json({
				error: "subscription_required"
			});

		}

		if (message.includes("not found")) {

			return res.status(404).json({
				error: "library_not_found"
			});

		}

		return res.status(500).json({
			error: "server_error"
		});

	}

});

export default router;