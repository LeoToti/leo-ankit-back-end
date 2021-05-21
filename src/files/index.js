import express from 'express';
import fs from 'fs-extra';
import multer from 'multer';
import { join, dirname } from 'path';
import { pipeline } from 'stream';
import { fileURLToPath } from 'url';
import zlib from 'zlib';

const productsFolderPath = join(
	dirname(fileURLToPath(import.meta.url)),
	'../../public/img/products'
);

const filesRouter = express.Router();
filesRouter.post(
	'/upload',
	multer().single('profilePic'),
	async (req, res, next) => {
		try {
			console.log(req.file);
			await writeProductPicture(req.file.originalname, req.file.buffer);
			res.send();
		} catch (error) {
			console.log(error);
			next(error);
		}
	}
);
export default filesRouter;
