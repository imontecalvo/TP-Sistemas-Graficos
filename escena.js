import { Camara } from "./camaras/camara.js";
import { EjesEscena } from "./elementosEscena/ejesEscena.js";
import { Terreno } from "./elementosEscena/terreno.js"
import { Muralla } from "./elementosEscena/muralla.js"
import { Castillo } from "./elementosEscena/castillo.js";
import { Catapulta } from "./elementosEscena/catapulta.js";
import { Caja } from "./elementosEscena/caja.js";
import { Esfera } from "./elementosEscena/esfera.js";
import { Agua } from "./elementosEscena/agua.js";
import { Cilindro } from "./elementosEscena/cilindro.js";

var mat4 = glMatrix.mat4;

export class Escena {
    constructor(camaras = null) {
        this.ejes = new EjesEscena()
        this.matriz = mat4.create()
        this.camara = camaras ? new Camara(camaras.orbital, camaras.orbitalCatapulta, camaras.primeraPersona) : new Camara()

        this.terreno = new Terreno()

        const configMapeoUv = [
            { multiplicadorU: 1, multiplicadorV: 3, signoU: 1, signoV: 1 },
            { multiplicadorU: 1, multiplicadorV: 3, signoU: 1, signoV: 1 },
            { multiplicadorU: 1, multiplicadorV: 3, signoU: 1, signoV: 1 },
            { multiplicadorU: 1, multiplicadorV: 3, signoU: 1, signoV: 1 },
            { multiplicadorU: 1, multiplicadorV: 3, signoU: 1, signoV: 1 },
            { multiplicadorU: 1, multiplicadorV: 3, signoU: 1, signoV: 1 }
        ]
        this.puente = new Caja(0.2, 2, 8, window.materiales.PASTO, "puente", configMapeoUv)
        this.puente.trasladar(0, -0.25, 10 + 7 / 2)

        this.agua = new Agua()
        this.agua.trasladar(0, -0.8, 0)

        this.muralla = new Muralla(app.alturaMuralla, app.cantLados)
        this.muralla.trasladar(0, 0.4, 0)

        this.castillo = new Castillo(app.ancho, app.largo, app.cantPisos)
        this.castillo.trasladar(0, 0.4, 0)

        this.catapulta = new Catapulta()

        this.cielo = new Esfera(60, window.materiales.CIELO, "cielo", true)
        this.cielo.rotarY(Math.PI / 3)
        this.cielo.rotarX(Math.PI / 2)
    }

    actualizar() {
        this.camara.actualizar()
        this.agua.rotarY(0.002)
    }

    obtenerVista() {
        const data = {
            origen: [0, 0, 0],
            posCatapulta: this.catapulta.obtenerPosicion()
        }

        return this.camara.generarVista(data)
    }

    obtenerPosCamara() {
        return this.camara.obtenerPosicion()
    }

    obtenerPosAntorchas() {
        return this.muralla.obtenerPosAntorchas()
    }

    obtenerPosMunicion() {
        return this.catapulta.obtenerPosMunicion()
        return [0, 0, 0]
    }

    obtenerCamaras() {
        return this.camara.obtenerCamaras()
    }

    dibujar() {
        if (app.mostrarEjes) this.ejes.dibujar()
        this.terreno.dibujar(this.matriz)
        this.puente.dibujar(this.matriz)
        this.agua.dibujar(this.matriz)

        this.muralla.actualizar()
        this.muralla.dibujar(this.matriz)

        this.catapulta.actualizar()
        this.catapulta.dibujar(this.matriz)

        this.castillo.dibujar(this.matriz)
        this.cielo.dibujar(this.matriz)
    }
}