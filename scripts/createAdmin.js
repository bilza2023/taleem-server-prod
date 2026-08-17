

import kernel from "../src/serverKernel/ServerKernel.js";

const email = "bilal@taleem.help";
const password = "12345678";

await kernel.admin.create({
	email,
	password,
	courseSlugs: JSON.stringify([
		"fbise9math"
	])
});

await kernel.shutdown();