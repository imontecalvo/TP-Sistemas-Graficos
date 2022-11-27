import { shadersManager } from "../../../web-gl.js";
import Material from "../material.js";

class Agua extends Material {
    constructor() {
        super();
        this.color = [101 / 255, 218 / 255, 223 / 255];
        this.shaderProgram = shadersManager.getProgram("phong")
    }
};

export default Agua