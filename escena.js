import {CamaraInteractuableArrastre} from "./camara.js"
import {Esfera, Plano} from "./esfera.js"
import { EsferaDirigible } from "./esferaDirigible.js";
import { Camara } from "./camara2.js";
import { EjesEscena } from "./ejesEscena.js";

var mat4 = glMatrix.mat4;

export class Escena {
    constructor(){
        this.ejes = new EjesEscena()
        this.matriz = mat4.create()
        this.camara = new Camara()
        // this.esferaDirigible = new EsferaDirigible(100, 100, 1)
        // this.esferaDirigible.trasladar(-5,0,0)
        this.plano = new Esfera(100,100,1)
        this.plano.trasladar(0,0,0)
        this.camera = new CamaraInteractuableArrastre()
        this.centro = new Esfera(20,20,0.2)

        // this.x1 = new Esfera(20,20,0.2)
        // this.x1.trasladar(0.5,0,0)
        // this.x2 = new Esfera(20,20,0.2)
        // this.x2.trasladar(1.,0,0)
        // this.x3 = new Esfera(20,20,0.2)
        // this.x3.trasladar(1.5,0,0)
        // this.x4 = new Esfera(20,20,0.2)
        // this.x4.trasladar(2.,0,0)
        // this.x5 = new Esfera(20,20,0.2)
        // this.x5.trasladar(2.5,0,0)

        // this.y1 = new Esfera(20,20,0.2)
        // this.y1.trasladar(0, 0.5,0)
        // this.y2 = new Esfera(20,20,0.2)
        // this.y2.trasladar(0, 1.,0)
        // this.y3 = new Esfera(20,20,0.2)
        // this.y3.trasladar(0, 1.5,0)
        // this.y4 = new Esfera(20,20,0.2)
        // this.y4.trasladar(0, 2.,0)
        // this.y5 = new Esfera(20,20,0.2)
        // this.y5.trasladar(0, 2.5,0)

        // this.z1 = new Esfera(20,20,0.2)
        // this.z1.trasladar(0, 0, 0.5)
        // this.z2 = new Esfera(20,20,0.2)
        // this.z2.trasladar(0, 0, 1.)
        // this.z3 = new Esfera(20,20,0.2)
        // this.z3.trasladar(0, 0, 1.5)
        // this.z4 = new Esfera(20,20,0.2)
        // this.z4.trasladar(0, 0, 2.)
        // this.z5 = new Esfera(20,20,0.2)
        // this.z5.trasladar(0, 0, 2.5)
    }

    actualizar(){
        this.camara.actualizar()
    }

    obtenerVista(){
        return this.camara.generarVista(this.centro.posicion)
    }

    dibujar(){
        this.ejes.dibujar()
        // this.plano.dibujar(this.matriz)
        // this.camara.actualizar()
        // this.esferaDirigible.actualizar()
        // this.esferaDirigible.dibujar(this.matriz)
        this.centro.dibujar(this.matriz)
    }
}