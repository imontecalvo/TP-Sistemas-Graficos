import { BezierCubica } from "./bezier/bezier3.js"
import { discretizar } from "./bezier/discretizador.js"
import { superficeBarrido } from "./superficieBarrido.js";

//tramos = [ [[x1,y1,z1],[x2,y2,z2],[x3,y3,z3],[x4,y4,z4]] , [] , ... , []]
//Son vectores de vectores de vectores (vectores de tramos -> vectores de vectores de 4 puntos de control)
export const superficieBarridoConTapas = (tramos, ancho) => {

    const puntosCurva = obtenerPuntosCurva(tramos)
    const columnas = puntosCurva.posicion.length / 3
    const filas = 5

    const cantPuntosCurva = columnas + 1
    const recorrido = new BezierCubica([[0, 0, ancho / 2], [0, 0, ancho / 3], [0, 0, -ancho / 3], [0, 0, -ancho / 2]], "y")
    console.log("DAa4ta: ", puntosCurva)
    const data = superficeBarrido(puntosCurva, recorrido, columnas, 2)
    const caras = obtenerCaras(data, cantPuntosCurva, ancho)

    const bufferPos = caras.Frontal.posicion.concat(data[0], caras.Trasera.posicion)
    const bufferNorm = caras.Frontal.normal.concat(data[1], caras.Trasera.normal)

    return { posicion: bufferPos, normal: bufferNorm, columnas:columnas }
}

const obtenerCaras = (data, cantPuntosCurva, ancho) => {
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


const obtenerPuntosCurva = (tramos) => {

    let pos = []
    let norm = []

    for (let i = 0; i < tramos.length; i++) {
        const p1 = tramos[i]
        const p2 = tramos[i]
        const p3 = tramos[i]
        const p4 = tramos[i]

        let niveles
        if (((p1[0] == p2[0] && p1[0] == p3 && p1[0] == p4[0]) && (p1[1] == p2[1] && p1[1] == p3 && p1[1] == p4[1])) ||
            ((p1[0] == p2[0] && p1[0] == p3 && p1[0] == p4[0]) && (p1[2] == p2[2] && p1[2] == p3 && p1[2] == p4[2])) ||
            ((p1[2] == p2[2] && p1[2] == p3 && p1[2] == p4[2]) && (p1[1] == p2[1] && p1[1] == p3 && p1[1] == p4[1]))) {
            niveles = 2
        } else {
            niveles = 10
        }

        const curva = new BezierCubica(tramos[i], "z")
        const puntos = discretizar(curva, 1 / (niveles - 1), false)

        pos = pos.concat(puntos.posicion)
        norm = norm.concat(puntos.normal)
    }

    return {
        posicion: pos,
        normal: norm,
    }
}