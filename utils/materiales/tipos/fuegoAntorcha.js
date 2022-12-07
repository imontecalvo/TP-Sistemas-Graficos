import { shadersManager } from "../../../web-gl.js";
import Material from "../material.js";

class FuegoAntorcha extends Material {
    constructor() {
        super();
        this.setColor()
        this.shaderProgram = shadersManager.getProgram("fuego")
    }

    actualizarColor(){
        // vec3 blanco = vec3(1.,1.,1.);
        // vec3 diferencia = blanco - vColor;
        // gl_FragColor = vec4(blanco - ((0.15)*diferencia), 1.0);
        // this.color = app.luzAntorcha;
        this.setColor()
    }

    setColor(){
        const blanco = [255.,255.,255.]
        // console.log(app.luzAntorcha)
        const diferencia = blanco.map((x,i) => x-app.luzAntorcha[i])
        this.color = blanco.map((x,i)=>x-(0.15*diferencia[i]))
        // console.log(this.color)
    }
};

export default FuegoAntorcha