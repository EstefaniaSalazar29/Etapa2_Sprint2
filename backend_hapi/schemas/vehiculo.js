const Joi = require('joi');

const vehiculoSchema = Joi.object({
    id_placa: Joi.string().max(7).required(),
    id_linea: Joi.number().integer().required(),
    modelo: Joi.string().max(10).required(),
    fecha_vencimiento_seguro: Joi.date().min('now').required(),
    fecha_vencimiento_tecnomecanica: Joi.date().min('now').required(),
})

module.exports = {vehiculoSchema}