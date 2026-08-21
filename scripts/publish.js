
import courses from "/home/bilal-tariq/00--TALEEM/taleem-library/courses/index.js";
import TaleemPublish from "../src/publisher/TaleemPublish.js";
import addSvg from "./addSvg.js";
import addAdmins from "./addAdmins.js";

const sourceDir = "/home/bilal-tariq/00--TALEEM/taleem-library";

let failed = false;

for (const [courseName, course] of Object.entries(courses)) {
	console.log(`\n========================================`);
	console.log(`Publishing: ${course.title}`);
	console.log(`Course: ${courseName}`);
	console.log(`========================================`);

	try {
		const publisher = new TaleemPublish(sourceDir, courseName, course);
		await publisher.publish();
		console.log(`✓ Published ${courseName}`);
	}
	catch (error) {
		console.error(`✗ Failed ${courseName}:`, error.message);
		failed = true;
	}
}

if (!failed) {
	try {
		console.log(`\n========================================`);
		console.log(`Publishing SVGs`);
		console.log(`========================================`);

		await addSvg(sourceDir);
		console.log(`✓ SVGs published`);

		console.log(`\n========================================`);
		console.log(`Publishing Admins`);
		console.log(`========================================`);

		await addAdmins(sourceDir);
		console.log(`✓ Admins processed`);
	}
	catch (error) {
		console.error(`✗ Final publish step failed:`, error.message);
		failed = true;
	}
}

if (failed) process.exitCode = 1;