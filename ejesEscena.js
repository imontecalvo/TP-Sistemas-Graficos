import { Objeto3D } from "./objeto3d.js"
import { crearMalla } from "./geometria.js"
import { gl, glProgram } from "./web-gl.js"

var mat4 = glMatrix.mat4

export class EjesEscena {
    constructor() {
        this.ejeX = new Eje("X")
        this.ejeY = new Eje("Y")
        this.ejeZ = new Eje("Z")
    }

    dibujar() {
        this.ejeX.dibujar()
        this.ejeY.dibujar()
        this.ejeZ.dibujar()
    }
}

class Eje {
    constructor(tipo) {
        this.filas = 30
        this.columnas = 30
        this.tipo = tipo
        this.radio = 0.05
        this.largo = 15
        if (tipo=="X") this.color = [1, 0, 0]
        if (tipo=="Y") this.color = [0, 1, 0]
        if (tipo=="Z") this.color = [0, 0, 1]
        this.mallaDeTriangulos = crearMalla(this)
    }

    obtenerPosicion = function (u, v) {

        if (this.tipo == "Y") {
            var x = this.radio * Math.cos(v * 2 * Math.PI);
            var z = this.radio * Math.sin(v * 2 * Math.PI);
            var y = u * this.largo;

            return [x, y, z];
        } else if (this.tipo == "X") {
            var x = u * this.largo;
            var y = this.radio * Math.cos(v * 2 * Math.PI);
            var z = this.radio * Math.sin(v * 2 * Math.PI);
            return [x, y, z];
        } else {
            var x = this.radio * Math.cos(v * 2 * Math.PI);
            var y = this.radio * Math.sin(v * 2 * Math.PI);
            var z = u * this.largo;
            return [x, y, z];
        }
    }

    obtenerNormal = function (u, v) {
        var p0 = this.obtenerPosicion(u, v);
        var p1 = this.obtenerPosicion(u + 0.001, v);
        var p2 = this.obtenerPosicion(u, v + 0.001);
        var v1 = [p1[0] - p0[0], p1[1] - p0[1], p1[2] - p0[2]];
        var v2 = [p2[0] - p0[0], p2[1] - p0[1], p2[2] - p0[2]];

        var x = v1[1] * v2[2] - v1[2] * v2[1];
        var y = -(v1[0] * v2[2] - v1[2] * v2[0]);
        var z = v1[0] * v2[1] - v1[1] * v2[0];
        return p0;
    }

    dibujar() {
        gl.useProgram(glProgram)
        if (this.mallaDeTriangulos) {
            var mat = mat4.create();
            var modelMatrixUniform = gl.getUniformLocation(glProgram, "modelMatrix");
            gl.uniformMatrix4fv(modelMatrixUniform, false, mat);
            
            var colorUniform = gl.getUniformLocation(glProgram, "uColor");
            gl.uniform3fv(colorUniform, this.color);

            var vertexPositionAttribute = gl.getAttribLocation(glProgram, "aVertexPosition"); //referencia a aVertexPosition del shader
            gl.enableVertexAttribArray(vertexPositionAttribute); //activo el atributo
            gl.bindBuffer(gl.ARRAY_BUFFER, this.mallaDeTriangulos.webgl_position_buffer); //linkeo mi buffer de posiciones al atributo activado (aVertexPosition)
            gl.vertexAttribPointer(vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);

            var vertexNormalAttribute = gl.getAttribLocation(glProgram, "aVertexNormal");
            gl.enableVertexAttribArray(vertexNormalAttribute);
            gl.bindBuffer(gl.ARRAY_BUFFER, this.mallaDeTriangulos.webgl_normal_buffer);
            gl.vertexAttribPointer(vertexNormalAttribute, 3, gl.FLOAT, false, 0, 0);

            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.mallaDeTriangulos.webgl_index_buffer);

            gl.drawElements(gl.TRIANGLE_STRIP, this.mallaDeTriangulos.webgl_index_buffer.numItems, gl.UNSIGNED_SHORT, 0);

        }
    }
}