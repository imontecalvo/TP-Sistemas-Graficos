import { Objeto3D } from "../objeto3d.js";
import { BezierCubica } from "../bezier/bezier3.js"
import { discretizar } from "../bezier/discretizador.js";
import { superficieRevolucion } from "../superficieRevolucion.js";

export class TorreCastillo extends Objeto3D {
    constructor(alturaEdificio) {
        super()
        const alturaFija = 2.5
        const alturaVariable = alturaEdificio - (alturaFija / 2)
        const radioInf = 1.0
        const radioSup = 1.5

        const torre = new Torre(alturaVariable, alturaFija, radioInf, radioSup)
        const techo = new TechoTorre(alturaVariable, alturaFija, radioSup)
        this.agregarHijo(torre)
        this.agregarHijo(techo)
    }
}

class Torre extends Objeto3D {
    constructor(alturaVariable, alturaFija, radioInf, radioSup) {
        super()
        this.filas = 20
        this.columnas = 2 + 5 + 2 - 1

        const puntosCurva = this.obtenerPuntosCurva(alturaVariable, alturaFija, radioInf, radioSup)
        const data = superficieRevolucion(puntosCurva, this.columnas, this.filas + 1, 1)

        this.bufferPos = data[0]
        this.bufferNorm = data[1]
        this.bufferNormDibujadas = []
        this.calcularNormalesDibujadas()

        this.mallaDeTriangulos = this.crearMalla()
        this.color = [0, 0, 0]
    }
    obtenerPuntosCurva(alturaVariable, alturaFija, radioInf, radioSup) {
        //Puntos de control
        const ptosCtrlInferior = [[radioInf / 2, 0, 0], [radioInf / 2, alturaVariable * 0.75, 0], [radioInf / 2, alturaVariable * (7 / 8), 0], [radioInf / 2, alturaVariable, 0]]

        const ptosCtrlMedio = [[radioInf / 2, alturaVariable, 0], [radioInf / 2, alturaVariable + 0.5, 0], [radioSup / 2, alturaVariable + 0.5, 0], [radioSup / 2, alturaVariable + 1, 0]]

        const ptosCtrlSuperior = [[radioSup / 2, alturaVariable + 1, 0], [radioSup / 2, alturaVariable + 1.5, 0], [radioSup / 2, alturaVariable + alturaFija / 2, 0], [radioSup / 2, alturaVariable + alturaFija, 0]]

        //Instanciamos las curvas
        const ladoInf = new BezierCubica(ptosCtrlInferior, "z")
        const ladoMedio = new BezierCubica(ptosCtrlMedio, "z")
        const ladoSup = new BezierCubica(ptosCtrlSuperior, "z")

        //Obtenemos el poligono que forma la curva
        const puntosLadoInf = discretizar(ladoInf, 1, false, true)
        const puntosLadoMedio = discretizar(ladoMedio, 1 / 4, false, true)
        const puntosLadoSup = discretizar(ladoSup, 1, false, true)


        const pos = puntosLadoInf.posicion.concat(
            puntosLadoMedio.posicion,
            puntosLadoSup.posicion,
        )

        const norm = puntosLadoInf.normal.concat(
            puntosLadoMedio.normal,
            puntosLadoSup.normal,
        )

        return {
            posicion: pos,
            normal: norm,
        }
    }
}

class TechoTorre extends Objeto3D {
    constructor(alturaVariable, alturaFija, radioSup) {
        super()
        this.filas = 20
        this.columnas = 10 - 1
        const puntosCurva = this.obtenerPuntosCurva(alturaVariable, alturaFija, radioSup)
        const data = superficieRevolucion(puntosCurva, this.columnas, this.filas + 1, 1)

        this.bufferPos = data[0]
        this.bufferNorm = data[1]
        this.bufferNormDibujadas = []
        this.calcularNormalesDibujadas()

        this.mallaDeTriangulos = this.crearMalla()
        this.color = [0, 0, 0]
    }
    obtenerPuntosCurva(alturaVariable) {
        //Puntos de control
        const radioSup = 1.5
        const alturaFija = 2.5

        const alturaTecho = 2

        const ptosCtrlTecho = [[radioSup / 2 + 0.2, alturaVariable + alturaFija, 0], [radioSup / 2 * 8 / 18, alturaVariable + alturaFija + alturaTecho / 3, 0], [0.05, alturaVariable + alturaFija + alturaTecho, 0], [0, alturaVariable + alturaFija + alturaTecho, 0]]

        //Instanciamos las curvas
        const curvaTecho = new BezierCubica(ptosCtrlTecho, "z")

        //Obtenemos el poligono que forma la curva
        const puntosTecho = discretizar(curvaTecho, 1 / 9, false, true)

        return puntosTecho
    }
}