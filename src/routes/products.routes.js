import {Router} from 'express';

import { 
    getProducts, 
    getProductById, 
    createProduct, 
    updateProduct, 
    deleteProduct 
} from '../controllers/products.controllers.js';
import { validateProducts } from '../validators/products.js';

const router = Router();

////////////.  RUTAS DE PRODUCTOS ///////////

router.get('/', getProducts);
router.get('/:id', getProductById);
router.post('/', validateProducts, createProduct);
router.put('/:id', validateProducts, updateProduct);
router.delete('/:id', deleteProduct);

export default router;