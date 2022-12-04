
uniform bool renderColor;

precision highp float;

uniform vec3 vColor;
varying vec3 vNormal;

void main(void) {
  if (renderColor==true){
    vec3 blanco = vec3(1.,1.,1.);
    vec3 diferencia = blanco - vColor;
    gl_FragColor = vec4(blanco - ((0.25)*diferencia), 1.0);
  }else{
    gl_FragColor = vec4(vNormal,1.0);
  }
}