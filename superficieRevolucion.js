import { BezierCubica } from "./bezier/bezier3.js"
import { productoVectorial, discretizar } from "./bezier/discretizador.js";
var mat4 = glMatrix.mat4;
var vec4 = glMatrix.vec4;

export function superficeRevolucion(curva, columnas, niveles) {
    //filas = niveles-1
    // let m = mat4.fromValues(1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16)
    // let v = vec4.fromValues(1, 1, 1, 1)
    // mat4.transpose(m, m)
    // vec4.transformMat4(v, v, m)
    // console.log("pruebaaa matriz: ", v)

    let puntosTransformados = []
    let normalesTransformadas = []
    const puntosCurva = discretizar(curva, "z", 1 / columnas, false)
    const puntosRecorrido = getRecorrido(niveles)
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
            // console.log("NORMALES- x: ", normalVec4[0], " y: ", normalVec4[1], " z: ", normalVec4[2])
        }
    }
    console.log("puntoss: ", puntosTransformados)
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

function getRecorrido(niveles){
    const posiciones = []
    const normales = []
    const tangentes = []
    const binormales = []

    for (let i = 0; i<=1; i+=1/(niveles-1)){
        console.log(i)
        posiciones.push([0, 0, 0])
        binormales.push([0,1,0])
        tangentes.push([Math.cos(i*2*Math.PI), 0, Math.sin(i*2*Math.PI)])
        normales.push(productoVectorial([0,1,0], [Math.cos(i*2*Math.PI), 0, Math.sin(i*2*Math.PI)]))
    }
    return {posicion:posiciones, tangente: tangentes, normal:normales, binormal:[0,1,0]}
}

