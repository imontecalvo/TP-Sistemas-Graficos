import { shadersManager } from "../../../web-gl.js";
import Material from "../material.js";

class FuegoMunicion extends Material {
    constructor() {
        super();
        this.setColor()
        this.shaderProgram = shadersManager.getProgram("fuego")
    }

    actualizarColor(){
        this.setColor()
    }

    setColor(){
        const blanco = [255.,255.,255.]
        const diferencia = blanco.map((x,i) => x-app.luzMunicion[i])
        this.color = blanco.map((x,i)=>x-0.5*diferencia[i])
    }
};

export default FuegoMunicion