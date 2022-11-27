import { shadersManager } from "../../../web-gl.js";
import Material from "../material.js";

class PinturaAmarilla extends Material {
    constructor() {
        super();
        this.color = [238/255,226/255,121/255];
        this.shaderProgram = shadersManager.getProgram("phong")
    }
}

export default PinturaAmarilla