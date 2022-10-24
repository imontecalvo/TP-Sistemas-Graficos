import { BezierCubica } from "./bezier/bezier3.js"
import { discretizar } from "./bezier/discretizador.js";
var mat4 = glMatrix.mat4;
var vec4 = glMatrix.vec4;

export function superficeBarrido(puntosCurva, recorrido, columnas, niveles) {

    
    // filas = niveles-1

    let puntosTransformados = []
    let normalesTransformadas = []
    const puntosRecorrido = discretizar(recorrido, 1 / (niveles-1), true)

    // Recorro c/u de los niveles del recorrido
    for (let i = 0; i < niveles; i++) {
        const matrizDeNivel = generarMatrizDeNivel(puntosRecorrido.posicion[i],
            puntosRecorrido.normal[i],
            puntosRecorrido.binormal,
            puntosRecorrido.tangente[i])
        
        const matrizDeNivelPos = matrizDeNivel[0]
        const matrizDeNivelNor = matrizDeNivel[1]
        // A cada punto de la curva para este nivel, le aplico la matriz de nivel
        mat4.transpose(matrizDeNivelPos, matrizDeNivelPos)
        mat4.transpose(matrizDeNivelNor, matrizDeNivelNor)
        for (let j = 0; j <= columnas; j++) {
            //Posiciones
            const posicionVec3 = puntosCurva.posicion[j]
            const posicionVec4 = vec4.fromValues(posicionVec3[0], posicionVec3[1], posicionVec3[2], 1)
            vec4.transformMat4(posicionVec4, posicionVec4, matrizDeNivelPos)
            puntosTransformados.push(posicionVec4[0])
            puntosTransformados.push(posicionVec4[1])
            puntosTransformados.push(posicionVec4[2])

            //Normales
            const normalVec3 = puntosCurva.normal[j]
            const normalVec4 = vec4.fromValues(normalVec3[0], normalVec3[1], normalVec3[2], 1)
            vec4.transformMat4(normalVec4, normalVec4, matrizDeNivelNor)
            normalesTransformadas.push(normalVec4[0])
            normalesTransformadas.push(normalVec4[1])
            normalesTransformadas.push(normalVec4[2])
        }
    }
    return [puntosTransformados, normalesTransformadas]
}

function generarMatrizDeNivel(pos, normal, binormal, tangente) {
    return [
        mat4.fromValues(
        normal[0], binormal[0], tangente[0], pos[0],
        normal[1], binormal[1], tangente[1], pos[1],
        normal[2], binormal[2], tangente[2], pos[2],
        0, 0, 0, 1),
        mat4.fromValues(
            normal[0], binormal[0], tangente[0], 0,
            normal[1], binormal[1], tangente[1], 0,
            normal[2], binormal[2], tangente[2], 0,
            0, 0, 0, 0)
    ]
}