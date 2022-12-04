import { Objeto3D } from "../objeto3d.js";
import { BezierCubica } from "../bezier/bezier3.js"
import { discretizar } from "../bezier/discretizador.js";
import { superficieRevolucion } from "../superficieRevolucion.js";

export class TorreMuralla extends Objeto3D {
    constructor(altura) {
        const configMapeoUv = {multiplicadorU:4, multiplicadorV:4}
        super(window.materiales.PIEDRA, configMapeoUv)
        this.id = "torre"
        this.filas = 20
        this.columnas = 18-1
        const puntosCurva = this.obtenerPuntosCurva(altura+0.85)
        const data = superficieRevolucion(puntosCurva, this.columnas, this.filas+1, 1)
        this.bufferPos = data[0]
        this.bufferNorm = data[1]
        this.bufferTang = data[2]
        this.bufferNormDibujadas = []
        this.bufferTangDibujadas = []
        this.calcularNormalesDibujadas()
        this.calcularTangentesDibujadas()

        this.mallaDeTriangulos = this.crearMalla()
    }

    obtenerPuntosCurva(altura) {
        //Puntos de control
        const radio = 3
        const h = 0.5
        
        const ptosCtrlLadoInf = [[-radio / 2, 0, 0], [-radio / 2, altura*0.3, 0], [(-radio / 2) + 0.4, altura*0.4, 0], [(-radio / 2) + 0.565, altura*0.6125, 0]]
        const ptosCtrlLadoSup =
            [[(-radio / 2) + 0.565, altura*0.6125, 0], [(-radio / 2) + 0.73, altura*0.825, 0], [(-radio / 2) + 1, altura*0.95, 0], [(-radio / 2) + 0.5, altura, 0]]
        const ptosCtrlBalconExt =
            [[(-radio / 2) + 0.5, altura, 0], [(-radio / 2) + 0.5, altura + h * 0.3, 0], [(-radio / 2) + 0.5, altura + h * 0.6, 0], [(-radio / 2) + 0.5, altura + h, 0]]
        const ptosCtrlBalconSup =
            [[(-radio / 2) + 0.5, altura + h, 0], [(-radio / 2) + 0.5 + 0.15 * 0.3, altura + h, 0], [(-radio / 2) + 0.5 + 0.15 * 0.6, altura + h, 0], [(-radio / 2) + 0.5 + 0.15, altura + h, 0]]
        const ptosCtrlBalconInt = [[(-radio / 2) + 0.5 + 0.2, altura + h, 0], [(-radio / 2) + 0.5 + 0.2, altura + h * 0.6, 0], [(-radio / 2) + 0.5 + 0.2, altura + h * 0.3, 0], [(-radio / 2) + 0.5 + 0.2, altura, 0]]
        const ptosCtrlBalconPiso = [[(-radio / 2) + 0.5 + 0.2, altura, 0], [(-radio / 2) + 0.5 * 0.6 + 0.2 * 0.6, altura, 0], [(-radio / 2) + 0.5 * 0.3 + 0.2 * 0.3, altura, 0], [0, altura, 0]]

        //Instanciamos las curvas
        const ladoInf = new BezierCubica(ptosCtrlLadoInf, "z")
        const ladoSup = new BezierCubica(ptosCtrlLadoSup, "z")
        const balconExt = new BezierCubica(ptosCtrlBalconExt, "z")
        const balconSup = new BezierCubica(ptosCtrlBalconSup, "z")
        const balconInt = new BezierCubica(ptosCtrlBalconInt, "z")
        const balconPiso = new BezierCubica(ptosCtrlBalconPiso, "z")

        //Obtenemos el poligono que forma la curva
        const puntosLadoInf = discretizar(ladoInf, 1 / 4, false, false)
        const puntosLadoSup = discretizar(ladoSup, 1 / 4, false, false)
        const puntosBalconExt = discretizar(balconExt, 1, false, false)
        const puntosBalconSup = discretizar(balconSup, 1, false, false)
        const puntosBalconInt = discretizar(balconInt, 1, false, false)
        const puntosBalconPiso = discretizar(balconPiso, 1, false, false)

        const pos = puntosLadoInf.posicion.concat(
            puntosLadoSup.posicion,
            puntosBalconExt.posicion,
            puntosBalconSup.posicion,
            puntosBalconInt.posicion,
            puntosBalconPiso.posicion
        )

        const norm = puntosLadoInf.normal.concat(
            puntosLadoSup.normal,
            puntosBalconExt.normal,
            puntosBalconSup.normal,
            puntosBalconInt.normal,
            puntosBalconPiso.normal
        )

        const tang = puntosLadoInf.tangente.concat(
            puntosLadoSup.tangente,
            puntosBalconExt.tangente,
            puntosBalconSup.tangente,
            puntosBalconInt.tangente,
            puntosBalconPiso.tangente
        )

        return {
            posicion: pos,
            normal: norm,
            tangente: tang
        }
    }
}