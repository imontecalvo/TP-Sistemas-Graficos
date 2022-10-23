import { BezierCubica } from "./bezier/bezier3.js";
import { discretizar } from "./bezier/discretizador.js";
import { gl, glProgramCurva } from "./web-gl.js";

var mat4 = glMatrix.mat4;

export class LineaCurva {
    constructor(puntosDeControl) {

        const h = 0.5
        const a = 0.25
        const ancho = 2
        //muro
        const radio = 6
        const pControlLadoI = [[radio, 0, 0], [radio + 0.10, 1.60, 0], [radio + .40, 2.33, 0], [radio + .5, 4, 0]]
        const pControlBalconILadoI = [[radio + .5, 4, 0], [radio + .5, 4 + h * 0.3, 0], [radio + .5, 4 + h * 0.6, 0], [radio + .5, 4 + h, 0]]
        console.log("balcon: ", pControlBalconILadoI)
        const pControlBalconITecho = [[radio + .5, 4 + h, 0], [radio + .5 + a * 0.3, 4 + h, 0], [radio + .5 + a * 0.6, 4 + h, 0], [radio + .5 + a, 4 + h, 0]]
        const pControlBalconILadoD = [[radio + .5 + a, 4 + h, 0], [radio + .5 + a, 4 + h * 0.6, 0], [radio + .5 + a, 4 + h * 0.3, 0], [radio + .5 + a, 4, 0]]
        const pControlBalconPiso = [[radio + .5 + a, 4, 0], [radio + .5 + 1.3 * a, 4, 0], [radio + .5 + 1.6 * a, 4, 0], [radio + .5 + 2 * a, 4, 0]]

        const ladoI = new BezierCubica(pControlLadoI, "z")
        const balconILadoI = new BezierCubica(pControlBalconILadoI, "z")
        const balconITecho = new BezierCubica(pControlBalconITecho, "z")
        const balconILadoD = new BezierCubica(pControlBalconILadoD, "z")
        const balconPiso = new BezierCubica(pControlBalconPiso, "z")

        const ladoD = new BezierCubica(pControlLadoI.map(p => [2 * radio + ancho - p[0], p[1], p[2]]), "z")
        const balconDLadoD = new BezierCubica(pControlBalconILadoI.map(p => [1 + p[0], p[1], p[2]]), "z")
        const balconDTecho = new BezierCubica(pControlBalconITecho.map(p => [0.75 + p[0], p[1], p[2]]), "z")
        const balconDLadoI = new BezierCubica(pControlBalconILadoD.map(p => [0.5 + p[0], p[1], p[2]]), "z")
        const balconPisoD = new BezierCubica(pControlBalconPiso.map(p => [0.25 + p[0], p[1], p[2]]), "z")

        const puntosLadoI = discretizar(ladoI, 1 / 9, false)
        const puntosBalconILadoI = discretizar(balconILadoI, 1, false)
        const puntosBalconITecho = discretizar(balconITecho, 1, false)
        const puntosBalconILadoD = discretizar(balconILadoD, 1, false)
        const puntosBalconPiso = discretizar(balconPiso, 1, false)

        const puntosBalconPisoD = discretizar(balconPisoD, 1, false)
        const puntosBalconDLadoI = discretizar(balconDLadoI, 1, false)
        const puntosBalconDTecho = discretizar(balconDTecho, 1, false)
        const puntosBalconDLadoD = discretizar(balconDLadoD, 1, false)
        const puntosLadoD = discretizar(ladoD, 1 / 9, false)

        const puntosCurvaMuralla = puntosLadoI.posicion.concat(
            puntosBalconILadoI.posicion,
            puntosBalconITecho.posicion,
            puntosBalconILadoD.posicion,
            puntosBalconPiso.posicion,
            puntosBalconPisoD.posicion,
            puntosBalconDLadoI.posicion,
            puntosBalconDTecho.posicion,
            puntosBalconDLadoD.posicion,
            puntosLadoD.posicion.reverse()
        )

        var mat4 = glMatrix.mat4;
        var vec4 = glMatrix.vec4;

        const anchoPorton = 2
        let posInicio = []
        let normInicio = []
        let posFin = []
        let normFin = []

        const matInicioMuralla = mat4.create()
        const matFinMuralla = mat4.create()

        const mat = mat4.create()
        // mat4.translate(mat,mat, [-1,0,0])
        mat4.rotateY(mat, mat, Math.PI / 2)
        mat4.translate(mat, mat, [-radio-1, 0, 0])
        mat4.translate(matInicioMuralla, matInicioMuralla, [-1,0,0])
        mat4.multiply(matInicioMuralla, matInicioMuralla, mat)
        
        // mat4.translate(matInicioMuralla, matInicioMuralla, [-anchoPorton, 0, 0])
        // mat4.translate(matInicioMuralla, matInicioMuralla, [0, 0, -anchoPorton])
        
        // mat4.scale(matInicioMuralla, matInicioMuralla, [2,4,2])
        // mat4.rotate(matInicioMuralla, matFinMuralla, 3.14/2, [0,1,0])
        // mat4.transpose(matInicioMuralla, matInicioMuralla)
        // console.log("maat: ", matInicioMuralla)
        // mat4.transpose(matFinMuralla, matFinMuralla)

        for (let i = 0; i < puntosCurvaMuralla.length; i++) {
            const posActualInicio = vec4.fromValues(puntosCurvaMuralla[i][0],puntosCurvaMuralla[i][1],puntosCurvaMuralla[i][2], 1)
            const posActualFin = [puntosCurvaMuralla[i][0],puntosCurvaMuralla[i][1],puntosCurvaMuralla[i][2], 1]

            vec4.transformMat4(posActualInicio, posActualInicio, matInicioMuralla)
            vec4.transformMat4(posActualFin, posActualFin, matFinMuralla)

            posInicio.push(posActualInicio[0], posActualInicio[1], posActualInicio[2])
            posFin.push(posActualFin[0], posActualFin[1], posActualFin[2])
        }

        const pos = posInicio
        console.log("curvaaaaSasd: ", posInicio)
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
        this.vertices = pos
        this.bufferPos = [].concat(...pos)
        this.bufferColor = [].concat(...this.vertices.map(x => [0, 0, 0]))
        console.log("puntos curvita: ", this.vertices)

    }

    dibujar() {
        const puntos = 2 * 18;
        // console.log("dibu curva: ", this.bufferPos)
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

// agregar 3er componente a pcontrol
// corregir desplazamientos en parte de arriba
// Reverse al ultimo lado