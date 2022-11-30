import { shadersManager } from "../../../web-gl.js";
import Material from "../material.js";

class ColorLiso extends Material {
    constructor(color) {
        const configPhong = {
            colorDifuso:color,
            Ka:1.0,
            Kd:1.0,
            Ks:10.0,
            glossiness:100.0
        }
        super(configPhong);
        this.shaderProgram = shadersManager.getProgram("phong")
    }
}

export default ColorLiso