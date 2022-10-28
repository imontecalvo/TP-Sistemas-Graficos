import { Esfera, Plano } from "./esfera.js";
import { Objeto3D } from "./objeto3d.js";
import { Escena } from "./escena.js";
var tiempo = 0;
var mat4 = glMatrix.mat4;
var vec3 = glMatrix.vec3;
var escena = null;

var gl = null,
    canvas = null,

    glProgram = null,
    fragmentShader = null,
    vertexShader = null,
    fragmentShaderCurva = null,
    vertexShaderCurva = null;

var vertexPositionAttribute = null,
    trianglesVerticeBuffer = null,
    vertexNormalAttribute = null,
    trianglesNormalBuffer = null,
    trianglesIndexBuffer = null;

var glProgramCurva = null
var vs_source
var fs_source

var vs_src_curva
var fs_src_curva

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
    // mat4.rotate(modelMatrix, modelMatrix, 0.78, [1.0, 0.0, 0.0]);

    // mat4.identity(viewMatrix);
    mat4.translate(viewMatrix, viewMatrix, [0., 0, -20.0]);
    // mat4.rotate(viewMatrix, viewMatrix, Math.PI/4, [0, 0, 1]);
}

function loadShaders() {

    $.when(loadVS(), loadFS(), loadVSCurva(), loadFSCurva()).done(function (res1, res2) {
        //this code is executed when all ajax calls are done     
        initWebGL();
    });

    function loadVS() {
        return $.ajax({
            url: "./shaders/vertex.glsl",
            success: function (result) {
                vs_source = result;
            }
        });
    }

    function loadFS() {
        return $.ajax({
            url: "./shaders/fragment.glsl",
            success: function (result) {
                fs_source = result;
            }
        });
    }

    function loadVSCurva() {
        return $.ajax({
            url: "./shaders/vlinea.glsl",
            success: function (result) {
                vs_src_curva = result;
            }
        });
    }

    function loadFSCurva() {
        return $.ajax({
            url: "./shaders/flinea.glsl",
            success: function (result) {
                fs_src_curva = result;
            }
        });
    }
}




function initShaders() {
    //get shader source
    // var fs_source = document.getElementById('shader-fs').innerHTML,
    // vs_source = document.getElementById('shader-vs').innerHTML;


    //compile shaders    
    vertexShader = makeShader(vs_source, gl.VERTEX_SHADER);
    fragmentShader = makeShader(fs_source, gl.FRAGMENT_SHADER);

    vertexShaderCurva = makeShader(vs_src_curva, gl.VERTEX_SHADER);
    fragmentShaderCurva = makeShader(fs_src_curva, gl.FRAGMENT_SHADER);

    //create program
    glProgram = gl.createProgram();

    glProgramCurva = gl.createProgram()

    //attach and link shaders to the program
    gl.attachShader(glProgram, vertexShader);
    gl.attachShader(glProgram, fragmentShader);
    gl.linkProgram(glProgram);

    if (!gl.getProgramParameter(glProgram, gl.LINK_STATUS)) {
        alert("Unable to initialize the shader program.");
    }

    //...

    gl.attachShader(glProgramCurva, vertexShaderCurva);
    gl.attachShader(glProgramCurva, fragmentShaderCurva);
    gl.linkProgram(glProgramCurva);

    if (!gl.getProgramParameter(glProgramCurva, gl.LINK_STATUS)) {
        alert("Unable to initialize the shader program.");
    }


    //use program
    gl.useProgram(glProgram);
    gl.useProgram(glProgramCurva);
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
    gl.useProgram(glProgram);
    var viewMatrixUniform = gl.getUniformLocation(glProgram, "viewMatrix");
    var projMatrixUniform = gl.getUniformLocation(glProgram, "projMatrix");
    var normalMatrixUniform = gl.getUniformLocation(glProgram, "normalMatrix");

    gl.uniformMatrix4fv(viewMatrixUniform, false, viewMatrix);
    gl.uniformMatrix4fv(projMatrixUniform, false, projMatrix);
    gl.uniformMatrix4fv(normalMatrixUniform, false, normalMatrix);

    gl.useProgram(glProgramCurva);
    var viewMatrixUniformCurva = gl.getUniformLocation(glProgramCurva, "viewMatrix");
    var projMatrixUniformCurva = gl.getUniformLocation(glProgramCurva, "projMatrix");
    gl.uniformMatrix4fv(viewMatrixUniformCurva, false, viewMatrix);
    gl.uniformMatrix4fv(projMatrixUniformCurva, false, projMatrix);
}

function drawScene() {
    if (app.cambiosPendientes) {
        app.cambiosPendientes = false
        app.moverMunicion = false
        app.disparando = false
        app.tiempo = 0
        app.anguloCatapulta = 0
        tiempo = 0

        escena = new Escena()
    }

    escena.actualizar()
    viewMatrix = escena.obtenerVista()
    setupVertexShaderMatrix();
    escena.dibujar()
}

function tick() {
    // console.log(app.disparando,app.anguloCatapulta<Math.PI/2 )
    // app.tiempo = 0
    // $('body').on("keydown", function (event) {
    //     switch (event.key) {
    //         case "1":
    //             app.camara = "Orbital";

    //         case "2":
    //             app.camara = "Orbital catapulta";


    //         case "3":
    //             app.camara = "Primera persona";

    //     }

    // });

    if (app.disparando) {
        tiempo += 0.01
        if (app.anguloCatapulta < Math.PI / 2) {
            app.anguloCatapulta = (7 * tiempo ** 2) * 0.7 * Math.PI / 2
            app.tiempo = 0
            app.velInicial = app.radioMC * (9.8) * (Math.PI / 2) * tiempo
            // app.anguloCatapulta = 0
            // console.log("disparando", app.anguloCatapulta)
        } else {
            app.tiempo += 0.01
            app.moverMunicion = true
            // console.log(app.tiempo)
            // console.log(app.moverMunicion, app.velInicial)
        }
    }
    // console.log(app)
    requestAnimationFrame(tick);
    drawScene();
    // animate();
}

window.onload = loadShaders;

export { gl, glProgram, glProgramCurva }