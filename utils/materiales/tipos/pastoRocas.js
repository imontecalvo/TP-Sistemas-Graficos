import { shadersManager, textureManager } from "../../../web-gl.js";
import Material from "../material.js";

class PastoRocas extends Material {
    constructor() {
        const color = [120/255,140/255,120/255];
        const configPhong = {
            colorDifuso: color,
            Ka:0.5,
            Kd:0.15,
            Ks:0.6,
            glossiness:5
        }
        super(configPhong);
        this.shaderProgram = shadersManager.getProgram("phong")
        this.textura = textureManager.PastoRoca;
        this.texturaNMap = textureManager.PastoRocaNM;
    }
};

export default PastoRocas