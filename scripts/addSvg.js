import fs from "fs";
import path from "path";
import kernel from "taleem-kernel";

export default async function addSvg(sourceDir) {
	const svgDir = path.join(sourceDir, "svgs");

	if (!fs.existsSync(svgDir)) {
		throw new Error(`SVG directory not found: ${svgDir}`);
	}

	const files = fs.readdirSync(svgDir)
		.filter(file => file.endsWith(".json"));

	for (const file of files) {
		const filePath = path.join(svgDir, file);
		const data = JSON.parse(fs.readFileSync(filePath, "utf8"));

		if (!data.slug) throw new Error(`SVG slug missing: ${file}`);
		if (!data.body || !data.body.trim()) {
			throw new Error(`SVG body missing: ${file}`);
		}

		const existing = await kernel.svg.get(data.slug);

		if (existing) {
			console.log(`SVG exists: ${data.slug} — skipped`);
			continue;
		}

		await kernel.svg.create({
			slug: data.slug,
			title: data.title || data.slug,
			tags: JSON.stringify(data.tags || []),
			body: data.body
		});

		console.log(`SVG added: ${data.slug}`);
	}
}