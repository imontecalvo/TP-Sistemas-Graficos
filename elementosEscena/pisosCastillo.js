import { Objeto3D } from "../objeto3d.js";
import { Caja, CaraTrapecio } from "./caja.js";
import { superficeBarrido } from "../superficieBarrido.js";
import { BezierCubica } from "../bezier/bezier3.js"
import { discretizar } from "../bezier/discretizador.js"

export class PisosCastillo extends Objeto3D {
    constructor(ancho, largo, cantPisos, alturaPiso) {
        super()

        const configMapeoUv = [
            {multiplicadorU:3,multiplicadorV:3,signoU:1,signoV:1},
            {multiplicadorU:3,multiplicadorV:3,signoU:1,signoV:1},
            {multiplicadorU:3,multiplicadorV:3,signoU:1,signoV:1},
            {multiplicadorU:3,multiplicadorV:3,signoU:1,signoV:1},
            {multiplicadorU:3,multiplicadorV:3,signoU:1,signoV:1},
            {multiplicadorU:3,multiplicadorV:3,signoU:1,signoV:1}
        ]
        const pisos = new Caja(cantPisos * alturaPiso, largo, ancho, window.materiales.PINTURA_AMARILLA, null, configMapeoUv)
        this.agregarHijo(pisos)

        const anchoBorde = 0.15
        const configMapeoUvBorde = [
            {multiplicadorU:1,multiplicadorV:1/20,signoU:1,signoV:1},
            {multiplicadorU:1,multiplicadorV:1/20,signoU:1,signoV:1},
            {multiplicadorU:1,multiplicadorV:1/20,signoU:1,signoV:1},
            {multiplicadorU:1,multiplicadorV:1/20,signoU:1,signoV:1},
            {multiplicadorU:1,multiplicadorV:1,signoU:1,signoV:1},
            {multiplicadorU:1,multiplicadorV:1,signoU:1,signoV:1}
        ]
        for (let i = 1; i < cantPisos; i++) {
            const borde = new Caja(anchoBorde, largo + anchoBorde, ancho + anchoBorde, window.materiales.PINTURA_AMARILLA,null, configMapeoUvBorde)
            borde.trasladar(0, i * alturaPiso - anchoBorde / 2, 0)
            this.agregarHijo(borde)
        }

        this.agregarVentanas(cantPisos, alturaPiso, ancho, largo)
    }

    agregarVentanas(cantPisos, alturaPiso, ancho, largo) {
        const margen = 1
        const espaciado = 0.25
        const largoVentana = 0.5
        const altoVentana = 0.5
        const margenInferior = alturaPiso / 2
        const nVentanasLargo = Math.floor((largo - 2 * margen + espaciado) / (largoVentana + espaciado))
        const nVentanasAncho = Math.floor((ancho - 2 * margen + espaciado) / (largoVentana + espaciado))
        const espaciadoLargo = ((largo - 2 * margen) - (nVentanasLargo * largoVentana)) / (nVentanasLargo - 1)
        const espaciadoAncho = ((ancho - 2 * margen) - (nVentanasAncho * largoVentana)) / (nVentanasAncho - 1)

        for (let j = 0; j < cantPisos; j++) {
            const coordY = j * alturaPiso + margenInferior - altoVentana / 2
            for (let i = 0; i < nVentanasLargo; i++) {
                let ventana1 = new Ventana(altoVentana, largoVentana)
                ventana1.trasladar(i * (espaciadoLargo + largoVentana) + largoVentana / 2, 0, 0)
                ventana1.trasladar((-largo / 2) + margen, coordY, ancho / 2)

                let ventana2 = new Ventana(altoVentana, largoVentana)
                ventana2.trasladar(i * (espaciadoLargo + largoVentana) + largoVentana / 2, 0, 0)
                ventana2.trasladar((-largo / 2) + margen, coordY, -ancho / 2)

                this.agregarHijo(ventana1)
                this.agregarHijo(ventana2)
            }

            for (let k = 0; k < nVentanasAncho; k++) {
                let ventana3 = new Ventana(altoVentana, largoVentana)
                ventana3.trasladar(0, 0, k * (espaciadoAncho + largoVentana) + largoVentana / 2)
                ventana3.trasladar(-largo / 2, coordY, -(ancho - 2 * margen) / 2)
                ventana3.rotarY(Math.PI / 2)

                let ventana4 = new Ventana(altoVentana, largoVentana)
                ventana4.trasladar(0, 0, k * (espaciadoAncho + largoVentana) + largoVentana / 2,)
                ventana4.trasladar(largo / 2, coordY, -(ancho - 2 * margen) / 2)
                ventana4.rotarY(Math.PI / 2)

                this.agregarHijo(ventana3)
                this.agregarHijo(ventana4)
            }
        }
    }
}

