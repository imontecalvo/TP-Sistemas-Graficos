import { shadersManager, textureManager } from "../../../web-gl.js";
import Material from "../material.js";

class Madera extends Material {
    constructor() {
        const color = [89 / 255, 67 / 255, 46 / 255];
        const configPhong = {
            colorDifuso: color,
            Ka:1.0,
            Kd:1.0,
            Ks:0.2,
            glossiness:1
        }
        super(configPhong);
        this.shaderProgram = shadersManager.getProgram("phong")
        this.textura = textureManager.TablonMadera;
    }
}

export default Madera