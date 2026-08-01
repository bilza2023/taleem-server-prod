// routes/public.js

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
// List public library items
//
// Examples:
//   /library
//   /library?course=pre-algebra
//   /library?type=ARTICLE
//   /library?access=PUBLIC
// --------------------------------------------------

router.get("/library", async (req, res) => {

	try {
	// console.log(req.query);
		const items = await kernel.library.list({

			course: req.query.course,
			type: req.query.type,
			access: req.query.access

		});

		res.json(items);

	}
	catch (error) {
		console.log("library",error)
		res.status(500).json({
			error: error.message
		});

	}

});

export default router;