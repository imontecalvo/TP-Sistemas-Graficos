import { shadersManager, textureManager } from "../../../web-gl.js";
import Material from "../material.js";

class Cielo extends Material {
    constructor() {
        const color = [75 / 200, 115 / 255, 110 / 255];
        const configPhong = {
            colorDifuso: color,
            Ka: 0.5,
            Kd: 0.7,
            Ks: 0.01,
            glossiness: 1
        }
        super(configPhong);
        this.shaderProgram = shadersManager.getProgram("phong")
        this.textura = textureManager.Cielo;
    }
};

export default Cielo