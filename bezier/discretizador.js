export function discretizar(curva, deltaU, esRecorrido = false, invertirNormales = false) {
    const puntos = []
    const tangentes = []
    const normales = []
    const binormales = []

    let binormal;
    if (curva.ejeBinormal == "x") binormal = [1, 0, 0]
    else if (curva.ejeBinormal == "y") binormal = [0, 1, 0]
    else if (curva.ejeBinormal == "z") binormal = [0, 0, 1]

    let u = 0
    while ( u-1 <= 10**(-15)){
        const punto = curva.obtenerPunto(u)
        const tangente = curva.obtenerTangente(u)

        puntos.push(punto)
        binormales.push(binormal)
        tangentes.push(tangente)
        if(invertirNormales) normales.push(productoVectorial(tangente, binormal))
        else normales.push(productoVectorial(binormal, tangente))

        u+=deltaU
    }

    return {posicion:puntos, tangente:tangentes, normal:normales, binormal:binormales}
    // if (esRecorrido) {
        // return {posicion:puntos, tangente:tangentes, normal:normales, binormal:binormal}
    // } else {
        // return {posicion:puntos, normal:normales}
    // }
}


export function productoVectorial(vec1, vec2) {
    const x = vec1[1] * vec2[2] - vec1[2] * vec2[1]
    const y = - (vec1[0] * vec2[2] - vec1[2] * vec2[0])
    const z = vec1[0] * vec2[1] - vec1[1] * vec2[0]

    return [x, y, z]
}