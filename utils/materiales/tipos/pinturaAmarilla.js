import { shadersManager, textureManager } from "../../../web-gl.js";
import Material from "../material.js";

class PinturaAmarilla extends Material {
    constructor() {
        const color = [238/255,226/255,121/255];
        const configPhong = {
            colorDifuso: color,
            Ka:0.7,
            Kd:0.4,
            Ks:0.25,
            glossiness:10
        }
        super(configPhong);
        this.shaderProgram = shadersManager.getProgram("phong")
        this.textura = textureManager.ParedCastillo;
        this.texturaNMap = textureManager.ParedCastilloNM;
    }
}

export default PinturaAmarilla