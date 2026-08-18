
// --------------------------------------------------
// Configuration
// --------------------------------------------------

import kernel from "../src/serverKernel/ServerKernel.js";

const slug = "blog";

const title = "Taleem Blog";

const description =
	"Articles, explanations, ideas and useful resources for students and teachers.";

const thumbnail =
	"blog.webp";

const access = "OPEN";

await kernel.course.create({
	slug,
	title,
	description,
	thumbnail,
	access
});