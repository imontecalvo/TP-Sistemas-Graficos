import { Esfera, Plano } from "./esfera.js";
import { Objeto3D } from "./objeto3d.js";
import { Escena } from "./escena.js";

var mat4 = glMatrix.mat4;
var vec3 = glMatrix.vec3;
var escena = null;

var gl = null,
    canvas = null,

    glProgram = null,
    fragmentShader = null,
    vertexShader = null;

var vertexPositionAttribute = null,
    trianglesVerticeBuffer = null,
    vertexNormalAttribute = null,
    trianglesNormalBuffer = null,
    trianglesIndexBuffer = null;

var modelMatrix = mat4.create();
var viewMatrix = mat4.create();
var projMatrix = mat4.create();
var normalMatrix = mat4.create();
var rotate_angle = -1.57078;

// var { vertices, normals, indices } = setupBuffers(new Plano(1,1));
// var plano = new Objeto3D(buffers.webgl_position_buffer,buffers.webgl_normal_buffer, buffers.webgl_index_buffer)


function initWebGL() {

    canvas = document.getElementById("my-canvas");

    try {
        gl = canvas.getContext("webgl");

    } catch (e) {
        alert("Error: Your browser does not appear to support WebGL.");
    }

    if (gl) {

        setupWebGL();
        initShaders();
        // setupBuffers();
        setupVertexShaderMatrix();
        tick();

    } else {
        alert("Error: Your browser does not appear to support WebGL.");
    }

}


function setupWebGL() {
    escena = new Escena()

    gl.enable(gl.DEPTH_TEST);
    //set the clear color
    gl.clearColor(0.1, 0.1, 0.2, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    gl.viewport(0, 0, canvas.width, canvas.height);

    // Matrix de Proyeccion Perspectiva

    mat4.perspective(projMatrix, 45, canvas.width / canvas.height, 0.1, 100.0);

    mat4.identity(modelMatrix);
    mat4.rotate(modelMatrix, modelMatrix, 0.78, [1.0, 0.0, 0.0]);

    mat4.identity(viewMatrix);
    mat4.translate(viewMatrix, viewMatrix, [0.0, 0.0, -5.0]);
}


function initShaders() {
    //get shader source
    var fs_source = document.getElementById('shader-fs').innerHTML,
        vs_source = document.getElementById('shader-vs').innerHTML;

    //compile shaders    
    vertexShader = makeShader(vs_source, gl.VERTEX_SHADER);
    fragmentShader = makeShader(fs_source, gl.FRAGMENT_SHADER);

    //create program
    glProgram = gl.createProgram();

    //attach and link shaders to the program
    gl.attachShader(glProgram, vertexShader);
    gl.attachShader(glProgram, fragmentShader);
    gl.linkProgram(glProgram);

    if (!gl.getProgramParameter(glProgram, gl.LINK_STATUS)) {
        alert("Unable to initialize the shader program.");
    }

    //use program
    gl.useProgram(glProgram);
}

function makeShader(src, type) {
    //compile the vertex shader
    var shader = gl.createShader(type);
    gl.shaderSource(shader, src);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.log("Error compiling shader: " + gl.getShaderInfoLog(shader));
    }
    return shader;
}


function setupVertexShaderMatrix() {
    // Objeto3D.MODEL_MATRIX_UNIFORM = gl.getUniformLocation(glProgram, "uModelMatrix");
    // glProgram.modelMatrixUniform = gl.getUniformLocation(glProgram, "modelMatrix");
    // glProgram.normalMatrixUniform = gl.getUniformLocation(glProgram, "normalMatrix");
    // var modelMatrixUniform = gl.getUniformLocation(glProgram, "modelMatrix");
    var viewMatrixUniform = gl.getUniformLocation(glProgram, "viewMatrix");
    var projMatrixUniform = gl.getUniformLocation(glProgram, "projMatrix");
    var normalMatrixUniform = gl.getUniformLocation(glProgram, "normalMatrix");

    // gl.uniformMatrix4fv(modelMatrixUniform, false, modelMatrix);
    gl.uniformMatrix4fv(viewMatrixUniform, false, viewMatrix);
    gl.uniformMatrix4fv(projMatrixUniform, false, projMatrix);
    gl.uniformMatrix4fv(normalMatrixUniform, false, normalMatrix);
}

function drawScene() {
    // escena.actualizar()
    // viewMatrix = escena.obtenerVista()
    setupVertexShaderMatrix();
    // escena.dibujar()

    // var esfera = new Esfera(100,100,1)
    // esfera.trasladar(1,0,0)
    // esfera.trasladar(0,0,-2)
    // var esfera2 = new Esfera(100,100,0.5)
    // esfera.trasladar(1,3,3)
    // esfera2.trasladar(-4,0,0)
    var plano = new Plano(2,2,100,100)
    // plano.trasladar(0,0,0)
    plano.dibujar()
    // esfera.dibujar()
    // esfera2.dibujar()
}


function animate() {

    rotate_angle += 0.01;
    mat4.identity(modelMatrix);
    mat4.rotate(modelMatrix, modelMatrix, rotate_angle, [1.0, 0.0, 1.0]);


    mat4.identity(normalMatrix);
    mat4.multiply(normalMatrix, viewMatrix, modelMatrix);
    mat4.invert(normalMatrix, normalMatrix);
    mat4.transpose(normalMatrix, normalMatrix);

}

function tick() {

    requestAnimationFrame(tick);
    drawScene();
    // animate();
}

window.onload = initWebGL;

export {gl, glProgram}