import { shadersManager, textureManager } from "../../../web-gl.js";
import Material from "../material.js";

class TejasAzules extends Material {
    constructor() {
        const color = [38/255,87/255,136/255];
        const configPhong = {
            colorDifuso: color,
            Ka:0.7,
            Kd:0.5,
            Ks:0.7,
            glossiness:10
        }
        super(configPhong);
        this.shaderProgram = shadersManager.getProgram("phong")
        this.textura = textureManager.TejasAzules;
    }
}

export default TejasAzules