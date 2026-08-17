import { describe, it, expect } from "vitest";
import request from "supertest";
import app from "../../app.js";

describe("User API", () => {

	it("POST /api/user/login returns a token", async () => {

		const res = await request(app)
			.post("/api/user/login")
			.send({
				email: "test@example.com",
				password: "password"
			});

		expect(res.status).toBe(200);
		expect(res.body.token).toBeTruthy();

	});

	it("POST /api/user/verify verifies the token", async () => {

		const login = await request(app)
			.post("/api/user/login")
			.send({
				email: "test@example.com",
				password: "password"
			});

		expect(login.status).toBe(200);

		const res = await request(app)
			.post("/api/user/verify")
			.send({
				token: login.body.token
			});

		expect(res.status).toBe(200);
		expect(res.body.email).toBe("test@example.com");

	});

	it("POST /api/user/login rejects invalid password", async () => {

		const res = await request(app)
			.post("/api/user/login")
			.send({
				email: "test@example.com",
				password: "wrong-password"
			});

		expect(res.status).toBe(401);
		expect(res.body.error).toBeTruthy();

	});

	it("POST /api/user/verify rejects invalid token", async () => {

		const res = await request(app)
			.post("/api/user/verify")
			.send({
				token: "invalid-token"
			});

		expect(res.status).toBe(401);
		expect(res.body.error).toBeTruthy();

	});

});