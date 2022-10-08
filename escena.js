import {CamaraInteractuableArrastre} from "./camara.js"
import {Esfera, Plano} from "./esfera.js"
import { EsferaDirigible } from "./esferaDirigible.js";

var mat4 = glMatrix.mat4;

export class Escena {
    constructor(){
        this.matriz = mat4.create()
        this.esferaDirigible = new EsferaDirigible(100, 100, 1)
        // this.esferaDirigible.trasladar(-5,0,0)
        this.plano = new Esfera(100,100,1)
        this.plano.trasladar(0,0,0)
        this.camera = new CamaraInteractuableArrastre()
        this.centro = new Esfera(20,20,0.2)

        this.x1 = new Esfera(20,20,0.2)
        this.x1.trasladar(0.5,0,0)
        this.x2 = new Esfera(20,20,0.2)
        this.x2.trasladar(1.,0,0)
        this.x3 = new Esfera(20,20,0.2)
        this.x3.trasladar(1.5,0,0)
        this.x4 = new Esfera(20,20,0.2)
        this.x4.trasladar(2.,0,0)
        this.x5 = new Esfera(20,20,0.2)
        this.x5.trasladar(2.5,0,0)

        this.y1 = new Esfera(20,20,0.2)
        this.y1.trasladar(0, 0.5,0)
        this.y2 = new Esfera(20,20,0.2)
        this.y2.trasladar(0, 1.,0)
        this.y3 = new Esfera(20,20,0.2)
        this.y3.trasladar(0, 1.5,0)
        this.y4 = new Esfera(20,20,0.2)
        this.y4.trasladar(0, 2.,0)
        this.y5 = new Esfera(20,20,0.2)
        this.y5.trasladar(0, 2.5,0)

        this.z1 = new Esfera(20,20,0.2)
        this.z1.trasladar(0, 0, 0.5)
        this.z2 = new Esfera(20,20,0.2)
        this.z2.trasladar(0, 0, 1.)
        this.z3 = new Esfera(20,20,0.2)
        this.z3.trasladar(0, 0, 1.5)
        this.z4 = new Esfera(20,20,0.2)
        this.z4.trasladar(0, 0, 2.)
        this.z5 = new Esfera(20,20,0.2)
        this.z5.trasladar(0, 0, 2.5)
    }

    actualizar(){
        this.camera.actualizar()
    }

    obtenerVista(){
        return this.camera.generarVista(this.plano.posicion)
    }

    dibujar(){
        // this.plano.dibujar(this.matriz)
        this.esferaDirigible.actualizar()
        this.esferaDirigible.dibujar(this.matriz)
        this.centro.dibujar(this.matriz)

        this.x1.dibujar(this.matriz)
        this.x2.dibujar(this.matriz)
        this.x3.dibujar(this.matriz)
        this.x4.dibujar(this.matriz)
        this.x5.dibujar(this.matriz)

        this.y1.dibujar(this.matriz)
        this.y2.dibujar(this.matriz)
        this.y3.dibujar(this.matriz)
        this.y4.dibujar(this.matriz)
        this.y5.dibujar(this.matriz)

        this.z1.dibujar(this.matriz)
        this.z2.dibujar(this.matriz)
        this.z3.dibujar(this.matriz)
        this.z4.dibujar(this.matriz)
        this.z5.dibujar(this.matriz)
    }
}