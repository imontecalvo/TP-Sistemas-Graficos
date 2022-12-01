
uniform bool renderColor;

precision highp float;

varying vec3 vNormal;

void main(void) {
  if (renderColor==true){
    gl_FragColor = vec4(1.0, 1.0, 0.65, 1.0);
  }else{
    gl_FragColor = vec4(vNormal,1.0);
  }
}