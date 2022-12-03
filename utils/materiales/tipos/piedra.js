import { shadersManager, textureManager } from "../../../web-gl.js";
import Material from "../material.js";

class Piedra extends Material {
    constructor() {
        const color = [125/255,125/255,125/255];
        const configPhong = {
            colorDifuso: color,
            Ka:0.5,
            Kd:1.0,
            Ks:0.2,
            glossiness:4
        }
        super(configPhong);
        this.shaderProgram = shadersManager.getProgram("phong")
        this.textura = textureManager.Piedra;
    }
}

export default Piedra