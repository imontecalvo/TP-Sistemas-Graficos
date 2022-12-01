import { gl, glProgramCurva } from "./web-gl.js";
var mat4 = glMatrix.mat4;
var vec4 = glMatrix.vec4;

export class Objeto3D {
    static MODEL_MATRIX_UNIFORM = null;
    constructor(material=window.materiales.ROJO) {
        this.mallaDeTriangulos = null;
        this.matrizModelado = mat4.create();
        this.hijos = []
        this.oculto = false
        this.material = material
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
            
            const glProgram = this.material.activar(renderColor)
            // console.log(glProgram)
            gl.useProgram(glProgram);

            gl.uniformMatrix4fv(glProgram.modelMatrixUniform, false, mat);
            gl.uniformMatrix4fv(glProgram.normalMatrixUniform, false, matNorm);

            gl.bindBuffer(gl.ARRAY_BUFFER, this.mallaDeTriangulos.webgl_position_buffer);
            gl.vertexAttribPointer(glProgram.vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);

            gl.bindBuffer(gl.ARRAY_BUFFER, this.mallaDeTriangulos.webgl_normal_buffer);
            gl.vertexAttribPointer(glProgram.vertexNormalAttribute, 3, gl.FLOAT, false, 0, 0);

            gl.bindBuffer(gl.ARRAY_BUFFER, this.mallaDeTriangulos.webgl_uvs_buffer);
            gl.vertexAttribPointer(glProgram.vertexUVAttribute, 2, gl.FLOAT, false, 0, 0);

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
        // const color = [].concat(this.bufferNorm.map(x => [1, 1, 1]))
        gl.useProgram(glProgramCurva);

        var modelMatrixUniform = gl.getUniformLocation(glProgramCurva, "modelMatrix");
        gl.uniformMatrix4fv(modelMatrixUniform, false, mat);


        var trianglesVerticeBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, trianglesVerticeBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.bufferNormDibujadas), gl.STATIC_DRAW);
        var trianglesColorBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, trianglesColorBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.bufferNorm), gl.STATIC_DRAW);

        var vertexPositionAttribute = gl.getAttribLocation(glProgramCurva, "aVertexPosition");
        gl.enableVertexAttribArray(vertexPositionAttribute);
        gl.bindBuffer(gl.ARRAY_BUFFER, trianglesVerticeBuffer);
        gl.vertexAttribPointer(vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);

        // var vertexColorAttribute = gl.getAttribLocation(glProgramCurva, "aVertexColor");
        // gl.enableVertexAttribArray(vertexColorAttribute);
        // gl.bindBuffer(gl.ARRAY_BUFFER, trianglesColorBuffer);
        // gl.vertexAttribPointer(vertexColorAttribute, 3, gl.FLOAT, false, 0, 0);

        gl.drawArrays(gl.LINES, 0, 2 * this.bufferNormDibujadas.length / 3);
    }


    crearMalla() {
        function getVertexIndex(i, j, columnas) {
            return i * (columnas + 1) + j;
        }

        let uvBuffer = []

        for (var i = 0; i <= this.filas; i++) {
            for (var j = 0; j <= this.columnas; j++) {
                var u=j/this.columnas;
                var v=i/this.filas;

                uvBuffer.push(u);
                uvBuffer.push(v);
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
}