import { Objeto3D } from "../objeto3d.js"
import { BezierCubica } from "../bezier/bezier3.js"
import { discretizar } from "../bezier/discretizador.js"
import { superficeBarrido } from "../superficieBarrido.js";


export class Entrada extends Objeto3D {
    constructor(alto, largo, ancho) {
        super()
        const porton = new Porton(alto, largo, ancho)
        const marco = new MarcoPorton(alto, largo, ancho)
        this.agregarHijo(porton)
        this.agregarHijo(marco)
    }
}

class Porton extends Objeto3D {
    constructor(alto, largo, ancho) {
        super()
        this.filas = 5
        this.columnas = 7
        const puntosCurva = this.obtenerPuntosCurva(alto, largo)
        const cantPuntosCurva = this.columnas + 1
        const recorrido = new BezierCubica([[0, 0, 2 * ancho], [0, 0, 2 * ancho / 3], [0, 0, 2 * ancho / 5], [0, 0, ancho]], "y")
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
            if (i % 3 == 2) return -ancho;
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

class MarcoPorton extends Objeto3D {
    constructor(alto, largo, ancho) {
        super()
        const anchoMarco = 0.25
        const profundidad = ancho + 4 * anchoMarco

        this.filas = 5
        this.columnas = 19
        const puntosCurva = this.obtenerPuntosCurva(alto, largo, 0, anchoMarco)
        const cantPuntosCurva = this.columnas + 1
        const recorrido = new BezierCubica([[0, 0, profundidad / 2], [0, 0, profundidad / 4], [0, 0, -profundidad / 4], [0, 0, -profundidad / 2]], "y")
        const data = superficeBarrido(puntosCurva, recorrido, this.columnas, 2)

        const caras = this.obtenerCaras(data, cantPuntosCurva, profundidad / 2, alto, anchoMarco)

        this.bufferPos = caras.Frontal.posicion.concat(data[0], caras.Trasera.posicion)
        this.bufferNorm = caras.Frontal.normal.concat(data[1], caras.Trasera.normal)
        this.bufferNormDibujadas = []
        this.calcularNormalesDibujadas()

        this.mallaDeTriangulos = this.crearMalla()
        this.color = [0, 0, 0]
    }

    obtenerCaras(data, cantPuntosCurva, ancho, alto, anchoMarco) {
        const caraFrontalPos = data[0].slice(0, cantPuntosCurva * 3).map((x, i) => {
            if (i === 13 || i === 16 || i === 43 || i == 46) return alto;
            else if (i % 3 == 1) return 0;
            else return x;
        }).concat(data[0].slice(0, cantPuntosCurva * 3))

        let caraFrontalNorm = []
        for (let i = 0; i < cantPuntosCurva * 2; i++) {
            caraFrontalNorm.push(0)
            caraFrontalNorm.push(0)
            caraFrontalNorm.push(1)
        }

        const caraTraseraPos = data[0].slice(-cantPuntosCurva * 3).concat(caraFrontalPos.map((x, i) => {
            if (i % 3 == 2) return -ancho;
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

    obtenerPuntosCurva(alto, largo, profundidad, anchoMarco) {

        const ptosCtrlAbajoDer = [[largo / 2 + anchoMarco, 0, profundidad / 2], [largo / 2 + anchoMarco * 0.5, 0, profundidad / 2], [largo / 2 + anchoMarco * 0.2, 0, profundidad / 2], [largo / 2, 0, profundidad / 2]]
        const ptosCtrlLadoDerInt = [[largo / 2, 0, profundidad / 2], [largo / 2, alto * 0.2, profundidad / 2], [largo / 2, alto * 0.5, profundidad / 2], [largo / 2, alto, profundidad / 2]]
        const ptosCtrlArribaInt = [[largo / 2, alto, profundidad / 2], [0.5 * largo / 2, alto, profundidad / 2], [-0.5 * largo / 2, alto, profundidad / 2], [-largo / 2, alto, profundidad / 2]]
        const ptosCtrlLadoIzqInt = ptosCtrlLadoDerInt.map(x => ([x[0] - largo, x[1], x[2]])).reverse()
        const ptosCtrlAbajoIzq = ptosCtrlAbajoDer.map(x => ([x[0] - largo - anchoMarco, x[1], x[2]]))
        const ptosCtrlLadoIzqExt = ptosCtrlLadoDerInt.map(x => ([x[0] - largo - anchoMarco, x[1], x[2]]))
        const ptosCtrlArribaExtIzq = [[-largo / 2 - anchoMarco, alto + anchoMarco, profundidad / 2], [-largo / 2 - anchoMarco * 0.5, alto + anchoMarco, profundidad / 2], [-largo / 2 - anchoMarco * 0.3, alto + anchoMarco, profundidad / 2], [-largo / 2, alto + anchoMarco, profundidad / 2]]
        const ptosCtrlArribaExt = ptosCtrlArribaInt.map(x => ([x[0], x[1] + anchoMarco, x[2]])).reverse()
        const ptosCtrlArribaExtDer = [[largo / 2, alto + anchoMarco, profundidad / 2], [largo / 2 + anchoMarco * 0.3, alto + anchoMarco, profundidad / 2], [largo / 2 + anchoMarco * 0.5, alto + anchoMarco, profundidad / 2], [largo / 2 + anchoMarco, alto + anchoMarco, profundidad / 2]]
        const ptosCtrlLadoDerExt = ptosCtrlLadoDerInt.map(x => ([x[0] + anchoMarco, x[1], x[2]])).reverse()

        const curvaAbajoDer = new BezierCubica(ptosCtrlAbajoDer, "z")
        const curvaLadoDerInt = new BezierCubica(ptosCtrlLadoDerInt, "z")
        const curvaArribaInt = new BezierCubica(ptosCtrlArribaInt, "z")
        const curvaLadoIzqInt = new BezierCubica(ptosCtrlLadoIzqInt, "z")
        const curvaLadoAbajoIzq = new BezierCubica(ptosCtrlAbajoIzq, "z")
        const curvaLadoIzqExt = new BezierCubica(ptosCtrlLadoIzqExt, "z")
        const curvaArribaExtIzq = new BezierCubica(ptosCtrlArribaExtIzq, "z")
        const curvaArribaExt = new BezierCubica(ptosCtrlArribaExt, "z")
        const curvaArribaExtDer = new BezierCubica(ptosCtrlArribaExtDer, "z")
        const curvaLadoDerExt = new BezierCubica(ptosCtrlLadoDerExt, "z")

        const ptosAbajoDer = discretizar(curvaAbajoDer, 1, false)
        const ptosLadoDerInt = discretizar(curvaLadoDerInt, 1, false)
        const ptosArribaInt = discretizar(curvaArribaInt, 1, false)
        const ptosLadoIzqInt = discretizar(curvaLadoIzqInt, 1, false)
        const ptosAbajoIzq = discretizar(curvaLadoAbajoIzq, 1, false)
        const ptosLadoIzqExt = discretizar(curvaLadoIzqExt, 1, false)
        const ptosArribaExtIzq = discretizar(curvaArribaExtIzq, 1, false)
        const ptosArribaExt = discretizar(curvaArribaExt, 1, false)
        const ptosArribaExtDer = discretizar(curvaArribaExtDer, 1, false)
        const ptosLadoDerExt = discretizar(curvaLadoDerExt, 1, false)

        const pos =
            ptosAbajoDer.posicion.concat(
                ptosLadoDerInt.posicion,
                ptosArribaInt.posicion,
                ptosLadoIzqInt.posicion,
                ptosAbajoIzq.posicion,
                ptosLadoIzqExt.posicion,
                ptosArribaExtIzq.posicion,
                ptosArribaExt.posicion,
                ptosArribaExtDer.posicion,
                ptosLadoDerExt.posicion,
            )

        const norm =
            ptosAbajoDer.normal.concat(
                ptosLadoDerInt.normal,
                ptosArribaInt.normal,
                ptosLadoIzqInt.normal,
                ptosAbajoIzq.normal,
                ptosLadoIzqExt.normal,
                ptosArribaExtIzq.normal,
                ptosArribaExt.normal,
                ptosArribaExtDer.normal,
                ptosLadoDerExt.normal,
            )

        return {
            posicion: pos,
            normal: norm,
        }
    }
}