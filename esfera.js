import { Objeto3D } from "./objeto3d.js"
import { crearMalla } from "./geometria.js"

export class Esfera extends Objeto3D {
    constructor(filas, columnas, radio, color = [0, 0, 0]) {
        super(filas, columnas);
        this.radio = radio
        this.filas = filas
        this.columnas = columnas
        this.bufferPos = []
        this.bufferNorm = []
        this.generarGeometria()
        this.mallaDeTriangulos = crearMalla(this)
        this.color = color
    }

    obtenerMalla = () => {
        return this.mallaDeTriangulos;
    }

    generarGeometria() {
        for (var i = 0; i <= this.filas; i++) {
            for (var j = 0; j <= this.columnas; j++) {

                var u = j / this.columnas;
                var v = i / this.filas;

                var pos = this.obtenerPosicion(u, v);
                this.bufferPos.push(pos[0]);
                this.bufferPos.push(pos[1]);
                this.bufferPos.push(pos[2]);

                var nrm = this.obtenerNormal(u, v);

                this.bufferNorm.push(nrm[0]);
                this.bufferNorm.push(nrm[1]);
                this.bufferNorm.push(nrm[2]);

                // var uvs = superficie.getCoordenadasTextura(u, v);

                // uvBuffer.push(uvs[0]);
                // uvBuffer.push(uvs[1]);

            }
        }
    }

    obtenerPosicion(u, v) {

        var x = this.radio * Math.sin(u * Math.PI) * Math.cos(v * 2 * Math.PI);
        var y = this.radio * Math.sin(u * Math.PI) * Math.sin(v * 2 * Math.PI);
        var z = this.radio * Math.cos(u * Math.PI);
        return [x, y, z];
    }

    obtenerNormal(u, v) {
        var p0 = this.obtenerPosicion(u, v);
        var p1 = this.obtenerPosicion(u + 0.001, v);
        var p2 = this.obtenerPosicion(u, v + 0.001);
        var v1 = [p1[0] - p0[0], p1[1] - p0[1], p1[2] - p0[2]];
        var v2 = [p2[0] - p0[0], p2[1] - p0[1], p2[2] - p0[2]];

        var x = v1[1] * v2[2] - v1[2] * v2[1];
        var y = -(v1[0] * v2[2] - v1[2] * v2[0]);
        var z = v1[0] * v2[1] - v1[1] * v2[0];
        return p0;
    }
}

export class Plano extends Objeto3D {
    constructor(ancho, largo, filas, columnas) {
        super(filas, columnas);
        this.ancho = ancho
        this.largo = largo
        this.mallaDeTriangulos = crearMalla(this)
    }

    obtenerMalla = () => {
        return this.mallaDeTriangulos;
    }

    obtenerPosicion = function (u, v) {

        var x = (u - 0.5) * this.ancho;
        var z = (v - 0.5) * this.largo;
        return [x, 0, z];
    }

    obtenerNormal = function (u, v) {
        return [0, 1, 0];
    }
}
