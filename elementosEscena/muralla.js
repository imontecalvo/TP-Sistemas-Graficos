import { BezierCubica } from "../bezier/bezier3.js"
import { discretizar } from "../bezier/discretizador.js"
import { Objeto3D } from "../objeto3d.js"
import { superficieRevolucion } from "../superficieRevolucion.js";
import { superficeBarrido } from "../superficieBarrido.js";
// Columnas: cant de puntos que forman un segmento transversal de la torre MENOS 1
// Filas: cant niveles MAS 1

export class Muralla extends Objeto3D {
    constructor() {
        super()
        this.lados = 8
        this.filas = this.lados - 1
        this.columnas = 35

        const h = 0.5
        const a = 0.25

        const puntosCurva = this.obtenerPuntosCurva(h, a)
        const data = superficieRevolucion(puntosCurva, this.columnas, this.filas + 1, 1 - 1 / this.lados, 1 / this.lados)

        this.bufferPos = data[0]
        this.bufferNorm = data[1]
        this.bufferNormDibujadas = []
        this.calcularNormalesDibujadas()

        const lastPointIdx = this.bufferPos.length - 1
        const inicio = [this.bufferPos[3 * 17], 0, this.bufferPos[3 * 17 + 2]]
        const final = [this.bufferPos[lastPointIdx - (3 * 17 + 2)], 0, this.bufferPos[lastPointIdx - (3 * 17)]]
        const posPorton = [(inicio[0] + final[0]) / 2, 0, (inicio[2] + final[2]) / 2]
        console.log("inicio: ", inicio, " final: ", final, "pos porton: ", posPorton)

        const porton = new Porton()
        // porton.trasladar(3,0,0)
        porton.trasladar(posPorton[0], posPorton[1], posPorton[2])
        porton.rotarY(Math.PI * 2 / 16)
        this.agregarHijo(porton)

        const longitud = Math.sqrt((final[0] - inicio[0]) ** 2 + (final[1] - inicio[1]) ** 2 + (final[2] - inicio[2]) ** 2)
        console.log("long: ", longitud)

        this.mallaDeTriangulos = this.crearMalla()
        this.color = [0, 0, 0]
    }

    obtenerPuntosCurva(h, a) {
        const radio = 9
        const ancho = 2

        const pControlLadoI = [[radio, 0, 0], [radio + 0.10, 1.60, 0], [radio + .40, 2.33, 0], [radio + .5, 4, 0]]
        const pControlBalconILadoI = [[radio + .5, 4, 0], [radio + .5, 4 + h * 0.3, 0], [radio + .5, 4 + h * 0.6, 0], [radio + .5, 4 + h, 0]]
        console.log("balcon: ", pControlBalconILadoI)
        const pControlBalconITecho = [[radio + .5, 4 + h, 0], [radio + .5 + a * 0.3, 4 + h, 0], [radio + .5 + a * 0.6, 4 + h, 0], [radio + .5 + a, 4 + h, 0]]
        const pControlBalconILadoD = [[radio + .5 + a, 4 + h, 0], [radio + .5 + a, 4 + h * 0.6, 0], [radio + .5 + a, 4 + h * 0.3, 0], [radio + .5 + a, 4, 0]]
        const pControlBalconPiso = [[radio + .5 + a, 4, 0], [radio + .5 + 1.3 * a, 4, 0], [radio + .5 + 1.6 * a, 4, 0], [radio + .5 + 2 * a, 4, 0]]

        const ladoI = new BezierCubica(pControlLadoI, "z")
        const balconILadoI = new BezierCubica(pControlBalconILadoI, "z")
        const balconITecho = new BezierCubica(pControlBalconITecho, "z")
        const balconILadoD = new BezierCubica(pControlBalconILadoD, "z")
        const balconPiso = new BezierCubica(pControlBalconPiso, "z")

        const ladoD = new BezierCubica(pControlLadoI.map(p => [2 * radio + ancho - p[0], p[1], p[2]]), "z")
        const balconDLadoD = new BezierCubica(pControlBalconILadoI.map(p => [1 + p[0], p[1], p[2]]), "z")
        const balconDTecho = new BezierCubica(pControlBalconITecho.map(p => [0.75 + p[0], p[1], p[2]]), "z")
        const balconDLadoI = new BezierCubica(pControlBalconILadoD.map(p => [0.5 + p[0], p[1], p[2]]), "z")
        const balconPisoD = new BezierCubica(pControlBalconPiso.map(p => [0.25 + p[0], p[1], p[2]]), "z")

        const puntosLadoI = discretizar(ladoI, 1 / 9, false, false)
        const puntosBalconILadoI = discretizar(balconILadoI, 1, false)
        const puntosBalconITecho = discretizar(balconITecho, 1, false)
        const puntosBalconILadoD = discretizar(balconILadoD, 1, false)
        const puntosBalconPiso = discretizar(balconPiso, 1, false)

        const puntosBalconPisoD = discretizar(balconPisoD, 1, false)
        const puntosBalconDLadoI = discretizar(balconDLadoI, 1, false)
        const puntosBalconDTecho = discretizar(balconDTecho, 1, false)
        const puntosBalconDLadoD = discretizar(balconDLadoD, 1, false)
        const puntosLadoD = discretizar(ladoD, 1 / 9, false, true)

        const pos =
            puntosLadoI.posicion.concat(
                puntosBalconILadoI.posicion,
                puntosBalconITecho.posicion,
                puntosBalconILadoD.posicion,
                puntosBalconPiso.posicion,
                puntosBalconPisoD.posicion,
                puntosBalconDLadoI.posicion,
                puntosBalconDTecho.posicion,
                puntosBalconDLadoD.posicion,
                puntosLadoD.posicion.reverse()
            )

        const norm =
            puntosLadoI.normal.concat(
                puntosBalconILadoI.normal,
                puntosBalconITecho.normal,
                puntosBalconILadoD.normal,
                puntosBalconPiso.normal,
                puntosBalconPisoD.normal,
                puntosBalconDLadoI.normal,
                puntosBalconDTecho.normal,
                puntosBalconDLadoD.normal,
                puntosLadoD.normal.reverse()
            )

        return {
            posicion: pos,
            normal: norm,
        }
    }
}

