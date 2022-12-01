import { Objeto3D } from "../objeto3d.js";
import { Cilindro } from "./cilindro.js";
import { Esfera } from "./esfera.js";

export class Antorcha extends Objeto3D{
    constructor(){
        super()
        const fuego = new Esfera(0.13,window.materiales.FUEGO)
        fuego.trasladar(0,0.6/2,0)
        const mango = new Cilindro(0.07,0.6,5,window.materiales.MADERA_OSCURA)
        mango.rotarX(Math.PI/2)

        this.agregarHijo(fuego)
        this.agregarHijo(mango)
    }
} 