// scripts/first-images-upload.js

import fs from "fs";
import path from "path";

import kernel from "../src/serverKernel/ServerKernel.js";

const imageDir = path.resolve("content/images");

async function main() {

	console.log("🧹 Clearing Image table...");

	await kernel.db.image.deleteMany();

	console.log("📂 Reading image folder...");

	const files = fs.readdirSync(imageDir)
		.filter(file =>
			/\.(png|jpg|jpeg|webp|gif|svg)$/i.test(file)
		)
		.sort();

	console.log(`Found ${files.length} images.`);

	for (const filename of files) {

		await kernel.image.create({

			filename,

			description: "Imported image",

			alt: null,

			uploadedBy: "system"

		});

		console.log(`✅ ${filename}`);

	}

	console.log(`\n🎉 Imported ${files.length} images.`);

	await kernel.shutdown();

}

main().catch(async error => {

	console.error(error);

	await kernel.shutdown();

	process.exit(1);

});