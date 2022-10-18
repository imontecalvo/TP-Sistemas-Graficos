import {CamaraInteractuableArrastre} from "./camara.js"
import {Esfera, Plano} from "./esfera.js"
import { EsferaDirigible } from "./esferaDirigible.js";
import { Camara } from "./camara2.js";
import { EjesEscena } from "./ejesEscena.js";
import { LineaCurva } from "./pruebaCurva.js";
import { Superficie } from "./superficie.js";
import { superficeBarrido } from "./superficieBarrido.js";
import { superficieRevolucion } from "./superficieRevolucion.js";
import { BezierCubica } from "./bezier/bezier3.js";
import {Terreno} from "./elementosEscena/terreno.js"
import {Muralla} from "./elementosEscena/muralla.js"

var mat4 = glMatrix.mat4;

export class Escena {
    constructor(){
        this.ejes = new EjesEscena()
        this.matriz = mat4.create()
        this.camara = new Camara()
        // this.esferaDirigible = new EsferaDirigible(100, 100, 1)
        // this.esferaDirigible.trasladar(-5,0,0)
        // this.plano = new Esfera(100,100,1)
        // this.plano.trasladar(0,0,0)
        // this.camera = new CamaraInteractuableArrastre()
        this.centro = new Esfera(20,20,0.2,[0,0,0])
        // this.esferita = new Esfera(50,50,2, [0,0,0])
        // this.ref = new Esfera(20,20,0.2,[1,0,0])
        // this.ref.trasladar(0,0,5)
        this.curva = new LineaCurva([[-5,5,0], [-0.5,0,0],[0.5,0,0],[5,5,0]])
        
        // this.recorrido = new LineaCurva([[0,2,3], [3,2,0],[0,2,-3],[-3,2,0]])
        // let curva = new BezierCubica([[-5, 5, 0], [-0.5, 0, 0], [0.5, 0, 0], [5, 5, 0]],"z")
        // let recorrido = new BezierCubica([[10, 0, 0,], [4, 0, -12], [-4, 0, -12], [-10, 0, 0]],"y")
        // const columnas = 10
        // const filas = 10
        // const data = superficeBarrido(curva, recorrido, columnas, filas + 1)
        // this.sup = new Superficie(columnas,filas,data[0],data[1])

        // let curvaRev = new BezierCubica([[0, 3, 0], [3, 1, 0], [3, -1, 0], [0, -3, 0]],"z")
        // let revData = superficeRevolucion(curvaRev, 10, 21)
        // this.supRev = new Superficie(20,10,revData[0],revData[1])
        // this.curva2 = new LineaCurva([[0, 3, 0], [3, 1, 0], [3, -1, 0], [0, -3, 0]])
        // this.plataforma = new Centro()
        // this.periferia = new Periferia()
        this.terreno = new Terreno()
        this.muralla = new Muralla()
        // this.terreno.trasladar(15,5,2)
    }

    actualizar(){
        this.camara.actualizar()
    }

    obtenerVista(){
        return this.camara.generarVista([0,0,0])
    }

    dibujar(){
        this.ejes.dibujar()
        // this.centro.dibujar(this.matriz)
        this.terreno.dibujar(this.matriz)
        this.muralla.dibujar(this.matriz)
        // this.plataforma.dibujar(this.matriz)
        // this.periferia.dibujar(this.matriz)
        // this.esferita.dibujar(this.matriz)
        // this.plano.dibujar(this.matriz)
        // this.camara.actualizar()
        // this.esferaDirigible.actualizar()
        // this.esferaDirigible.dibujar(this.matriz)
        // this.curva.dibujar()
        // this.recorrido.dibujar()
        // this.curva2.dibujar()
        // this.ref.dibujar(this.matriz, "red")
        // this.sup.dibujar(this.matriz)
        // this.supRev.dibujar(this.matriz)
    }
}