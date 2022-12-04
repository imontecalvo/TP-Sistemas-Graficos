import { shadersManager, textureManager } from "../../../web-gl.js";
import Material from "../material.js";

class Cielo extends Material {
    constructor() {
        const color = [200 / 200, 180 / 255, 0 / 255];
        const configPhong = {
            colorDifuso:color,
            Ka:0.4,
            Kd:0.7,
            Ks:0.01,
            glossiness:1
        }
        super(configPhong);
        this.shaderProgram = shadersManager.getProgram("phong")
        this.textura = textureManager.Cielo;
    }
};

export default Cielo