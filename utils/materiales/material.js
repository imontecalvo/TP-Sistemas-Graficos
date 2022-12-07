import { gl, textureManager } from "../../web-gl.js";

class Material {
  constructor(phong) {
    if (phong) {
      this.configuracionPhong = phong
    }
  }


  activar(renderColor) {
    const { shaderProgram } = this;
    gl.useProgram(shaderProgram);

    // Activamos colores de iluminacion para modelo de Phong
    if (this.configuracionPhong) {
      gl.uniform3fv(shaderProgram.colorDifusoUniform, this.configuracionPhong.colorDifuso);

      gl.uniform1f(shaderProgram.KaUniform, this.configuracionPhong.Ka);
      gl.uniform1f(shaderProgram.KdUniform, this.configuracionPhong.Kd);
      gl.uniform1f(shaderProgram.KsUniform, this.configuracionPhong.Ks);
      gl.uniform1f(shaderProgram.glossinessUniform, this.configuracionPhong.glossiness);

      var textura1Uniform = gl.getUniformLocation(shaderProgram, "uTextura1");
      gl.uniform1i(textura1Uniform, textureManager.getTextureUnit(this.textura));

      var textura2Uniform = gl.getUniformLocation(shaderProgram, "uTextura2");
      gl.uniform1i(textura2Uniform, textureManager.getTextureUnit(this.textura_2));

      var textura3Uniform = gl.getUniformLocation(shaderProgram, "uTextura3");
      gl.uniform1i(textura3Uniform, textureManager.getTextureUnit(this.textura_3));

      var texturaNMapUniform = gl.getUniformLocation(shaderProgram, "uTexturaNMap");
      gl.uniform1i(texturaNMapUniform, textureManager.getTextureUnit(this.texturaNMap));

      var texturaReflexionUniform = gl.getUniformLocation(shaderProgram, "uMapaReflexion");
      gl.uniform1i(texturaReflexionUniform, textureManager.getTextureUnit(this.texturaRelejo));

      gl.uniform3fv(shaderProgram.colorSolUniform, normalizarColor(app.luzSol));
      gl.uniform3fv(shaderProgram.colorMunicionUniform, normalizarColor(app.luzMunicion));
      gl.uniform3fv(shaderProgram.colorAntorchaUniform, normalizarColor(app.luzAntorcha));
      gl.uniform3fv(shaderProgram.colorAmbienteUniform, normalizarColor(app.luzAmbiente));
    }

    if (shaderProgram.id === "fuego"){
      this.actualizarColor();
      gl.uniform3fv(shaderProgram.colorUniform, normalizarColor(this.color));
    }

    gl.uniform1i(shaderProgram.rendering, renderColor);

    return this.shaderProgram
  }
}

export default Material

function normalizarColor(color) {
  return [color[0] / 255, color[1] / 255, color[2] / 255]
}



/*
// 1- cargar materiales en global
// 2- usar en objeto 3d
// 3- Asignar material a elementos de la escena
// 4- eliminar glprogram
5. adaptar para shader curva y eliminar glprogramcurva
*/