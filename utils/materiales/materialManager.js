import Agua from "./tipos/agua.js";
import FuegoAntorcha from "./tipos/fuegoAntorcha.js";
import FuegoMunicion from "./tipos/fuegoMunicion.js";
import Madera from "./tipos/madera.js";
import MaderaClara from "./tipos/maderaClara.js";
import MaderaOscura from "./tipos/maderaOscura.js";
import Pasto from "./tipos/pasto.js";
import Piedra from "./tipos/piedra.js";
import PiedraOscura from "./tipos/piedraOscura.js";
import PinturaAmarilla from "./tipos/pinturaAmarilla.js";
import TejasAzules from "./tipos/tejasAzules.js";
import Vidrio from "./tipos/vidrio.js";
import ColorLiso from "./tipos/colorLiso.js";
import Cielo from "./tipos/cielo.js";
import PastoRocas from "./tipos/pastoRocas.js";

export default function initMateriales(){
    window.materiales = {
        AGUA: new Agua(),
        FUEGO_ANTORCHA: new FuegoAntorcha(),
        FUEGO_MUNICION: new FuegoMunicion(),
        MADERA: new Madera(),
        MADERA_CLARA: new MaderaClara(),
        MADERA_OSCURA: new MaderaOscura(),
        PASTO: new Pasto(),
        PIEDRA: new Piedra(),
        PIEDRA_OSCURA: new PiedraOscura(),
        PINTURA_AMARILLA: new PinturaAmarilla(),
        TEJAS_AZULES: new TejasAzules(),
        VIDRIO: new Vidrio(),
        ROJO: new ColorLiso([1, 0, 0]),
        VERDE: new ColorLiso([0, 1, 0]),
        AZUL: new ColorLiso([0, 0, 1]),
        PRUEBA: new ColorLiso([1,0.87,0.29]),
        CIELO: new Cielo(),
        PASTO_ROCAS: new PastoRocas()
    }
}