/*
Para la muralla que queda:
El porton tendra tamaño fijo. Lo creo y lo roto 90-(angulo delta/2) y deberia quedar siempre en el medio -> esto lo deberia poder hacer
Queda rellenar a ambos lados del porton con dos mini muros de longitud variable segun el largo de cada lado
    -> pensar como
        Tal vez creando los puntos de una curva transveral de la muralla ni bien empeiza y termina el porton y pushear esos puntos al buffer de puntos de la muralla al ppio y fin asi quedan unidos a la muralla
        
        |       |       |       |
        | izq   |PORTON | der   |
        |       |       |       |


        puntosDeIzq
        puntoMuralla (ya los tengo)
        puntosDer

*/


class Porton extends Objeto3D {
    constructor() {
        super()
        this.filas = 1
        this.columnas = 7
        const puntosCurva = this.obtenerPuntosCurva()
        const recorrido = new BezierCubica([[0, 0, 0], [0, 0, -0.1], [0, 0, -0.2], [0, 0, -0.25]], "y")
        const data = superficeBarrido(puntosCurva, recorrido, this.columnas, this.filas + 1)

        this.bufferPos = data[0]
        this.bufferNorm = data[1]
        this.bufferNormDibujadas = []
        this.calcularNormalesDibujadas()

        this.mallaDeTriangulos = this.crearMalla()
        console.log("portonn: ", this.mallaDeTriangulos)
        this.color = [0, 0, 0]
    }

    obtenerPuntosCurva() {
        const ptosCtrlAbajo = [[1, 0, 0], [0.5, 0, 0], [-0.5, 0, 0], [-1, 0, 0]]
        const ptosCtrlIzq = [[-1, 0, 0], [-1, 1, 0], [-1, 1.5, 0], [-1, 2, 0]]
        const ptosCtrlArriba = [[-1, 2, 0], [-0.5, 2, 0], [0.5, 2, 0], [1, 2, 0]]
        const ptosCtrlDerecha = [[1, 2, 0], [1, 1, 0], [1, 0.5, 0], [1, 0, 0]]

        const curvaAbajo = new BezierCubica(ptosCtrlAbajo, "z")
        const curvaIzq = new BezierCubica(ptosCtrlIzq, "z")
        const curvaArriba = new BezierCubica(ptosCtrlArriba, "z")
        const curvaDerecha = new BezierCubica(ptosCtrlDerecha, "z")

        const puntosAbajo = discretizar(curvaAbajo, 1, false)
        const puntosIzq = discretizar(curvaIzq, 1, false)
        const puntosArriba = discretizar(curvaArriba, 1, false)
        const puntosDerecha = discretizar(curvaDerecha, 1, false)

        const pos =
            puntosAbajo.posicion.concat(
                puntosIzq.posicion,
                puntosArriba.posicion,
                puntosDerecha.posicion
            )

        const norm =
            puntosAbajo.normal.concat(
                puntosIzq.normal,
                puntosArriba.normal,
                puntosDerecha.normal
            )

        return {
            posicion: pos,
            normal: norm,
        }
    }
}