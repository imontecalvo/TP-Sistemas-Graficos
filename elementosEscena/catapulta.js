import { Objeto3D } from "../objeto3d.js";
import { Caja } from "./caja.js";
import { Cilindro } from "./cilindro.js";
import { BezierCubica } from "../bezier/bezier3.js"
import { discretizar } from "../bezier/discretizador.js"
import { superficeBarrido } from "../superficieBarrido.js";
import { Esfera } from "./esfera.js";

var angulo = 0*2 * Math.PI / 4

export class Catapulta extends Objeto3D {
    constructor() {
        super()
        //MEDIDAS: ALTO, LARGO, ANCHO
        const alturaCatapulta = 2
        const medidasTablon = [0.15, 1.8, 3.5]
        const elevacion = 0.3
        const tablon = new Caja(medidasTablon[0], medidasTablon[1], medidasTablon[2])
        tablon.trasladar(0, 0, -0.5)

        //3.5/2-(2*(0.3 + 0.15)+0.5)

        this.agregarHijo(tablon)
        this.agregarRuedas(elevacion + medidasTablon[0] / 2, 0.07, medidasTablon[1], medidasTablon[2])
        this.agregarPilares(medidasTablon[0], medidasTablon[1], medidasTablon[2], elevacion + medidasTablon[0] / 2, alturaCatapulta)

        let brazo = new Brazo(medidasTablon[2], medidasTablon[0] / 2 + alturaCatapulta - 0.12)
        this.agregarHijo(brazo)
        // brazo.trasladar(0, alturaCatapulta + elevacion + medidasTablon[0], 0.5)
        // brazo.trasladar(0, alturaCatapulta + elevacion + medidasTablon[0], 0)
        brazo.trasladar(0, alturaCatapulta, 0)
        brazo.rotarX(angulo)
        brazo.trasladar(0, 0, -0.80)
        // brazo.trasladar(0, -alturaCatapulta - elevacion - medidasTablon[0], -0.5)

        this.trasladar(0, elevacion + medidasTablon[0]/2, 0)
    }

    agregarRuedas(radio, ancho, largoTablon, anchoTablon) {
        const multiplicadores = [[1, 1], [1, -1], [-1, -1], [-1, 1]]
        multiplicadores.forEach((x) => {
            console.log(x)
            const rueda = new Cilindro(radio, ancho, 20)
            rueda.trasladar(x[0] * (largoTablon + ancho) / 2, 0, x[1] * (anchoTablon / 2) - (x[1] * radio) - 0.5)
            rueda.rotarY(Math.PI / 2)
            this.agregarHijo(rueda)
        })

        const eje1 = new Cilindro(0.05, largoTablon + 2 * ancho + 2 * 0.1, 10)
        eje1.trasladar(0, 0, (anchoTablon / 2) - radio - 0.5)
        eje1.rotarY(Math.PI / 2)

        const eje2 = new Cilindro(0.05, largoTablon + 2 * ancho + 2 * 0.1, 10)
        eje2.trasladar(0, 0, -(anchoTablon / 2) + radio - 0.5)
        eje2.rotarY(Math.PI / 2)

        this.agregarHijo(eje1)
        this.agregarHijo(eje2)
    }

    agregarPilares(elevacion, largoTablon, anchoTablon, radioRuedas, alturaCatapulta) {
        const altoPilar = alturaCatapulta
        const largoPilar = 1
        const anchoPilar = 0.15
        const pilar1 = new Pilar(altoPilar, largoPilar, anchoPilar)
        pilar1.trasladar(largoTablon / 2 - 0.2, elevacion, anchoTablon / 2 - 2 * radioRuedas - largoPilar / 2 - 0.5)
        pilar1.rotarY(Math.PI / 2)

        const pilar2 = new Pilar(altoPilar, largoPilar, anchoPilar)
        pilar2.trasladar(-largoTablon / 2 + 0.2, elevacion, anchoTablon / 2 - 2 * radioRuedas - largoPilar / 2 - 0.5)
        pilar2.rotarY(Math.PI / 2)

        this.agregarHijo(pilar1)
        this.agregarHijo(pilar2)

        const ejePilar = new Cilindro(anchoPilar * 2 / 3, largoTablon, 20)
        console.log(ejePilar.obtenerPosicion())
        // ejePilar.trasladar(0, -alturaCatapulta - elevacion -0.15, 0)

        ejePilar.trasladar(0, elevacion + altoPilar - 0.2, anchoTablon / 2 - 2 * radioRuedas - largoPilar / 2 - 0.5)
        ejePilar.rotarY(Math.PI / 2)


        this.agregarHijo(ejePilar)
    }
}


// Piezas:
// Box: (an:3.7, l: 1.5, al: 1.7)

// - TablonInf
// - Ruedas (4)
// - Ejes Ruedas (2)
// - Pilares (2)
// - Eje Brazo

// - Brazo (ancho:3.5)
//     - Barra
//     - Pala
//     - Municion quieta
//     - Colgante
//          - Pilares (2)
//          - Eje
//          - Bloque
// - Municion en movimiento

//ALTO - LARGO - ANCHO
// TABLON: x,1.5,2.7

