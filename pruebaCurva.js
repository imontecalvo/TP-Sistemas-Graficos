import { BezierCubica } from "./bezier/bezier3.js";
import { discretizar } from "./bezier/discretizador.js";
import { gl, glProgramCurva } from "./web-gl.js";

var mat4 = glMatrix.mat4;

export class LineaCurva {
    constructor(puntosDeControl) {

        //muro
        // const h = 0.5
        // const a = 0.25
        // const ancho = 2
        // const radio = 6
        // const pControlLadoI = [[radio, 0, 0], [radio + 0.10, 1.60, 0], [radio + .40, 2.33, 0], [radio + .5, 4, 0]]
        // const pControlBalconILadoI = [[radio + .5, 4, 0], [radio + .5, 4 + h * 0.3, 0], [radio + .5, 4 + h * 0.6, 0], [radio + .5, 4 + h, 0]]
        // const pControlBalconITecho = [[radio + .5, 4 + h, 0], [radio + .5 + a * 0.3, 4 + h, 0], [radio + .5 + a * 0.6, 4 + h, 0], [radio + .5 + a, 4 + h, 0]]
        // const pControlBalconILadoD = [[radio + .5 + a, 4 + h, 0], [radio + .5 + a, 4 + h * 0.6, 0], [radio + .5 + a, 4 + h * 0.3, 0], [radio + .5 + a, 4, 0]]
        // const pControlBalconPiso = [[radio + .5 + a, 4, 0], [radio + .5 + 1.3 * a, 4, 0], [radio + .5 + 1.6 * a, 4, 0], [radio + .5 + 2 * a, 4, 0]]

        // const ladoI = new BezierCubica(pControlLadoI, "z")
        // const balconILadoI = new BezierCubica(pControlBalconILadoI, "z")
        // const balconITecho = new BezierCubica(pControlBalconITecho, "z")
        // const balconILadoD = new BezierCubica(pControlBalconILadoD, "z")
        // const balconPiso = new BezierCubica(pControlBalconPiso, "z")

        // const ladoD = new BezierCubica(pControlLadoI.map(p => [2 * radio + ancho - p[0], p[1], p[2]]), "z")
        // const balconDLadoD = new BezierCubica(pControlBalconILadoI.map(p => [1 + p[0], p[1], p[2]]), "z")
        // const balconDTecho = new BezierCubica(pControlBalconITecho.map(p => [0.75 + p[0], p[1], p[2]]), "z")
        // const balconDLadoI = new BezierCubica(pControlBalconILadoD.map(p => [0.5 + p[0], p[1], p[2]]), "z")
        // const balconPisoD = new BezierCubica(pControlBalconPiso.map(p => [0.25 + p[0], p[1], p[2]]), "z")

        // const puntosLadoI = discretizar(ladoI, 1 / 9, false)
        // const puntosBalconILadoI = discretizar(balconILadoI, 1, false)
        // const puntosBalconITecho = discretizar(balconITecho, 1, false)
        // const puntosBalconILadoD = discretizar(balconILadoD, 1, false)
        // const puntosBalconPiso = discretizar(balconPiso, 1, false)

        // const puntosBalconPisoD = discretizar(balconPisoD, 1, false)
        // const puntosBalconDLadoI = discretizar(balconDLadoI, 1, false)
        // const puntosBalconDTecho = discretizar(balconDTecho, 1, false)
        // const puntosBalconDLadoD = discretizar(balconDLadoD, 1, false)
        // const puntosLadoD = discretizar(ladoD, 1 / 9, false)

        // const puntosCurvaMuralla = puntosLadoI.posicion.concat(
        //     puntosBalconILadoI.posicion,
        //     puntosBalconITecho.posicion,
        //     puntosBalconILadoD.posicion,
        //     puntosBalconPiso.posicion,
        //     puntosBalconPisoD.posicion,
        //     puntosBalconDLadoI.posicion,
        //     puntosBalconDTecho.posicion,
        //     puntosBalconDLadoD.posicion,
        //     puntosLadoD.posicion.reverse()
        // )

        // var mat4 = glMatrix.mat4;
        // var vec4 = glMatrix.vec4;

        // const anchoPorton = 2
        // let posInicio = []
        // let normInicio = []
        // let posFin = []
        // let normFin = []

        // const matInicioMuralla = mat4.create()
        // const matFinMuralla = mat4.create()

        // const mat = mat4.create()
        // // mat4.translate(mat,mat, [-1,0,0])
        // mat4.rotateY(mat, mat, Math.PI / 2)
        // mat4.translate(mat, mat, [-radio-1, 0, 0])
        // mat4.translate(matInicioMuralla, matInicioMuralla, [-1,0,0])
        // mat4.multiply(matInicioMuralla, matInicioMuralla, mat)
        
        // mat4.translate(matInicioMuralla, matInicioMuralla, [-anchoPorton, 0, 0])
        // mat4.translate(matInicioMuralla, matInicioMuralla, [0, 0, -anchoPorton])
        
        // mat4.scale(matInicioMuralla, matInicioMuralla, [2,4,2])
        // mat4.rotate(matInicioMuralla, matFinMuralla, 3.14/2, [0,1,0])
        // mat4.transpose(matInicioMuralla, matInicioMuralla)
        // mat4.transpose(matFinMuralla, matFinMuralla)

        // for (let i = 0; i < puntosCurvaMuralla.length; i++) {
        //     const posActualInicio = vec4.fromValues(puntosCurvaMuralla[i][0],puntosCurvaMuralla[i][1],puntosCurvaMuralla[i][2], 1)
        //     const posActualFin = [puntosCurvaMuralla[i][0],puntosCurvaMuralla[i][1],puntosCurvaMuralla[i][2], 1]

        //     vec4.transformMat4(posActualInicio, posActualInicio, matInicioMuralla)
        //     vec4.transformMat4(posActualFin, posActualFin, matFinMuralla)

        //     posInicio.push(posActualInicio[0], posActualInicio[1], posActualInicio[2])
        //     posFin.push(posActualFin[0], posActualFin[1], posActualFin[2])
        // }

        // const pos = posInicio
        //porton
        // const ptosCtrlAbajo = [[-1.5, 0, 0], [-1, 0, 0], [1, 0, 0], [1.5, 0, 0]]
        // const ptosCtrlIzq = [[-1.5, 0, 0], [-1.5, 1, 0], [-1.5, 2, 0], [-1.5, 3, 0]]
        // const ptosCtrlArriba = [[-1.5, 3, 0], [-1, 3, 0], [1, 3, 0], [1.5, 3, 0]]
        // const ptosCtrlDerecha = [[1.5, 3, 0], [1.5, 2, 0], [1.5, 1, 0], [1.5, 0, 0]]

        // const curvaAbajo = new BezierCubica(ptosCtrlAbajo, "z")
        // const curvaIzq = new BezierCubica(ptosCtrlIzq, "z")
        // const curvaArriba = new BezierCubica(ptosCtrlArriba, "z")
        // const curvaDerecha = new BezierCubica(ptosCtrlDerecha, "z")

        // const puntosAbajo = discretizar(curvaAbajo, 1, false)
        // const puntosIzq = discretizar(curvaIzq, 1, false)
        // const puntosArriba = discretizar(curvaArriba, 1, false)
        // const puntosDerecha = discretizar(curvaDerecha, 1, false)

        // const pos =
        //     puntosAbajo.posicion.concat(
        //         puntosIzq.posicion,
        //         puntosArriba.posicion,
        //         puntosDerecha.posicion
        //     )


        // Recta entrada
        // let pos = [[0, 0, 7], [6.062177658081055, 0, 3.5],]

        // Marco puerta
        // const largo = 3
        // const anchoMarco = 0.25
        // const alto = 2
        // const profundidad = 1

        // const ptosCtrlAbajoDer = [[largo / 2 + anchoMarco, 0, profundidad / 2], [largo / 2 + anchoMarco * 0.5, 0, profundidad / 2], [largo / 2 + anchoMarco * 0.2, 0, profundidad / 2], [largo / 2, 0, profundidad / 2]]
        // const ptosCtrlLadoDerInt = [[largo / 2, 0, profundidad / 2], [largo / 2, alto * 0.2, profundidad / 2], [largo / 2, alto * 0.5, profundidad / 2], [largo / 2, alto, profundidad / 2]]
        // const ptosCtrlArribaInt = [[largo / 2, alto, profundidad / 2], [0.5 * largo / 2, alto, profundidad / 2], [-0.5 * largo / 2, alto, profundidad / 2], [-largo / 2, alto, profundidad / 2]]
        // const ptosCtrlLadoIzqInt = ptosCtrlLadoDerInt.map(x => ([x[0] - largo, x[1], x[2]])).reverse()
        // const ptosCtrlAbajoIzq = ptosCtrlAbajoDer.map(x => ([x[0] - largo - anchoMarco, x[1], x[2]]))
        // const ptosCtrlLadoIzqExt = ptosCtrlLadoDerInt.map(x => ([x[0] - largo - anchoMarco, x[1], x[2]]))
        // const ptosCtrlArribaExtIzq = [[-largo / 2 - anchoMarco, alto + anchoMarco, profundidad / 2], [-largo / 2 - anchoMarco * 0.5, alto + anchoMarco, profundidad / 2], [-largo / 2 - anchoMarco * 0.3, alto + anchoMarco, profundidad / 2], [-largo / 2, alto + anchoMarco, profundidad / 2]]
        // const ptosCtrlArribaExt = ptosCtrlArribaInt.map(x => ([x[0], x[1] + anchoMarco, x[2]])).reverse()
        // const ptosCtrlArribaExtDer = [[largo / 2, alto+anchoMarco, profundidad / 2], [largo / 2 + anchoMarco * 0.3, alto+anchoMarco, profundidad / 2], [largo / 2 + anchoMarco * 0.5, alto+anchoMarco, profundidad / 2], [largo / 2 + anchoMarco, alto+anchoMarco, profundidad / 2]]
        // const ptosCtrlLadoDerExt = ptosCtrlLadoDerInt.map(x => ([x[0] + anchoMarco, x[1], x[2]])).reverse()

        // const curvaAbajoDer = new BezierCubica(ptosCtrlAbajoDer, "z")
        // const curvaLadoDerInt = new BezierCubica(ptosCtrlLadoDerInt, "z")
        // const curvaArribaInt = new BezierCubica(ptosCtrlArribaInt, "z")
        // const curvaLadoIzqInt = new BezierCubica(ptosCtrlLadoIzqInt, "z")
        // const curvaLadoAbajoIzq = new BezierCubica(ptosCtrlAbajoIzq, "z")
        // const curvaLadoIzqExt = new BezierCubica(ptosCtrlLadoIzqExt, "z")
        // const curvaArribaExtIzq = new BezierCubica(ptosCtrlArribaExtIzq, "z")
        // const curvaArribaExt = new BezierCubica(ptosCtrlArribaExt, "z")
        // const curvaArribaExtDer = new BezierCubica(ptosCtrlArribaExtDer, "z")
        // const curvaLadoDerExt = new BezierCubica(ptosCtrlLadoDerExt, "z")

        // const ptosAbajoDer = discretizar(curvaAbajoDer, 1, false)
        // const ptosLadoDerInt = discretizar(curvaLadoDerInt, 1, false)
        // const ptosArribaInt = discretizar(curvaArribaInt, 1, false)
        // const ptosLadoIzqInt = discretizar(curvaLadoIzqInt, 1, false)
        // const ptosAbajoIzq = discretizar(curvaLadoAbajoIzq, 1, false)
        // const ptosLadoIzqExt = discretizar(curvaLadoIzqExt, 1, false)
        // const ptosArribaExtIzq = discretizar(curvaArribaExtIzq, 1, false)
        // const ptosArribaExt = discretizar(curvaArribaExt, 1, false)
        // const ptosArribaExtDer = discretizar(curvaArribaExtDer, 1, false)
        // const ptosLadoDerExt = discretizar(curvaLadoDerExt, 1, false)

        // const pos =
        //     ptosAbajoDer.posicion.concat(
        //         ptosLadoDerInt.posicion,
        //         ptosArribaInt.posicion,
        //         ptosLadoIzqInt.posicion,
        //         ptosAbajoIzq.posicion,
        //         ptosLadoIzqExt.posicion,
        //         ptosArribaExtIzq.posicion,
        //         ptosArribaExt.posicion,
        //         ptosArribaExtDer.posicion,
        //         ptosLadoDerExt.posicion,
        //     )


        // pos = [[largo / 2 + anchoMarco, 0, 0], [largo / 2, 0, 0], [largo / 2, alto, 0], [-largo / 2, alto, 0], [-largo / 2, 0, 0], [-largo / 2 - anchoMarco, 0, 0], [-largo / 2 - anchoMarco, alto+anchoMarco, 0], [largo / 2 + anchoMarco, alto+anchoMarco, 0], [largo / 2 + anchoMarco, 0, 0]]

        // this.curva = new BezierCubica(puntosDeControl)

        //VENTANA
        // const ancho = 0.75
        // const altura = 0.75
        
        // // const t1 = [[ancho, 0, 0],[ancho*0.6, 0, 0],[ancho*0.3, 0, 0],[0, 0, 0]].reverse()
        // // const t2 = [[ancho, altura, 0],[ancho, altura*0.6, 0],[ancho, altura*0.3, 0],[ancho, 0, 0]].reverse()
        // // const t3 = [[0, altura, 0], [ancho * 2 / 15, altura + 0.3, 0], [ancho * 13 / 15, altura + 0.3, 0], [ancho, altura, 0]].reverse()
        // // const t4 = [[0, 0, 0], [0, altura * 0.3, 0], [0, altura * 0.6, 0], [0, altura, 0]].reverse()

        // // const tramos = [t1,t2,t3,t4]
        // // const data = obtenerPuntosCurva(tramos)
        // // console.log("D4t4: ", data)
        // // const pos = data.posicion
        // const t1 = [[0, 0, 0], [0, altura * 0.3, 0], [0, altura * 0.6, 0], [0, altura, 0]]
        // const t2 = [[0, altura, 0], [ancho * 2 / 15, altura + 0.3, 0], [ancho * 13 / 15, altura + 0.3, 0], [ancho, altura, 0]]
        // const t3 = [[ancho, altura, 0], [ancho, altura * 0.6, 0], [ancho, altura * 0.3, 0], [ancho, 0, 0]]
        // const t4 = [[ancho, 0, 0], [ancho * 0.6, 0, 0], [ancho * 0.3, 0, 0], [0, 0, 0]]

        // const ladoIzq = new BezierCubica(t1, "z")
        // const ladoArriba = new BezierCubica(t2, "z")
        // const ladoDer = new BezierCubica(t3, "z")
        // const ladoAbajo = new BezierCubica(t4, "z")

        // //Obtenemos el poligono que forma la curva
        // const puntosLadoIzq = discretizar(ladoIzq, 1, false, true)
        // const puntosLadoArriba = discretizar(ladoArriba, 1 / 9, false, true)
        // const puntosLadoDer = discretizar(ladoDer, 1, false, true)
        // const puntosLadoAbajo = discretizar(ladoAbajo, 1, false, true)


        // const pos = puntosLadoIzq.posicion.concat(
        //     puntosLadoArriba.posicion,
        //     puntosLadoDer.posicion,
        //     puntosLadoAbajo.posicion
        // )

        // const norm = puntosLadoIzq.normal.concat(
        //     puntosLadoArriba.normal,
        //     puntosLadoDer.normal,
        //     puntosLadoAbajo.normal
        // )

        // TRAYECTORIA
        const pos = [0, 0.44999998807907104, -2.75, 0, 5.918574810028076, 0.49699291586875916,0, 5.917105197906494, 0.5042499899864197, 0, 5.9146552085876465, 0.5163451433181763,0, 5.911224842071533, 0.5332782864570618,0, 5.906815052032471, 0.5550495386123657,0, 5.901424884796143, 0.5816588401794434,0, 5.895054817199707, 0.6131061911582947,0, 5.887704849243164, 0.6493915915489197,0, 5.879374980926514, 0.6905150413513184,0, 5.870065212249756, 0.7364765405654907,0, 5.859775066375732, 0.7872760891914368,0, 5.848505020141602, 0.8429136872291565,0, 5.836255073547363, 0.9033893346786499,0, 5.823025226593018, 0.968703031539917,0, 5.808815002441406, 1.0388548374176025,0, 5.7936248779296875, 1.113844633102417,0, 5.777454853057861, 1.19367253780365,0, 5.760304927825928, 1.2783384323120117,0, 5.742175102233887, 1.367842435836792,0, 5.72306489944458, 1.4621844291687012,0, 5.702974796295166, 1.5613645315170288,0, 5.6819047927856445, 1.6653826236724854,0, 5.659854888916016, 1.7742388248443604,0, 5.636825084686279, 1.8879330158233643,0, 5.612814903259277, 2.006465435028076,0, 5.587824821472168, 2.129835605621338,0, 5.561854839324951, 2.2580440044403076,0, 5.534904956817627, 2.3910906314849854,0, 5.506975173950195, 2.528975009918213,0, 5.478065013885498, 2.6716976165771484,0, 5.448174953460693, 2.819258213043213,0, 5.417304992675781, 2.9716567993164062,0, 5.385455131530762, 3.1288936138153076,0, 5.352624893188477, 3.290968418121338,0, 5.318815231323242, 3.457881212234497,0, 5.284025192260742, 3.629631996154785,0, 5.248254776000977, 3.8062210083007812,0, 5.211504936218262, 3.9876480102539062,0, 0.7206549644470215, 26.158023834228516]

        this.vertices = pos
        this.bufferPos = [].concat(...pos)
        this.bufferColor = [].concat(...this.vertices.map(x => [0, 0, 0]))

    }

