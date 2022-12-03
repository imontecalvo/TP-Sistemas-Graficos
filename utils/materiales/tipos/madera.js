import { shadersManager, textureManager } from "../../../web-gl.js";
import Material from "../material.js";

class Madera extends Material {
    constructor() {
        const color = [41 / 255, 24 / 255, 24 / 255];
        const configPhong = {
            colorDifuso: color,
            Ka:0.5,
            Kd:0.5,
            Ks:0.2,
            glossiness:1
        }
        super(configPhong);
        this.shaderProgram = shadersManager.getProgram("phong")
        this.textura = textureManager.TablonMadera;
    }
}

export default Madera