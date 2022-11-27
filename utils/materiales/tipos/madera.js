import { shadersManager } from "../../../web-gl.js";
import Material from "../material.js";

class Madera extends Material {
    constructor() {
        super();
        this.color = [89 / 255, 67 / 255, 46 / 255];
        this.shaderProgram = shadersManager.getProgram("phong")
    }
}

export default Madera