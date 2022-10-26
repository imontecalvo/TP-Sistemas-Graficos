import { Objeto3D } from "../objeto3d.js";
import { TorreCastillo } from "./torreCastillo.js";

export class Castillo extends Objeto3D{
    constructor(){
        super()
        const torre = new TorreCastillo(2)
        this.agregarHijo(torre)
    }
}