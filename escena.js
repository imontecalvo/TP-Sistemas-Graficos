import {CamaraInteractuableArrastre} from "./camara.js"
import {Plano} from "./esfera.js"

export class Escena {
    constructor(){
        this.plano = new Plano(1,1,10,10)
        this.camera = new CamaraInteractuableArrastre()
    }

    actualizar(){
        this.camera.actualizar()
    }

    obtenerVista(){
        return this.camera.generarVista(this.plano.posicion)
    }

    dibujar(){
        this.plano.dibujar()
    }
}