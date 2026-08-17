import bcrypt from "bcrypt";

export default class Admin {

	constructor(kernel) {
		this.kernel = kernel;
	}

	async list(filters = {}) {

		const where = {};

		if (filters.isActive !== undefined) {
			where.isActive = filters.isActive;
		}

		return this.kernel.db.admin.findMany({
			where
		});

	}

	async get(id) {

		return this.kernel.db.admin.findUnique({
			where: { id }
		});

	}

	async login(email, password) {

		const admin = await this.kernel.db.admin.findUnique({
			where: { email }
		});

		if (!admin) {
			throw new Error(`Admin.login(): Admin '${email}' not found.`);
		}

		if (!admin.isActive) {
			throw new Error(`Admin.login(): Admin '${email}' is inactive.`);
		}

		const ok = await bcrypt.compare(password, admin.password);

		if (!ok) {
			throw new Error(`Admin.login(): Invalid password.`);
		}

		return this.kernel.auth.createAdminToken(admin);

	}

	async create(data) {

		if (data.password) {
			data.password = await bcrypt.hash(data.password, 10);
		}

		return this.kernel.db.admin.create({
			data
		});

	}

	async update(id, data) {

		if (data.password) {
			data.password = await bcrypt.hash(data.password, 10);
		}

		return this.kernel.db.admin.update({
			where: { id },
			data
		});

	}

	async delete(id) {

		return this.kernel.db.admin.delete({
			where: { id }
		});

	}

	async emailToId(email) {

		const admin = await this.kernel.db.admin.findUnique({
			where: { email },
			select: { id: true }
		});

		if (!admin) {
			throw new Error(`Admin "${email}" not found.`);
		}

		return admin.id;

	}
	async isAdmin(courseSlug) {

	const courseSlugs = JSON.parse(this.courseSlugs || "[]");

	return courseSlugs.includes(courseSlug);

	}

}