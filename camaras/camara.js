import { CamaraOrbital } from "./camaraOrbital.js";
import { CamaraPrimeraPersona } from "./camaraPrimeraPersona.js";

var vec3 = glMatrix.vec3;
var mat4 = glMatrix.mat4;

export class Camara{
    constructor(){
        this.orbital = new CamaraOrbital()
        this.orbitalCatapulta = new CamaraOrbital()
        this.primeraPersona = new CamaraPrimeraPersona()

        this.control = ControlTipoCam()
    }

    actualizar(){
        if (app.camara == "Orbital") this.orbital.actualizar()
        else if (app.camara == "Orbital catapulta") this.orbitalCatapulta.actualizar()
        else if (app.camara == "Primera persona") this.primeraPersona.actualizar()
    }

    generarVista(data){
        if (app.camara == "Orbital") return this.orbital.generarVista(data.origen)
        else if (app.camara == "Orbital catapulta") return this.orbitalCatapulta.generarVista(data.posCatapulta)
        else if (app.camara == "Primera persona") return this.primeraPersona.generarVista()
    }
}

function ControlTipoCam(){
    $('body').on("keydown", function (event) {
        switch (event.key) {
            case "1":
                app.camara = "Orbital";
                app.refreshGUI()
                break;

            case "2":
                app.camara = "Orbital catapulta";
                app.refreshGUI()
                break;


            case "3":
                app.camara = "Primera persona";
                app.refreshGUI()
                break;
        }
    });
}

// export class CamaraOrbital {
//     constructor() {
//         this.control = new ControlRaton()
//         this.position = vec3.create()
//     }

//     actualizar() {
//         this.control.actualizar()
//     }

//     generarVista(foco) {

//         var posObserver = this.control.obtener_posicion();
//         var scroll = posObserver.scroll;

//         var matrizVista = mat4.create();
//         var ojo = vec3.fromValues(foco[0]+scroll*posObserver.x,foco[1]+scroll*posObserver.y,foco[2]+scroll*posObserver.z);
//         var centro = vec3.fromValues(foco[0], foco[1], foco[2]);

//         mat4.lookAt(matrizVista,
//             ojo,
//             centro,
//             vec3.fromValues(0, 1, 0)
//         );

//         return matrizVista;
//     }

// }

// function ControlRaton() {

//     var MOUSE = {
//         x: 0,
//         y: 0
//     };
//     var PREV_MOUSE = {
//         x: 0,
//         y: 0
//     };

//     var WHEEL_SCROLL = 1;

//     var IS_MOUSE_DOWN = false;
//     var ALFA = Math.PI / 4;
//     var BETA = Math.PI / 2;

//     const FACTOR_VELOCIDAD = 0.01;
//     const RADIO = 20;


//     // seteo handlers del raton
//     $("body").mousemove(function (e) {
//         if (IS_MOUSE_DOWN){
//             MOUSE.x = e.clientX || e.pageX;
//             MOUSE.y = e.clientY || e.pageY
//         }
//     });

//     $('body').mousedown(function (event) {
//         IS_MOUSE_DOWN = true;
//     });

//     $('body').mouseup(function (event) {
//         IS_MOUSE_DOWN = false;
//     });
    
//     $('body').on("wheel", function (event) {
//         WHEEL_SCROLL += event.originalEvent.deltaY / 100;
//         WHEEL_SCROLL = Math.max(0.01, Math.min(6, WHEEL_SCROLL));
//     });

//     // obtener posicion a partir de los valores Alfa y Beta
//     this.obtener_posicion = function () {
//         return {
//             x: RADIO * Math.sin(ALFA) * Math.sin(BETA),
//             y: RADIO * Math.cos(BETA),
//             z: RADIO * Math.cos(ALFA) * Math.sin(BETA),
//             scroll: WHEEL_SCROLL
//         }
//     };

//     // cambiar valores de Alfa y Beta segun el movimiento del mouse
//     this.actualizar = function () {

//         if (!IS_MOUSE_DOWN) {
//             return;
//         }

//         var deltaX = 0;
//         var deltaY = 0;

//         if (PREV_MOUSE.x) {
//             deltaX = MOUSE.x - PREV_MOUSE.x;
//         }
//         if (PREV_MOUSE.y) {
//             deltaY = MOUSE.y - PREV_MOUSE.y;
//         }

//         PREV_MOUSE.x = MOUSE.x;
//         PREV_MOUSE.y = MOUSE.y;

//         ALFA = ALFA + deltaX * FACTOR_VELOCIDAD;
//         BETA = BETA + deltaY * FACTOR_VELOCIDAD;

//         if (BETA <= 0) {
//             BETA = 0.001;
//         }
//         if (BETA > Math.PI) {
//             BETA = Math.PI - 0.001;
//         }

//     }

// }


// const FACTOR_VELOCIDAD = 0.001;
// const RADIO = 0.1;
// var JOYSTICK_CONTROLLER = null;