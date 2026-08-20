export default class Svg {

	constructor(kernel) {
		this.kernel = kernel;
	}

	async create(data) {

		return this.kernel.db.svg.create({
			data: {
				slug: data.slug,
				title: data.title,
				body: data.body,
				tags: data.tags ?? "[]"
			}
		});

	}

	async get(slug) {

		return this.kernel.db.svg.findUnique({
			where: { slug }
		});

	}

	async list() {

		return this.kernel.db.svg.findMany({
			orderBy: {
				title: "asc"
			}
		});

	}

	async update(slug, data) {

		return this.kernel.db.svg.update({
			where: { slug },
			data: {
				title: data.title,
				body: data.body,
				tags: data.tags
			}
		});

	}

	async delete(slug) {

		return this.kernel.db.svg.delete({
			where: { slug }
		});

	}

}