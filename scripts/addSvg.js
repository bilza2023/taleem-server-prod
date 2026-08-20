import fs from "fs";
import path from "path";
import kernel from "taleem-kernel";

export default async function addSvg(sourceDir) {

	const svgDir = path.join(sourceDir, "svgs");

	if (!fs.existsSync(svgDir)) {
		throw new Error(`SVG directory not found: ${svgDir}`);
	}

	const files = fs.readdirSync(svgDir)
		.filter(file => file.endsWith(".svg"));

	for (const file of files) {

		const slug = path.basename(file, ".svg");
		const body = fs.readFileSync(
			path.join(svgDir, file),
			"utf8"
		);

		if (!body.trim()) {
			throw new Error(`SVG file is empty: ${file}`);
		}

		const existing = await kernel.svg.get(slug);

		if (existing) {
			console.log(`SVG exists: ${slug} — skipped`);
			continue;
		}

		await kernel.svg.create({
			slug,
			title: slug,
			body
		});

		console.log(`SVG added: ${slug}`);
	}

}