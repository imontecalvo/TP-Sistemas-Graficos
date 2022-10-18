import { BezierCubica } from "../bezier/bezier3.js"
import { discretizar } from "../bezier/discretizador.js"
import { Objeto3D } from "../objeto3d.js"
import { superficieRevolucion } from "../superficieRevolucion.js";
// Columnas: cant de puntos que forman un segmento transversal de la torre MENOS 1
// Filas: cant niveles MAS 1

export class Muralla extends Objeto3D {
    constructor() {
        super()
        this.lados = 8
        this.filas = this.lados-1
        this.columnas = 35
        var puntosCurva = []
        this.curvaLado = new BezierCubica([[17,-1.5,0],[17,-0.5,0],[17,-0.1,0],[17,0,0]], "z")
        this.curvaCentro = new BezierCubica([[6,5,0],[6.9,7,0],[7.1,7,0],[8,5,0]], "z")
        const puntosPendiente = discretizar(this.curvaLado, 1, false)
        const puntosCentro = discretizar(this.curvaCentro, 1/10, false)

        const h = 0.5
        const a = 0.25

        //muro
        // const pControlLadoI = [[6, 0, 0], [6.10, 1.60, 0], [6.40, 2.33, 0], [6.5, 4, 0]]
        // const ladoI = new BezierCubica(pControlLadoI, "z")
        // const puntosLadoI = discretizar(ladoI, 1 / this.columnas, false)
        const pControlLadoI = [[6, 0, 0], [6.10, 1.60, 0], [6.40, 2.33, 0], [6.5, 4, 0]]
        const pControlBalconILadoI = [[6.5, 4,0], [6.5, 4 + h * 0.3,0], [6.5, 4 + h * 0.6,0], [6.5, 4 + h,0]]
        console.log("balcon: ", pControlBalconILadoI)
        const pControlBalconITecho = [[6.5, 4 + h, 0], [6.5 + a * 0.3, 4 + h,0], [6.5 + a * 0.6, 4 + h,0], [6.5 + a, 4 + h,0]]
        const pControlBalconILadoD = [[6.5 + a, 4 + h,0], [6.5 + a, 4 + h * 0.6,0], [6.5 + a, 4 + h * 0.3,0], [6.5 + a, 4,0]]
        const pControlBalconPiso = [[6.5 + a, 4,0], [6.5 + 1.3 * a, 4,0], [6.5 + 1.6 * a, 4,0], [6.5 + 2 * a, 4,0]]

        const ladoI = new BezierCubica(pControlLadoI, "z")
        const balconILadoI = new BezierCubica(pControlBalconILadoI, "z")
        const balconITecho = new BezierCubica(pControlBalconITecho, "z")
        const balconILadoD = new BezierCubica(pControlBalconILadoD, "z")
        const balconPiso = new BezierCubica(pControlBalconPiso, "z")

        const ladoD = new BezierCubica(pControlLadoI.map(p => [6 + 8 - p[0], p[1], p[2]]), "z")
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


        // puntosCurva = {
        //     posicion:puntosPendiente.posicion.concat(puntosCentro.posicion),
        //     normal:puntosPendiente.normal.concat(puntosCentro.normal),
        // }
        
        puntosCurva = {
            posicion:pos,
            normal:norm,
        }

        console.log("topee: ", 1-1/this.filas)
        const data = superficieRevolucion(puntosCurva, this.columnas, this.filas+1, 1-1/this.lados, 1/this.lados)
        // console.log("puntos curva: ", data[0])

        this.bufferPos = data[0]
        this.bufferNorm = data[1]
        this.bufferNormDibujadas = []
        this.calcularNormalesDibujadas()
        this.mallaDeTriangulos = this.crearMalla()
        this.color = [0,0,0]
    }
}