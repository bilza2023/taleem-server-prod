import express from "express";
import kernel from "../src/serverKernel/ServerKernel.js";
import getToken from "../content/js/getToken.js";

const router = express.Router();

router.get("/discussion", async (req, res) => {

	try {

		const slug = req.query.article;
		const item = await kernel.library.get(slug);

		if (!item) {
			return res.status(404).json({
				error: "library_not_found"
			});
		}

		const course = await kernel.course.get(item.courseSlug);

		if (course.access !== "OPEN") {

			const token = getToken(req);
			const user = await kernel.auth.authenticate(token);

			if (course.access === "SUBSCRIPTION") {
				await kernel.subscription.authorize(
					user.id,
					item.courseSlug
				);
			}
		}

		const discussion = await kernel.communication.list({
			librarySlug: item.slug
		});

		res.json(discussion);

	}
	catch (error) {

		console.error(error);

		const message = error.message.toLowerCase();

		if (message.includes("authenticate") || message.includes("token"))
			return res.status(401).json({ error: "login_required" });

		if (message.includes("subscription"))
			return res.status(403).json({ error: "subscription_required" });

		if (message.includes("not found"))
			return res.status(404).json({ error: "library_not_found" });

		return res.status(500).json({ error: "server_error" });
	}

});


router.get("/:slug", async (req, res) => {

	try {

		const item = await kernel.library.get(req.params.slug);

		if (!item) {
			return res.status(404).json({
				error: "library_not_found"
			});
		}

		const course = await kernel.course.get(item.courseSlug);

		if (course.access !== "OPEN") {

			const token = getToken(req);
			const user = await kernel.auth.authenticate(token);

			if (course.access === "SUBSCRIPTION") {
				await kernel.subscription.authorize(
					user.id,
					item.courseSlug
				);
			}
		}

		res.json(item);

	}
	catch (error) {

		console.error(error);

		const message = error.message.toLowerCase();

		if (message.includes("authenticate") || message.includes("token"))
			return res.status(401).json({ error: "login_required" });

		if (message.includes("subscription"))
			return res.status(403).json({ error: "subscription_required" });

		if (message.includes("not found"))
			return res.status(404).json({ error: "library_not_found" });

		return res.status(500).json({ error: "server_error" });
	}

});

export default router;