var vec3 = glMatrix.vec3;

//shaders = [{vs1,fs1},{vs2,fs2}]
class ShaderManager {
    constructor(shaders, glContext) {
        console.log(shaders)

        this.gl = glContext
        this.programs = {}

        this.initShaders(shaders)
    }

    initShaders(shaders) {
        this.crearShader(shaders[0], 'phong');
        this.crearShader(shaders[1], 'curvas');
        this.crearShader(shaders[2], 'fuego');

        console.log(this.programs["fuego"])
    }

    crearShader(shader, id) {
        const { gl } = this

        const vs_source = shader.vs
        const fs_source = shader.fs

        function makeShader(src, type) {
            //compile the vertex shader
            var shader = gl.createShader(type);
            gl.shaderSource(shader, src);
            gl.compileShader(shader);

            if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
                console.log("Error compiling shader: " + id + " " + gl.getShaderInfoLog(shader));
            }
            return shader;
        }

        //compile shaders    
        const vertexShader = makeShader(vs_source, gl.VERTEX_SHADER);
        const fragmentShader = makeShader(fs_source, gl.FRAGMENT_SHADER);

        //create program
        let glProgram = gl.createProgram();

        //attach and link shaders to the program
        gl.attachShader(glProgram, vertexShader);
        gl.attachShader(glProgram, fragmentShader);
        gl.linkProgram(glProgram);

        if (!gl.getProgramParameter(glProgram, gl.LINK_STATUS)) {
            alert("Unable to initialize the shader program.");
        }
        glProgram.id = id

        this.programs[id] = glProgram
        this.inicializarShader(glProgram)
    }

    inicializarShader(glProgram) {
        const { gl } = this

        gl.useProgram(glProgram);
        glProgram.modelMatrixUniform = gl.getUniformLocation(glProgram, "modelMatrix");
        glProgram.normalMatrixUniform = gl.getUniformLocation(glProgram, "normalMatrix");
        glProgram.projMatrixUniform = gl.getUniformLocation(glProgram, "projMatrix");
        glProgram.viewMatrixUniform = gl.getUniformLocation(glProgram, "viewMatrix");

        
        glProgram.vertexPositionAttribute = gl.getAttribLocation(glProgram, "aVertexPosition");
        gl.enableVertexAttribArray(glProgram.vertexPositionAttribute);
        
        if (glProgram.id !== 'curvas') {
            glProgram.rendering = gl.getUniformLocation(glProgram, "renderColor");
            glProgram.vertexNormalAttribute = gl.getAttribLocation(glProgram, "aVertexNormal");
            gl.enableVertexAttribArray(glProgram.vertexNormalAttribute);

            if (glProgram.id == "phong" || glProgram.id == "fuego") {
                glProgram.colorDifusoUniform = gl.getUniformLocation(glProgram, "uColorDifuso");

                glProgram.vertexUVAttribute = gl.getAttribLocation(glProgram, "aUv");
                gl.enableVertexAttribArray(glProgram.vertexUVAttribute);

                glProgram.posCamaraUniform = gl.getUniformLocation(glProgram, "posCamaraMundo");

                glProgram.KaUniform = gl.getUniformLocation(glProgram, "Ka");
                glProgram.KdUniform = gl.getUniformLocation(glProgram, "Kd");
                glProgram.KsUniform = gl.getUniformLocation(glProgram, "Ks");
                glProgram.glossinessUniform = gl.getUniformLocation(glProgram, "glossiness");
            }
        }
    }

    getProgram = (id) => {
        if (this.programs.hasOwnProperty(id)) {
            return this.programs[id];
        } else {
            const msg = `Unexisting shader program "${fileName}"`;
            console.error(msg)
            throw new Error(msg);
        }
    }

    actualizarMatrices(viewMatrix, projMatrix) {
        const { gl } = this
        for (const id in this.programs) {
            const program = this.programs[id]

            gl.useProgram(program);

            gl.uniformMatrix4fv(program.viewMatrixUniform, false, viewMatrix);
            gl.uniformMatrix4fv(program.projMatrixUniform, false, projMatrix);
        }
    }

    actualizarPosCamara(posCamaraMundo) {
        const { gl } = this
        for (const id in this.programs) {
            if (id == 'phong') {
                const program = this.programs[id]

                gl.useProgram(program);
                // console.log(posCamaraMundo)
                gl.uniform3fv(program.posCamaraUniform, posCamaraMundo);
            }
        }
    }
}

export default ShaderManager