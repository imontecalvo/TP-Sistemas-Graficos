import { Objeto3D } from "../objeto3d.js";
import { TorreCastillo } from "./torreCastillo.js";
import { PisosCastillo, TechoCastillo } from "./pisosCastillo.js";
import { BezierCubica } from "../bezier/bezier3.js";

export class Castillo extends Objeto3D{
    constructor(ancho, largo, cantPisos){
        super()
        this.alturaPiso = 2
        //Torres
        const torre1 = new TorreCastillo(this.alturaPiso*cantPisos)
        torre1.trasladar(-largo/2, 0, -ancho/2)

        const torre2 = new TorreCastillo(this.alturaPiso*cantPisos)
        torre2.trasladar(-largo/2, 0, ancho/2)

        const torre3 = new TorreCastillo(this.alturaPiso*cantPisos)
        torre3.trasladar(largo/2, 0, -ancho/2)

        const torre4 = new TorreCastillo(this.alturaPiso*cantPisos)
        torre4.trasladar(largo/2, 0, ancho/2)


        const pisos = new PisosCastillo(ancho,largo,cantPisos, this.alturaPiso)
        this.agregarHijo(pisos)

        const techo = new TechoCastillo(ancho,largo)
        techo.trasladar(0, this.alturaPiso * cantPisos, 0)
        this.agregarHijo(techo)

        this.agregarHijo(torre1)
        this.agregarHijo(torre2)
        this.agregarHijo(torre3)
        this.agregarHijo(torre4)
    }
}