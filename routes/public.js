
import express from "express";
import kernel from "taleem-kernel";
import getToken from "../content/js/getToken.js";

const router = express.Router();

// --------------------------------------------------
// Courses
// --------------------------------------------------

router.get("/course", async (req, res) => {

	try {

		const courses = await kernel.course.list();

		res.json(courses);

	}
	catch (error) {

		res.status(500).json({
			error: "server_error"
		});

	}

});

router.get("/course/:slug", async (req, res) => {

	try {

		const course = await kernel.course.get(
			req.params.slug
		);

		if (!course) {
			return res.status(404).json({
				error: "course_not_found"
			});
		}

		res.json(course);

	}
	catch (error) {

		res.status(500).json({
			error: "server_error"
		});

	}

});

// --------------------------------------------------
// Course Library
// --------------------------------------------------

router.get("/course/:slug/list", async (req, res) => {

	try {

		const course = await kernel.course.get(
			req.params.slug
		);

		if (!course) {
			return res.status(404).json({
				error: "course_not_found"
			});
		}

		const items = await kernel.library.listByCourse(
			req.params.slug
		);

		res.json(items);

	}
	catch (error) {

		res.status(500).json({
			error: "server_error"
		});

	}

});

// --------------------------------------------------
// Library Item
// --------------------------------------------------

router.get("/library/:slug", async (req, res) => {

	try {

		const item = await kernel.library.get(
			req.params.slug
		);

		if (!item) {
			return res.status(404).json({
				error: "library_not_found"
			});
		}

		const course = await kernel.course.get(
			item.courseSlug
		);

		if (!course) {
			return res.status(404).json({
				error: "course_not_found"
			});
		}

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

		res.status(500).json({
			error: "server_error"
		});

	}

});

// --------------------------------------------------
// Library Discussion
// --------------------------------------------------

router.get("/library/:slug/discussion", async (req, res) => {

	try {

		const item = await kernel.library.get(
			req.params.slug
		);

		if (!item) {
			return res.status(404).json({
				error: "library_not_found"
			});
		}

		const course = await kernel.course.get(
			item.courseSlug
		);

		if (!course) {
			return res.status(404).json({
				error: "course_not_found"
			});
		}

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

		const discussion =
			await kernel.communication.list({
				librarySlug: item.slug
			});

		res.json(discussion);

	}
	catch (error) {

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

		res.status(500).json({
			error: "server_error"
		});

	}

});

export default router;