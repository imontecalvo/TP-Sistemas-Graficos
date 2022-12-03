import { shadersManager, textureManager } from "../../../web-gl.js";
import Material from "../material.js";

class Cielo extends Material {
    constructor() {
        const color = [255 / 255, 180 / 255, 0 / 255];
        const configPhong = {
            colorDifuso:color,
            Ka:0.5,
            Kd:0.4,
            Ks:0.01,
            glossiness:1
        }
        super(configPhong);
        this.shaderProgram = shadersManager.getProgram("phong")
        this.textura = textureManager.Cielo;
    }
};

export default Cielo