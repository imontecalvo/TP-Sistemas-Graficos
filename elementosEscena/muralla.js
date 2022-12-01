import { BezierCubica } from "../bezier/bezier3.js"
import { discretizar } from "../bezier/discretizador.js"
import { Objeto3D } from "../objeto3d.js"
import { superficieRevolucion } from "../superficieRevolucion.js";
import { Entrada } from "./entrada.js";
import { TorreMuralla } from "./torresMuralla.js";
import {Antorcha} from "./antorcha.js"


// Columnas: cant de puntos que forman un segmento transversal de la torre MENOS 1
// Filas: cant niveles MAS 1

var mat4 = glMatrix.mat4;
var vec4 = glMatrix.vec4;

export class Muralla extends Objeto3D {
    constructor(altura, lados) {
        super(window.materiales.PIEDRA)
        this.lados = lados
        this.filas = this.lados - 1 + 2 + 4
        this.columnas = 35
        this.largoEntrada = 2
        const h = 0.25
        const a = 0.25
        const radio = 6;
        const anguloEntrada = Math.PI * 2 / (2 * this.lados)

        const puntosCurva = this.obtenerPuntosCurva(altura, h, a, radio)
        const data = superficieRevolucion(puntosCurva, this.columnas, this.lados, 1 - 1 / this.lados, 1 / this.lados)

        //Rotamos para que la entrada quede de frente
        const matRot = mat4.create()
        mat4.rotateY(matRot, matRot, -anguloEntrada)

        let posicionMuralla = []
        let normalesMuralla = []
        for (let i = 0; i < data[0].length; i += 3) {
            const pos = [data[0][i], data[0][i + 1], data[0][i + 2], 1]
            const norm = [data[1][i], data[1][i + 1], data[1][i + 2], 1]
            vec4.transformMat4(pos, pos, matRot)
            vec4.transformMat4(norm, norm, matRot)

            posicionMuralla.push(pos[0], pos[1], pos[2])
            normalesMuralla.push(norm[0], norm[1], norm[2])

        }

        // Creacion entrada
        this.posPorton = this.obtenerPosPorton(posicionMuralla)
        this.entrada = new Entrada(2, this.largoEntrada, 0.25)
        this.entrada.trasladar(this.posPorton[0], this.posPorton[1], this.posPorton[2])
        this.agregarHijo(this.entrada)

        // Extremos y tapas de muralla
        const extremos = this.obtenerExtremosMuralla(puntosCurva, radio, this.largoEntrada, this.posPorton)
        const caras = this.obtenerCarasExtremos(extremos)

        // Creacion torres
        for (let i = 0; i < this.lados; i++) {
            const torre = new TorreMuralla(altura)
            torre.rotarY(Math.PI * 2 / (this.lados) * i - Math.PI / (this.lados))
            torre.trasladar(0, 0, radio + 1)
            // this.agregarHijo(torre)
        }

        // Creacion de antorchas
        const antorcha1 = new Antorcha()
        antorcha1.trasladar(this.posPorton[0]-2.,1.2,this.posPorton[2]-1)
        antorcha1.rotarX(-Math.PI / 4)
        this.agregarHijo(antorcha1)
        const antorcha2 = new Antorcha()
        antorcha2.trasladar(this.posPorton[0]+2.,1.2,this.posPorton[2]-1)
        antorcha2.rotarX(-Math.PI / 4)
        this.agregarHijo(antorcha2)


        
        this.bufferPos = caras.inicio.posicion.concat(extremos.inicio.posicion, posicionMuralla, extremos.fin.posicion, caras.fin.posicion)
        this.bufferNorm = caras.inicio.normal.concat(extremos.inicio.normal, normalesMuralla, extremos.fin.normal, caras.fin.normal)
        this.bufferNormDibujadas = []
        this.calcularNormalesDibujadas()

        this.mallaDeTriangulos = this.crearMalla()
    }

    actualizar() {
        this.entrada.porton.resetearMatriz()

        this.entrada.porton.trasladar(0, 2, 0)
        this.entrada.porton.rotarX((-app.aperturaPorton / 360) * Math.PI * 2)
        this.entrada.porton.trasladar(0, - 2, 0)

    }

