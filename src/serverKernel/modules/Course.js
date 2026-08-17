export default class Course {

	constructor(kernel) {
		this.kernel = kernel;
	}

	async list(filters = {}) {

		const where = {};

		if (filters.access) {
			where.access = filters.access;
		}

		return this.kernel.db.course.findMany({
			where
		});

	}

	async get(slug) {

		return this.kernel.db.course.findUnique({
			where: { slug }
		});

	}

}