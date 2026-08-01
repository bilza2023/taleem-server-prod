// src/upload/audioUpload.js

import fs from "fs";
import path from "path";
import multer from "multer";

const audioDir = "content/audio";

fs.mkdirSync(audioDir, { recursive: true });

const storage = multer.memoryStorage();

function fileFilter(req, file, cb) {

	const ext = path.extname(file.originalname).toLowerCase();

	if (
		[
			".mp3",
			".wav",
			".ogg",
			".m4a"
		].includes(ext)
	) {

		return cb(null, true);

	}

	cb(new Error("invalid_audio_type"));

}

export default multer({

	storage,

	fileFilter,

	limits: {

		fileSize: 100 * 1024 * 1024

	}

});