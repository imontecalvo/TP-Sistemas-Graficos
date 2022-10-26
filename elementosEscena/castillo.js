import { Objeto3D } from "../objeto3d.js";
import { TorreCastillo } from "./torreCastillo.js";
import { PisosCastillo } from "./pisosCastillo.js";

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

        this.agregarHijo(torre1)
        this.agregarHijo(torre2)
        this.agregarHijo(torre3)
        this.agregarHijo(torre4)
    }
}


//Setear altura fija para piso
//Crear caja de ancho:ancho, largo:largo, altura:alturaPiso*cantPisos
//Divisiones
    // Cant: cantPisos-1
    // altura de c/division: i*alturaPiso, i>=1
    // anchoDiv: anchoPiso+x
    // largoDiv: largoPiso+x
    // altoDiv: x

// VENTANAS

// Ajustar altura variable de torres en funcion de la cantidad de pisos

//alturaVariable+alturaFija-(alturaFija/2) = alturaPiso*cantPisos
//alturaVariable = alturaPiso*cantPisos-(alturaFija/2)