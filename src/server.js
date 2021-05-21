import express from 'express'; // importing 3rd part module
import listEndpoints from 'express-list-endpoints';
import cors from 'cors';
import filesRouter from '../src/files/index.js';
import {
	badRequestErrorHandler,
	notFoundErrorHandler,
	forbiddenErrorHandler,
	catchAllErrorHandler,
} from './errorHandlers.js';

import productsRoutes from './products/index.js';
//import { badRequestErrorHandler, notFoundErrorHandler, forbiddenErrorHandler, catchAllErrorHandler } from "./errorHandlers.js"
const port = 3001;

const server = express();
//server.use(loggerMiddleware)
server.use(cors());
server.use(express.json());

server.use('/products', productsRoutes);
server.use(badRequestErrorHandler);
server.use(notFoundErrorHandler);
server.use(forbiddenErrorHandler);
server.use(catchAllErrorHandler);

console.table(listEndpoints(server));

server.listen(port, () => {
	console.log('Server listening on port ', port);
});
