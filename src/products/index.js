import express from 'express';
import fs from 'fs-extra';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import uniqid from 'uniqid';
import { productValidation } from './validation.js';
import { validationResult } from 'express-validator';
import createError from 'http-errors';
import multer from 'multer';

const { writeFile } = fs;
const productsJsonPath = join(
	dirname(fileURLToPath(import.meta.url)),
	'products.json'
);
const productsFolderPath = join(
	dirname(fileURLToPath(import.meta.url)),
	'../../public/img/products'
);
// const readProductPicture = (fileName) =>
// 	fs.createReadStream(join(productsFolderPath, fileName));
const writeProductPicture = (fileName, content) =>
	writeFile(join(productsFolderPath, fileName), content);

const getProducts = () => {
	const content = fs.readFileSync(productsJsonPath);
	return JSON.parse(content);
};

const writeProducts = (content) =>
	fs.writeFileSync(productsJsonPath, JSON.stringify(content));

const productsRouter = express.Router();

productsRouter.get('/', (req, res, next) => {
	try {
		const products = getProducts();
		res.send(products);
	} catch (error) {
		console.log(error);
		next(error);
	}
});

productsRouter.post('/', productValidation, (req, res, next) => {
	try {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			next(
				createError(400, {
					errorList: errors,
				})
			);
		} else {
			const products = getProducts();
			const newProduct = { ...req.body, ID: uniqid(), createdAt: new Date() };

			products.push(newProduct);

			writeProducts(products);

			res.status(201).send({ id: newProduct.ID });
		}
	} catch (error) {
		console.log(error);
		next(error);
	}
});

productsRouter.delete('/:id', (req, res, next) => {
	try {
		const products = getProducts();

		const newProduct = products.filter(
			(product) => product.ID !== req.params.id
		);

		writeProducts(newProduct);

		res.status(204).send();
	} catch (error) {
		console.log(error);
		next(error);
	}
});

productsRouter.put('/:id', (req, res, next) => {
	try {
		const products = getProducts();

		const newProducts = products.filter(
			(product) => product.ID !== req.params.id
		);

		const modifiedProduct = {
			...req.body,
			ID: req.params.id,
			modifiedAt: new Date(),
		};

		newProducts.push(modifiedProduct);

		writeProducts(newProducts);

		res.send({ id: modifiedProduct.ID });
	} catch (error) {
		console.log(error);
		next(error);
	}
});

productsRouter.post(
	'/:id/upload',
	multer().single('productPic'),
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

export default productsRouter;
