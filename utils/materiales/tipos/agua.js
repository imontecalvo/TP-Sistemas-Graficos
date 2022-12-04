import { shadersManager, textureManager } from "../../../web-gl.js";
import Material from "../material.js";

class Agua extends Material {
    constructor() {
        const color = [100 / 255, 190 / 255, 223 / 255];
        const configPhong = {
            colorDifuso:color,
            Ka:0.7,
            Kd:1.0,
            Ks:1.0,
            glossiness:100
        }
        super(configPhong);
        this.shaderProgram = shadersManager.getProgram("phong")
        this.textura = textureManager.Agua;
        this.texturaNMap = textureManager.AguaNM;
    }
};

export default Agua