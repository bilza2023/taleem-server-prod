import express from "express";
import kernel from "../src/serverKernel/ServerKernel.js";
import getToken from "../content/js/getToken.js";

const router = express.Router();

// --------------------------------------------------
// Authentication
// --------------------------------------------------

router.post("/login", async (req, res) => {

	try {

		const token = await kernel.admin.login(
			req.body.email,
			req.body.password
		);

		res.json({ token });

	}
	catch (error) {

		res.status(401).json({
			error: error.message
		});

	}

});

router.get("/verify", async (req, res) => {

	try {

		const admin = await kernel.auth.authenticate(
			getToken(req)
		);

		res.json({
			id: admin.id,
			email: admin.email,
			courseSlugs: admin.courseSlugs,
			isActive: admin.isActive
		});

	}
	catch (error) {

		res.status(401).json({
			error: error.message
		});

	}

});

// --------------------------------------------------
// Courses
// --------------------------------------------------

router.get("/courses", async (req, res) => {

	try {

		const admin = await kernel.auth.authenticate(
			getToken(req)
		);

		const courses = await kernel.course.list();

		const allowed = courses.filter(course =>
			kernel.admin.isAdmin(admin, course.slug)
		);

		res.json(allowed);

	}
	catch (error) {

		res.status(401).json({
			error: error.message
		});

	}

});

router.get("/course/:slug", async (req, res) => {

	try {

		const admin = await kernel.auth.authenticate(
			getToken(req)
		);

		const courseSlug = req.params.slug;

		if (!kernel.admin.isAdmin(admin, courseSlug)) {
			return res.status(403).json({
				error: "course_access_denied"
			});
		}

		const course = await kernel.course.get(courseSlug);

		if (!course) {
			return res.status(404).json({
				error: "course_not_found"
			});
		}

		res.json(course);

	}
	catch (error) {

		res.status(401).json({
			error: error.message
		});

	}

});

// --------------------------------------------------
// Library
// --------------------------------------------------

router.get("/course/:courseSlug/library", async (req, res) => {

	try {

		const admin = await kernel.auth.authenticate(
			getToken(req)
		);

		const courseSlug = req.params.courseSlug;

		if (!kernel.admin.isAdmin(admin, courseSlug)) {
			return res.status(403).json({
				error: "course_access_denied"
			});
		}

		res.json(
			await kernel.library.listByCourse(courseSlug)
		);

	}
	catch (error) {

		res.status(401).json({
			error: error.message
		});

	}

});

router.get("/library/:slug", async (req, res) => {

	try {

		const admin = await kernel.auth.authenticate(
			getToken(req)
		);

		const item = await kernel.library.get(
			req.params.slug
		);

		if (!item) {
			return res.status(404).json({
				error: "library_not_found"
			});
		}

		if (!kernel.admin.isAdmin(admin, item.courseSlug)) {
			return res.status(403).json({
				error: "course_access_denied"
			});
		}

		res.json(item);

	}
	catch (error) {

		res.status(401).json({
			error: error.message
		});

	}

});

// --------------------------------------------------
// Communication
// --------------------------------------------------

router.get("/course/:courseSlug/communication", async (req, res) => {

	try {

		const admin = await kernel.auth.authenticate(
			getToken(req)
		);

		const courseSlug = req.params.courseSlug;

		if (!kernel.admin.isAdmin(admin, courseSlug)) {
			return res.status(403).json({
				error: "course_access_denied"
			});
		}

		res.json(
			await kernel.communication.listUnanswered(courseSlug)
		);

	}
	catch (error) {

		res.status(401).json({
			error: error.message
		});

	}

});

// --------------------------------------------------
// Subscription
// --------------------------------------------------

router.post("/subscription", async (req, res) => {

	try {

		const admin = await kernel.auth.authenticate(
			getToken(req)
		);

		const courseSlug = req.body.courseSlug;

		if (!kernel.admin.isAdmin(admin, courseSlug)) {
			return res.status(403).json({
				error: "course_access_denied"
			});
		}

		const userId = await kernel.user.emailToId(
			req.body.email
		);

		const startsAt = new Date();

		const endsAt = new Date(startsAt);

		endsAt.setDate(
			endsAt.getDate() + Number(req.body.days)
		);

		const subscription =
			await kernel.subscription.create({
				userId,
				courseSlug,
				startsAt,
				endsAt
			});

		res.status(201).json(subscription);

	}
	catch (error) {

		res.status(500).json({
			error: error.message
		});

	}

});

export default router;