class Pilar extends Objeto3D {
    constructor(alto, largo, ancho) {
        super()
        this.filas = 5
        this.columnas = 8 - 1
        const puntosCurva = this.obtenerPuntosCurva(alto, largo)
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

    obtenerPuntosCurva(alto, largo) {
        const largoSup = largo * (3 / 20)

        const t1 = [[-largo / 2, 0, 0], [(0.3) * ((-largoSup) - (-largo / 2)) - largo / 2, (0.3) * (alto), 0], [(0.6) * ((-largoSup) - (-largo / 2)) - largo / 2, (0.6) * (alto), 0], [-largoSup, alto, 0]]
        const t2 = [[-largoSup, alto, 0], [-largoSup / 2, alto, 0], [largoSup / 2, alto, 0], [largoSup, alto, 0]]
        const t3 = [[largoSup, alto, 0], [(0.3) * ((largo / 2) - largoSup) + largoSup, (0.6) * alto, 0], [(0.6) * ((largo / 2) - largoSup) + largoSup, (0.3) * alto, 0], [largo / 2, 0, 0]]
        const t4 = [[largo / 2, 0, 0], [largo / 4, 0, 0], [-largo / 4, 0, 0], [-largo / 2, 0, 0]]

        const curvaT1 = new BezierCubica(t1, "z")
        const curvaT2 = new BezierCubica(t2, "z")
        const curvaT3 = new BezierCubica(t3, "z")
        const curvaT4 = new BezierCubica(t4, "z")

        const puntosT1 = discretizar(curvaT1, 1, false)
        const puntosT2 = discretizar(curvaT2, 1, false)
        const puntosT3 = discretizar(curvaT3, 1, false)
        const puntosT4 = discretizar(curvaT4, 1, false)

        const pos =
            puntosT1.posicion.concat(
                puntosT2.posicion,
                puntosT3.posicion,
                puntosT4.posicion
            )

        const norm =
            puntosT1.normal.concat(
                puntosT2.normal,
                puntosT3.normal,
                puntosT4.normal
            )

        return {
            posicion: pos,
            normal: norm,
        }
    }
}

class Brazo extends Objeto3D {
    constructor(anchoTablon, elevacion) {
        super()
        const largoBarra = 4.5
        const anchoBarra = 0.25
        const barra = new Barra(0.18, largoBarra, anchoBarra)
        barra.trasladar(0, 0, anchoTablon / 2)
        barra.rotarY(-Math.PI / 2)
        this.agregarHijo(barra)

        const pala = new Caja(0.1, 1, 1)
        pala.trasladar(0, 0, anchoTablon / 2 - largoBarra)
        this.agregarHijo(pala)

        const colgante = new Colgante(anchoTablon, 0 + 0.08, anchoBarra)
        colgante.trasladar(0, 0, anchoTablon / 2 )
        colgante.rotarX(-angulo)
        this.agregarHijo(colgante)

        const radioMunicion = 0.35
        const municion = new Esfera(radioMunicion)
        municion.trasladar(0, 0 + radioMunicion + 0.1, anchoTablon / 2 - largoBarra)
        this.agregarHijo(municion)
    }
}

class Barra extends Objeto3D {
    constructor(alto, largo, ancho) {
        super()
        this.filas = 5
        this.columnas = 7
        const puntosCurva = this.obtenerPuntosCurva(alto, largo)
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

    obtenerPuntosCurva(alto, largo) {
        const alturaMin = alto / 2.5
        const ptosCtrlAbajo = [[0, 0, 0], [largo / 3, 0, 0], [largo / 2, 0, 0], [largo, 0, 0]]
        const ptosCtrlIzq = [[largo, 0, 0], [largo, alturaMin / 6, 0], [largo, alturaMin / 4, 0], [largo, alturaMin, 0]]
        const ptosCtrlArriba = [[largo, alturaMin, 0], [0.3 * (-largo) + largo, 0.3 * (alto - alturaMin) + alturaMin, 0], [0.6 * (-largo) + largo, 0.6 * (alto - alturaMin) + alturaMin, 0], [0, alto, 0]]
        // const ptosCtrlArriba = [[largo, alturaMin, 0], [largo, alto, 0] [largo, alto, 0]]
        const ptosCtrlDerecha = [[0, alto, 0], [0, alto / 3, 0], [0, alto / 2, 0], [0, 0, 0]]

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

class Colgante extends Objeto3D {
    constructor(anchoTablon, elevacion, anchoBarra) {
        super()

        // EJE
        const eje = new Cilindro(0.05, 2.5 * anchoBarra, 20)
        eje.trasladar(0, 0, 0)
        // eje.trasladar(0, 0, anchoTablon / 2 - 0.10)
        eje.rotarY(Math.PI / 2)
        this.agregarHijo(eje)

        // PILARES
        const pilar1 = new Pilar(0.4, 0.3, 0.05)
        pilar1.trasladar(anchoBarra / 2 + 0.1, 0 - 0.30, 0)
        // pilar1.trasladar(anchoBarra / 2 + 0.1, 0 - 0.30, anchoTablon / 2 - 0.10)
        pilar1.rotarY(Math.PI / 2)
        this.agregarHijo(pilar1)

        const pilar2 = new Pilar(0.4, 0.3, 0.05)
        pilar2.trasladar(-anchoBarra / 2 - 0.1, 0 - 0.30, 0)
        // pilar2.trasladar(-anchoBarra / 2 - 0.1, 0 - 0.30, anchoTablon / 2 - 0.10)
        pilar2.rotarY(Math.PI / 2)
        this.agregarHijo(pilar2)

        //BLOQUE
        const bloque = new Caja(0.6, 2.5 * anchoBarra + 0.1, 0.6)
        bloque.trasladar(0, 0 - 0.30 - 0.6, 0)
        // bloque.trasladar(0, 0 - 0.30 - 0.6, anchoTablon / 2 - 0.10)
        this.agregarHijo(bloque)
    }
}