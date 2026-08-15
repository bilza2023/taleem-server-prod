// --------------------------------------------------
// Configuration
// --------------------------------------------------

import kernel from "../src/serverKernel/ServerKernel.js";


const adminEmail = "bilal@taleem.help";
const courseSlug = "fbise9math";


const library = true;
const communication = true;
const subscription = false;


// --------------------------------------------------
// Resolve IDs
// --------------------------------------------------

const adminId = await kernel.admin.emailToId(adminEmail);
const courseId = await kernel.course.slugToId(courseSlug);


// --------------------------------------------------
// Create / Update Policy
// --------------------------------------------------

const policy = await kernel.adminCoursePolicy.upsert(
	adminId,
	courseId,
	{
		library,
		communication,
		subscription
	}
);


console.log("Admin course policy created/updated:");
console.log(policy);


await kernel.shutdown();