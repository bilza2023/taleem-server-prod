// src/serverKernel/modules/Library.js

export default class Library {

	constructor(kernel) {
		this.kernel = kernel;
	}

	// --------------------------------------------------
	// Queries
	// --------------------------------------------------

	async list(filters = {}) {

		const where = {};

		if (filters.type) {
			where.type = filters.type;
		}

		if (filters.course || filters.access) {

			where.course = {};

			if (filters.course) {
				where.course.slug = filters.course;
			}

			if (filters.access) {
				where.course.access = filters.access;
			}

		}

		return this.kernel.db.library.findMany({

			where,

			select: {

				id: true,
				slug: true,
				title: true,
				thumbnail: true,
				type: true,
				createdAt: true,
				updatedAt: true,

				course: {
					select: {
						id: true,
						slug: true,
						access: true
					}
				}

			}

		});

	}

	async get(id) {

		return this.kernel.db.library.findUnique({

			where: { id },

			include: {

				course: {
					select: {
						id: true,
						slug: true,
						access: true
					}
				}

			}

		});

	}

	// --------------------------------------------------
	// CRUD
	// --------------------------------------------------

	async create(data) {

		return this.kernel.db.library.create({
			data
		});

	}

	async update(id, data) {

		return this.kernel.db.library.update({

			where: { id },

			data

		});

	}

	async delete(id) {

		return this.kernel.db.library.delete({

			where: { id }

		});

	}

	// --------------------------------------------------
	// Utilities
	// --------------------------------------------------

	async slugToId(slug) {

		const item = await this.kernel.db.library.findUnique({

			where: { slug },

			select: { id: true }

		});

		if (!item) {
			throw new Error(`Library "${slug}" not found.`);
		}

		return item.id;

	}

	async idToSlug(id) {

		const item = await this.kernel.db.library.findUnique({

			where: { id },

			select: { slug: true }

		});

		if (!item) {
			throw new Error(`Library "${id}" not found.`);
		}

		return item.slug;

	}

}