    dibujar() {
        const puntos = 40;
        gl.useProgram(glProgramCurva);
        const mat = mat4.create()
        var modelMatrixUniform = gl.getUniformLocation(glProgramCurva, "modelMatrix");
        gl.uniformMatrix4fv(modelMatrixUniform, false, mat);

        var trianglesVerticeBuffer = gl.createBuffer();                               // creo el buffer
        gl.bindBuffer(gl.ARRAY_BUFFER, trianglesVerticeBuffer);                   // activo el buffer
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.bufferPos), gl.STATIC_DRAW);   // cargo los datos en el buffer 

        var trianglesColorBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, trianglesColorBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.bufferColor), gl.STATIC_DRAW);

        var vertexPositionAttribute = gl.getAttribLocation(glProgramCurva, "aVertexPosition");
        gl.enableVertexAttribArray(vertexPositionAttribute);
        gl.bindBuffer(gl.ARRAY_BUFFER, trianglesVerticeBuffer);
        gl.vertexAttribPointer(vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);

        var vertexColorAttribute = gl.getAttribLocation(glProgramCurva, "aVertexColor");
        gl.enableVertexAttribArray(vertexColorAttribute);
        gl.bindBuffer(gl.ARRAY_BUFFER, trianglesColorBuffer);
        gl.vertexAttribPointer(vertexColorAttribute, 3, gl.FLOAT, false, 0, 0);

        gl.drawArrays(gl.LINE_STRIP, 0, puntos);
    }
}

