import {Objeto3D} from "../objeto3d.js"
import {BezierCubica} from "../bezier/bezier3.js"
import { superficieRevolucion } from "../superficieRevolucion.js";
import { discretizar } from "../bezier/discretizador.js";

var mat4 = glMatrix.mat4;

export class Terreno extends Objeto3D{
    constructor(){
        super()
        const centro = new Centro()
        centro.trasladar(0,0.4,0)
        this.agregarHijo(centro)
        
        this.agregarHijo(new Periferia())
        
        this.modelMatrix = mat4.create()
    }
}

class Centro extends Objeto3D {
    constructor() {
        super([63/255,147/255,68/255])
        const radio = 10
        this.filas = 40
        this.columnas = 3
        var puntosCurva = []
        this.curvaPendiente = new BezierCubica([[11,-1.5,0],[10.5,-0.75,0],[10.3,-0.45,0],[10,0,0]], "z")
        this.curvaCentro = new BezierCubica([[10,0,0],[5,0,0],[2,0,0],[0,0,0]], "z")
        const puntosPendiente = discretizar(this.curvaPendiente, 1, false, true)
        const puntosCentro = discretizar(this.curvaCentro, 1, false, true)

        puntosCurva = {
            posicion:puntosPendiente.posicion.concat(puntosCentro.posicion),
            normal:puntosPendiente.normal.concat(puntosCentro.normal),
        }
        
        const data = superficieRevolucion(puntosCurva, this.columnas, this.filas+1)

        this.bufferPos = data[0]
        this.bufferNorm = data[1]
        this.bufferNormDibujadas = []
        this.calcularNormalesDibujadas()
        this.mallaDeTriangulos = this.crearMalla()
    }
}

class Periferia extends Objeto3D {
    constructor() {
        super([63/255,147/255,68/255])
        this.filas = 8
        this.columnas = 5
        var puntosCurva = []
        this.curvaLado = new BezierCubica([[17,-1.5,0],[17,-0.5,0],[17,-0.1,0],[17,0,0]], "z")
        this.curvaCentro = new BezierCubica([[17,0,0],[18,0,0],[20,0,0],[40,0,0]], "z")
        this.curvaLadoFuera = new BezierCubica([[40,0,0],[40,-0.5,0],[40,-0.75,0],[40,-1,0]], "z")
        const puntosPendiente = discretizar(this.curvaLado, 1, false)
        const puntosCentro = discretizar(this.curvaCentro, 1, false)
        const puntosLadoFuera = discretizar(this.curvaLadoFuera, 1, false)

        puntosCurva = {
            posicion:puntosPendiente.posicion.concat(puntosCentro.posicion, puntosLadoFuera.posicion),
            normal:puntosPendiente.normal.concat(puntosCentro.normal, puntosLadoFuera.normal),
        }
        
        const data = superficieRevolucion(puntosCurva, this.columnas, this.filas+1)

        this.bufferPos = data[0]
        this.bufferNorm = data[1]
        this.bufferNormDibujadas = []
        this.calcularNormalesDibujadas()
        this.mallaDeTriangulos = this.crearMalla()
    }
}


