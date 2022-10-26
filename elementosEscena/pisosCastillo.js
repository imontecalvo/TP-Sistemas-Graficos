import { Objeto3D } from "../objeto3d.js";
import { Caja } from "./caja.js";


export class PisosCastillo extends Objeto3D{
    constructor(largo, ancho, cantPisos, alturaPiso){
        super()
        const pisos = new Caja(cantPisos*alturaPiso, largo, ancho)
        this.agregarHijo( pisos)

        const anchoBorde = 0.15
        for (let i = 1; i < cantPisos;i++){
            const borde = new Caja(anchoBorde, largo+anchoBorde, ancho+anchoBorde)
            borde.trasladar(0, i*alturaPiso-anchoBorde/2, 0)
            this.agregarHijo(borde)
        }
    }
}