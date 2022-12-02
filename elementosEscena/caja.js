import { Objeto3D } from "../objeto3d.js"
import { BezierCubica } from "../bezier/bezier3.js"
import { discretizar } from "../bezier/discretizador.js"
import { superficeBarrido } from "../superficieBarrido.js";
import { Esfera } from "./esfera.js";

export class Caja extends Objeto3D{
    constructor(alto, largo, ancho, material) {
        super()

        const caraFrontal = new CaraCaja(alto, largo, material)
        caraFrontal.trasladar(0, 0, ancho / 2)
        const caraTrasera = new CaraCaja(alto, largo, material)
        caraTrasera.trasladar(0, 0, -ancho / 2)
        caraTrasera.rotarY(Math.PI)
        const caraIzquierda = new CaraCaja(alto, ancho, material)
        caraIzquierda.trasladar(-largo/2, 0, 0)
        caraIzquierda.rotarY(-Math.PI/2)
        const caraDerecha = new CaraCaja(alto, ancho, material)
        caraDerecha.trasladar(largo/2, 0, 0)
        caraDerecha.rotarY(Math.PI/2)
        const caraSuperior = new CaraCaja(ancho, largo, material)
        caraSuperior.trasladar(0, alto, ancho/2)
        caraSuperior.rotarX(-Math.PI/2)
        const caraInferior = new CaraCaja(ancho, largo, material)
        caraInferior.trasladar(0, 0, -ancho/2)
        caraInferior.rotarX(Math.PI/2)

        this.agregarHijo(caraFrontal)
        this.agregarHijo(caraTrasera)
        this.agregarHijo(caraIzquierda)
        this.agregarHijo(caraDerecha)
        this.agregarHijo(caraSuperior)
        this.agregarHijo(caraInferior)
    }
}

export class CaraCaja extends Objeto3D{
    constructor(alto, largo, material) {
        super(material)

        this.filas = 1
        this.columnas = 1
        const posiciones = [[largo/2,0,0], [largo/2,alto,0],[-largo/2,0,0], [-largo/2,alto,0]]
        const normales = [[0,0,1], [0,0,1], [0,0,1], [0,0,1]]
        this.bufferPos = posiciones.flat()
        this.bufferNorm = normales.flat()
        this.bufferNormDibujadas = []
        this.calcularNormalesDibujadas()

        this.mallaDeTriangulos = this.crearMalla()
    }
}

export class CaraTrapecio extends Objeto3D{
    constructor(abajoIzq, arribaIzq, abajoDer, arribaDer, material) {
        super(material)
        this.id = "trapecio"
        this.filas = 8
        this.columnas = 1
        const puntoMedioArriba = puntoMedio(arribaIzq, arribaDer)
        const puntoMedioAbajo = puntoMedio(abajoIzq, abajoDer)

        const puntoMedioDerArriba = puntoMedio(arribaDer, puntoMedioArriba)
        const puntoMedioDerAbajo = puntoMedio(abajoDer, puntoMedioAbajo)

        const puntoMedioIzqArriba = puntoMedio(arribaIzq, puntoMedioArriba)
        const puntoMedioIzqAbajo = puntoMedio(abajoIzq, puntoMedioAbajo)

        const puntoMedioDerDerArriba = puntoMedio(arribaDer, puntoMedioDerArriba)
        const puntoMedioDerDerAbajo = puntoMedio(abajoDer, puntoMedioDerAbajo)

        const puntoMedioDerIzqArriba = puntoMedio(puntoMedioArriba, puntoMedioDerArriba)
        const puntoMedioDerIzqAbajo = puntoMedio(puntoMedioAbajo, puntoMedioDerAbajo)

        const puntoMedioIzqIzqArriba = puntoMedio(arribaIzq, puntoMedioIzqArriba)
        const puntoMedioIzqIzqAbajo = puntoMedio(abajoIzq, puntoMedioIzqAbajo)

        const puntoMedioIzqDerArriba = puntoMedio(puntoMedioArriba, puntoMedioIzqArriba)
        const puntoMedioIzqDerAbajo = puntoMedio(puntoMedioAbajo, puntoMedioIzqAbajo)

        const posiciones = [abajoDer, arribaDer,
            puntoMedioDerDerAbajo, puntoMedioDerDerArriba,
            puntoMedioDerAbajo, puntoMedioDerArriba,
            puntoMedioDerIzqAbajo, puntoMedioDerIzqArriba,
            puntoMedioAbajo, puntoMedioArriba,
            puntoMedioIzqDerAbajo, puntoMedioIzqDerArriba,
            puntoMedioIzqAbajo, puntoMedioIzqArriba,
            puntoMedioIzqIzqAbajo, puntoMedioIzqIzqArriba,
            abajoIzq, arribaIzq]
            
        const normal = normalizar(productoVectorial(restarVectores(abajoDer, abajoIzq), restarVectores(arribaIzq, abajoIzq)))
        const normales = new Array(2*(this.filas+1)).fill(normal);

        this.bufferPos = posiciones.flat()
        this.bufferNorm = normales.flat()
        this.bufferNormDibujadas = []
        this.calcularNormalesDibujadas()

        this.mallaDeTriangulos = this.crearMalla()
    }
}

function productoVectorial(vec1, vec2) {
    const x = vec1[1] * vec2[2] - vec1[2] * vec2[1]
    const y = - (vec1[0] * vec2[2] - vec1[2] * vec2[0])
    const z = vec1[0] * vec2[1] - vec1[1] * vec2[0]

    return [x, y, z]
}

function normalizar(normal) {
    const norma = Math.sqrt(normal[0] * normal[0] + normal[1] * normal[1] + normal[2] * normal[2])
    return [normal[0] / norma, normal[1] / norma, normal[2] / norma]
}

function restarVectores(vec1, vec2) {
    return [vec1[0] - vec2[0], vec1[1] - vec2[1], vec1[2] - vec2[2]]
}

function puntoMedio(vec1, vec2) {
    return [(vec1[0] + vec2[0]) / 2, (vec1[1] + vec2[1]) / 2, (vec1[2] + vec2[2]) / 2]
}
