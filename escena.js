import { Camara } from "./camaras/camara.js";
import { EjesEscena } from "./ejesEscena.js";
import { LineaCurva } from "./pruebaCurva.js";
import { Terreno } from "./elementosEscena/terreno.js"
import { Muralla } from "./elementosEscena/muralla.js"
import { Castillo } from "./elementosEscena/castillo.js";
import { Catapulta } from "./elementosEscena/catapulta.js";
import { Caja } from "./elementosEscena/caja.js";

var mat4 = glMatrix.mat4;

export class Escena {
    constructor() {
        this.ejes = new EjesEscena()
        this.matriz = mat4.create()
        this.camara = new Camara()

        this.curva = new LineaCurva([[-5, 5, 0], [-0.5, 0, 0], [0.5, 0, 0], [5, 5, 0]])

        this.terreno = new Terreno()

        this.puente = new Caja(0.2,2,8)
        this.puente.trasladar(0,-0.2,10+7/2)

        this.agua = new Caja(0.2,50,50)
        this.agua.trasladar(0,-0.8,0)

        this.muralla = new Muralla(app.alturaMuralla,app.cantLados)
        this.muralla.trasladar(0,0.4,0)

        this.castillo = new Castillo(app.ancho,app.largo,app.cantPisos)
        this.castillo.trasladar(0,0.4,0)
        
        this.catapulta = new Catapulta()

    }

    actualizar() {
        this.camara.actualizar()
    }

    obtenerVista() {
        const data = {
            origen:[0,0,0],
            posCatapulta:this.catapulta.obtenerPosicion()
        }

        return this.camara.generarVista(data)
    }

    dibujar() {
        // this.ejes.dibujar()
        this.terreno.dibujar(this.matriz)
        this.puente.dibujar(this.matriz)
        this.agua.dibujar(this.matriz)

        this.muralla.actualizar()
        this.muralla.dibujar(this.matriz)

        this.catapulta.actualizar()
        this.catapulta.dibujar(this.matriz)

        this.castillo.dibujar(this.matriz)
    }
}