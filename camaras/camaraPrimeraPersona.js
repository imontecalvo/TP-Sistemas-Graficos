import { Objeto3D } from "../objeto3d.js";
import { Esfera } from "../elementosEscena/esfera.js";
import { Caja } from "../elementosEscena/caja.js";

var mat4 = glMatrix.mat4;
var vec3 = glMatrix.vec3;

export class CamaraPrimeraPersona {
    constructor() {
        this.persona = new Objeto3D()
        this.control = new ControlFPCam()
        this.persona.trasladar(0, 2, 20)
    }

    actualizar() {
        this.control.actualizar()
    }

    generarVista() {
        const data = this.control.obtenerPosicionPersona()
        const posPreviaPersona = this.persona.obtenerPosicion()

        this.persona.resetearMatriz()
        this.persona.trasladar(posPreviaPersona[0], posPreviaPersona[1], posPreviaPersona[2])
        this.persona.rotarY(data.angulo)
        this.persona.trasladar(data.x, data.y,data.z)
        this.control.resetCoords()

        var posFoco = this.control.obtenerPosicionFoco();
        const posPersona = this.persona.obtenerPosicion()

        var matrizVista = mat4.create();
        var ojo = posPersona
        var centro = vec3.fromValues(posPersona[0] + posFoco.x, posPersona[1] + posFoco.y, posPersona[2] + posFoco.z);

        mat4.lookAt(matrizVista,
            ojo,
            centro,
            vec3.fromValues(0, 1, 0)
        );

        return matrizVista;
    }
}


function ControlFPCam() {

    var MOUSE = {
        x: 0,
        y: 0
    };
    var PREV_MOUSE = {
        x: 0,
        y: 0
    };

    var WHEEL_SCROLL = 1;

    var IS_MOUSE_DOWN = false;
    // var ALFA = 0;
    var ALFA = Math.PI;
    var BETA = Math.PI / 2;

    const FACTOR_VELOCIDAD = 0.005;
    const RADIO = 4;

    var DERECHA = 0;
    var ADELANTE = 0;

    var puntosPorArrastre = 0

    // seteo handlers del raton
    $("canvas").mousemove(function (e) {
        if (IS_MOUSE_DOWN) {
            MOUSE.x = e.clientX || e.pageX;
            MOUSE.y = e.clientY || e.pageY
            if (puntosPorArrastre == 0) {
                PREV_MOUSE.x = MOUSE.x;
                PREV_MOUSE.y = MOUSE.y;
            }
            puntosPorArrastre += 1

        } else {
            puntosPorArrastre = 0
        }
    });

    $('canvas').mousedown(function (event) {
        IS_MOUSE_DOWN = true;
    });

    $('canvas').mouseup(function (event) {
        IS_MOUSE_DOWN = false;
    });

    $('canvas').on("wheel", function (event) {
        WHEEL_SCROLL += event.originalEvent.deltaY / 100;
        WHEEL_SCROLL = Math.max(0.01, Math.min(6, WHEEL_SCROLL));
    });

    $('body').on("keydown", function (event) {
        switch (event.key) {
            case "a":
                DERECHA += 0.5
                break;

            case "d":
                DERECHA -= 0.5
                break;

            case "w":
                ADELANTE += 0.5
                break;
            case "s":
                ADELANTE -= 0.5
                break;
        }

    });

    this.obtenerPosicionPersona = () => {
        return {
            x: DERECHA,
            y: 0,
            z: ADELANTE,
            angulo: ALFA
        }
    }

    this.resetCoords = () => {
        DERECHA = 0
        ADELANTE = 0
    }

    // obtener posicion a partir de los valores Alfa y Beta
    this.obtenerPosicionFoco = function () {
        return {
            x: RADIO * Math.sin(ALFA) * Math.sin(BETA),
            y: RADIO * Math.cos(BETA),
            z: RADIO * Math.cos(ALFA) * Math.sin(BETA),
            scroll: WHEEL_SCROLL
        }
    };

    // cambiar valores de Alfa y Beta segun el movimiento del mouse
    this.actualizar = function () {

        if (!IS_MOUSE_DOWN) {
            return;
        }

        if (puntosPorArrastre > 1) {
            var deltaX = 0;
            var deltaY = 0;

            if (PREV_MOUSE.x) {
                deltaX = MOUSE.x - PREV_MOUSE.x;
            }
            if (PREV_MOUSE.y) {
                deltaY = MOUSE.y - PREV_MOUSE.y;
            }

            PREV_MOUSE.x = MOUSE.x;
            PREV_MOUSE.y = MOUSE.y;

            ALFA = ALFA + deltaX * FACTOR_VELOCIDAD;
            BETA = BETA + deltaY * FACTOR_VELOCIDAD;

            if (BETA <= 0) {
                BETA = 0.001;
            }
            if (BETA > Math.PI) {
                BETA = Math.PI - 0.001;
            }

        }

    }

}