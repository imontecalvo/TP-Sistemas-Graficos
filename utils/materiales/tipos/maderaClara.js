import { shadersManager } from "../../../web-gl.js";
import Material from "../material.js";

class MaderaClara extends Material {
    constructor() {
        super();
        this.color = [103 / 255, 78 / 255, 55 / 255];
        this.shaderProgram = shadersManager.getProgram("phong")
    }
}

export default MaderaClara