import { gl } from "../../web-gl.js";

class Material {
  constructor(phong) {
    if (phong) {
      this.configuracionPhong = phong
    }
  }


  activar(renderColor) {
    const { shaderProgram } = this;
    // console.log("shader: ",shaderProgram)
    gl.useProgram(shaderProgram);

    // Activamos colores de iluminacion para modelo de Phong
    if (this.configuracionPhong) {
      gl.uniform3fv(shaderProgram.colorDifusoUniform, this.configuracionPhong.colorDifuso);

      gl.uniform1f(shaderProgram.KaUniform, this.configuracionPhong.Ka);
      gl.uniform1f(shaderProgram.KdUniform, this.configuracionPhong.Kd);
      gl.uniform1f(shaderProgram.KsUniform, this.configuracionPhong.Ks);
      gl.uniform1f(shaderProgram.glossinessUniform, this.configuracionPhong.glossiness);
    }

    gl.uniform1i(shaderProgram.rendering, renderColor);

    return this.shaderProgram
  }
}

export default Material



/*
// 1- cargar materiales en global
// 2- usar en objeto 3d
// 3- Asignar material a elementos de la escena
// 4- eliminar glprogram
5. adaptar para shader curva y eliminar glprogramcurva
*/