    obtenerPuntosCurva(altura, h, a, radio) {
        const ancho = 2

        //Puntos de Control curva muralla
        const pControlLadoI =
            [[radio, 0, 0], [radio + 0.10, altura / 3, 0], [radio + .40, altura / 2, 0], [radio + .5, altura, 0]]

        const pControlBalconILadoI =
            [[radio + .5, altura, 0], [radio + .5, altura + h * 0.3, 0], [radio + .5, altura + h * 0.6, 0], [radio + .5, altura + h, 0]]

        const pControlBalconITecho =
            [[radio + .5, altura + h, 0], [radio + .5 + a * 0.3, altura + h, 0], [radio + .5 + a * 0.6, altura + h, 0], [radio + .5 + a, altura + h, 0]]

        const pControlBalconILadoD =
            [[radio + .5 + a, altura + h, 0], [radio + .5 + a, altura + h * 0.6, 0], [radio + .5 + a, altura + h * 0.3, 0], [radio + .5 + a, altura, 0]]

        const pControlBalconPiso =
            [[radio + .5 + a, altura, 0], [radio + .5 + 1.3 * a, altura, 0], [radio + .5 + 1.6 * a, altura, 0], [radio + .5 + 2 * a, altura, 0]]

        //Instanciamos las curvas
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

        //Obtenemos el poligono que forma la curva
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

        //Concatenamos los vectores de posicion y de normales en dos unicos vectores
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

    obtenerExtremosMuralla(puntosMuralla, radio, anchoPorton, posPorton) {
        const puntosCurvaMuralla = {
            posicion: puntosMuralla.posicion.reverse(),
            normal: puntosMuralla.normal.reverse()
        }

        let posInicio = []
        let normInicio = []
        let posFin = []
        let normFin = []

        const mat = mat4.create()
        const matInicioMuralla = mat4.create()
        const matFinMuralla = mat4.create()

        mat4.rotateY(mat, mat, Math.PI / 2)
        mat4.translate(mat, mat, [-radio - 1, 0, 0])

        mat4.translate(matInicioMuralla, matInicioMuralla, [-anchoPorton / 2 - 0.25, 0, posPorton[2]])
        mat4.multiply(matInicioMuralla, matInicioMuralla, mat)

        mat4.translate(matFinMuralla, matFinMuralla, [anchoPorton / 2 + 0.25, 0, posPorton[2]])
        mat4.multiply(matFinMuralla, matFinMuralla, mat)

        const mat2Normales = mat4.create()
        mat4.rotateY(mat2Normales, mat2Normales, Math.PI / 2)

        for (let i = 0; i < puntosCurvaMuralla.posicion.length; i++) {
            const posActualInicio =
                [puntosCurvaMuralla.posicion[i][0], puntosCurvaMuralla.posicion[i][1], puntosCurvaMuralla.posicion[i][2], 1]
            const normActualInicio = [puntosCurvaMuralla.normal[i][0], puntosCurvaMuralla.normal[i][1], puntosCurvaMuralla.normal[i][2], 1]

            const posActualFin = [puntosCurvaMuralla.posicion[i][0], puntosCurvaMuralla.posicion[i][1], puntosCurvaMuralla.posicion[i][2], 1]
            const normActualFin = [puntosCurvaMuralla.normal[i][0], puntosCurvaMuralla.normal[i][1], puntosCurvaMuralla.normal[i][2], 1]

            vec4.transformMat4(posActualInicio, posActualInicio, matInicioMuralla)
            vec4.transformMat4(normActualInicio, normActualInicio, mat2Normales)

            vec4.transformMat4(posActualFin, posActualFin, matFinMuralla)
            vec4.transformMat4(normActualFin, normActualFin, mat2Normales)

            posInicio.push(posActualInicio[0], posActualInicio[1], posActualInicio[2])
            normInicio.push(normActualInicio[0], normActualInicio[1], normActualInicio[2])
            posFin.push(posActualFin[0], posActualFin[1], posActualFin[2])
            normFin.push(normActualFin[0], normActualFin[1], normActualFin[2])
        }

        return {
            inicio: {
                posicion: posInicio,
                normal: normInicio
            },
            fin: {
                posicion: posFin,
                normal: normInicio
            }
        }

    }

    obtenerCarasExtremos(extremos) {
        const posInicio = extremos.inicio.posicion.map((x, i) => {
            if (i % 3 == 1) return 0
            return x
        }).concat(extremos.inicio.posicion)

        const posFin = extremos.fin.posicion.concat(extremos.fin.posicion.map((x, i) => {
            if (i % 3 == 1) return 0
            return x
        }))

        const normInicio = []
        const normFin = []

        for (let i = 0; i < posInicio.length / 3; i++) {
            const normActual = [1, 0, 0, 1]
            normInicio.push(normActual[0], normActual[1], normActual[2])
            normFin.push(-normActual[0], normActual[1], -normActual[2])
        }

        return {
            inicio: {
                posicion: posInicio,
                normal: normInicio
            },
            fin: {
                posicion: posFin,
                normal: normFin
            }
        }
    }

    obtenerPosPorton(pos) {
        const lastPointIdx = pos.length - 1
        const inicio = [pos[3 * 17], 0, pos[3 * 17 + 2]]
        const final = [pos[lastPointIdx - (3 * 17 + 2)], 0, pos[lastPointIdx - (3 * 17)]]
        const posPorton = [(inicio[0] + final[0]) / 2, 0, (inicio[2] + final[2]) / 2]

        return posPorton
    }
}