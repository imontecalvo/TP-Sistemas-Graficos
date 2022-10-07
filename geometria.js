import {gl} from "./web-gl.js"

function getVertexIndex(i, j, columnas) {
    return i * (columnas + 1) + j;
}

export function crearMalla(superficie) {
    let positionBuffer = [];
    let normalBuffer = [];
    // uvBuffer = [];

    for (var i = 0; i <= superficie.filas; i++) {
        for (var j = 0; j <= superficie.columnas; j++) {

            var u = j / superficie.columnas;
            var v = i / superficie.filas;

            var pos = superficie.obtenerPosicion(u, v);

            positionBuffer.push(pos[0]);
            positionBuffer.push(pos[1]);
            positionBuffer.push(pos[2]);

            var nrm = superficie.obtenerNormal(u, v);

            normalBuffer.push(nrm[0]);
            normalBuffer.push(nrm[1]);
            normalBuffer.push(nrm[2]);

            // var uvs = superficie.getCoordenadasTextura(u, v);

            // uvBuffer.push(uvs[0]);
            // uvBuffer.push(uvs[1]);

        }
    }

    // Buffer de indices de los triángulos
    let indexBuffer = [];

    for (i = 0; i < superficie.filas; i++) {
        for (j = 0; j <= superficie.columnas; j++) {
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
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positionBuffer), gl.STATIC_DRAW);
    webgl_position_buffer.itemSize = 3;
    webgl_position_buffer.numItems = positionBuffer.length / 3;

    let webgl_normal_buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, webgl_normal_buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normalBuffer), gl.STATIC_DRAW);
    webgl_normal_buffer.itemSize = 3;
    webgl_normal_buffer.numItems = normalBuffer.length / 3;

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