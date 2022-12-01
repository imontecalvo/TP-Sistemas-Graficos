import { Escena } from "./escena.js";
import initMateriales from "./utils/materiales/materialManager.js";
import ShadersManager from "./utils/shaderManager.js";

var shadersManager;

var tiempo = 0;
var mat4 = glMatrix.mat4;
var vec3 = glMatrix.vec3;
var escena = null;

var gl = null,
    canvas = null

var glProgramCurva = null

//Shader sources
var vs_source
var fs_source
var vs_src_curva
var fs_src_curva
var fs_src_fuego
var vs_src_fuego

var modelMatrix = mat4.create();
var viewMatrix = mat4.create();
var projMatrix = mat4.create();
var rotate_angle = -1.57078;


function initWebGL() {
    canvas = document.getElementById("my-canvas");

    try {
        gl = canvas.getContext("webgl");

    } catch (e) {
        alert("Error: Your browser does not appear to support WebGL.");
    }

    if (gl) {
        shadersManager = new ShadersManager([{ vs: vs_source, fs: fs_source }, { vs: vs_src_curva, fs: fs_src_curva }, {vs: vs_source, fs:fs_src_fuego}], gl);
        glProgramCurva = shadersManager.getProgram("curvas");
        initMateriales()
        // setupVertexShaderMatrix();
        setupWebGL();
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

    $.when(loadVS(), loadFS(), loadVSCurva(), loadFSCurva(), loadVSFuego(), loadFSFuego()).done(function (res1, res2) {
        //this code is executed when all ajax calls are done     
        initWebGL();
    });

    function loadVS() {
        return $.ajax({
            url: "./shaders/vs-default.glsl",
            success: function (result) {
                vs_source = result;
            }
        });
    }

    function loadFS() {
        return $.ajax({
            url: "./shaders/fs-phong.glsl",
            success: function (result) {
                fs_source = result;
            }
        });
    }

    function loadVSCurva() {
        return $.ajax({
            url: "./shaders/vs-curvas.glsl",
            success: function (result) {
                vs_src_curva = result;
            }
        });
    }

    function loadFSCurva() {
        return $.ajax({
            url: "./shaders/fs-curvas.glsl",
            success: function (result) {
                fs_src_curva = result;
            }
        });
    }

    function loadFSFuego() {
        return $.ajax({
            url: "./shaders/fs-fuego.glsl",
            success: function (result) {
                fs_src_fuego = result;
            }
        });
    }

    function loadVSFuego() {
        return $.ajax({
            url: "./shaders/vs-fuego.glsl",
            success: function (result) {
                vs_src_fuego = result;
            }
        });
    }

}


function setupVertexShaderMatrix() {
    shadersManager.actualizarMatrices(viewMatrix, projMatrix);
    shadersManager.actualizarPosCamara(escena.obtenerPosCamara());
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
    if (app.disparando) {
        tiempo += 0.01
        if (app.anguloCatapulta < Math.PI / 2) {
            app.anguloCatapulta = (7 * tiempo ** 2) * 0.7 * Math.PI / 2
            app.tiempo = 0
            app.velInicial = app.radioMC * (9.8) * (Math.PI / 2) * tiempo

        } else {
            app.tiempo += 0.01
            app.moverMunicion = true
        }
    }

    requestAnimationFrame(tick);
    drawScene();
}

window.onload = loadShaders;

export { gl, glProgramCurva, shadersManager }