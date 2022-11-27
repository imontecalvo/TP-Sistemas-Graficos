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

    // gl.uniformMatrix4fv(shaderProgram.modelMatrixUniform, false, modelMatrix);
    // gl.uniformMatrix4fv(shaderProgram.normalMatrixUniform, false, normalMatrix);

    // gl.bindBuffer(gl.ARRAY_BUFFER, position);
    // gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, position.itemSize, gl.FLOAT, false, 0, 0);

    // Activamos colores de iluminacion para modelo de Phong
    if (this.configuracionPhong) {
      //   gl.uniform3fv(shaderProgram.colorAmbienteUniform, this._colorArrayNormalized(this.colorAmbiente));
      //   gl.uniform3fv(shaderProgram.colorDifusoUniform, this._colorArrayNormalized(this.colorDifuso));
      //   gl.uniform3fv(shaderProgram.colorEspecularUniform, this._colorArrayNormalized(this.colorEspecular));
      gl.uniform3fv(shaderProgram.colorAmbienteUniform, this._colorArrayNormalized(this.phong.ambiente));
      gl.uniform3fv(shaderProgram.colorDifusoUniform, this._colorArrayNormalized(this.phong.difuso));
      gl.uniform3fv(shaderProgram.colorEspecularUniform, this._colorArrayNormalized(this.phong.especular));
      gl.uniform1f(shaderProgram.glossinessUniform, this.phong.glossiness);
    }

    gl.uniform1i(shaderProgram.rendering, renderColor);
    gl.uniform3fv(shaderProgram.colorUniform, this.color);

    return this.shaderProgram
  }
}

export default Material



/*
// 1- cargar materiales en global
// 2- usar en objeto 3d
3- Asignar material a elementos de la escena
4- eliminar glprogram
5. adaptar para shader curva y eliminar glprogramcurva
*/