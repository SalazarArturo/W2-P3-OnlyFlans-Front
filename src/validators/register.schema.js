import Joi from 'joi';

const registerSchema = Joi.object({
    name: Joi.string().min(2).max(100).required().messages({
        'string.min': 'El nombre debe tener al menos 2 caracteres',
        'string.empty': 'No puede dejar este campo vacío'
    }),
    email: Joi.string().email({ tlds: { allow: false } }).required().messages({
        'string.email': 'Formato de email no válido',
        'string.empty': 'No puede dejar este campo vacío'
    }),
    password: Joi.string().min(6).required().messages({
        'string.min': 'La contraseña debe contener al menos 6 caracteres',
        'string.empty': 'No puede dejar este campo vacío'
    }),
    role: Joi.string().valid('creador', 'seguidor').required().messages({
        'any.only': 'Debe seleccionar un rol',
        'any.required': 'Debe seleccionar un rol'
    })
});

export default registerSchema;
