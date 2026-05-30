import {Router} from 'express';

import { 
    getProducts, 
    getProductById, 
    createProduct, 
    updateProduct, 
    deleteProduct 
} from '../controllers/products.controllers.js';

const router = Router();

////////////.  RUTAS DE PRODUCTOS ///////////

router.get('/', getProducts);
router.get('/:id', getProductById);
router.post('/', createProduct);
router.put('/:id', updateProduct);
router.delete('/:id', deleteProduct);

export default router;