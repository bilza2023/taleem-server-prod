// /home/bilal-tariq/00--TALEEM/taleem-server/routes/admin.js

import express from "express";
import kernel from "../src/serverKernel/ServerKernel.js";
import getToken from "../content/js/getToken.js";

const router = express.Router();

// --------------------------------------------------
// Dashboard
// --------------------------------------------------

router.get("/courses", async (req, res) => {

	try {

		const admin = await kernel.auth.authenticate(getToken(req));

		res.json(await kernel.policy.listCourses(admin));

	}
	catch (error) {

		res.status(401).json({ error: error.message });

	}

});

router.get("/verify", async (req, res) => {

	try {

		const admin = await kernel.auth.authenticate(getToken(req));

		res.json({
			id: admin.id,
			email: admin.email,
			name: admin.name
		});

	}
	catch (error) {

		res.status(401).json({ error: error.message });

	}

});

router.post("/login", async (req, res) => {

	try {

		const token = await kernel.admin.login(
			req.body.email,
			req.body.password
		);

		res.json({ token });

	}
	catch (error) {

		res.status(401).json({ error: error.message });

	}

});

// --------------------------------------------------
// Library API
// --------------------------------------------------

router.get("/library/:slug", async (req, res) => {

	try {

		const admin = await kernel.auth.authenticate(getToken(req));

		const id = await kernel.library.slugToId(req.params.slug);
		const library = await kernel.library.get(id);

		await kernel.policy.require(admin, library.course.id, "library");

		res.json(library);

	}
	catch (error) {

		res.status(404).json({ error: error.message });

	}

});

router.post("/library", async (req, res) => {

	try {
// console.log(req.body);
// console.log("courseSlug =", req.body.courseSlug);
//  debugger;
		const admin = await kernel.auth.authenticate(getToken(req));

		const courseSlug = req.body.courseSlug
		const courseId = await kernel.course.slugToId(courseSlug);

		req.body.courseId = courseId;
		delete req.body.courseSlug;

		await kernel.policy.require(admin, courseId, "library");

		res.status(201).json(await kernel.library.create(req.body));

	}
	catch (error) {res.status(500).json({ error: error.message });}

});

router.put("/library/:slug", async (req, res) => {

	try {

       console.log("req.params" , req.params);
		const admin = await kernel.auth.authenticate(getToken(req));

		const id = await kernel.library.slugToId(req.params.slug);
		const library = await kernel.library.get(id);

		await kernel.policy.require(admin, library.course.id, "library");
		// const data = req.body;
		delete req.body.courseSlug;
		
		// req.body.courseId = library.course.id;

		res.json(await kernel.library.update(id, req.body));

	}
	catch (error) {

		res.status(500).json({ error: error.message });

	}

});

router.delete("/library/:slug", async (req, res) => {

	try {

		const admin = await kernel.auth.authenticate(getToken(req));

		const id = await kernel.library.slugToId(req.params.slug);
		const library = await kernel.library.get(id);

		await kernel.policy.require(admin, library.course.id, "library");

		await kernel.library.delete(id);

		res.json({ success: true });

	}
	catch (error) {

		res.status(500).json({ error: error.message });

	}

});

// --------------------------------------------------
// Course API
// --------------------------------------------------

router.get("/course/:slug", async (req, res) => {

	try {

		const admin = await kernel.auth.authenticate(getToken(req));

		const id = await kernel.course.slugToId(req.params.slug);
		const course = await kernel.course.get(id);

		await kernel.policy.require(admin, course.id, "course");

		res.json(course);

	}
	catch (error) {

		res.status(404).json({ error: error.message });

	}

});

router.post("/course", async (req, res) => {

	try {

		const admin = await kernel.auth.authenticate(getToken(req));

		await kernel.policy.require(admin, req.body.id, "course");

		res.status(201).json(await kernel.course.create(req.body));

	}
	catch (error) {

		res.status(500).json({ error: error.message });

	}

});

router.put("/course/:slug", async (req, res) => {

	try {

		const admin = await kernel.auth.authenticate(getToken(req));

		const id = await kernel.course.slugToId(req.params.slug);
		const course = await kernel.course.get(id);

		await kernel.policy.require(admin, course.id, "course");

		res.json(await kernel.course.update(id, req.body));

	}
	catch (error) {

		res.status(500).json({ error: error.message });

	}

});

router.delete("/course/:slug", async (req, res) => {

	try {

		const admin = await kernel.auth.authenticate(getToken(req));

		const id = await kernel.course.slugToId(req.params.slug);
		const course = await kernel.course.get(id);

		await kernel.policy.require(admin, course.id, "course");

		await kernel.course.delete(id);

		res.json({ success: true });

	}
	catch (error) {

		res.status(500).json({ error: error.message });

	}

});

// --------------------------------------------------
// Communication API
// --------------------------------------------------

router.get("/communication/unanswered/list", async (req, res) => {

	try {

		res.json(await kernel.communication.listUnanswered());

	}
	catch {

		res.status(500).json({ error: "server_error" });

	}

});

router.post("/communication/respond", async (req, res) => {

	try {

		const { id, authorResponse, isPublic } = req.body;

		await kernel.communication.update(id, {
			authorResponse,
			isPublic
		});

		res.json({ success: true });

	}
	catch {

		res.status(500).json({ error: "update_failed" });

	}

});
router.get("/communication/course/:courseSlug", async (req, res) => {

	try {

		const admin = await kernel.auth.authenticate(getToken(req));

		const courseId = await kernel.course.slugToId(
			req.params.courseSlug
		);

		await kernel.policy.require(
			admin,
			courseId,
			"library"
		);

		res.json(
			await kernel.communication.listUnanswered(courseId)
		);

	}
	catch (error) {

		res.status(500).json({
			error: error.message
		});

	}

});
router.post("/subscription", async (req, res) => {

	try {

		const admin = await kernel.auth.authenticate(getToken(req));

		const userId = await kernel.user.emailToId(
			req.body.email
		);

		const courseId = await kernel.course.slugToId(
			req.body.courseSlug
		);

		await kernel.policy.require(
			admin,
			courseId,
			"subscription"
		);

		const startsAt = new Date();

		const endsAt = new Date(startsAt);

		endsAt.setDate(
			endsAt.getDate() + Number(req.body.days)
		);

		res.status(201).json(

			await kernel.subscription.create({

				userId,
				courseId,
				startsAt,
				endsAt

			})

		);

	}
	catch (error) {

		res.status(500).json({

			error: error.message

		});

	}

});
export default router;