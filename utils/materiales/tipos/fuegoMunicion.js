import { shadersManager } from "../../../web-gl.js";
import Material from "../material.js";

class FuegoMunicion extends Material {
    constructor() {
        super();
        this.color = app.luzMunicion
        this.shaderProgram = shadersManager.getProgram("fuego")
    }

    actualizarColor(){
        this.color = app.luzMunicion;
    }
};

export default FuegoMunicion