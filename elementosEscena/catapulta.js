import { Objeto3D } from "../objeto3d.js";
import { Caja } from "./caja.js";
import { Cilindro } from "./cilindro.js";
import { BezierCubica } from "../bezier/bezier3.js"
import { discretizar } from "../bezier/discretizador.js"
import { superficeBarrido } from "../superficieBarrido.js";
import { Esfera } from "./esfera.js";

var mat4 = glMatrix.mat4;

const angulo = 0

export class Catapulta extends Objeto3D {
    constructor() {
        super()
        //MEDIDAS: ALTO, LARGO, ANCHO
        this.alturaCatapulta = 2
        this.medidasTablon = [0.15, 1.8, 3.5]
        this.elevacion = 0.3
        const tablon = new Caja(this.medidasTablon[0], this.medidasTablon[1], this.medidasTablon[2], window.materiales.MADERA)
        tablon.trasladar(0, 0, -0.5)

        this.agregarHijo(tablon)
        this.agregarRuedas(this.elevacion + this.medidasTablon[0] / 2, 0.07, this.medidasTablon[1], this.medidasTablon[2])
        this.agregarPilares(this.medidasTablon[0], this.medidasTablon[1], this.medidasTablon[2], this.elevacion + this.medidasTablon[0] / 2, this.alturaCatapulta)

        this.brazo = new Brazo(this.medidasTablon[2], this.medidasTablon[0] / 2 + this.alturaCatapulta - 0.12)
        this.agregarHijo(this.brazo)

        this.municionMov = new Esfera(0.35, window.materiales.FUEGO_MUNICION)
        this.municionMov.trasladar(0, 5.544064998626709, 0.4945738911628723)
        this.municionMov.ocultar()
        this.agregarHijo(this.municionMov)

        this.trasladar(0, this.elevacion + this.medidasTablon[0] / 2, 0)
    }

    obtenerPosMunicion() {
        if (this.brazo.municion.oculto) return this.municionMov.obtenerPosicionAbsoluta(this.matrizModelado)
        var mat = mat4.create();
        mat4.multiply(mat, this.matrizModelado, this.brazo.matrizModelado);

        return this.brazo.municion.obtenerPosicionAbsoluta(mat)
    }

    actualizar() {
        this.resetearMatriz()
        this.brazo.resetearMatriz()

        this.brazo.actualizar()

        this.rotarY(Math.PI / 8)
        this.trasladar(0, 0, 22)
        this.rotarY(Math.PI)

        this.brazo.trasladar(0, this.alturaCatapulta, 0)
        this.brazo.rotarX(app.anguloCatapulta)
        this.brazo.trasladar(0, 0, -0.80)

        this.trasladar(0, this.elevacion + this.medidasTablon[0] / 2, 0)

        if (app.moverMunicion) {
            this.municionMov.mostrar()
            this.brazo.municion.ocultar()
            if (this.municionMov.obtenerPosicion()[1] > 0) {
                this.municionMov.resetearMatriz()
                this.municionMov.trasladar(0, 5.544064998626709, 0.4945738911628723)
                const x = 2 * app.velInicial * app.tiempo
                const y = - (1 / 2) * 9.8 * (app.tiempo) * (app.tiempo)
                this.municionMov.trasladar(0, y, x)
            } else {
                this.municionMov.setearPosicionY(0)
            }
        }

        this.rotarY(app.rotacionCatapulta * 2 * Math.PI / 360)
    }

    agregarRuedas(radio, ancho, largoTablon, anchoTablon) {
        const multiplicadores = [[1, 1], [1, -1], [-1, -1], [-1, 1]]
        multiplicadores.forEach((x) => {
            const rueda = new Cilindro(radio, ancho, 20, window.materiales.MADERA_CLARA)
            rueda.trasladar(x[0] * (largoTablon + ancho) / 2, 0, x[1] * (anchoTablon / 2) - (x[1] * radio) - 0.5)
            rueda.rotarY(Math.PI / 2)
            this.agregarHijo(rueda)
        })

        const eje1 = new Cilindro(0.05, largoTablon + 2 * ancho + 2 * 0.1, 10, window.materiales.MADERA_OSCURA)
        eje1.trasladar(0, 0, (anchoTablon / 2) - radio - 0.5)
        eje1.rotarY(Math.PI / 2)

        const eje2 = new Cilindro(0.05, largoTablon + 2 * ancho + 2 * 0.1, 10, window.materiales.MADERA_OSCURA)
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

        const ejePilar = new Cilindro(anchoPilar * 2 / 3, largoTablon, 20, materiales.MADERA)
        // ejePilar.trasladar(0, -alturaCatapulta - elevacion -0.15, 0)

        ejePilar.trasladar(0, elevacion + altoPilar - 0.2, anchoTablon / 2 - 2 * radioRuedas - largoPilar / 2 - 0.5)
        ejePilar.rotarY(Math.PI / 2)


        this.agregarHijo(ejePilar)
    }
}

class Pilar extends Objeto3D {
    constructor(alto, largo, ancho) {
        super(window.materiales.MADERA_CLARA)
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

        const tang =
            puntosT1.tangente.concat(
                puntosT2.tangente,
                puntosT3.tangente,
                puntosT4.tangente
            )

        return {
            posicion: pos,
            normal: norm,
            tangente: tang
        }
    }
}

class Brazo extends Objeto3D {
    constructor(anchoTablon, elevacion) {
        super()
        this.anchoTablon = anchoTablon
        const largoBarra = 4.5
        const anchoBarra = 0.25
        const barra = new Barra(0.18, largoBarra, anchoBarra)
        barra.trasladar(0, 0, anchoTablon / 2)
        barra.rotarY(-Math.PI / 2)
        this.agregarHijo(barra)

        const pala = new Caja(0.1, 1, 1, window.materiales.MADERA)
        pala.trasladar(0, 0, anchoTablon / 2 - largoBarra)
        this.agregarHijo(pala)

        this.colgante = new Colgante(anchoTablon, 0 + 0.08, anchoBarra)
        this.agregarHijo(this.colgante)

        const radioMunicion = 0.35
        this.municion = new Esfera(radioMunicion, window.materiales.FUEGO_MUNICION)
        this.municion.trasladar(0, 0 + radioMunicion + 0.1, anchoTablon / 2 - largoBarra)
        this.agregarHijo(this.municion)

        app.radioMC = -(anchoTablon / 2 - largoBarra)
    }

    actualizar() {
        this.colgante.resetearMatriz()

        this.colgante.trasladar(0, 0.07, this.anchoTablon / 2 - 0.1)
        this.colgante.rotarX(-app.anguloCatapulta)
    }
}

class Barra extends Objeto3D {
    constructor(alto, largo, ancho) {
        super(window.materiales.MADERA)
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

        const tang =
            puntosAbajo.tangente.concat(
                puntosIzq.tangente,
                puntosArriba.tangente,
                puntosDerecha.tangente
            )

        return {
            posicion: pos,
            normal: norm,
            tangente: tang
        }
    }
}

class Colgante extends Objeto3D {
    constructor(anchoTablon, elevacion, anchoBarra) {
        super()

        // EJE
        const eje = new Cilindro(0.05, 2.5 * anchoBarra, 20, window.materiales.MADERA)
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
        const bloque = new Caja(0.75, 2.5 * anchoBarra + 0.1, 0.75, window.materiales.PIEDRA)
        bloque.trasladar(0, 0 - 0.37 - 0.6, 0)
        // bloque.trasladar(0, 0 - 0.30 - 0.6, anchoTablon / 2 - 0.10)
        this.agregarHijo(bloque)
    }
}