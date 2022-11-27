import { shadersManager } from "../../../web-gl.js";
import Material from "../material.js";

class Pasto extends Material {
    constructor() {
        super();
        this.color = [63/255,147/255,68/255];
        this.shaderProgram = shadersManager.getProgram("phong")
    }
}

export default Pasto