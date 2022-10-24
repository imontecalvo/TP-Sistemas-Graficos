import { Objeto3D } from "./objeto3d.js"
import { BezierCubica } from "./bezier/bezier3.js"
import { discretizar } from "./bezier/discretizador.js";
import { gl, glProgram } from "./web-gl.js";
import { superficeBarrido } from "./superficieBarrido.js";

export class Superficie extends Objeto3D {
    constructor(filas, columnas, posiciones, normales) {
        super(filas, columnas)
        this.bufferPos = posiciones
        this.bufferNorm = normales
        this.bufferNormDibujadas = []


        for (let i = 0; i < this.bufferPos.length-3; i+=3) {
            this.bufferNormDibujadas.push(this.bufferPos[i])
            this.bufferNormDibujadas.push(this.bufferPos[i+1])
            this.bufferNormDibujadas.push(this.bufferPos[i+2])

            this.bufferNormDibujadas.push(this.bufferPos[i] + this.bufferNorm[i])
            this.bufferNormDibujadas.push(this.bufferPos[i+1] + this.bufferNorm[i+1])
            this.bufferNormDibujadas.push(this.bufferPos[i+2] + this.bufferNorm[i+2])
        }

        // this.bufferNormDibujadas=[0,0,0,0,1,1,3,0,0,3,0,4]
        this.mallaDeTriangulos = crearMalla(this)
        this.color = [0, 0, 0]
    }
}

function getVertexIndex(i, j, columnas) {
    return i * (columnas + 1) + j;
}


function crearMalla(superficie) {
    // Buffer de indices de los triángulos
    let indexBuffer = [];

    for (let i = 0; i < superficie.filas; i++) {
        for (let j = 0; j <= superficie.columnas; j++) {
            indexBuffer.push(getVertexIndex(i, j, superficie.columnas));
            indexBuffer.push(getVertexIndex(i + 1, j, superficie.columnas));
            if (j == superficie.columnas && i < superficie.filas - 1) {
                indexBuffer.push(getVertexIndex(i + 1, j, superficie.columnas));
                indexBuffer.push(getVertexIndex(i, j, superficie.columnas) + 1);
            }
        }
    }

    // Creación e Inicialización de los buffers

    let webgl_position_buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, webgl_position_buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(superficie.bufferPos), gl.STATIC_DRAW);
    webgl_position_buffer.itemSize = 3;
    webgl_position_buffer.numItems = superficie.bufferPos.length / 3;

    let webgl_normal_buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, webgl_normal_buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(superficie.bufferNorm), gl.STATIC_DRAW);
    webgl_normal_buffer.itemSize = 3;
    webgl_normal_buffer.numItems = superficie.bufferPos.length / 3;

    // webgl_uvs_buffer = gl.createBuffer();
    // gl.bindBuffer(gl.ARRAY_BUFFER, webgl_uvs_buffer);
    // gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(uvBuffer), gl.STATIC_DRAW);
    // webgl_uvs_buffer.itemSize = 2;
    // webgl_uvs_buffer.numItems = uvBuffer.length / 2;


    let webgl_index_buffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, webgl_index_buffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indexBuffer), gl.STATIC_DRAW);
    webgl_index_buffer.itemSize = 1;
    webgl_index_buffer.numItems = indexBuffer.length;

    return {
        webgl_position_buffer,
        webgl_normal_buffer,
        // webgl_uvs_buffer,
        webgl_index_buffer
    }
}