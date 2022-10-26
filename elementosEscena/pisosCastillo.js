import { Objeto3D } from "../objeto3d.js";
import { Caja } from "./caja.js";
import { superficeBarrido } from "../superficieBarrido.js";
import { BezierCubica } from "../bezier/bezier3.js"
import { discretizar } from "../bezier/discretizador.js"

export class PisosCastillo extends Objeto3D {
    constructor(largo, ancho, cantPisos, alturaPiso) {
        super()
        const pisos = new Caja(cantPisos * alturaPiso, largo, ancho)
        this.agregarHijo(pisos)

        const anchoBorde = 0.15
        for (let i = 1; i < cantPisos; i++) {
            const borde = new Caja(anchoBorde, largo + anchoBorde, ancho + anchoBorde)
            borde.trasladar(0, i * alturaPiso - anchoBorde / 2, 0)
            this.agregarHijo(borde)
        }

        this.agregarVentanas(cantPisos, alturaPiso, ancho, largo)
    }

    agregarVentanas(cantPisos, alturaPiso, ancho, largo) {
        const margen = 1
        const espaciado = 0.25
        const largoVentana = 0.5
        const altoVentana = 0.5
        const margenInferior = alturaPiso / 2
        const nVentanasLargo = Math.floor((largo - 2 * margen + espaciado) / (largoVentana + espaciado))
        const nVentanasAncho = Math.floor((ancho - 2 * margen + espaciado) / (largoVentana + espaciado))
        const espaciadoLargo = ((largo - 2 * margen) - (nVentanasLargo * largoVentana)) / (nVentanasLargo - 1)
        const espaciadoAncho = ((ancho - 2 * margen) - (nVentanasAncho * largoVentana)) / (nVentanasAncho - 1)

        for (let j = 0; j < cantPisos; j++) {
            const coordY = j * alturaPiso + margenInferior - altoVentana / 2
            for (let i = 0; i < nVentanasLargo; i++) {
                let ventana1 = new Ventana(altoVentana, largoVentana)
                ventana1.trasladar(i * (espaciadoLargo + largoVentana) + largoVentana / 2, 0, 0)
                ventana1.trasladar((-largo / 2) + margen, coordY, ancho / 2)

                let ventana2 = new Ventana(altoVentana, largoVentana)
                ventana2.trasladar(i * (espaciadoLargo + largoVentana) + largoVentana / 2, 0, 0)
                ventana2.trasladar((-largo / 2) + margen, coordY, -ancho / 2)

                this.agregarHijo(ventana1)
                this.agregarHijo(ventana2)
            }

            for (let k = 0; k < nVentanasAncho; k++) {
                let ventana3 = new Ventana(altoVentana, largoVentana)
                ventana3.trasladar(0, 0, k * (espaciadoAncho + largoVentana) + largoVentana / 2)
                ventana3.trasladar(-largo / 2, coordY, -(ancho - 2 * margen) / 2)
                ventana3.rotarY(Math.PI / 2)

                let ventana4 = new Ventana(altoVentana, largoVentana)
                ventana4.trasladar(0, 0, k * (espaciadoAncho + largoVentana) + largoVentana / 2,)
                ventana4.trasladar(largo / 2, coordY, -(ancho - 2 * margen) / 2)
                ventana4.rotarY(Math.PI / 2)

                this.agregarHijo(ventana3)
                this.agregarHijo(ventana4)
            }
        }
    }
}

export class Ventana extends Objeto3D {
    constructor(altura, largo) {
        super()
        this.filas = 5
        this.columnas = 16 - 1
        const ancho = 0.15
        const puntosCurva = this.obtenerPuntosCurva(altura, largo)
        const cantPuntosCurva = this.columnas + 1
        const recorrido = new BezierCubica([[0, 0, ancho / 2], [0, 0, ancho / 3], [0, 0, -ancho / 3], [0, 0, -ancho / 2]], "y")
        const data = superficeBarrido(puntosCurva, recorrido, this.columnas, 2)

        const caras = this.obtenerCaras(data, cantPuntosCurva, ancho)

        this.bufferPos = caras.Frontal.posicion.concat(data[0], caras.Trasera.posicion)
        this.bufferNorm = caras.Frontal.normal.concat(data[1], caras.Trasera.normal)
        this.bufferNormDibujadas = []
        this.calcularNormalesDibujadas()

        this.mallaDeTriangulos = this.crearMalla()
        this.color = [0, 0, 0]
    }

    obtenerCaras(data, cantPuntosCurva, ancho) {
        const caraFrontalPos = data[0].slice(0, cantPuntosCurva * 3).map((x, i) => {
            if (i % 3 == 1) return 0;
            else return x
        }).concat(data[0].slice(0, cantPuntosCurva * 3))

        let caraFrontalNorm = []
        for (let i = 0; i < cantPuntosCurva * 2; i++) {
            caraFrontalNorm.push(0)
            caraFrontalNorm.push(0)
            caraFrontalNorm.push(1)
        }

        const caraTraseraPos = data[0].slice(-cantPuntosCurva * 3).concat(caraFrontalPos.map((x, i) => {
            if (i % 3 == 2) return -ancho / 2;
            else return x
        }))

        const caraTraseraNorm = caraFrontalNorm.map((x, i) => {
            if (i % 3 == 2) return -1;
            else return x
        })

        return {
            Frontal: { posicion: caraFrontalPos, normal: caraFrontalNorm },
            Trasera: { posicion: caraTraseraPos, normal: caraTraseraNorm }
        }
    }

    obtenerPuntosCurva(altura, largo) {
        const t1 = [[0, 0, 0], [0, altura * 0.3, 0], [0, altura * 0.6, 0], [0, altura, 0]]
        const t2 = [[0, altura, 0], [largo * 2 / 15, altura + 0.3, 0], [largo * 13 / 15, altura + 0.3, 0], [largo, altura, 0]]
        const t3 = [[largo, altura, 0], [largo, altura * 0.6, 0], [largo, altura * 0.3, 0], [largo, 0, 0]]
        const t4 = [[largo, 0, 0], [largo * 0.6, 0, 0], [largo * 0.3, 0, 0], [0, 0, 0]]

        const ladoIzq = new BezierCubica(t1, "z")
        const ladoArriba = new BezierCubica(t2, "z")
        const ladoDer = new BezierCubica(t3, "z")
        const ladoAbajo = new BezierCubica(t4, "z")

        //Obtenemos el poligono que forma la curva
        const puntosLadoIzq = discretizar(ladoIzq, 1, false, false)
        const puntosLadoArriba = discretizar(ladoArriba, 1 / 9, false, false)
        const puntosLadoDer = discretizar(ladoDer, 1, false, false)
        const puntosLadoAbajo = discretizar(ladoAbajo, 1, false, false)


        const pos = puntosLadoIzq.posicion.map(x => ([x[0] - largo / 2, x[1], x[2]])).concat(
            puntosLadoArriba.posicion.map(x => ([x[0] - largo / 2, x[1], x[2]])),
            puntosLadoDer.posicion.map(x => ([x[0] - largo / 2, x[1], x[2]])),
            puntosLadoAbajo.posicion.map(x => ([x[0] - largo / 2, x[1], x[2]]))
        )

        const norm = puntosLadoIzq.normal.concat(
            puntosLadoArriba.normal,
            puntosLadoDer.normal,
            puntosLadoAbajo.normal
        )


        return {
            posicion: pos,
            normal: norm,
        }
    }
}