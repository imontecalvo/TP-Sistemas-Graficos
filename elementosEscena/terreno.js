import { Objeto3D } from "../objeto3d.js"
import { BezierCubica } from "../bezier/bezier3.js"
import { superficieRevolucion } from "../superficieRevolucion.js";
import { discretizar } from "../bezier/discretizador.js";

var mat4 = glMatrix.mat4;

export class Terreno extends Objeto3D {
    constructor() {
        super()
        const centro = new Centro()
        centro.trasladar(0, 0.4, 0)
        this.agregarHijo(centro)

        const ladera = new Ladera()
        ladera.trasladar(0, 0.4, 0)
        this.agregarHijo(ladera)

        this.agregarHijo(new Periferia())

        this.modelMatrix = mat4.create()
    }
}

class Centro extends Objeto3D {
    constructor() {
        const configMapeoUv = { multiplicadorU: 2, signoU: -1 }
        super(window.materiales.PASTO, configMapeoUv)
        this.id = "terrenoCentro"
        const radio = 10
        this.filas = 40
        this.columnas = 1
        this.curvaCentro = new BezierCubica([[10, 0, 0], [5, 0, 0], [2, 0, 0], [0, 0, 0]], "z")
        const puntosCentro = discretizar(this.curvaCentro, 1, false, true)
        console.log(puntosCentro)

        const data = superficieRevolucion(puntosCentro, this.columnas, this.filas + 1)

        this.bufferPos = data[0]
        this.bufferNorm = data[1]
        this.bufferTang = data[2]
        this.bufferBinorm = data[3]

        this.bufferNormDibujadas = []
        this.bufferBinormDibujadas = []
        this.bufferTangDibujadas = []

        this.calcularNormalesDibujadas()
        this.calcularBinormalesDibujadas()
        this.calcularTangentesDibujadas()
        this.mallaDeTriangulos = this.crearMalla()
    }
}

class Ladera extends Objeto3D{
    constructor(){
        super(window.materiales.PASTO_ROCAS,{ multiplicadorU: 10, multiplicadorV: 0.5, })
        this.filas = 40
        this.columnas = 1
        this.curvaPendiente = new BezierCubica([[11, -1.5, 0], [10.5, -0.75, 0], [10.3, -0.45, 0], [10, 0, 0]], "z")
        const puntosPendiente = discretizar(this.curvaPendiente, 1, false, true)

        const data = superficieRevolucion(puntosPendiente, this.columnas, this.filas + 1)

        this.bufferPos = data[0]
        this.bufferNorm = data[1]
        this.bufferBinorm = data[2]
        this.bufferTang = data[3]

        this.bufferNormDibujadas = []
        this.bufferBinormDibujadas = []
        this.bufferTangDibujadas = []

        this.calcularNormalesDibujadas()
        this.calcularBinormalesDibujadas()
        this.calcularTangentesDibujadas()
        this.mallaDeTriangulos = this.crearMalla()
    }
}

class Periferia extends Objeto3D {
    constructor() {
        const filas = 8
        const configMapeoUv = { multiplicadorU: filas, multiplicadorV: 2, signoU: -1 }
        super(window.materiales.PASTO, configMapeoUv)
        this.id = "terrenoPeriferia"
        this.filas = filas
        this.columnas = 5
        this.lados = this.filas
        var puntosCurva = []
        this.curvaLado = new BezierCubica([[17, -1.5, 0], [17, -0.5, 0], [17, -0.1, 0], [17, 0, 0]], "z")
        this.curvaCentro = new BezierCubica([[17, 0, 0], [18, 0, 0], [20, 0, 0], [40, 0, 0]], "z")
        this.curvaLadoFuera = new BezierCubica([[40, 0, 0], [40, -0.5, 0], [40, -0.75, 0], [40, -1, 0]], "z")
        const puntosPendiente = discretizar(this.curvaLado, 1, false)
        const puntosCentro = discretizar(this.curvaCentro, 1, false)
        const puntosLadoFuera = discretizar(this.curvaLadoFuera, 1, false)

        puntosCurva = {
            posicion: puntosPendiente.posicion.concat(puntosCentro.posicion, puntosLadoFuera.posicion),
            normal: puntosPendiente.normal.concat(puntosCentro.normal, puntosLadoFuera.normal),
            tangente: puntosPendiente.tangente.concat(puntosCentro.tangente, puntosLadoFuera.tangente),
            binormal: puntosPendiente.binormal.concat(puntosCentro.binormal, puntosLadoFuera.binormal)
        }

        const data = superficieRevolucion(puntosCurva, this.columnas, this.filas + 1)

        this.bufferPos = data[0]
        this.bufferNorm = data[1]
        this.bufferNormDibujadas = []
        this.calcularNormalesDibujadas()
        this.mallaDeTriangulos = this.crearMalla()
    }
}


