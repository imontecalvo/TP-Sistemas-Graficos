import { shadersManager } from "../../../web-gl.js";
import Material from "../material.js";

class TejasAzules extends Material {
    constructor() {
        super();
        this.color = [38/255,87/255,136/255];
        this.shaderProgram = shadersManager.getProgram("phong")
    }
}

export default TejasAzules