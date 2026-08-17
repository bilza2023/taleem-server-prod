import { describe, it, expect, beforeAll } from "vitest";
import request from "supertest";
import app from "../../app.js";
import kernel from "../../src/serverKernel/ServerKernel.js";

describe("Admin API", () => {

	const adminEmail = "bilal@taleem.help";
	const adminPassword = "12345678";
	const courseSlug = "fbise9math";

	let token;
	let librarySlug;

	beforeAll(async () => {

		const admin = await kernel.db.admin.findUnique({
			where: { email: adminEmail }
		});

		if (!admin) {
			throw new Error(`TEST SEED ERROR: Admin '${adminEmail}' not found.`);
		}

		const course = await kernel.course.get(courseSlug);

		if (!course) {
			throw new Error(`TEST SEED ERROR: Course '${courseSlug}' not found.`);
		}

		const items = await kernel.library.listByCourse(courseSlug);

		if (!items.length) {
			throw new Error(
				`TEST SEED ERROR: No library items found for course '${courseSlug}'.`
			);
		}

		librarySlug = items[0].slug;

	});

	it("logs in the admin", async () => {

		const res = await request(app)
			.post("/api/admin/login")
			.send({
				email: adminEmail,
				password: adminPassword
			});

		expect(res.status).toBe(200);
		expect(res.body.token).toBeTruthy();

		token = res.body.token;

	});

	it("verifies the admin", async () => {

		const res = await request(app)
			.get("/api/admin/verify")
			.set("Authorization", `Bearer ${token}`);

		expect(res.status).toBe(200);
		expect(res.body.email).toBe(adminEmail);
		expect(res.body.courseSlugs).toBeTruthy();

	});

	it("lists the admin's allowed courses", async () => {

		const res = await request(app)
			.get("/api/admin/courses")
			.set("Authorization", `Bearer ${token}`);

		expect(res.status).toBe(200);
		expect(Array.isArray(res.body)).toBe(true);

		const slugs = res.body.map(course => course.slug);

		expect(slugs).toContain(courseSlug);

	});

	it("allows access to the assigned course", async () => {

		const res = await request(app)
			.get(`/api/admin/course/${courseSlug}`)
			.set("Authorization", `Bearer ${token}`);

		expect(res.status).toBe(200);
		expect(res.body.slug).toBe(courseSlug);

	});

	it("lists library for the assigned course", async () => {

		const res = await request(app)
			.get(`/api/admin/course/${courseSlug}/library`)
			.set("Authorization", `Bearer ${token}`);

		expect(res.status).toBe(200);
		expect(Array.isArray(res.body)).toBe(true);

	});

	it("gets a library item belonging to the assigned course", async () => {

		const res = await request(app)
			.get(`/api/admin/library/${librarySlug}`)
			.set("Authorization", `Bearer ${token}`);

		expect(res.status).toBe(200);
		expect(res.body.slug).toBe(librarySlug);
		expect(res.body.courseSlug).toBe(courseSlug);

	});

	it("rejects an invalid admin token", async () => {

		const res = await request(app)
			.get(`/api/admin/course/${courseSlug}`)
			.set("Authorization", "Bearer invalid-token");

		expect(res.status).toBe(401);

	});

});