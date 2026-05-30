import { Router } from 'express';
import { 
    createUser,
    deleteUser,
    getUsers, 
    getUsersById, 
    updateUser
} from '../controllers/users.controllers.js';
import { validateCreateUser } from '../validators/users.js';

const router = Router();

////////////.  RUTAS DE USUARIOS ///////////

router.get('/', getUsers);
router.get('/:id', getUsersById);
router.post('/', validateCreateUser, createUser);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

export default router;