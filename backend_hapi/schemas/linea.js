const Joi = require('joi');

const lineaSchema = Joi.object({
    id_marca: Joi.number().integer().required(),
    nombre: Joi.string().max(20).required(),
    descripcion: Joi.string().required(),
    estado: Joi.string().max(1).required()
})

module.exports = {lineaSchema}