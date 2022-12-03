import { shadersManager } from "../../../web-gl.js";
import Material from "../material.js";

class Fuego extends Material {
    constructor() {
        super();
        this.shaderProgram = shadersManager.getProgram("fuego")
    }
};

export default Fuego