const obtenerPuntosCurva = (tramos) => {

    let pos = []
    let norm = []

    for (let i = 0; i < tramos.length; i++) {
        const p1 = tramos[i][0]
        const p2 = tramos[i][1]
        const p3 = tramos[i][2]
        const p4 = tramos[i][3]

        let niveles
        if (((p1[0] == p2[0] && p1[0] == p3[0] && p1[0] == p4[0]) && (p1[1] == p2[1] && p1[1] == p3[1] && p1[1] == p4[1])) ||
            ((p1[0] == p2[0] && p1[0] == p3[0] && p1[0] == p4[0]) && (p1[2] == p2[2] && p1[2] == p3[2] && p1[2] == p4[2])) ||
            ((p1[2] == p2[2] && p1[2] == p3[2] && p1[2] == p4[2]) && (p1[1] == p2[1] && p1[1] == p3[1] && p1[1] == p4[1]))) {
            niveles = 2
        } else {
            niveles = 10
        }
        // console.log("NIV: ", niveles, " p1: ", p1, " - p2: ", p2, " - p3: ", p3, " - p4: ", p4)
        // console.log((p1[2] == p2[2] && p1[2] == p3 && p1[2] == p4[2]), p1[2], p2[2], p3[2], p4[2])
        const curva = new BezierCubica(tramos[i], "z")
        const puntos = discretizar(curva, 1 / (niveles - 1), false)
        console.log("PUNTOS: ", puntos)
        pos = pos.concat(puntos.posicion)
        norm = norm.concat(puntos.normal)
    }

    return {
        posicion: pos,
        normal: norm,
    }
}


// agregar 3er componente a pcontrol
// corregir desplazamientos en parte de arriba
// Reverse al ultimo lado