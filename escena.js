import { Camara } from "./camara2.js";
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
        this.camara = new Camara()

        this.curva = new LineaCurva([[-5, 5, 0], [-0.5, 0, 0], [0.5, 0, 0], [5, 5, 0]])

        this.terreno = new Terreno()
        this.muralla = new Muralla(app.alturaMuralla,app.cantLados)
        this.castillo = new Castillo(5,5,3)
        
        this.catapulta = new Catapulta()
        this.catapulta.rotarY(Math.PI/8)
        this.catapulta.trasladar(0,0,22)
        this.catapulta.rotarY(Math.PI)
    }

    actualizar() {
        this.camara.actualizar()
    }

    obtenerVista() {
        return this.camara.generarVista([0, 0, 0])
    }

    dibujar() {
        this.ejes.dibujar()
        this.terreno.dibujar(this.matriz)
        // this.ventana.dibujar(this.matriz)
        this.muralla.dibujar(this.matriz)
        this.catapulta.dibujar(this.matriz)
        // this.cil.dibujar(this.matriz)
        this.castillo.dibujar(this.matriz)
        // this.caja.dibujar(this.matriz)
        // this.caja2.dibujar(this.matriz)
        // this.curva.dibujar()

    }
}