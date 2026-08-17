import express from "express";
import fs from "fs";
import path from "path";

const router = express.Router();

const COURSES_FILE = path.resolve("content/courses.json");

router.get("/course", async (req, res) => {

	try {

		const courses = JSON.parse(
			fs.readFileSync(COURSES_FILE, "utf8")
		);

		res.json(courses);

	}
	catch (error) {

		res.status(500).json({
			error: error.message
		});

	}

});

export default router;