precision highp float;

attribute vec3 aVertexPosition;
attribute vec3 aVertexNormal;

varying vec3 vNormal; 

uniform mat4 modelMatrix;            
uniform mat4 viewMatrix;
uniform mat4 projMatrix;
uniform mat4 normalMatrix;

uniform bool renderColor;


void main(void) {
    gl_Position = projMatrix * viewMatrix * modelMatrix * vec4(aVertexPosition, 1.0);
    vNormal=(normalMatrix*vec4(aVertexNormal,1.0)).xyz;
}