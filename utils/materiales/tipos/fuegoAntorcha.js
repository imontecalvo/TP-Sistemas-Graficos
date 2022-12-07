import { shadersManager } from "../../../web-gl.js";
import Material from "../material.js";

class FuegoAntorcha extends Material {
    constructor() {
        super();
        this.color = app.luzAntorcha
        this.shaderProgram = shadersManager.getProgram("fuego")
    }

    actualizarColor(){
        this.color = app.luzAntorcha;
    }
};

export default FuegoAntorcha