import {gl, glProgram} from "./web-gl.js";

export class Objeto3D{
    constructor(filas, columnas){
        this.mallaDeTriangulos = null;
        this.filas = filas;
        this.columnas = columnas;
    }
    
    async dibujar(){
        if (this.mallaDeTriangulos){
            gl.bindBuffer(gl.ARRAY_BUFFER, this.mallaDeTriangulos.webgl_position_buffer);
            gl.vertexAttribPointer(glProgram.vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);
    
            gl.bindBuffer(gl.ARRAY_BUFFER, this.mallaDeTriangulos.webgl_normal_buffer);
            gl.vertexAttribPointer(glProgram.vertexNormalAttribute, 3, gl.FLOAT, false, 0, 0);
    
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.mallaDeTriangulos.webgl_index_buffer);
    
            gl.drawElements(gl.TRIANGLE_STRIP, this.mallaDeTriangulos.webgl_index_buffer.numItems, gl.UNSIGNED_SHORT, 0);
        }
    }
}