// --------------------------------------------------
// Configuration
// --------------------------------------------------

import kernel from "../src/serverKernel/ServerKernel.js";

const slug = "blog";

const title = "Blog";

const description =
	"Taleem.help Blog.";

const thumbnail =
	"/content/thumbnails/banner.webp";

const access = "OPEN"; // OPEN | MEMBERS | SUBSCRIPTION

await kernel.course.create({
	slug,
	title,
	description,
	thumbnail,
	access
});