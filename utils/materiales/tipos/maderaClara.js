import { shadersManager } from "../../../web-gl.js";
import Material from "../material.js";

class MaderaClara extends Material {
    constructor() {
        const color = [103 / 255, 78 / 255, 55 / 255];
        const configPhong = {
            colorDifuso: color,
            Ka:1.0,
            Kd:1.0,
            Ks:0.2,
            glossiness:1
        }
        super(configPhong);
        this.shaderProgram = shadersManager.getProgram("phong")
    }
}

export default MaderaClara