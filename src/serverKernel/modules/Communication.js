export default class Communication {

	constructor(kernel) {
		this.kernel = kernel;
	}

	async list(filters = {}) {
		const where = {};

		if (filters.courseSlug) {
			const items = await this.kernel.db.library.findMany({
				where: { courseSlug: filters.courseSlug },
				select: { slug: true }
			});

			where.librarySlug = {
				in: items.map(item => item.slug)
			};
		}

		if (filters.librarySlug) where.librarySlug = filters.librarySlug;
		if (filters.userId) where.userId = filters.userId;

		if (filters.unanswered) {
			where.OR = [
				{ authorResponse: null },
				{ authorResponse: "" }
			];
		}

		return this.kernel.db.communication.findMany({
			where,
			include: { user: true },
			orderBy: { createdAt: "desc" }
		});
	}

	async get(id) {
		const item = await this.kernel.db.communication.findUnique({
			where: { id },
			include: { user: true }
		});

		if (!item) return null;

		const library = await this.kernel.db.library.findUnique({
			where: { slug: item.librarySlug },
			select: {
				slug: true,
				title: true,
				courseSlug: true
			}
		});

		return {
			...item,
			library
		};
	}

	async create(data) {
		return this.kernel.db.communication.create({ data });
	}

	async update(id, data) {
		return this.kernel.db.communication.update({
			where: { id },
			data
		});
	}

	async delete(id) {
		return this.kernel.db.communication.delete({
			where: { id }
		});
	}

	async listUnanswered(courseSlug) {
		const items = await this.list({
			courseSlug,
			unanswered: true
		});

		const slugs = [...new Set(items.map(item => item.librarySlug))];

		const libraries = await this.kernel.db.library.findMany({
			where: { slug: { in: slugs } },
			select: {
				slug: true,
				title: true,
				courseSlug: true
			}
		});

		const map = new Map(
			libraries.map(item => [item.slug, item])
		);

		return items.map(item => ({
			...item,
			library: map.get(item.librarySlug) || null
		}));
	}

	async countUserOpenQuestions(userId) {
		return this.kernel.db.communication.count({
			where: {
				userId,
				OR: [
					{ authorResponse: null },
					{ authorResponse: "" }
				]
			}
		});
	}
}