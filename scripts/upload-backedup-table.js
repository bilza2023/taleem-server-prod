// scripts/upload-backedup-table.js

import kernel from "../src/serverKernel/ServerKernel.js";

const TABLE = "Course";
const backupPath = "/home/bilal-tariq/00--TALEEM/taleem-server-prod/prisma/backup.db";

async function main() {

	console.log("📂 Attaching backup database...");

	await kernel.db.$executeRawUnsafe(
		`ATTACH DATABASE '${backupPath}' AS backup`
	);

	try {

		console.log(`🧹 Clearing "${TABLE}" table...`);

		await kernel.db.$executeRawUnsafe(
			`DELETE FROM main."${TABLE}"`
		);

		console.log(`📥 Copying ${TABLE} rows...`);

		await kernel.db.$executeRawUnsafe(
			`INSERT INTO main."${TABLE}" SELECT * FROM backup."${TABLE}"`
		);

		const result = await kernel.db.$queryRawUnsafe(
			`SELECT COUNT(*) as count FROM main."${TABLE}"`
		);

		console.log(`✅ ${TABLE} table restored: ${result[0].count} rows.`);

		await kernel.db.$executeRawUnsafe(
			`DETACH DATABASE backup`
		);

		console.log("🎉 Done.");

	}
	catch (error) {

		console.error("❌ Failed:", error.message);

		try {
			await kernel.db.$executeRawUnsafe(
				`DETACH DATABASE backup`
			);
		}
		catch {}

		throw error;

	}
	finally {

		await kernel.shutdown();

	}

}

main().catch(error => {

	console.error(error);

	process.exit(1);

});