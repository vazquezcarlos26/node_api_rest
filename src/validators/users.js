import { body, validationResult } from 'express-validator';
import { getConnection } from '../database/connection.js';


//Definimos las reglas de validación para la creación de un nuevo usuario

export const validateCreateUser = [
    body('name')
    .notEmpty().withMessage('El nombre es obligatorio')
    .isLength({ min: 2}).withMessage('El nombre debe tener al menos 2 caracteres'),

    body('surnames')
    .notEmpty().withMessage('Los apellidos son obligatorios')
    .isLength({ min: 2}).withMessage('Los apellidos deben tener al menos 2 caracteres'),

    body('email')
    .notEmpty().withMessage('El correo electrónico es obligatorio')
    .isEmail().withMessage('El correo electrónico no es válido')

    ///Validacion en la base de datos para verificar que el correo no exista
    /// si el correo ya existe, se lanza un error personalizado
    .custom(async (value) => {
        const pool = await getConnection();
        const result = await pool
            .request()
            .input('email', value)
            .query('SELECT COUNT(*) AS count FROM users WHERE email = @email');

        if (result.recordset[0].count > 0) {
            throw new Error('El correo electrónico ya está en uso');
        }
    }),

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

export const validateUpdateUser = [
    body('name')
    .notEmpty().withMessage('El nombre es obligatorio')
    .isLength({ min: 2}).withMessage('El nombre debe tener al menos 2 caracteres'),

    body('surnames')
    .notEmpty().withMessage('Los apellidos son obligatorios')
    .isLength({ min: 2}).withMessage('Los apellidos deben tener al menos 2 caracteres'),

    // 🛑 Bloqueo total si intentan mandar el correo
    body('email')
    .custom((value,{ req }) => {
        //validamos si el campo email existe en el body, si existe lanzamos un error personalizado
        if(req.body.email !== undefined){
            throw new Error('No se permite actualizar el correo electrónico');
        }
        return true;
    }),

    // Middleware para manejar los errores de validación y limpiar el body
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