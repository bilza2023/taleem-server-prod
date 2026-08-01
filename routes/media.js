// routes/media.js

import express from "express";
import fs from "fs";
import path from "path";

import kernel from "../src/serverKernel/ServerKernel.js";
import getToken from "../content/js/getToken.js";
import imageUpload from "../src/upload/imageUpload.js";
import audioUpload from "../src/upload/audioUpload.js";

const router = express.Router();

// --------------------------------------------------
// Images
// --------------------------------------------------

router.get("/image", async (req, res) => {

	try {

		await kernel.auth.authenticate(getToken(req));

		res.json(await kernel.image.list());

	}
	catch (error) {

		res.status(401).json({ error: error.message });

	}

});

router.post(
	"/image",
	imageUpload.single("file"),
	async (req, res) => {

		try {

			const admin = await kernel.auth.authenticate(
				getToken(req)
			);

			const filename = req.file.originalname;

			const filepath = path.join(
				"content/images",
				filename
			);

			if (fs.existsSync(filepath)) {

				return res.status(409).json({
					error: "filename_already_exists"
				});

			}

			fs.writeFileSync(
				filepath,
				req.file.buffer
			);

			const image = await kernel.image.create({

				filename,

				description: req.body.description,

				alt: req.body.alt || null,

				uploadedBy: admin.email

			});

			res.status(201).json(image);

		}
		catch (error) {

			if (error.message === "invalid_image_type") {

				return res.status(400).json({
					error: "invalid_image_type"
				});

			}

			if (
				error.message.toLowerCase().includes("authenticate") ||
				error.message.toLowerCase().includes("token")
			) {

				return res.status(401).json({
					error: "login_required"
				});

			}

			console.error(error);

			res.status(500).json({
				error: "server_error"
			});

		}

	}
);

// --------------------------------------------------
// Audio
// --------------------------------------------------

router.get("/audio", async (req, res) => {

	try {

		await kernel.auth.authenticate(getToken(req));

		res.json(await kernel.audio.list());

	}
	catch (error) {

		res.status(401).json({ error: error.message });

	}

});

router.post(
	"/audio",
	audioUpload.single("file"),
	async (req, res) => {

		try {

			const admin = await kernel.auth.authenticate(
				getToken(req)
			);

			const filename = req.file.originalname;

			const filepath = path.join(
				"content/audio",
				filename
			);

			if (fs.existsSync(filepath)) {

				return res.status(409).json({
					error: "filename_already_exists"
				});

			}

			fs.writeFileSync(
				filepath,
				req.file.buffer
			);

			const audio = await kernel.audio.create({

				filename,

				description: req.body.description,

				uploadedBy: admin.email

			});

			res.status(201).json(audio);

		}
		catch (error) {

			if (error.message === "invalid_audio_type") {

				return res.status(400).json({
					error: "invalid_audio_type"
				});

			}

			if (
				error.message.toLowerCase().includes("authenticate") ||
				error.message.toLowerCase().includes("token")
			) {

				return res.status(401).json({
					error: "login_required"
				});

			}

			console.error(error);

			res.status(500).json({
				error: "server_error"
			});

		}

	}
);

export default router;
