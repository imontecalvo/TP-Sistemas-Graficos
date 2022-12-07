import { Objeto3D } from "../objeto3d.js"
import { BezierCubica } from "../bezier/bezier3.js"
import { superficieRevolucion } from "../superficieRevolucion.js";
import { discretizar } from "../bezier/discretizador.js";

export class Cilindro extends Objeto3D {
    constructor(radio, ancho, columnas, material) {
        super(material)

        this.filas = 1
        this.columnas = columnas
        const puntosCurva = this.obtenerPuntosCurva(radio, columnas, ancho)
        const puntosCurvaExtremo = puntosCurva.posicion.map((pos) => [pos[0], pos[1],-ancho/2])

        const caraFrontal = new CaraCilindro(radio, columnas,material)
        caraFrontal.trasladar(0,0,ancho/2)
        caraFrontal.rotarX(Math.PI/2)
        this.agregarHijo(caraFrontal)

        const caraTrasera = new CaraCilindro(radio, columnas,material)
        caraTrasera.trasladar(0,0,-ancho/2)
        caraTrasera.rotarX(-Math.PI/2)
        this.agregarHijo(caraTrasera)

        this.bufferPos = puntosCurva.posicion.flat().concat(puntosCurvaExtremo.flat())
        this.bufferNorm = puntosCurva.normal.flat().concat(puntosCurva.normal.flat())
        this.bufferTang = puntosCurva.tangente.flat().concat(puntosCurva.tangente.flat())

        this.bufferNormDibujadas = []
        this.bufferTangDibujadas = []
        this.calcularNormalesDibujadas()
        this.calcularTangentesDibujadas()

        this.mallaDeTriangulos = this.crearMalla()
    }

    obtenerPuntosCurva(radio, columnas, ancho) {
        let pos = []
        let norm = []
        let tang = []

        let i = 0
        while (i - 1 <= 10 ** (-15)) {
            const x = radio * Math.cos(2 * Math.PI * i)
            const y = radio * Math.sin(2 * Math.PI * i)

            const dX = radio * 2 * Math.PI * (-Math.sin(2 * Math.PI * i))
            const dY = radio * 2 * Math.PI * (Math.cos(2 * Math.PI * i))
            const modulo = Math.sqrt(dX ** 2 + dY ** 2)

            const normal = [dY / modulo, -dX / modulo, 0]
            pos.push([x, y, ancho/2])

            norm.push(normal)
            tang.push([normal[0]*Math.cos(Math.PI/2)-normal[1]*Math.sin(Math.PI/2), normal[0]*Math.sin(Math.PI/2)+normal[1]*Math.cos(Math.PI/2), normal[2]])

            i += 1 / columnas
        }

        return {
            posicion: pos,
            normal: norm,
            tangente: tang
        }
    }

}

class CaraCilindro extends Objeto3D{
    constructor(radio, filas, material){
        const configMapeoUv = { multiplicadorU: 5, multiplicadorV:1.5, signoU: -1 }
        super(material, configMapeoUv)
        this.filas = filas
        this.columnas = 1

        const curvaCircunferencia = new BezierCubica([[radio, 0, 0], [radio*0.6, 0, 0], [radio*0.3, 0, 0], [0, 0, 0]], "z")
        const puntosCircunferencia = discretizar(curvaCircunferencia, 1, false, true)

        const data = superficieRevolucion(puntosCircunferencia, this.columnas, this.filas + 1)

        this.bufferPos = data[0]
        this.bufferNorm = data[1]
        this.bufferTang = data[2]

        this.bufferNormDibujadas = []
        this.bufferTangDibujadas = []

        this.calcularNormalesDibujadas()
        this.calcularTangentesDibujadas()
        this.mallaDeTriangulos = this.crearMalla()
    }
}