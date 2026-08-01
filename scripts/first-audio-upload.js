
// scripts/first-audio-upload.js

import fs from "fs";
import path from "path";

import kernel from "../src/serverKernel/ServerKernel.js";

const audioDir = path.resolve("content/audio");

async function main() {

	console.log("🧹 Clearing Audio table...");

	await kernel.db.audio.deleteMany();

	console.log("📂 Reading audio folder...");

	const files = fs.readdirSync(audioDir)
		.filter(file =>
			/\.(mp3|wav|ogg|m4a|aac|flac)$/i.test(file)
		)
		.sort();

	console.log(`Found ${files.length} audio files.`);

	for (const filename of files) {

		await kernel.audio.create({

			filename,

			description: "Imported audio",

			uploadedBy: "system"

		});

		console.log(`✅ ${filename}`);

	}

	console.log(`\n🎉 Imported ${files.length} audio files.`);

	await kernel.shutdown();

}

main().catch(async error => {

	console.error(error);

	await kernel.shutdown();

	process.exit(1);

});