import { shadersManager } from "../../../web-gl.js";
import Material from "../material.js";

class Piedra extends Material {
    constructor() {
        super();
        this.color = [125/255,125/255,125/255];
        this.shaderProgram = shadersManager.getProgram("phong")
    }
}

export default Piedra