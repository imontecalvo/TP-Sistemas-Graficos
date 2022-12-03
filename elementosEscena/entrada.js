import { Objeto3D } from "../objeto3d.js"
import { BezierCubica } from "../bezier/bezier3.js"
import { discretizar } from "../bezier/discretizador.js"
import { superficeBarrido } from "../superficieBarrido.js";
import { Caja } from "./caja.js";


export class Entrada extends Objeto3D {
    constructor(alto, largo, ancho) {
        super()
        this.porton = new Caja(alto, largo, ancho, window.materiales.MADERA_OSCURA)
        const marco = new MarcoPorton(alto, largo, ancho)
        this.agregarHijo(this.porton)
        this.agregarHijo(marco)
    }
}

class MarcoPorton extends Objeto3D {
    constructor(alto, largo, ancho) {
        super(window.materiales.PIEDRA_OSCURA)
        const anchoMarco = 0.25
        const profundidad = ancho + 4 * anchoMarco

        
        const configMapeoUv = [
            {multiplicadorU:1/10,multiplicadorV:1,signoU:1,signoV:1},
            {multiplicadorU:1/10,multiplicadorV:1,signoU:1,signoV:1},
            {multiplicadorU:1,multiplicadorV:1,signoU:1,signoV:1},
            {multiplicadorU:1,multiplicadorV:1,signoU:1,signoV:1},
            {multiplicadorU:1/10,multiplicadorV:1,signoU:1,signoV:1},
            {multiplicadorU:1/10,multiplicadorV:1,signoU:1,signoV:1}
        ]

        const configMapeoUvTecho = [
            {multiplicadorU:1,multiplicadorV:1/10,signoU:1,signoV:1},
            {multiplicadorU:1,multiplicadorV:1/10,signoU:1,signoV:1},
            {multiplicadorU:1,multiplicadorV:1/10,signoU:1,signoV:1},
            {multiplicadorU:1,multiplicadorV:1/10,signoU:1,signoV:1},
            {multiplicadorU:1,multiplicadorV:1/2,signoU:1,signoV:1},
            {multiplicadorU:1,multiplicadorV:1/2,signoU:1,signoV:1},
        ]

        const paredDerecha = new Caja(alto, anchoMarco, profundidad, window.materiales.PIEDRA, "marco",configMapeoUv)
        paredDerecha.trasladar((largo / 2)+(anchoMarco/2), 0, 0)
        const paredIzquierda = new Caja(alto, anchoMarco, profundidad, window.materiales.PIEDRA, "marco", configMapeoUv)
        paredIzquierda.trasladar((-largo / 2)+(-anchoMarco/2), 0, 0)

        const paredSuperior = new Caja(app.alturaMuralla-alto + 0.25, largo+2*anchoMarco, profundidad, window.materiales.PIEDRA, "marco", configMapeoUvTecho)
        paredSuperior.trasladar(0, alto, 0)

        this.agregarHijo(paredDerecha)
        this.agregarHijo(paredIzquierda)
        this.agregarHijo(paredSuperior)

    }

}