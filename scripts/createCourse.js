// --------------------------------------------------
// Configuration
// --------------------------------------------------
///home/bilal-tariq/00--TALEEM/taleem-server-prod/scripts/createCourse.js
import kernel from "../src/serverKernel/ServerKernel.js";

const slug = "fbise9math";

const title = "Class 9 Math Federal Board";

const description =
	"Class 9 Math Federal Board. Latest Edition, the questions are being updated regularly";

const thumbnail =
	"banner.webp";

const access = "OPEN"; // OPEN | MEMBERS | SUBSCRIPTION

await kernel.course.create({
	slug,
	title,
	description,
	thumbnail,
	access
});