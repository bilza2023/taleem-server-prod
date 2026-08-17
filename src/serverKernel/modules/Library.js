export default class Library {

	constructor(kernel) {
		this.kernel = kernel;
	}

	async listByCourse(courseSlug) {

		return this.kernel.db.library.findMany({
			where: { courseSlug },
			select: {
				slug: true,
				title: true,
				description: true,
				thumbnail: true,
				type: true,
				courseSlug: true,
				groupSlug: true,
				sortOrder: true,
				allowCommunication: true,
				createdAt: true,
				updatedAt: true
			},
			orderBy: {
				sortOrder: "asc"
			}
		});

	}

	async listByGroup(courseSlug, groupSlug) {

		return this.kernel.db.library.findMany({
			where: {
				courseSlug,
				groupSlug
			},
			select: {
				slug: true,
				title: true,
				description: true,
				thumbnail: true,
				type: true,
				courseSlug: true,
				groupSlug: true,
				sortOrder: true,
				allowCommunication: true,
				createdAt: true,
				updatedAt: true
			},
			orderBy: {
				sortOrder: "asc"
			}
		});

	}

	async get(slug) {

		return this.kernel.db.library.findUnique({
			where: { slug }
		});

	}

}