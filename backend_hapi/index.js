const Hapi = require("@hapi/hapi");
const Cors = require("cors");
const Package = require('./package.json')
const HapiSwagger = require("hapi-swagger");
const Inert = require("@hapi/inert");
const Vision = require("@hapi/vision");

const { pool } = require("./config/database.js");
const { vehiculoSchema } = require("./schemas/vehiculo.js");
const { marcaSchema } = require("./schemas/marca.js");
const { lineaSchema } = require("./schemas/linea.js");
const Joi = require("joi");
const { required } = require("joi");

const init = async () => {
  const server = Hapi.server({
    port: 3030,
    host: "localhost",
    routes: {
      cors: true,
    },
  });

  //Configure Swagger
  const swaggerOptions = {
    info: {
      title: "API REST Academia",
      description: 'Esta es la documentación de la API del sprint-2, donde se pueden observar todos los servicios', 
      version: Package.version,
    },
  };

  await server.register([
    Inert,
    Vision,
    {
      plugin: HapiSwagger,
      options: swaggerOptions,
    },
  ]);

  server.route([
    {
      method: "GET",
      path: "/",
      handler: (request, h) => {
        return "Bienvenid@ a la API";
      },
    },
    {//Traer vehiculos
      method: "GET",
      path: "/vehiculo",
      handler: async (request, h) => {
        let vehiculo = await pool.connect();
        try {
          let result = await vehiculo.query(`SELECT * FROM vehiculo`);
          return result.rows;
        } catch (err) {
          console.log({ err });
          return h.code(500).response({ error: "Internal error server" });
        } finally {
          vehiculo.release(true);
        }
      },
      options:{
          description: 'Servicio para observar los vehículos',
          tags:['api'],
          notes: ['Este servicio nos permite validar la conexión con la BD'],
          plugins:{
              'hapi-swagger':{
                  responses: {
                      200: {description: '¡Todo está correcto!'},
                      500: {descripcion: '¡Hay un error interno!'}
                  }
              }
          }
      }
    },
    {//Metodo post vehiculo
      method: "POST",
      path: "/vehiculo",
      handler: async (request, h) => {
        let vehiculo = await pool.connect();
        const {
          id_placa,
          id_linea,
          modelo,
          fecha_vencimiento_seguro,
          fecha_vencimiento_tecnomecanica
        } = request.payload;
        try {
          let result = await vehiculo.query(
            `INSERT INTO vehiculo 
            VALUES ($1, $2, $3, $4, $5)`,
            [
              id_placa,
              id_linea,
              modelo,
              fecha_vencimiento_seguro,
              fecha_vencimiento_tecnomecanica
            ]
          );
          return h.response('Datos enviados');
        } catch (err) {
          console.log({ err });
          return h.code(500).response({ error: "Internal error server" });
        } finally {
          vehiculo.release(true);
        }
      },
      options: {
        validate: {
          payload: vehiculoSchema},
          description: 'Servicio para agregar un nuevo vehiculo',
          tags: ['api'],
          notes: ['Este servicio permite agregar un nuevo vehículo a la BD'],
          plugins: {
              'hapi-swagger':{
                  responses: {
                      200: {description: '¡Todo está correcto'},
                      500: { description: '¡Hay un error interno!'}
                  }
              }
          }
      },
    },
    {//Metodo put vehiculo
      method: "PUT",
      path: "/vehiculo",
      handler: async (request, h) => {
        let vehiculo = await pool.connect();
        const { id_placa } = request.query;
        const {
          id_linea,
          modelo,
          fecha_vencimiento_seguro,
          fecha_vencimiento_tecnomecanica
        } = request.payload;
        try {
          let result = await vehiculo.query(
            `UPDATE vehiculo SET id_linea= $1, modelo= $2, fecha_vencimiento_seguro= $3, fecha_vencimiento_tecnomecanica= $4 WHERE id_placa = $5`,
            [
              id_linea,
              modelo,
              fecha_vencimiento_seguro,
              fecha_vencimiento_tecnomecanica,
              id_placa
            ]
          );
          return h.response("Los datos se han actualizado correctamente");
        } catch (err) {
          console.log({ err });
          return h.code(500).response({ error: "Internal error server" });
        } finally {
          vehiculo.release(true);
        }
      },
      options: {
        validate: {
          payload: vehiculoSchema},
          description: 'Servicio para actualizar un vehiculo',
          tags: ['api'],
          notes: ['Este servicio permite actualizar un vehículo de la BD'],
          plugins: {
            'hapi-swagger':{
                responses: {
                    200: {description: '¡Todo está correcto'},
                    500: { description: '¡Hay un error interno!'}
                }
            }
        }
      },
    },
    {//Metodo delete vehiculo
      method: "DELETE",
      path: "/vehiculo",
      handler: async (request, h) => {
        let vehiculo = await pool.connect();
        const { id_placa } = request.query;
        try {
          let result = await vehiculo.query(
            `DELETE FROM vehiculo WHERE id_placa = $1`,
            [id_placa]
          );
          return h.response("El vehiculo ha sido eliminado");
        } catch (err) {
          console.log({ err });
          return h.code(500).response({ error: "Internal error server" });
        } finally {
          vehiculo.release(true);
        }
      },
      options: {
          description: 'Servicio para eliminar un vehiculo',
          tags: ['api'],
          notes: ['Este servicio permite eliminar un vehículo a la BD'],
          plugins: {
            'hapi-swagger':{
                responses: {
                    200: {description: '¡Todo está correcto'},
                    500: { description: '¡Hay un error interno!'}
                }
            }
        }
      }
    },
    {//Modelo máximo almacenado y el mínimo.
      method: "GET",
      path: "/vehiculo/modelo",
      handler: async (request, h) => {
        let vehiculo = await pool.connect();
        try {
          let result = await vehiculo.query(
            `SELECT MIN(modelo), MAX(modelo) FROM vehiculo`
          );
          return result.rows;
        } catch (err) {
          console.log({ err });
          return h.code(500).response({ error: "Internal error server" });
        } finally {
          vehiculo.release(true);
        }
      },
      options: {
        description: 'Servicio para saber el modelo minimo y el maximo almacenado',
        tags: ['api'],
        notes: ['Este servicio permite saber el modelo minimo y el maximo almacenado de la BD'],
        plugins: {
          'hapi-swagger':{
              responses: {
                  200: {description: '¡Todo está correcto'},
                  500: { description: '¡Hay un error interno!'}
              }
          }
      }
    }

    },
    {//Rango de fechas sobre el campo FECHA_VENCIMIENTO_SEGURO
      method: "GET",
      path: "/vehiculo/fecha_vencimiento_seguro/{fecha1}/{fecha2}",
      handler: async (request, h) => {
        let vehiculo = await pool.connect();
        try {
          let result = await vehiculo.query(
            `SELECT * FROM vehiculo WHERE fecha_vencimiento_seguro BETWEEN '${request.params.fecha1}' AND '${request.params.fecha2}'`
          );
          return result.rows;
        } catch (err) {
          console.log({ err });
          return h.code(500).response({ error: "Internal error server" });
        } finally {
          vehiculo.release(true);
        }
      },
      options: {
         description: 'Servicio para saber todos los vehículos por un rango de fechas',
         tags: ['api'],
         notes: ['Este servicio permite consultar todos los vehículos por un rango de fechas sobre el campo FECHA_VENCIMIENTO_SEGURO de la BD'],
         plugins: {
          'hapi-swagger':{
              responses: {
                  200: {description: '¡Todo está correcto'},
                  500: { description: '¡Hay un error interno!'}
              }
              
          }
      }
    }
    },
    // {
    //   method: "GET",
    //   path: "/vehiculo/modelo/{año1}/{año2}",
    //   handler: async (request, h) => {
    //     let vehiculo = await pool.connect();
    //     try {
    //       let result = await vehiculo.query(
    //         `SELECT * FROM vehiculo WHERE modelo BETWEEN '${request.params.año1}' AND '${request.params.año2}'`
    //       );
    //       return result.rows;
    //     } catch (err) {
    //       console.log({ err });
    //       return h.code(500).response({ error: "Internal error server" });
    //     } finally {
    //       vehiculo.release(true);
    //     }
    //   },
    // },
    {
      //Modelo máximo almacenado y el mínimo.
      method: "GET",
      path: "/vehiculo/modeloS",
      handler: async (request, h) => {
        let vehiculo = await pool.connect();
        try {
          let result = await vehiculo.query(`SELECT SUM(modelo) FROM vehiculo`);
          return result.rows;
        } catch (err) {
          console.log({ err });
          return h.code(500).response({ error: "Internal error server" });
        } finally {
          vehiculo.release(true);
        }
      },
    },
  ]);

  server.route([
    {//Traer marcas
      method: "GET",
      path: "/marca",
      handler: async (request, h) => {
        let marca = await pool.connect();
        try {
          let result = await marca.query(`SELECT * FROM marca`);
          return result.rows;
        } catch (err) {
          console.log({ err });
          return h.code(500).response({ error: "Internal error server" });
        } finally {
          marca.release(true);
        }
      },
      options:{
        description: 'Servicio para observar las marcas',
        tags:['api'],
        notes: ['Este servicio nos permite validar la conexión con la BD'],
        plugins:{
            'hapi-swagger':{
                responses: {
                    200: {description: '¡Todo está correcto!'},
                    500: {descripcion: '¡Hay un error interno!'}
                }
            }
        }
    }
    },
    {//Metodo POST marca
      method: "POST",
      path: "/marca",
      handler: async (request, h) => {
        let marca = await pool.connect();
        const { nombre, descripcion, estado } = request.payload;
        try {
          let result = await marca.query(
            `INSERT INTO marca (nombre, descripcion, estado)
              VALUES ($1, $2, $3)`,
            [nombre, descripcion, estado]
          );
          return result.rows;
        } catch (err) {
          console.log({ err });
          return h.response({ error: "Internal error server" });
        } finally {
          marca.release(true);
        }
      },
      options: {
        validate: {
          payload: marcaSchema},
          description: 'Servicio para agregar una nueva marca',
          tags: ['api'],
          notes: ['Este servicio permite agregar una nueva marca a la BD'],
          plugins: {
              'hapi-swagger':{
                  responses: {
                      200: {description: '¡Todo está correcto'},
                      500: { description: '¡Hay un error interno!'}
                  }
              }
          }
      },
    },
    {//Metodo PUT marca
      method: "PUT",
      path: "/marca",
      handler: async (request, h) => {
        let marca = await pool.connect();
        const { id } = request.query;
        const { nombre, descripcion, estado } = request.payload;
        try {
          let result = await marca.query(
            `UPDATE marca SET nombre= $1, descripcion=$2, estado=$3 WHERE id= $4`,
            [nombre, descripcion, estado, id]
          );
          return h.response("Los datos se han actualizado");
        } catch (err) {
          console.log({ err });
          return h.response({ error: "Internal error server" });
        } finally {
          marca.release(true);
        }
      },
      options: {
        validate: {
          payload: marcaSchema},
          description: 'Servicio para actualizar una marca',
          tags: ['api'],
          notes: ['Este servicio permite actualizar una marca de la BD'],
          plugins: {
              'hapi-swagger':{
                  responses: {
                      200: {description: '¡Todo está correcto'},
                      500: { description: '¡Hay un error interno!'}
                  }
              }
          }
      },
    },
    {//Estado N de una marca
      method: "GET",
      path: "/marca/n",
      handler: async (request, h) => {
        let marca = await pool.connect();
        try {
          let result = await marca.query(
            `SELECT * FROM marca WHERE estado='N'`
          );
          return result.rows;
        } catch (err) {
          console.log({ err });
          return h.code(500).response({ error: "Internal error server" });
        } finally {
          marca.release(true);
        }
      },
      options: {
          description: 'Servicio para para ver el estado N de una marca',
          tags: ['api'],
          notes: ['Este servicio permite ver el estado N de una marca de la BD'],
          plugins: {
              'hapi-swagger':{
                  responses: {
                      200: {description: '¡Todo está correcto'},
                      500: { description: '¡Hay un error interno!'}
                  }
              }
          }
      },
    },
    {//Estado S de una marca
      method: "GET",
      path: "/marca/s",
      handler: async (request, h) => {
        let marca = await pool.connect();
        try {
          let result = await marca.query(
            `SELECT * FROM marca WHERE estado='S'`
          );
          return result.rows;
        } catch (err) {
          console.log({ err });
          return h.code(500).response({ error: "Internal error server" });
        } finally {
          marca.release(true);
        }
      },
      options: {
        description: 'Servicio para para ver el estado S de una marca',
        tags: ['api'],
        notes: ['Este servicio permite ver el estado S de una marca de la BD'],
        plugins: {
            'hapi-swagger':{
                responses: {
                    200: {description: '¡Todo está correcto'},
                    500: { description: '¡Hay un error interno!'}
                }
            }
        }
    },
    },
  ]);

  server.route([
    {//Traer lineas
      method: "GET",
      path: "/linea",
      handler: async (request, h) => {
        let linea = await pool.connect();
        try {
          let result = await linea.query(`SELECT * FROM linea`);
          return result.rows;
        } catch (err) {
          console.log({ err });
          return h.code(500).response({ error: "Internal error server" });
        } finally {
          linea.release(true);
        }
      },
      options:{
        description: 'Servicio para observar las lineas',
        tags:['api'],
        notes: ['Este servicio nos permite validar la conexión con la BD'],
        plugins:{
            'hapi-swagger':{
                responses: {
                    200: {description: '¡Todo está correcto!'},
                    500: {descripcion: '¡Hay un error interno!'}
                }
            }
        }
    }
    },
    {//Metodo POST linea
      method: "POST",
      path: "/linea",
      handler: async (request, h) => {
        let linea = await pool.connect();
        const { id_marca, nombre, descripcion, estado } = request.payload;
        try {
          let result = await linea.query(
            `INSERT INTO linea (id_marca, nombre, descripcion, estado)
              VALUES ($1, $2, $3, $4)`,
            [id_marca, nombre, descripcion, estado]
          );
          return result.rows;
        } catch (err) {
          console.log({ err });
          return h.code(500).response({ error: "Internal error server" });
        } finally {
          linea.release(true);
        }
      },
      options: {
        validate: {
          payload: lineaSchema},
          description: 'Servicio para agregar una nueva linea',
          tags: ['api'],
          notes: ['Este servicio permite agregar una nueva linea a la BD'],
          plugins: {
              'hapi-swagger':{
                  responses: {
                      200: {description: '¡Todo está correcto'},
                      500: { description: '¡Hay un error interno!'}
                  }
              }
          }
      },
    },
    {//Metodo PUT linea
      method: "PUT",
      path: "/linea",
      handler: async (request, h) => {
        let linea = await pool.connect();
        const { id } = request.query;
        const { id_marca, nombre, descripcion, estado } = request.payload;
        try {
          let result = await linea.query(
            `UPDATE linea SET id_marca= $1, nombre= $2, descripcion=$3, estado=$4 WHERE id= $5`,
            [id_marca, nombre, descripcion, estado, id]
          );
          return h.response("Los datos se han actualizado");
        } catch (err) {
          console.log({ err });
          return h.response({ error: "Internal error server" });
        } finally {
          linea.release(true);
        }
      },
      options: {
        validate: {
          payload: lineaSchema},
          description: 'Servicio para actualizar una linea',
          tags: ['api'],
          notes: ['Este servicio permite actualizar una linea de la BD'],
          plugins: {
              'hapi-swagger':{
                  responses: {
                      200: {description: '¡Todo está correcto'},
                      500: { description: '¡Hay un error interno!'}
                  }
              }
          }
      },
    },
    {//Estado N de una linea
      method: "GET",
      path: "/linea/n",
      handler: async (request, h) => {
        let linea = await pool.connect();
        try {
          let result = await linea.query(
            `SELECT * FROM linea WHERE estado='N'`
          );
          return result.rows;
        } catch (err) {
          console.log({ err });
          return h.code(500).response({ error: "Internal error server" });
        } finally {
          linea.release(true);
        }
      },
      options: {
        description: 'Servicio para para ver el estado N de una linea',
        tags: ['api'],
        notes: ['Este servicio permite ver el estado N de una linea de la BD'],
        plugins: {
            'hapi-swagger':{
                responses: {
                    200: {description: '¡Todo está correcto'},
                    500: { description: '¡Hay un error interno!'}
                }
            }
        }
    },
    },
    {//Estado S de una linea
      method: "GET",
      path: "/linea/s",
      handler: async (request, h) => {
        let linea = await pool.connect();
        try {
          let result = await linea.query(
            `SELECT * FROM linea WHERE estado='S'`
          );
          return result.rows;
        } catch (err) {
          console.log({ err });
          return h.code(500).response({ error: "Internal error server" });
        } finally {
          linea.release(true);
        }
      },
      options: {
        description: 'Servicio para para ver el estado S de una marca',
        tags: ['api'],
        notes: ['Este servicio permite ver el estado S de una marca de la BD'],
        plugins: {
            'hapi-swagger':{
                responses: {
                    200: {description: '¡Todo está correcto'},
                    500: { description: '¡Hay un error interno!'}
                }
            }
        }
    },
    },
  ]);

  await server.start();
  console.log("Server running in port 3030");
};

init();