export class Ventana extends Objeto3D {
    constructor(altura, largo) {
        super(window.materiales.VIDRIO)
        this.filas = 5
        this.columnas = 16 - 1
        const ancho = 0.15
        const puntosCurva = this.obtenerPuntosCurva(altura, largo)
        const cantPuntosCurva = this.columnas + 1
        const recorrido = new BezierCubica([[0, 0, ancho / 2], [0, 0, ancho / 3], [0, 0, -ancho / 3], [0, 0, -ancho / 2]], "y")
        const data = superficeBarrido(puntosCurva, recorrido, this.columnas, 2)

        const caras = this.obtenerCaras(data, cantPuntosCurva, ancho)

        this.bufferPos = caras.Frontal.posicion.concat(data[0], caras.Trasera.posicion)
        this.bufferNorm = caras.Frontal.normal.concat(data[1], caras.Trasera.normal)
        this.bufferNormDibujadas = []
        this.calcularNormalesDibujadas()

        this.mallaDeTriangulos = this.crearMalla()
    }

    obtenerCaras(data, cantPuntosCurva, ancho) {
        const caraFrontalPos = data[0].slice(0, cantPuntosCurva * 3).map((x, i) => {
            if (i % 3 == 1) return 0;
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
            else return x
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

    obtenerPuntosCurva(altura, largo) {
        const t1 = [[0, 0, 0], [0, altura * 0.3, 0], [0, altura * 0.6, 0], [0, altura, 0]]
        const t2 = [[0, altura, 0], [largo * 2 / 15, altura + 0.3, 0], [largo * 13 / 15, altura + 0.3, 0], [largo, altura, 0]]
        const t3 = [[largo, altura, 0], [largo, altura * 0.6, 0], [largo, altura * 0.3, 0], [largo, 0, 0]]
        const t4 = [[largo, 0, 0], [largo * 0.6, 0, 0], [largo * 0.3, 0, 0], [0, 0, 0]]

        const ladoIzq = new BezierCubica(t1, "z")
        const ladoArriba = new BezierCubica(t2, "z")
        const ladoDer = new BezierCubica(t3, "z")
        const ladoAbajo = new BezierCubica(t4, "z")

        //Obtenemos el poligono que forma la curva
        const puntosLadoIzq = discretizar(ladoIzq, 1, false, false)
        const puntosLadoArriba = discretizar(ladoArriba, 1 / 9, false, false)
        const puntosLadoDer = discretizar(ladoDer, 1, false, false)
        const puntosLadoAbajo = discretizar(ladoAbajo, 1, false, false)


        const pos = puntosLadoIzq.posicion.map(x => ([x[0] - largo / 2, x[1], x[2]])).concat(
            puntosLadoArriba.posicion.map(x => ([x[0] - largo / 2, x[1], x[2]])),
            puntosLadoDer.posicion.map(x => ([x[0] - largo / 2, x[1], x[2]])),
            puntosLadoAbajo.posicion.map(x => ([x[0] - largo / 2, x[1], x[2]]))
        )

        const norm = puntosLadoIzq.normal.concat(
            puntosLadoArriba.normal,
            puntosLadoDer.normal,
            puntosLadoAbajo.normal
        )

        const tang = puntosLadoIzq.tangente.concat(
            puntosLadoArriba.tangente,
            puntosLadoDer.tangente,
            puntosLadoAbajo.tangente
        )


        return {
            posicion: pos,
            normal: norm,
            tangente:tang
        }
    }
}

export class TechoCastillo extends Objeto3D {
    constructor(ancho, largo) {
        super()
        const alto = 2
        // const cuerpo = new CuerpoTecho(ancho, largo, window.materiales.TEJAS_AZULES, alto)
        // this.agregarHijo(cuerpo)

        // const caraFrente = new CaraTechoPrincipal(ancho, largo, window.materiales.TEJAS_AZULES, alto, "frente")
        // const caraAtras = new CaraTechoPrincipal(ancho, largo, window.materiales.TEJAS_AZULES, alto, "atras")
        // const caraDer = new CaraTechoLateral(ancho, largo, window.materiales.TEJAS_AZULES, alto, "derecha")
        // const caraIzq = new CaraTechoLateral(ancho, largo, window.materiales.TEJAS_AZULES, alto, "izquierda")

        // this.agregarHijo(caraFrente)
        // this.agregarHijo(caraAtras)
        // this.agregarHijo(caraDer)
        // this.agregarHijo(caraIzq)

        const caraFrente = new CaraTrapecio([-largo / 2, 0, ancho / 2], [-largo / 4, alto, 0], [largo / 2, 0, ancho / 2], [largo / 4, alto, 0], window.materiales.TEJAS_AZULES)
        const caraAtras = new CaraTrapecio([largo / 2, 0, -ancho / 2], [largo / 4, alto, 0], [-largo / 2, 0, -ancho / 2], [-largo / 4, alto, 0], window.materiales.TEJAS_AZULES)
        const caraDer = new CaraTrapecio([largo / 2, 0, ancho / 2], [largo / 4, alto, 0],[largo / 2, 0, -ancho / 2], [largo / 4, alto, 0], window.materiales.TEJAS_AZULES)
        const caraIzq = new CaraTrapecio([-largo / 2, 0, -ancho / 2], [-largo / 4, alto, 0], [-largo / 2, 0, ancho / 2], [-largo / 4, alto, 0], window.materiales.TEJAS_AZULES)

        this.agregarHijo(caraFrente)
        this.agregarHijo(caraAtras)
        this.agregarHijo(caraDer)
        this.agregarHijo(caraIzq)
    }
}

class CuerpoTecho extends Objeto3D {
    constructor(ancho, largo, material, alto) {
        super(material)
        this.filas = 3
        this.columnas = 1
        this.id = "techo"

        const posiciones = [[-largo / 2, 0, ancho / 2], [largo / 2, 0, ancho / 2],
        [-largo / 4, alto, 0], [largo / 4, alto, 0],
        [-largo / 4, alto, 0], [largo / 4, alto, 0],
        [-largo / 2, 0, -ancho / 2], [largo / 2, 0, -ancho / 2]]

        let normFrente = productoVectorial([1, 0, 0], [0, alto, -ancho / 2])
        normFrente = normalizar(normFrente)
        let normAtras = productoVectorial([-1, 0, 0], [0, alto, ancho / 2])
        normAtras = normalizar(normAtras)

        const normales = [normFrente, normFrente, normFrente, normFrente, normAtras, normAtras, normAtras, normAtras]
        this.bufferPos = [].concat(...posiciones.map((pos) => pos))
        this.bufferNorm = [].concat(...normales.map((norm) => norm))
        this.bufferNormDibujadas = []
        this.calcularNormalesDibujadas()

        this.mallaDeTriangulos = this.crearMalla()
    }
}

class CaraTechoLateral extends Objeto3D {
    constructor(ancho, largo, material, alto, tipo) {
        super(material)
        this.filas = 1
        this.columnas = 1
        this.id = "techo"

        const coordX = tipo === "derecha" ? largo : -largo

        const posiciones = [[coordX / 2, 0, ancho / 2], [coordX / 2, 0, -ancho / 2],
        [coordX / 4, alto, 0], [coordX / 4, alto, 0]]

        let normal = tipo == "derecha" ? productoVectorial([0, 0, -1], [-largo / 4, alto, 0])
            : productoVectorial([0, 0, 1], [largo / 4, alto, 0])
        normal = normalizar(normal)

        const normales = [normal, normal, normal, normal]
        this.bufferPos = [].concat(...posiciones.map((pos) => pos))
        this.bufferNorm = [].concat(...normales.map((norm) => norm))
        this.bufferNormDibujadas = []
        this.calcularNormalesDibujadas()

        this.mallaDeTriangulos = this.crearMalla()
    }
}

class CaraTechoPrincipal extends Objeto3D {
    constructor(ancho, largo, material, alto, tipo) {
        super(material)
        this.filas = 1
        this.columnas = 1
        this.id = "techo"

        const coordZ = tipo === "frente" ? ancho : -ancho

        const posiciones = [[-largo / 2, 0, coordZ / 2], [largo / 2, 0, coordZ / 2],
        [-largo / 4, alto, 0], [largo / 4, alto, 0]]

        let normal = tipo == "frente" ? productoVectorial([1, 0, 0], [0, alto, -ancho / 2])
            : productoVectorial([-1, 0, 0], [0, alto, ancho / 2])
        normal = normalizar(normal)

        const normales = [normal, normal, normal, normal]
        this.bufferPos = [].concat(...posiciones.map((pos) => pos))
        this.bufferNorm = [].concat(...normales.map((norm) => norm))
        this.bufferNormDibujadas = []
        this.calcularNormalesDibujadas()

        this.mallaDeTriangulos = this.crearMalla()
    }
}

function productoVectorial(vec1, vec2) {
    const x = vec1[1] * vec2[2] - vec1[2] * vec2[1]
    const y = - (vec1[0] * vec2[2] - vec1[2] * vec2[0])
    const z = vec1[0] * vec2[1] - vec1[1] * vec2[0]

    return [x, y, z]
}

function normalizar(normal) {
    const norma = Math.sqrt(normal[0] * normal[0] + normal[1] * normal[1] + normal[2] * normal[2])
    return [normal[0] / norma, normal[1] / norma, normal[2] / norma]
}