import { body, validationResult } from 'express-validator';
import { getConnection } from '../database/connection.js';

//Definimos las reglas de validación para la creación de un nuevo producto

export const validateProducts = [
    body('name')
    // Si el método es POST o si el campo name está presente en el cuerpo de la solicitud, 
    // entonces se aplica la validación. Esto permite que en las actualizaciones 
    // (PUT) solo se valide el campo name si se está intentando actualizarlo, 
    // mientras que en la creación (POST) siempre se valida.
    .if((value, { req }) => req.method == 'POST' || req.body.name !== undefined)
    .notEmpty().withMessage('El nombre del producto es obligatorio')
    .isLength({ min: 5}).withMessage('El producto debe tener al menos 5 caracteres'),

    body('price')
    .if((value, { req }) => req.method == 'POST' || req.body.price !== undefined)
    .notEmpty().withMessage('El precio es obligatorio')
    .isFloat({ gt: 0 }).withMessage('El precio debe ser un número positivo'),

    body('quantity')
    .if((value, { req }) => req.method == 'POST' || req.body.quantity !== undefined)
    .notEmpty().withMessage('La cantidad es obligatoria')
    .isInt({ gt: 0 }).withMessage('La cantidad debe ser un número entero positivo'),

    body('description')
    .if((value, { req }) => req.method == 'POST' || req.body.description !== undefined)
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