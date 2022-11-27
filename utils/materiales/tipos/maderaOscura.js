import { shadersManager } from "../../../web-gl.js";
import Material from "../material.js";

class MaderaOscura extends Material {
    constructor() {
        super();
        this.color = [41 / 255, 24 / 255, 24 / 255];
        this.shaderProgram = shadersManager.getProgram("phong")
    }
}

export default MaderaOscura