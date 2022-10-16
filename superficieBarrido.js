import { BezierCubica } from "./bezier/bezier3.js"
import { discretizar } from "./bezier/discretizador.js";
var mat4 = glMatrix.mat4;
var vec4 = glMatrix.vec4;

export function superficeBarrido(curva, recorrido, columnas, niveles) {
    //filas = niveles-1
    let m = mat4.fromValues(1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16)
    let v = vec4.fromValues(1, 1, 1, 1)
    mat4.transpose(m, m)
    vec4.transformMat4(v, v, m)
    // console.log("pruebaaa matriz: ", v)

    let puntosTransformados = []
    let normalesTransformadas = []
    const puntosCurva = discretizar(curva, "z", 1 / columnas, false)
    const puntosRecorrido = discretizar(recorrido, "y", 1 / (niveles-1), true)
    console.log("recorrido:", puntosRecorrido)


    for (let i = 0; i < niveles; i++) {
        const matrizDeNivel = generarMatrizDeNivel(puntosRecorrido.posicion[i],
            puntosRecorrido.normal[i],
            puntosRecorrido.binormal,
            puntosRecorrido.tangente[i])

        mat4.transpose(matrizDeNivel, matrizDeNivel)
        for (let j = 0; j <= columnas; j++) {
            const posicionVec3 = puntosCurva.posicion[j]
            const posicionVec4 = vec4.fromValues(posicionVec3[0], posicionVec3[1], posicionVec3[2], 1)
            vec4.transformMat4(posicionVec4, posicionVec4, matrizDeNivel)
            puntosTransformados.push(posicionVec4[0])
            puntosTransformados.push(posicionVec4[1])
            puntosTransformados.push(posicionVec4[2])
            console.log("x: ", posicionVec4[0], "y: ", posicionVec4[1], "z: ", posicionVec4[2])
            normalesTransformadas.push(0)
            normalesTransformadas.push(0)
            normalesTransformadas.push(1)
            // const normalTransformada = mat4.multiply(matrizDeNivel, normal)
        }
    }
    // console.log("puntoss: ", puntosTransformados)
    return [puntosTransformados, normalesTransformadas]
}

function generarMatrizDeNivel(pos, normal, binormal, tangente) {
    // console.log("pos: ", pos)
    // console.log("nor: ", normal)
    // console.log("binro: ", binormal)
    // console.log("tang: ", tangente)

    return mat4.fromValues(
        normal[0], binormal[0], tangente[0], pos[0],
        normal[1], binormal[1], tangente[1], pos[1],
        normal[2], binormal[2], tangente[2], pos[2],
        0, 0, 0, 1)
}




// discretizar curva -> cols
// discretizar recorrido -> filas

// matriz de nivel

// for (let i = 0; i <= niveles; i++) {
//     let matrizDeNivel;
//     let puntosDeControl = [[-5, 5, i], [-0.5, 0, i], [0.5, 0, i], [5, 5, i]]
//     let curva = new BezierCubica(puntosDeControl)
//     let puntosCurva = discretizar(curva, "z", 1 / columnas, false)

//     for punto in puntosCurva:
//         posiciones.push(matrizdeNivel * punto)
//     this.bufferPos = this.bufferPos.concat(...puntosCurva.posicion)
//     this.bufferNorm = this.bufferNorm.concat(...puntosCurva.normal)
// }