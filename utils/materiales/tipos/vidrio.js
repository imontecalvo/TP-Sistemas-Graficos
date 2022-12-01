import { shadersManager } from "../../../web-gl.js";
import Material from "../material.js";

class Vidrio extends Material {
    constructor() {
        const color = [62/255,62/255,62/255];
        const configPhong = {
            colorDifuso: color,
            Ka:0.1,
            Kd:1.0,
            Ks:0.8,
            glossiness:100
        }
        super(configPhong);
        this.shaderProgram = shadersManager.getProgram("phong")
    }
}

export default Vidrio