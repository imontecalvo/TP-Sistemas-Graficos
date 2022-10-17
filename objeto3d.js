import { gl, glProgram, glProgramCurva } from "./web-gl.js";
var mat4 = glMatrix.mat4;
var vec3 = glMatrix.vec3;

export class Objeto3D {
    static MODEL_MATRIX_UNIFORM = null;
    constructor() {
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
        gl.useProgram(glProgram);
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
            
            if (this.bufferNormDibujadas){
                const color = [].concat(this.bufferNorm.map(x => [1,1,1]))
                gl.useProgram(glProgramCurva);
                var trianglesVerticeBuffer = gl.createBuffer();
                gl.bindBuffer(gl.ARRAY_BUFFER, trianglesVerticeBuffer);
                gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.bufferNormDibujadas), gl.STATIC_DRAW);
                // console.log("norm dibujar: ", this.bufferNormDibujadas)
                var trianglesColorBuffer = gl.createBuffer();
                gl.bindBuffer(gl.ARRAY_BUFFER, trianglesColorBuffer);
                gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.bufferNorm), gl.STATIC_DRAW);
        
                var vertexPositionAttribute = gl.getAttribLocation(glProgramCurva, "aVertexPosition");
                gl.enableVertexAttribArray(vertexPositionAttribute);
                gl.bindBuffer(gl.ARRAY_BUFFER, trianglesVerticeBuffer);
                gl.vertexAttribPointer(vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);
        
                var vertexColorAttribute = gl.getAttribLocation(glProgramCurva, "aVertexColor");
                gl.enableVertexAttribArray(vertexColorAttribute);
                gl.bindBuffer(gl.ARRAY_BUFFER, trianglesColorBuffer);
                gl.vertexAttribPointer(vertexColorAttribute, 3, gl.FLOAT, false, 0, 0);
                
                gl.drawArrays(gl.LINES, 0, 2*this.bufferNormDibujadas.length/3);
            }
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

    crearMalla() {
        function getVertexIndex(i, j, columnas) {
            return i * (columnas + 1) + j;
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

    calcularNormalesDibujadas(){
        for (let i = 0; i < this.bufferPos.length-3; i+=3) {
            this.bufferNormDibujadas.push(this.bufferPos[i])
            this.bufferNormDibujadas.push(this.bufferPos[i+1])
            this.bufferNormDibujadas.push(this.bufferPos[i+2])

            this.bufferNormDibujadas.push(this.bufferPos[i] + this.bufferNorm[i])
            this.bufferNormDibujadas.push(this.bufferPos[i+1] + this.bufferNorm[i+1])
            this.bufferNormDibujadas.push(this.bufferPos[i+2] + this.bufferNorm[i+2])
        }
    }
}