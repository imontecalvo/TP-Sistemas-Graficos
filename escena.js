import {CamaraInteractuableArrastre} from "./camara.js"
import {Esfera, Plano} from "./esfera.js"
import { EsferaDirigible } from "./esferaDirigible.js";
import { Camara } from "./camara2.js";
import { EjesEscena } from "./ejesEscena.js";
import { LineaCurva } from "./pruebaCurva.js";
import { Superficie } from "./superficie.js";

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
        this.ref = new Esfera(20,20,0.2,[1,0,0])
        this.ref.trasladar(0,0,5)
        this.curva = new LineaCurva([[-5,5,0], [-0.5,0,0],[0.5,0,0],[5,5,0]])
        
        this.recorrido = new LineaCurva([[0,2,3], [3,2,0],[0,2,-3],[-3,2,0]])
        this.sup = new Superficie(10,10)
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
        // this.centro.dibujar(this.matriz)
        // this.curva.dibujar()
        // this.recorrido.dibujar()
        this.ref.dibujar(this.matriz, "red")
        this.sup.dibujar(this.matriz)
    }
}