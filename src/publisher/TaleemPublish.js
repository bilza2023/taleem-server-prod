import path from "path";
import PublishSchema from "taleem-specs/schema/publish";
import loadCourse from "./componenets/loadCourse.js";
import compileItem from "./componenets/compileItem.js";
import trimSyllabus from "./componenets/trimSyllabus.js";
import kernel from "taleem-kernel";

import sqlAdoptor from "./componenets/SqlAdoptor.js";

export default class TaleemPublish {
	constructor(sourceDir, courseName) {
		if (!sourceDir) throw new Error("Content library path is required");
		if (!courseName) throw new Error("Course name is required");

		this.sourceDir = path.resolve(sourceDir);
		this.courseName = courseName;

		this.trimSyllabus = true;
		this.checkDecks = false;

		this.courseFile = path.join(
			this.sourceDir,
			"courses",
			courseName,
			`${courseName}.json`
		);

		this.contentDir = path.join(
			this.sourceDir,
			"content",
			courseName
		);

		this.course = null;
	}

	async compile() {
		this.course = loadCourse(
			this.courseFile,
			this.contentDir
		);

		const compiled = {
			course: {
				slug: this.course.slug,
				title: this.course.title,
				description: this.course.description,
				thumbnail: this.course.thumbnail,
				groupings: []
			},
			library: []
		};

		for (let i = 0; i < (this.course.groupings || []).length; i++) {
			const grouping = this.course.groupings[i];

			const groupingDir = path.join(
				this.contentDir,
				grouping.slug
			);

			const syllabus = grouping.items || [];
			const library = [];

			for (let j = 0; j < syllabus.length; j++) {
				const item = compileItem({
					slug: syllabus[j],
					grouping,
					groupingDir,
					course: this.course,
					sortOrder: j + 1
				});

				if (item) library.push(item);
			}

			const finalSyllabus = this.trimSyllabus
				? trimSyllabus(syllabus, library)
				: syllabus;

			compiled.course.groupings.push({
				slug: grouping.slug,
				title: grouping.title,
				sortOrder: i + 1,
				items: finalSyllabus
			});

			compiled.library.push(...library);
		}

		return PublishSchema.parse(compiled);
	}

async publish() {
	const data = await this.compile();
	return sqlAdoptor(kernel, data);
}
}