import { shadersManager } from "../../../web-gl.js";
import Material from "../material.js";

class Pasto extends Material {
    constructor() {
        const color = [63/255,147/255,68/255];
        const configPhong = {
            colorDifuso: color,
            Ka:0.5,
            Kd:1.0,
            Ks:0.1,
            glossiness:3
        }
        super(configPhong);
        this.shaderProgram = shadersManager.getProgram("phong")
    }
}

export default Pasto