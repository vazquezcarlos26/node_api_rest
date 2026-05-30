import { Router } from 'express';
import productsRoutes from './products.routes.js';
import usersRoutes from './users.routes.js';

const router = Router();

//Agregar las rutas de productos y usuarios al router principal,
// Si llegamos a tener mas rutas aqui se agregarian sin necesidad de modificar el index.js, 
// ya que el router se encarga de redirigir a cada una de las rutas específicas 
// dependiendo del endpoint solicitado

router.use('/products', productsRoutes);
router.use('/users', usersRoutes);

export default router;