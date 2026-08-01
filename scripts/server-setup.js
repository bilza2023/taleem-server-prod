import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

// --------------------------------------------------
// Paths
// --------------------------------------------------

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CONTENT_DIR = path.join(__dirname, "..", "content");
const PAGES_DIR = path.join(CONTENT_DIR, "pages");
const DATA_DIR = path.join(CONTENT_DIR, "data");
const IMAGES_DIR = path.join(CONTENT_DIR, "images");

// --------------------------------------------------
// Helpers
// --------------------------------------------------

async function ensureDirectory(dir) {
	await fs.mkdir(dir, { recursive: true });
}

async function writeJson(file, data) {
	await fs.writeFile(file, JSON.stringify(data, null, 2));
}

async function writeHtml(file, title) {
	await fs.writeFile(
		file,
		`<h1>${title}</h1>\n<p>This page is part of the Taleem reference installation.</p>\n`
	);
}

// --------------------------------------------------
// Main
// --------------------------------------------------

async function main() {

	console.log("📁 Preparing content library...");

	await ensureDirectory(CONTENT_DIR);
	await ensureDirectory(PAGES_DIR);
	await ensureDirectory(DATA_DIR);
	await ensureDirectory(IMAGES_DIR);

	console.log("📄 Creating pages...");

	await writeHtml(
		path.join(PAGES_DIR, "public-page.html"),
		"Public Page"
	);

	await writeHtml(
		path.join(PAGES_DIR, "members-page.html"),
		"Members Page"
	);

	console.log("🏠 Creating home-links.json...");

	await writeJson(
		path.join(DATA_DIR, "home-links.json"),
		{
			tabs: [],
			items: [
				{
					type: "page",
					contentId: "public-page",
					title: "Public Page",
					description: "Public page used for testing.",
					image: "/content/images/placeholder.webp",
					url: "/pages?article=public-page"
				},
				{
					type: "page",
					contentId: "members-page",
					title: "Members Page",
					description: "Members page used for testing.",
					image: "/content/images/placeholder.webp",
					url: "/pages?article=members-page"
				}
			]
		}
	);

	console.log("");
	console.log("✅ Content library ready.");
	console.log("");
	console.log("Created:");
	console.log("  content/pages/public-page.html");
	console.log("  content/pages/members-page.html");
	console.log("  content/data/home-links.json");
	console.log("");
}

main().catch((error) => {
	console.error(error);
	process.exit(1);
});