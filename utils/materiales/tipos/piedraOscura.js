import { shadersManager, textureManager } from "../../../web-gl.js";
import Material from "../material.js";

class PiedraOscura extends Material {
    constructor() {
        const color = [115/255,115/255,115/255];
        const configPhong = {
            colorDifuso: color,
            Ka:0.5,
            Kd:1.0,
            Ks:0.3,
            glossiness:4
        }
        super(configPhong);
        this.shaderProgram = shadersManager.getProgram("phong")
        this.textura = textureManager.Test;
    }
}

export default PiedraOscura