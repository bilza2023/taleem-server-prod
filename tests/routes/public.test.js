import { describe, it, expect } from "vitest";
import request from "supertest";
import app from "../../app.js";

describe("Public API", () => {

	it("GET /api/public/course returns courses", async () => {

		const res = await request(app)
			.get("/api/public/course");

		expect(res.status).toBe(200);
		expect(Array.isArray(res.body)).toBe(true);

	});

	it("GET /api/public/course/:slug returns a course", async () => {

		const res = await request(app)
			.get("/api/public/course/fbise9math");

		expect(res.status).toBe(200);
		expect(res.body.slug).toBe("fbise9math");
		expect(res.body.title).toBeTruthy();
		expect(res.body.groupings).toBeTruthy();

	});

	it("GET /api/public/course/:slug/list returns library items", async () => {

		const res = await request(app)
			.get("/api/public/course/fbise9math/list");

		expect(res.status).toBe(200);
		expect(Array.isArray(res.body)).toBe(true);

		if (res.body.length > 0) {

			expect(res.body[0]).toHaveProperty("slug");
			expect(res.body[0]).toHaveProperty("courseSlug");
			expect(res.body[0]).toHaveProperty("groupSlug");

		}

	});

	it("GET /api/public/course/:slug returns 404 for unknown course", async () => {

		const res = await request(app)
			.get("/api/public/course/does-not-exist");

		expect(res.status).toBe(404);
		expect(res.body.error).toBe("course_not_found");

	});

	it("GET /api/public/library/:slug returns a library item", async () => {

		const res = await request(app)
			.get("/api/public/library/fbise9math-ex4.2-q01");

		expect(res.status).toBe(200);
		expect(res.body.slug).toBe("fbise9math-ex4.2-q01");
		expect(res.body.courseSlug).toBe("fbise9math");

	});

	it("GET /api/public/library/:slug returns 404 for unknown item", async () => {

		const res = await request(app)
			.get("/api/public/library/does-not-exist");

		expect(res.status).toBe(404);
		expect(res.body.error).toBe("library_not_found");

	});

});