import { shadersManager } from "../../../web-gl.js";
import Material from "../material.js";

class Vidrio extends Material {
    constructor() {
        super();
        this.color = [62/255,62/255,62/255];
        this.shaderProgram = shadersManager.getProgram("phong")
    }
}

export default Vidrio