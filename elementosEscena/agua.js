import { Objeto3D } from "../objeto3d.js"
import { BezierCubica } from "../bezier/bezier3.js"
import { superficieRevolucion } from "../superficieRevolucion.js";
import { discretizar } from "../bezier/discretizador.js";

export class Agua extends Objeto3D {
    constructor() {
        const configMapeoUv = { multiplicadorU: 5, multiplicadorV:1.5, signoU: -1 }
        super(window.materiales.AGUA, configMapeoUv)
        this.filas = 40
        this.columnas = 1
        this.curvaCentro = new BezierCubica([[20, 0, 0], [5, 0, 0], [2, 0, 0], [0, 0, 0]], "z")
        const puntosCentro = discretizar(this.curvaCentro, 1, false, true)

        const data = superficieRevolucion(puntosCentro, this.columnas, this.filas + 1)

        this.bufferPos = data[0]
        this.bufferNorm = data[1]
        this.bufferTang = data[2]

        this.bufferNormDibujadas = []
        this.bufferTangDibujadas = []

        this.calcularNormalesDibujadas()
        this.calcularTangentesDibujadas()
        this.mallaDeTriangulos = this.crearMalla()
    }
}