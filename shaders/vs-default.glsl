precision highp float;

attribute vec3 aVertexPosition;
attribute vec3 aVertexNormal;
attribute vec3 aVertexTangente;
attribute vec2 aUv;

varying vec3 vNormal;    
varying vec3 vTangente;    
varying vec3 vPosWorld;  
varying vec2 vUv;

uniform vec3 posCamaraMundo;
varying vec3 vPosCamaraMundo;

uniform mat4 modelMatrix;            
uniform mat4 viewMatrix;
uniform mat4 projMatrix;
uniform mat4 normalMatrix;
            
uniform vec3 uColorDifuso;
varying vec3 vColorDifuso;

uniform bool renderColor;

uniform float Ka;   // Ambient reflection coefficient
varying float vKa;

uniform float Kd;   // Diffuse reflection coefficient
varying float vKd;

uniform float Ks;   // Specular reflection coefficient
varying float vKs;

uniform float glossiness;
varying float vGlossiness;

uniform vec3 uPosicionAntorcha1;
varying vec3 vPosicionAntorcha1;
uniform vec3 uPosicionAntorcha2;
varying vec3 vPosicionAntorcha2;
uniform vec3 uPosicionMunicion;
varying vec3 vPosicionMunicion;

void main(void) {
    vec3 position = aVertexPosition;
    gl_Position = projMatrix * viewMatrix * modelMatrix * vec4(position, 1.0);
    
    vec4 vPosWorld4 =(modelMatrix*vec4(position,1.0)).xyzw;
    vPosWorld = vec3(vPosWorld4)/vPosWorld4.w;
    vNormal=(normalMatrix*vec4(aVertexNormal,1.0)).xyz;        
    vTangente=(normalMatrix*vec4(aVertexTangente,1.0)).xyz;        
    vColorDifuso = uColorDifuso;
    vUv=aUv;

    vKa = Ka;
    vKd = Kd;
    vKs = Ks;
    vGlossiness = glossiness;

    vPosCamaraMundo = posCamaraMundo;
    vPosicionAntorcha1 = uPosicionAntorcha1;
    vPosicionAntorcha2 = uPosicionAntorcha2;
    vPosicionMunicion = uPosicionMunicion;
}