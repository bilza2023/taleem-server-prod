import express from "express";
import kernel from "taleem-kernel";

const router = express.Router();

router.post("/register", async (req, res) => {

	try {

		const user = await kernel.user.register(req.body);

		res.status(201).json(user);

	}
	catch (error) {

		res.status(400).json({
			error: error.message
		});

	}

});

router.post("/login", async (req, res) => {

	try {

		const { email, password } = req.body;

		const token = await kernel.user.login(
			email,
			password
		);

		res.json({ token });

	}
	catch (error) {

		res.status(401).json({
			error: error.message
		});

	}

});

router.post("/verify", async (req, res) => {

	try {

		const user = await kernel.auth.authenticate(
			req.body.token
		);

		res.json(user);

	}
	catch (error) {

		res.status(401).json({
			error: error.message
		});

	}

});

router.get("/me", async (req, res) => {

	try {

		const token = req.headers.authorization?.replace(
			"Bearer ",
			""
		);

		const user = await kernel.auth.authenticate(token);

		const communications =
			await kernel.communication.list({
				userId: user.id
			});

		res.json(communications);

	}
	catch (error) {

		res.status(401).json({
			error: error.message
		});

	}

});
router.post("/communication", async (req, res) => {
	try {
		const token = req.headers.authorization?.replace("Bearer ", "");
		const user = await kernel.auth.authenticate(token);
		const communication = await kernel.communication.create({
			userId: user.id,
			librarySlug: req.body.librarySlug,
			type: req.body.type,
			message: req.body.message
		});
		res.status(201).json(communication);
	}
	catch (error) {
		res.status(401).json({ error: error.message });
	}
});
export default router;