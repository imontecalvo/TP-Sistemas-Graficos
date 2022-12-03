import { shadersManager, textureManager } from "../../../web-gl.js";
import Material from "../material.js";

class TejasAzules extends Material {
    constructor() {
        const color = [38/255,87/255,136/255];
        const configPhong = {
            colorDifuso: color,
            Ka:1.0,
            Kd:1.0,
            Ks:1.0,
            glossiness:20
        }
        super(configPhong);
        this.shaderProgram = shadersManager.getProgram("phong")
        this.textura = textureManager.TejasAzules;
    }
}

export default TejasAzules