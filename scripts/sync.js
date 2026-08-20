import { PrismaClient } from "@prisma/client";

const live = new PrismaClient({
	datasources: {
		db: { url: "file:/home/bilal-tariq/00--TALEEM/taleem-server-prod/prisma/dev.db" }
	}
});

const content = new PrismaClient({
	datasources: {
		db: { url: "file:/home/bilal-tariq/00--TALEEM/taleem-server-prod/prisma/content.db" }
	}
});

async function sync() {
	console.log("Reading content database...");

	const [admins, courses, library, svgs] = await Promise.all([
		content.admin.findMany(),
		content.course.findMany(),
		content.library.findMany(),
		content.svg.findMany()
	]);

	console.log(`Admins: ${admins.length}`);
	console.log(`Courses: ${courses.length}`);
	console.log(`Library: ${library.length}`);
	console.log(`SVGs: ${svgs.length}`);

	await live.$transaction(async tx => {
		console.log("Wiping live content...");

		// Delete dependent/content tables first if relations require it.
		await tx.svg.deleteMany();
		await tx.library.deleteMany();
		await tx.course.deleteMany();
		await tx.admin.deleteMany();

		console.log("Recreating live content...");

		if (admins.length) await tx.admin.createMany({ data: admins });
		if (courses.length) await tx.course.createMany({ data: courses });
		if (library.length) await tx.library.createMany({ data: library });
		if (svgs.length) await tx.svg.createMany({ data: svgs });
	});

	console.log("Content sync complete.");
}

try {
	await sync();
}
catch (error) {
	console.error("SYNC FAILED:", error);
	process.exitCode = 1;
}
finally {
	await content.$disconnect();
	await live.$disconnect();
}