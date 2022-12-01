import { shadersManager } from "../../../web-gl.js";
import Material from "../material.js";

class PinturaAmarilla extends Material {
    constructor() {
        const color = [238/255,226/255,121/255];
        const configPhong = {
            colorDifuso: color,
            Ka:0.5,
            Kd:1.0,
            Ks:0.2,
            glossiness:2
        }
        super(configPhong);
        this.shaderProgram = shadersManager.getProgram("phong")
    }
}

export default PinturaAmarilla