
// src/upload/imageUpload.js

import fs from "fs";
import path from "path";
import multer from "multer";

const imageDir = "content/images";

fs.mkdirSync(imageDir, { recursive: true });

const storage = multer.memoryStorage();

function fileFilter(req, file, cb) {

	const ext = path.extname(file.originalname).toLowerCase();

	if (
		[
			".jpg",
			".jpeg",
			".png",
			".gif",
			".webp",
			".svg"
		].includes(ext)
	) {

		return cb(null, true);

	}

	cb(new Error("invalid_image_type"));

}

export default multer({

	storage,

	fileFilter,

	limits: {

		fileSize: 20 * 1024 * 1024

	}

});