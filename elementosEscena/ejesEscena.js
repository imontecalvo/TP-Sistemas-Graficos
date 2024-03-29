import { Cilindro } from "./cilindro.js"

var mat4 = glMatrix.mat4

export class EjesEscena {
    constructor() {
        this.ejeX = new Cilindro(0.05,15,10,window.materiales.ROJO)
        this.ejeX.trasladar(15/2,0,0)
        this.ejeX.rotarY(Math.PI/2)
        
        this.ejeY = new Cilindro(0.05,15,10,window.materiales.VERDE)
        this.ejeY.trasladar(0,15/2,0)
        this.ejeY.rotarX(Math.PI/2)
        // 
        this.ejeZ = new Cilindro(0.05,15,10,window.materiales.AZUL)
        this.ejeZ.trasladar(0,0,15/2)
    }
    
    dibujar() {
        this.ejeX.dibujar(mat4.create(), true)
        this.ejeY.dibujar(mat4.create(), true)
        this.ejeZ.dibujar(mat4.create(), true)
    }
}