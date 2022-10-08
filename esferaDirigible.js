import {Objeto3D} from "./objeto3d.js"
import {crearMalla} from "./geometria.js"

export class EsferaDirigible extends Objeto3D{
    constructor(filas, columnas, radio){
        super(filas, columnas);
        this.radio = radio
        this.mallaDeTriangulos = crearMalla(this)
        this.control = new ControlRaton()
    }

    obtenerMalla = () => {
        return this.mallaDeTriangulos;
    }

    obtenerPosicion(u, v) {

        var x = this.radio * Math.sin(u * Math.PI) * Math.cos(v * 2 * Math.PI);
        var y = this.radio * Math.sin(u * Math.PI) * Math.sin(v * 2 * Math.PI);
        var z = this.radio * Math.cos(u * Math.PI);
        return [x, y, z];
    }

    actualizar(){
        this.control.actualizar()
        const posicion = this.control.obtener_posicion()
        this.setearPosicion(posicion.x, posicion.y, posicion.z)
    }

    obtenerNormal(u, v) {
        var p0 = this.obtenerPosicion(u, v);
        var p1 = this.obtenerPosicion(u + 0.001, v);
        var p2 = this.obtenerPosicion(u, v + 0.001);
        var v1 = [p1[0] - p0[0], p1[1] - p0[1], p1[2] - p0[2]];
        var v2 = [p2[0] - p0[0], p2[1] - p0[1], p2[2] - p0[2]];

        var x = v1[1] * v2[2] - v1[2] * v2[1];
        var y = -(v1[0] * v2[2] - v1[2] * v2[0]);
        var z = v1[0] * v2[1] - v1[1] * v2[0];
        return p0;
    }
}

function ControlRaton() {

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
    var ALFA = Math.PI / 4;
    var BETA = Math.PI / 2;

    const FACTOR_VELOCIDAD = 0.01;
    const RADIO = 5;


    // seteo handlers del raton
    $("body").mousemove(function (e) {
        MOUSE.x = e.clientX || e.pageX;
        MOUSE.y = e.clientY || e.pageY
    });

    $('body').mousedown(function (event) {
        IS_MOUSE_DOWN = true;
    });

    $('body').mouseup(function (event) {
        IS_MOUSE_DOWN = false;
    });

    $('body').on("wheel",function (event) {
        WHEEL_SCROLL += event.originalEvent.deltaY / 12;
        WHEEL_SCROLL = Math.max(0.01, Math.min(6, WHEEL_SCROLL));
    });

    // obtener posicion a partir de los valores Alfa y Beta
    this.obtener_posicion = function () {
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


const FACTOR_VELOCIDAD = 0.001;
const RADIO = 0.1;
var JOYSTICK_CONTROLLER = null;