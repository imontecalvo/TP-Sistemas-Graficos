import { gl, glProgramCurva } from "./web-gl.js";
var mat4 = glMatrix.mat4;
var vec4 = glMatrix.vec4;

export class Objeto3D {
    static MODEL_MATRIX_UNIFORM = null;
    constructor(material = window.materiales.ROJO, configMapeoUv = { multiplicadorU: 1, multiplicadorV: 1, signoU: 1, signoV: 1 }) {
        this.mallaDeTriangulos = null;
        this.matrizModelado = mat4.create();
        this.hijos = []
        this.oculto = false
        this.material = material

        this.multiplicadorU = configMapeoUv.hasOwnProperty("multiplicadorU") ? configMapeoUv.multiplicadorU : 1
        this.multiplicadorV = configMapeoUv.hasOwnProperty("multiplicadorV") ? configMapeoUv.multiplicadorV : 1
        this.signoU = configMapeoUv.hasOwnProperty("signoU") ? configMapeoUv.signoU : 1
        this.signoV = configMapeoUv.hasOwnProperty("signoV") ? configMapeoUv.signoV : 1
    }

    ocultar() {
        this.oculto = true
    }

    mostrar() {
        this.oculto = false
    }

    agregarHijo(hijo) {
        this.hijos.push(hijo)
    }

    obtenerMatrizModelado() {
        return this.matrizModelado
    }

    obtenerPosicionAbsoluta(matrizPadre) {
        var mat = mat4.create();
        mat4.multiply(mat, matrizPadre, this.matrizModelado);

        const pos = vec4.fromValues(0, 0, 0, 1)
        vec4.transformMat4(pos, pos, mat)
        return [pos[0], pos[1], pos[2]]
    }

    resetearMatriz() {
        this.matrizModelado = mat4.create();
    }

    trasladar(x, y, z) {
        mat4.translate(this.matrizModelado, this.matrizModelado, [x, y, z]);
    }

    obtenerPosicion() {
        const pos = vec4.fromValues(0, 0, 0, 1)
        vec4.transformMat4(pos, pos, this.matrizModelado)
        return [pos[0], pos[1], pos[2]]
    }

    setearPosicionY(y) {
        const pos = this.obtenerPosicion()
        this.trasladar(0, y - pos[1], 0)
    }

    trasladarRelativo(x, y, z) {
        const pos = this.obtenerPosicion()
        mat4.translate(this.matrizModelado, this.matrizModelado, [pos[0] + x, pos[1] + y, pos[2] + z]);
    }

    rotarX(rad) {
        mat4.rotateX(this.matrizModelado, this.matrizModelado, rad);
    }

    rotarY(rad) {
        mat4.rotateY(this.matrizModelado, this.matrizModelado, rad);
    }

    rotarZ(rad) {
        mat4.rotateZ(this.matrizModelado, this.matrizModelado, rad);
    }

    escalar(x, y, z) {
        mat4.scale(this.matrizModelado, this.matrizModelado, [x, y, z]);
    }

    async dibujar(matrizPadre, forzarColor = false) {
        if (this.oculto) return

        var mat = mat4.create();
        mat4.multiply(mat, matrizPadre, this.matrizModelado);
        var matNorm = mat4.create()
        mat4.invert(matNorm, mat);
        mat4.transpose(matNorm, matNorm);

        if (this.mallaDeTriangulos) {
            // this.configurarIluminacion()

            const renderColor = (app.rendering == "Normales" && !forzarColor) ? false : true

            const glProgram = this.material.activar(renderColor, this.id)
            gl.useProgram(glProgram);

            gl.uniformMatrix4fv(glProgram.modelMatrixUniform, false, mat);
            gl.uniformMatrix4fv(glProgram.normalMatrixUniform, false, matNorm);

            gl.bindBuffer(gl.ARRAY_BUFFER, this.mallaDeTriangulos.webgl_position_buffer);
            gl.vertexAttribPointer(glProgram.vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);

            gl.bindBuffer(gl.ARRAY_BUFFER, this.mallaDeTriangulos.webgl_normal_buffer);
            gl.vertexAttribPointer(glProgram.vertexNormalAttribute, 3, gl.FLOAT, false, 0, 0);

            gl.bindBuffer(gl.ARRAY_BUFFER, this.mallaDeTriangulos.webgl_tangente_buffer);
            gl.vertexAttribPointer(glProgram.vertexTangenteAttribute, 3, gl.FLOAT, false, 0, 0);

            if (this.material.shaderProgram.id == "phong") {
                gl.bindBuffer(gl.ARRAY_BUFFER, this.mallaDeTriangulos.webgl_uvs_buffer);
                gl.vertexAttribPointer(glProgram.vertexUVAttribute, 2, gl.FLOAT, false, 0, 0);
            }

            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.mallaDeTriangulos.webgl_index_buffer);

            gl.drawElements(gl.TRIANGLE_STRIP, this.mallaDeTriangulos.webgl_index_buffer.numItems, gl.UNSIGNED_SHORT, 0);

            if (this.bufferNormDibujadas && app.dibujarNormales) {
                this.dibujarNormales(mat);
            }
        }

