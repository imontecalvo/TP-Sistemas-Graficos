import { shadersManager } from "../../../web-gl.js";
import Material from "../material.js";

class Agua extends Material {
    constructor() {
        const color = [101 / 255, 218 / 255, 223 / 255];
        const configPhong = {
            colorDifuso:color,
            Ka:0.3,
            Kd:1.0,
            Ks:1.0,
            glossiness:100
        }
        super(configPhong);
        this.shaderProgram = shadersManager.getProgram("phong")
    }
};

export default Agua