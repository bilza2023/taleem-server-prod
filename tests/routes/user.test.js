import { describe, it, expect } from "vitest";
import request from "supertest";
import app from "../../app.js";

describe("User API", () => {

	const email = `test-${Date.now()}@example.com`;
	const password = "test-password-123";

	let token;

	it("registers a user", async () => {

		const res = await request(app)
			.post("/api/user/register")
			.send({
				email,
				password,
				name: "Test User"
			});

		expect(res.status).toBe(201);
		expect(res.body.email).toBe(email);
		expect(res.body.name).toBe("Test User");

	});

	it("logs in the registered user", async () => {

		const res = await request(app)
			.post("/api/user/login")
			.send({
				email,
				password
			});

		expect(res.status).toBe(200);
		expect(res.body.token).toBeTruthy();

		token = res.body.token;

	});

	it("verifies the logged-in user", async () => {

		const res = await request(app)
			.post("/api/user/verify")
			.send({ token });

		expect(res.status).toBe(200);
		expect(res.body.email).toBe(email);
		expect(res.body.name).toBe("Test User");
		expect(res.body.id).toBeTruthy();

	});

	it("rejects an invalid token", async () => {

		const res = await request(app)
			.post("/api/user/verify")
			.send({
				token: "invalid-token"
			});

		expect(res.status).toBe(401);

	});

});