import { body, validationResult } from 'express-validator';
import { getConnection } from '../database/connection.js';

//Definimos las reglas de validación para la creación de un nuevo producto

export const validateProducts = [
    body('name')
    .notEmpty().withMessage('El nombre del producto es obligatorio')
    .isLength({ min: 5}).withMessage('El producto debe tener al menos 5 caracteres'),

    body('price')
    .notEmpty().withMessage('El precio es obligatorio')
    .isFloat({ gt: 0 }).withMessage('El precio debe ser un número positivo'),

    body('quantity')
    .notEmpty().withMessage('La cantidad es obligatoria')
    .isInt({ gt: 0 }).withMessage('La cantidad debe ser un número entero positivo'),

    body('description')
    .notEmpty().withMessage('La descripción es obligatoria')
    .isLength({ max: 255 }).withMessage('La descripción no puede exceder los 255 caracteres'),  
    
    // Middleware para manejar los errores de validación
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                status: false,
                errors: errors.array().map(err => ({
                    campo: err.path,
                    mensaje: err.msg
                }))
            });
        }
        next();
    }
]