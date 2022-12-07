
uniform bool renderColor;

precision highp float;

uniform vec3 vColor;
varying vec3 vNormal;

void main(void) {
  if (renderColor==true){
    gl_FragColor = vec4(vColor, 1.0);
  }else{
    gl_FragColor = vec4(vNormal,1.0);
  }
}