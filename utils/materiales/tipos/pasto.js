import { shadersManager, textureManager } from "../../../web-gl.js";
import Material from "../material.js";

class Pasto extends Material {
    constructor() {
        const color = [63/255,147/255,68/255];
        const configPhong = {
            colorDifuso: color,
            Ka:0.5,
            Kd:1.0,
            Ks:0.2,
            glossiness:3
        }
        super(configPhong);
        this.shaderProgram = shadersManager.getProgram("phong")
        this.textura = textureManager.Pasto1;
        this.textura_2 = textureManager.Pasto2;
        // this.textura_3 = textureManager.Pasto3;
    }
}

export default Pasto