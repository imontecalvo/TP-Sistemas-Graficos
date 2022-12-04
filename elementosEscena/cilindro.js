import { Objeto3D } from "../objeto3d.js"
import { BezierCubica } from "../bezier/bezier3.js"
import { superficeBarrido } from "../superficieBarrido.js";

export class Cilindro extends Objeto3D {
    constructor(radio, ancho, columnas, material) {
        super(material)

        this.filas = 5
        this.columnas = columnas
        const puntosCurva = this.obtenerPuntosCurva(radio, columnas)
        const cantPuntosCurva = this.columnas + 1
        const recorrido = new BezierCubica([[0, 0, ancho / 2], [0, 0, ancho / 3], [0, 0, -ancho / 3], [0, 0, -ancho / 2]], "y")
        const data = superficeBarrido(puntosCurva, recorrido, this.columnas, 2)
        console.log("data cil: ",data)
        const caras = this.obtenerCaras(data, cantPuntosCurva, ancho, radio)

        this.bufferPos = caras.Frontal.posicion.concat(data[0], caras.Trasera.posicion)
        this.bufferNorm = caras.Frontal.normal.concat(data[1], caras.Trasera.normal)
        this.bufferTang = puntosCurva.tangente.concat(data[2], puntosCurva.tangente)
        this.bufferNormDibujadas = []
        this.bufferTangDibujadas = []
        this.calcularNormalesDibujadas()
        this.calcularTangentesDibujadas()

        this.mallaDeTriangulos = this.crearMalla()
    }

    obtenerCaras(data, cantPuntosCurva, ancho, radio) {
        const caraFrontalPos = data[0].slice(0, cantPuntosCurva * 3).map((x, i) => {
            if (i % 3 == 1) return 0
            else return x
        }).concat(data[0].slice(0, cantPuntosCurva * 3))

        let caraFrontalNorm = []
        for (let i = 0; i < cantPuntosCurva * 2; i++) {
            caraFrontalNorm.push(0)
            caraFrontalNorm.push(0)
            caraFrontalNorm.push(1)
        }

        const caraTraseraPos = data[0].slice(-cantPuntosCurva * 3).concat(caraFrontalPos.map((x, i) => {
            if (i % 3 == 2) return -ancho / 2;
            return x
        }))

        const caraTraseraNorm = caraFrontalNorm.map((x, i) => {
            if (i % 3 == 2) return -1;
            else return x
        })

        return {
            Frontal: { posicion: caraFrontalPos, normal: caraFrontalNorm },
            Trasera: { posicion: caraTraseraPos, normal: caraTraseraNorm }
        }
    }

    obtenerPuntosCurva(radio, columnas) {
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
            pos.push([x, y, 0])

            norm.push(normal)
            tang.push([normal[0]*Math.cos(Math.PI/2)-normal[1]*Math.sin(Math.PI/2), normal[0]*Math.sin(Math.PI/2)+normal[1]*Math.cos(Math.PI/2), normal[2]])

            i += 1 / columnas
        }
        // console.log("cilindro: ",pos)
        return {
            posicion: pos,
            normal: norm,
            tangente: tang
        }
    }

}