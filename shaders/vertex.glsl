precision highp float;

attribute vec3 aVertexPosition;
attribute vec3 aVertexNormal;
attribute vec2 aUv;

uniform mat4 modelMatrix;            
uniform mat4 viewMatrix;
uniform mat4 projMatrix;

uniform mat4 normalMatrix;
            
uniform vec3 uColorDifuso;

uniform bool renderColor;

uniform float Ka;   // Ambient reflection coefficient
uniform float Kd;   // Diffuse reflection coefficient
uniform float Ks;   // Specular reflection coefficient
uniform float glossiness;

varying vec3 vNormal;    
varying vec3 vPosWorld;  
varying vec3 vColorDifuso;
varying vec2 vUv;

varying float vKa;   // Ambient reflection coefficient
varying float vKd;   // Diffuse reflection coefficient
varying float vKs;   // Specular reflection coefficient
varying float vGlossiness;

void main(void) {
    vec3 position = aVertexPosition;
    gl_Position = projMatrix * viewMatrix * modelMatrix * vec4(position, 1.0);
    
    vPosWorld=(modelMatrix*vec4(position,1.0)).xyz;
    vNormal=normalize((normalMatrix*vec4(aVertexNormal,1.0)).xyz);        
    vColorDifuso = uColorDifuso;
    vUv=aUv;

    vKa = Ka;
    vKd = Kd;
    vKs = Ks;
    vGlossiness = glossiness;
}