import { Objeto3D } from "../objeto3d.js"

export class Esfera extends Objeto3D{
    constructor(radio, material) {
        super(material)
        this.radio = radio
        this.filas = 20
        this.columnas = 20

        this.bufferPos = []
        this.bufferNorm = []
        this.bufferNormDibujadas = []
        this.generarGeometria()
        this.calcularNormalesDibujadas()

        this.mallaDeTriangulos = this.crearMalla()
    }

    generarGeometria() {
        for (var i = 0; i <= this.filas; i++) {
            for (var j = 0; j <= this.columnas; j++) {

                var u = j / this.columnas;
                var v = i / this.filas;

                var pos = this.obtenerPosicionPunto(u, v);
                this.bufferPos.push(pos[0]);
                this.bufferPos.push(pos[1]);
                this.bufferPos.push(pos[2]);

                var nrm = this.obtenerNormal(u, v);

                this.bufferNorm.push(nrm[0]);
                this.bufferNorm.push(nrm[1]);
                this.bufferNorm.push(nrm[2]);
            }
        }
    }

    obtenerPosicionPunto(u, v) {

        var x = this.radio * Math.sin(u * Math.PI) * Math.cos(v * 2 * Math.PI);
        var y = this.radio * Math.sin(u * Math.PI) * Math.sin(v * 2 * Math.PI);
        var z = this.radio * Math.cos(u * Math.PI);
        return [x, y, z];
    }

    obtenerNormal(u, v) {
        var p0 = this.obtenerPosicionPunto(u, v);
        var p1 = this.obtenerPosicionPunto(u + 0.001, v);
        var p2 = this.obtenerPosicionPunto(u, v + 0.001);
        var v1 = [p1[0] - p0[0], p1[1] - p0[1], p1[2] - p0[2]];
        var v2 = [p2[0] - p0[0], p2[1] - p0[1], p2[2] - p0[2]];

        const modulo = Math.sqrt(p0[0]**2 +p0[1]**2 + p0[2]**2);
        return [p0[0]/modulo, p0[1]/modulo, p0[2]/modulo];
    }
}