
export function Objeto3D (gl, glProgram){
    var trianglesVerticeBuffer = null
    var trianglesNormalBuffer = null
    var trianglesIndexBuffer = null
    // this.vertexBuffer = vertexBuffer;
    // this.indexBuffer = indexBuffer;
    // this.normalBuffer = normalBuffer;
    // this.color = null;
    // this.matriz_modelado = mat4.create();
    // this.matriz_normal = mat4.create();
    this.hijos = [];
    this.posicion = [0.0, 0.0, 0.0];
    this.Program = null;
    this.uniformBool = [];
    this.pos_camara = null;

    // set_posicion_camara(pos){
    //     this.pos_camara = pos;
    //     for (var i = 0; i < this.hijos.length; i++) {
    //         this.hijos[i].set_posicion_camara(pos);
    //     }
    // }

    // set_color(color){
    //     this.color = color;
    // }

    // getMatrizModelado(){
    //     return this.matriz_modelado;
    // }

    function Plano(ancho, largo) {

        this.getPos = function (u, v) {

            var x = (u - 0.5) * ancho;
            var z = (v - 0.5) * largo;
            return [x, 0, z];
        }

        this.getNrm = function (u, v) {
            return [0, 1, 0];
        }
    }

    function setupBuffers(superficie) {
        var pos = [];
        var normal = [];
        var r = 2;
        var rows = 200;
        var cols = 200;

        for (var i = 0; i < rows; i++) {
            for (var j = 0; j < cols; j++) {

                var u = i / rows
                var v = j / cols;
                var p = superficie.getPos(u, v);

                pos.push(p[0]);
                pos.push(p[1]);
                pos.push(p[2]);

                var n = superficie.getNrm(u, v);

                normal.push(n[0]);
                normal.push(n[1]);
                normal.push(n[2]);
            }

        }

        console.log(pos)

        trianglesVerticeBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, trianglesVerticeBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(pos), gl.STATIC_DRAW);


        trianglesNormalBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, trianglesNormalBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normal), gl.STATIC_DRAW);

        var index = [];

        for (var i = 0; i < rows - 1; i++) {
            index.push(i * cols);
            for (var j = 0; j < cols - 1; j++) {
                index.push(i * cols + j);
                index.push((i + 1) * cols + j);
                index.push(i * cols + j + 1);
                index.push((i + 1) * cols + j + 1);
            }
            index.push((i + 1) * cols + cols - 1);
        }


        trianglesIndexBuffer = gl.createBuffer();
        trianglesIndexBuffer.number_vertex_point = index.length;
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, trianglesIndexBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(index), gl.STATIC_DRAW);
    }

    this.dibujar = () => {
        console.log("llega")
        setupBuffers(new Plano(1,1))

        var vertexPositionAttribute = gl.getAttribLocation(glProgram, "aVertexPosition");
        gl.enableVertexAttribArray(vertexPositionAttribute);
        gl.bindBuffer(gl.ARRAY_BUFFER, trianglesVerticeBuffer);
        gl.vertexAttribPointer(vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);

        var vertexNormalAttribute = gl.getAttribLocation(glProgram, "aVertexNormal");
        gl.enableVertexAttribArray(vertexNormalAttribute);
        gl.bindBuffer(gl.ARRAY_BUFFER, trianglesNormalBuffer);
        gl.vertexAttribPointer(vertexNormalAttribute, 3, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, trianglesIndexBuffer);
        gl.drawElements(gl.TRIANGLE_STRIP, trianglesIndexBuffer.number_vertex_point, gl.UNSIGNED_SHORT, 0);
    }


    // agregarHijo(hijo){
    //     this.hijos.push(hijo);
    // }

    // quitarHijo(hijo){
    //     for (var i = 0; i < this.hijos.length; i++) {
    //         if (this.hijos[i] == hijo) {
    //             this.hijos.splice(i, 1);
    //             break;
    //         }
    //     }
    // }
    // obtenerHijos(){
    //     return this.hijos;
    // }
}
