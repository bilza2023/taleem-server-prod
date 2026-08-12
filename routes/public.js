// /home/bilal-tariq/00--TALEEM/taleem-server-prod/routes/public.js

import express from "express";
import kernel from "../src/serverKernel/ServerKernel.js";

const router = express.Router();

// --------------------------------------------------
// GET /api/public/course
// List public courses
//
// Examples:
//   /course
//   /course?access=PUBLIC
// --------------------------------------------------

router.get("/course", async (req, res) => {

	try {

		const courses = await kernel.course.list({

			access: req.query.access

		});

		res.json(courses);

	}
	catch (error) {
		console.log("library",error)
		res.status(500).json({
			error: error.message
		});

	}

});
// --------------------------------------------------
// GET /api/public/library
// List published library items
//
// Examples:
//   /library
//   /library?course=pre-algebra
//   /library?type=ARTICLE
//   /library?access=OPEN
// --------------------------------------------------

router.get("/library", async (req, res) => {

	try {

		const items = await kernel.library.list({

			course: req.query.course,
			type: req.query.type,
			access: req.query.access,
			status: "PUBLISHED"

		});

		res.json(items);

	}
	catch (error) {

		console.log("library", error);

		res.status(500).json({
			error: error.message
		});

	}

});

// --------------------------------------------------
// GET /api/public/grouping
// List groupings for a course
//
// Example:
//   /grouping?course=blog
// --------------------------------------------------

router.get("/grouping", async (req, res) => {

	try {

		const courseId = await kernel.course.slugToId(
			req.query.course
		);

		const groupings = await kernel.groupings.list({
			courseId
		});

		res.json(groupings);

	}
	catch (error) {

		console.log("grouping", error);

		res.status(500).json({
			error: error.message
		});

	}

});
export default router;