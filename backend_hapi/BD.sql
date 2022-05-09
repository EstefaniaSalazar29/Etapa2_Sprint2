DROP USER IF EXISTS backend;
CREATE USER backend;
ALTER USER backend WITH PASSWORD '2906';

DROP DATABASE IF EXISTS semillero;
CREATE DATABASE semillero WITH 
OWNER = 'backend' 
ENCODING = 'UTF8';

-----------------
DROP SEQUENCE IF EXISTS marca_seq;
DROP TYPE IF EXISTS enum_estado;

CREATE SEQUENCE marca_seq;
CREATE TYPE enum_estado AS ENUM ('S', 'N');

DROP TABLE IF EXISTS marca;
CREATE TABLE marca (
    id INT NOT NULL DEFAULT NEXTVAL('marca_seq'),
    nombre VARCHAR(20) NOT NULL,
    descripcion TEXT NOT NULL,
    estado enum_estado NULL,
    PRIMARY KEY (id)
);



DROP SEQUENCE IF EXISTS linea_seq;
CREATE SEQUENCE linea_seq;

CREATE TABLE linea (
    id INT NOT NULL DEFAULT NEXTVAL('linea_seq'),
    id_marca INT NULL DEFAULT 1,
    nombre VARCHAR(20) NOT NULL,
    descripcion TEXT NOT NULL,
    estado enum_estado NULL,
    PRIMARY KEY (id),
    CONSTRAINT fk_id_marca 
    FOREIGN KEY (id_marca) REFERENCES marca (id) 
    ON DELETE RESTRICT 
    ON UPDATE CASCADE
);


DROP TABLE IF EXISTS vehiculo;
CREATE TABLE vehiculo (
    id_placa VARCHAR(7) NOT NULL,
    id_linea INT NULL DEFAULT 1,
    modelo VARCHAR(10) NOT NULL,
    fecha_vencimiento_seguro DATE NOT NULL,
    fecha_vencimiento_tecnomecanica DATE NOT NULL,
    PRIMARY KEY(id_placa),
    CONSTRAINT fk_id_linea 
    FOREIGN KEY (id_linea) REFERENCES linea (id) 
    ON DELETE RESTRICT 
    ON UPDATE CASCADE
);


INSERT INTO marca (nombre, descripcion, estado)
VALUES('Chevrolet', 'Chevrolet, también denominada Chevy, es una marca de automóviles y camiones con sede en Detroit, Estados Unidos perteneciente al grupo General Motors', 'S');

INSERT INTO linea (id_marca, nombre, descripcion, estado)
VALUES ('1', 'Chevrolet Captiva', 'Modelo Captiva del año 2010, color azul, transmision automatica, 128600 km', 'S');

INSERT INTO vehiculo
VALUES ('CVY-000', '1', '2010', '2023-03-24', '2024-05-30');

INSERT INTO vehiculo
VALUES ('UFM-03F', '1', '2020', '2023-03-24', '2024-05-30');

INSERT INTO marca (nombre, descripcion, estado)
VALUES ('Renault', 'Renault es un fabricante francés de automóviles tanto de lujo como de turismo, vehículos comerciales y automóviles de carreras.', 'S');

INSERT INTO linea (id_marca, nombre, descripcion, estado)
VALUES ('2', 'Renault Megane', 'El Renault Megane es uno de los compactos más populares en el mercado español gracias a su gran equilibrio entre sentido práctico y precio.', 'S' );
