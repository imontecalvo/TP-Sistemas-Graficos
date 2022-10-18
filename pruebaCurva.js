import { BezierCubica } from "./bezier/bezier3.js";
import { discretizar } from "./bezier/discretizador.js";
import { gl, glProgramCurva } from "./web-gl.js";

var mat4 = glMatrix.mat4;

export class LineaCurva {
    constructor(puntosDeControl) {

        const h = 0.5
        const a = 0.25

        //muro
        // const pControlLadoI = [[6, 0, 0], [6.10, 1.60, 0], [6.40, 2.33, 0], [6.5, 4, 0]]
        // const ladoI = new BezierCubica(pControlLadoI, "z")
        // const puntosLadoI = discretizar(ladoI, 1 / this.columnas, false)
        const pControlLadoI = [[6, 0, 0], [6.10, 1.60, 0], [6.40, 2.33, 0], [6.5, 4, 0]]
        const pControlBalconILadoI = [[6.5, 4,0], [6.5, 4 + h * 0.3,0], [6.5, 4 + h * 0.6,0], [6.5, 4 + h,0]]
        console.log("balcon: ", pControlBalconILadoI)
        const pControlBalconITecho = [[6.5, 4 + h, 0], [6.5 + a * 0.3, 4 + h,0], [6.5 + a * 0.6, 4 + h,0], [6.5 + a, 4 + h,0]]
        const pControlBalconILadoD = [[6.5 + a, 4 + h,0], [6.5 + a, 4 + h * 0.6,0], [6.5 + a, 4 + h * 0.3,0], [6.5 + a, 4,0]]
        const pControlBalconPiso = [[6.5 + a, 4,0], [6.5 + 1.3 * a, 4,0], [6.5 + 1.6 * a, 4,0], [6.5 + 2 * a, 4,0]]

        const ladoI = new BezierCubica(pControlLadoI, "z")
        const balconILadoI = new BezierCubica(pControlBalconILadoI, "z")
        const balconITecho = new BezierCubica(pControlBalconITecho, "z")
        const balconILadoD = new BezierCubica(pControlBalconILadoD, "z")
        const balconPiso = new BezierCubica(pControlBalconPiso, "z")

        const ladoD = new BezierCubica(pControlLadoI.map(p => [6 + 8 - p[0], p[1], p[2]]), "z")
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

        const pos = puntosLadoI.posicion.concat(
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

        // this.curva = new BezierCubica(puntosDeControl)
        this.vertices = pos
        this.bufferPos = [].concat(...pos)
        this.bufferColor = [].concat(...this.vertices.map(x => [0, 0, 0]))
        console.log("puntos curvita: ", this.vertices)
        
    }

    dibujar() {
        // console.log("dibu curva: ", this.bufferPos)
        gl.useProgram(glProgramCurva);
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
        
        gl.drawArrays(gl.LINE_STRIP, 0, 36);
    }
}

// agregar 3er componente a pcontrol
// corregir desplazamientos en parte de arriba
// Reverse al ultimo lado