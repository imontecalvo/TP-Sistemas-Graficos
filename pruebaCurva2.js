import { BezierCubica } from "./bezier/bezier3.js";
import { discretizar } from "./bezier/discretizador.js";
import { gl, glProgramCurva } from "./web-gl.js";

var mat4 = glMatrix.mat4;

export class LineaCurva2 {
    constructor(puntosDeControl) {
        this.curva = new BezierCubica(puntosDeControl)
        this.vertices = discretizar(this.curva, "z", 1 / 8, false).posicion
        this.bufferPos = []
        this.bufferColor = [].concat(...this.vertices.map(x => [0, 0, 0]))

        this.recorrido = new BezierCubica([0,2,3], [3,2,0],[0,2,-3],[-3,2,0])
        this.verticesRecorrido = discretizar(this.recorrido, "y", 1/4, true)

    }

    dibujar() {
        for (vertice in this.vertices){
            
        }
    }

    dibujarInstancia(){
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
        
        gl.drawArrays(gl.LINE_STRIP, 0, 9);
    }
}

function generarMatrizDeNivel(pos, normal, binormal, tangente) {
    return mat4.fromValues(normal[0], binormal[0], tangente[0], pos[0],
        normal[1], binormal[1], tangente[1], pos[1],
        normal[2], binormal[2], tangente[2], pos[2],
        0, 0, 0, 1)
}