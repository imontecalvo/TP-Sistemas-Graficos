import { shadersManager } from "../../../web-gl.js";
import Material from "../material.js";

class PiedraOscura extends Material {
    constructor() {
        super();
        this.color = [115/255,115/255,115/255];
        this.shaderProgram = shadersManager.getProgram("phong")
    }
}

export default PiedraOscura