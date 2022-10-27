import { CamaraOrbital } from "./camara.js";
import { EjesEscena } from "./ejesEscena.js";
import { LineaCurva } from "./pruebaCurva.js";
import { Terreno } from "./elementosEscena/terreno.js"
import { Muralla } from "./elementosEscena/muralla.js"
import { Castillo } from "./elementosEscena/castillo.js";
import { Catapulta } from "./elementosEscena/catapulta.js";

var mat4 = glMatrix.mat4;

export class Escena {
    constructor() {
        this.ejes = new EjesEscena()
        this.matriz = mat4.create()
        this.camara = new CamaraOrbital([0,0,0])

        this.curva = new LineaCurva([[-5, 5, 0], [-0.5, 0, 0], [0.5, 0, 0], [5, 5, 0]])

        this.terreno = new Terreno()
        this.muralla = new Muralla(app.alturaMuralla,app.cantLados)
        this.castillo = new Castillo(5,5,3)
        
        this.catapulta = new Catapulta()

    }

    actualizar() {
        this.camara.actualizar()
    }

    obtenerVista() {
        let foco
        if (app.camara == "Orbital") foco = [0,0,0]
        else if (app.camara == "Orbital catapulta") foco = this.catapulta.obtenerPosicion()
        return this.camara.generarVista(foco)
    }

    dibujar() {
        this.ejes.dibujar()
        this.terreno.dibujar(this.matriz)
        this.curva.dibujar()
        this.muralla.dibujar(this.matriz)
        this.catapulta.actualizar()
        this.catapulta.dibujar(this.matriz)
        this.castillo.dibujar(this.matriz)
    }
}