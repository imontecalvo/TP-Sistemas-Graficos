export function discretizar(curva, ejeBinormal, deltaU, esRecorrido = false) {
    const puntos = []
    const tangentes = []
    const normales = []
    let binormal = []

    if (ejeBinormal == "x") binormal = [1, 0, 0]
    else if (ejeBinormal == "y") binormal = [0, 1, 0]
    else if (ejeBinormal == "z") binormal = [0, 0, 1]

    for (let u = 0; u <= 1; u += deltaU) {
        const punto = curva.obtenerPunto(u)
        const tangente = curva.obtenerTangente(u)

        puntos.push(punto)
        tangentes.push(tangente)
        normales.push(productoVectorial(binormal, tangente))
    }
    if (esRecorrido) {
        return {posicion:puntos, tangente:tangentes, normal:normales, binormal:binormal}
    } else {
        return {posicion:puntos, normal:normales}
    }
}


export function productoVectorial(vec1, vec2) {
    const x = vec1[1] * vec2[2] - vec1[2] * vec2[1]
    const y = - (vec1[0] * vec2[2] - vec1[2] * vec2[0])
    const z = vec1[0] * vec2[1] - vec1[1] * vec2[0]

    return [x, y, z]
}