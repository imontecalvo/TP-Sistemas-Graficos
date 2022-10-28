import { Objeto3D } from "../objeto3d.js"
import { BezierCubica } from "../bezier/bezier3.js"
import { discretizar } from "../bezier/discretizador.js"
import { superficeBarrido } from "../superficieBarrido.js";

export class Caja extends Objeto3D{
    constructor(alto, largo, ancho, color=[0,0,0]) {
        super(color)

        this.filas = 5
        this.columnas = 7
        const puntosCurva = this.obtenerPuntosCurva(alto, largo)
        const cantPuntosCurva = this.columnas + 1
        const recorrido = new BezierCubica([[0, 0, ancho/2], [0, 0, ancho / 3], [0, 0, -ancho / 3], [0, 0, -ancho/2]], "y")
        const data = superficeBarrido(puntosCurva, recorrido, this.columnas, 2)

        const caras = this.obtenerCaras(data, cantPuntosCurva, ancho)

        this.bufferPos = caras.Frontal.posicion.concat(data[0], caras.Trasera.posicion)
        this.bufferNorm = caras.Frontal.normal.concat(data[1], caras.Trasera.normal)
        this.bufferNormDibujadas = []
        this.calcularNormalesDibujadas()

        this.mallaDeTriangulos = this.crearMalla()
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
            if (i % 3 == 2) return -ancho/2;
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

    obtenerPuntosCurva(alto, largo) {
        const ptosCtrlAbajo = [[largo / 2, 0, 0], [largo / 4, 0, 0], [-largo / 4, 0, 0], [-largo / 2, 0, 0]]
        const ptosCtrlIzq = [[-largo / 2, 0, 0], [-largo / 2, alto / 3, 0], [-largo / 2, alto / 2, 0], [-largo / 2, alto, 0]]
        const ptosCtrlArriba = [[-largo / 2, alto, 0], [-largo / 4, alto, 0], [largo / 4, alto, 0], [largo / 2, alto, 0]]
        const ptosCtrlDerecha = [[largo / 2, alto, 0], [largo / 2, alto / 2, 0], [largo / 2, alto / 3, 0], [largo / 2, 0, 0]]

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