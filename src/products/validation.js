import { body } from 'express-validator';

export const productValidation = [
	body('name').exists().withMessage('Name is a mandatory field!'),
	body('type').exists().withMessage('Type is a mandatory field!'),
	body('price')
		.exists()
		.withMessage('Price is a mandatory field!')
		.isFloat()
		.withMessage('Price should be numeric'),
	body('brand').exists().withMessage('Brand is a mandatory field!'),
	body('description').exists().withMessage('Description is a mandatory field!'),
];
