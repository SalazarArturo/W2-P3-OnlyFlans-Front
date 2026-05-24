import Joi from "joi";

const loginSchema = Joi.object({
    email: Joi.string().email().required().messages({
        'string.email': 'Formato de email no valido',
        'string.empty': 'No puede dejar este campo vacio'
    }),
    password: Joi.string().min(6).required().messages({
        'string.min': 'La contraseña debe contener almenos 6 caracteres',
        'string.empty': 'No puede dejar este campo vacio'
    })
});

export default loginSchema
