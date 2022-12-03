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

    obtenerPosicion(){
        if (app.camara == "Orbital") return this.orbital.obtenerPosicion()
        else if (app.camara == "Orbital catapulta") return this.orbitalCatapulta.obtenerPosicion()
        else if (app.camara == "Primera persona") return this.primeraPersona.obtenerPosicion()
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