import { gl, glProgram } from "./web-gl.js";
var mat4 = glMatrix.mat4;
var vec3 = glMatrix.vec3;

export class Objeto3D {
    static MODEL_MATRIX_UNIFORM = null;
    constructor(filas, columnas) {
        this.filas = filas;
        this.columnas = columnas;
        this.mallaDeTriangulos = null;
        this.matrizModelado = mat4.create();
        this.posicion = vec3.fromValues(0, 0, 0);
        this.rotacionX = 0
        this.rotacionY = 0
        this.rotacionZ = 0
        this.escala = vec3.fromValues(1, 1, 1);
    }

    actualizarMatrizModelado() {
        mat4.translate(this.matrizModelado, this.matrizModelado, this.posicion);
        // mat4.rotateY(this.matrizModelado, this.matrizModelado, this.rotacionY);
        // mat4.rotateZ(this.matrizModelado, this.matrizModelado, this.rotacionZ);
        // mat4.rotateX(this.matrizModelado, this.matrizModelado, this.rotacionX);
        // mat4.scale(this.matrizModelado, this.matrizModelado, this.escala);
    };

    async dibujar(matrizPadre) {
        this.matrizModelado = mat4.create();
        var mat = mat4.create();
        this.actualizarMatrizModelado();
        mat4.multiply(mat, this.matrizModelado, matrizPadre);

        if (this.mallaDeTriangulos) {
            // mat4.identity(mat)
            // mat4.rotate(mat, mat, 0.78, [1.0, 0.0, 0.0]);
            // console.log(this.matrizModelado)
            // gl.uniformMatrix3fv(glProgram.normalMatrixUniform, false, normalMatrix);
            var modelMatrixUniform = gl.getUniformLocation(glProgram, "modelMatrix");
            gl.uniformMatrix4fv(modelMatrixUniform, false, mat);


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

    setearPosicion(x,y,z){
        this.posicion[0] = x;
        this.posicion[1] = y;
        this.posicion[2] = z;
    }

    trasladar(x, y, z) {
        this.posicion[0] = this.posicion[0] + x;
        this.posicion[1] = this.posicion[1] + y;
        this.posicion[2] = this.posicion[2] + z;
    }

    rotarX(rad) {
        this.rotacionX += rad;
    }

    rotarY(rad) {
        this.rotacionY += rad;
    }

    rotarZ(rad) {
        this.rotacionZ += rad;
    }

    escalar(x, y, z) {
        this.escala[0] = this.escala[0] * x;
        this.escala[1] = this.escala[1] * y;
        this.escala[2] = this.escala[2] * z;
    }
}