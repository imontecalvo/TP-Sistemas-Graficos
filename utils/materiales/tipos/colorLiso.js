import { shadersManager } from "../../../web-gl.js";
import Material from "../material.js";

class ColorLiso extends Material {
    constructor(color) {
        super();
        this.color = color;
        this.shaderProgram = shadersManager.getProgram("phong")
    }
}

export default ColorLiso