        for (let hijo of this.hijos) {
            await hijo.dibujar(mat);
        }
    }


    dibujarNormales(mat) {
        gl.useProgram(glProgramCurva);

        const componentes = [this.bufferNormDibujadas]
        for (let i in componentes) {
            var modelMatrixUniform = gl.getUniformLocation(glProgramCurva, "modelMatrix");
            gl.uniformMatrix4fv(modelMatrixUniform, false, mat);
            
            var trianglesVerticeBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, trianglesVerticeBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(componentes[i]), gl.STATIC_DRAW);
            
            var vertexPositionAttribute = gl.getAttribLocation(glProgramCurva, "aVertexPosition");
            gl.enableVertexAttribArray(vertexPositionAttribute);
            gl.bindBuffer(gl.ARRAY_BUFFER, trianglesVerticeBuffer);
            gl.vertexAttribPointer(vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);
            
            gl.drawArrays(gl.LINES, 0, 2 * componentes[i].length / 3);

        }
    }


    crearMalla() {
        function getVertexIndex(i, j, columnas) {
            return i * (columnas + 1) + j;
        }

        function agruparPuntos(arr, chunkSize) {
            var array = arr;
            return [].concat.apply([],
                array.map(function (elem, i) {
                    return i % chunkSize ? [] : [array.slice(i, i + chunkSize)];
                })
            );
        }

        function distancia(p1, p2) {
            return Math.sqrt((p1[0] - p2[0]) ** 2 + (p1[1] - p2[1]) ** 2 + (p1[2] - p2[2]) ** 2)
        }

        let uvBuffer = []

        // Calculo longitudes de los puntos pertenecientes a una fila (un nivel)
        let longAcumuladaFila = []
        const coordPos = agruparPuntos(this.bufferPos, 3)

        for (var i = 0; i <= this.filas; i++) {
            let longFilaActual = []
            for (var j = 0; j <= this.columnas; j++) {
                const idx = i * (this.columnas + 1) + j
                if (j == 0) longFilaActual.push(0)
                else {
                    longFilaActual.push(longFilaActual[j - 1] + distancia(coordPos[idx], coordPos[idx - 1]))
                }
            }
            const longTotalFila = longFilaActual[longFilaActual.length - 1]
            longFilaActual = longFilaActual.map(x => x / longTotalFila)
            longAcumuladaFila.push(longFilaActual)
        }

        let longAcumuladaColumna = []
        if (this.id == "muralla" || this.id == "techo") {
            // Calculo longitudes de los puntos pertenecientes a cada columna

            for (var j = 0; j <= this.columnas; j++) {
                let longColumnaActual = []
                for (var i = 0; i <= this.filas; i++) {
                    const idx = i * (this.columnas + 1) + j
                    if (i == 0) longColumnaActual.push(0)
                    else {
                        longColumnaActual.push(longColumnaActual[i - 1] + distancia(coordPos[idx], coordPos[idx - (this.columnas + 1)]))
                    }
                }
                const longTotalCol = longColumnaActual[longColumnaActual.length - 1]
                longColumnaActual = longColumnaActual.map(x => x / longTotalCol)
                longAcumuladaColumna.push(longColumnaActual)
            }
        }



        // longitudes a lo largo de una fila -> un nivel
        // long acumulada por cada columna -> ("una fila")

        for (var i = 0; i <= this.filas; i++) {
            for (var j = 0; j <= this.columnas; j++) {
                var v = longAcumuladaFila[i][j]

                var u = (this.id === "muralla" || this.id === "techo") ? longAcumuladaColumna[j][i] : (i / this.filas)
                uvBuffer.push(this.multiplicadorU * (1 - this.signoU * u));
                uvBuffer.push(this.multiplicadorV * (1 - this.signoV * v));
            }
        }

        // Buffer de indices de los triángulos
        let indexBuffer = [];

        for (let i = 0; i < this.filas; i++) {
            for (let j = 0; j <= this.columnas; j++) {
                indexBuffer.push(getVertexIndex(i, j, this.columnas));
                indexBuffer.push(getVertexIndex(i + 1, j, this.columnas));
                if (j == this.columnas && i < this.filas - 1) {
                    indexBuffer.push(getVertexIndex(i + 1, j, this.columnas));
                    indexBuffer.push(getVertexIndex(i, j, this.columnas) + 1);
                }
            }
        }

        // Creación e Inicialización de los buffers

        let webgl_position_buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, webgl_position_buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.bufferPos), gl.STATIC_DRAW);
        webgl_position_buffer.itemSize = 3;
        webgl_position_buffer.numItems = this.bufferPos.length / 3;

        let webgl_normal_buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, webgl_normal_buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.bufferNorm), gl.STATIC_DRAW);
        webgl_normal_buffer.itemSize = 3;
        webgl_normal_buffer.numItems = this.bufferPos.length / 3;

        let webgl_tangente_buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, webgl_tangente_buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.bufferTang), gl.STATIC_DRAW);
        webgl_normal_buffer.itemSize = 3;
        webgl_normal_buffer.numItems = this.bufferPos.length / 3;

        let webgl_uvs_buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, webgl_uvs_buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(uvBuffer), gl.STATIC_DRAW);
        webgl_uvs_buffer.itemSize = 2;
        webgl_uvs_buffer.numItems = uvBuffer.length / 2;


        let webgl_index_buffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, webgl_index_buffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indexBuffer), gl.STATIC_DRAW);
        webgl_index_buffer.itemSize = 1;
        webgl_index_buffer.numItems = indexBuffer.length;

        return {
            webgl_position_buffer,
            webgl_normal_buffer,
            webgl_tangente_buffer,
            webgl_uvs_buffer,
            webgl_index_buffer
        }
    }

    calcularNormalesDibujadas() {
        for (let i = 0; i <= this.bufferPos.length - 3; i += 3) {
            this.bufferNormDibujadas.push(this.bufferPos[i])
            this.bufferNormDibujadas.push(this.bufferPos[i + 1])
            this.bufferNormDibujadas.push(this.bufferPos[i + 2])

            this.bufferNormDibujadas.push(this.bufferPos[i] + this.bufferNorm[i])
            this.bufferNormDibujadas.push(this.bufferPos[i + 1] + this.bufferNorm[i + 1])
            this.bufferNormDibujadas.push(this.bufferPos[i + 2] + this.bufferNorm[i + 2])
        }
    }

    calcularBinormalesDibujadas() {
        for (let i = 0; i <= this.bufferPos.length - 3; i += 3) {
            this.bufferBinormDibujadas.push(this.bufferPos[i])
            this.bufferBinormDibujadas.push(this.bufferPos[i + 1])
            this.bufferBinormDibujadas.push(this.bufferPos[i + 2])

            this.bufferBinormDibujadas.push(this.bufferPos[i] + this.bufferBinorm[i])
            this.bufferBinormDibujadas.push(this.bufferPos[i + 1] + this.bufferBinorm[i + 1])
            this.bufferBinormDibujadas.push(this.bufferPos[i + 2] + this.bufferBinorm[i + 2])
        }
    }

    calcularTangentesDibujadas() {
        for (let i = 0; i <= this.bufferPos.length - 3; i += 3) {
            this.bufferTangDibujadas.push(this.bufferPos[i])
            this.bufferTangDibujadas.push(this.bufferPos[i + 1])
            this.bufferTangDibujadas.push(this.bufferPos[i + 2])

            this.bufferTangDibujadas.push(this.bufferPos[i] + this.bufferTang[i])
            this.bufferTangDibujadas.push(this.bufferPos[i + 1] + this.bufferTang[i + 1])
            this.bufferTangDibujadas.push(this.bufferPos[i + 2] + this.bufferTang[i + 2])
        }
    }
}