precision highp float;

attribute vec3 aVertexPosition;
attribute vec3 aVertexNormal;
attribute vec2 aUv;

uniform mat4 modelMatrix;            
uniform mat4 viewMatrix;
uniform mat4 projMatrix;

uniform mat4 normalMatrix;
            
uniform vec3 uColor;

uniform bool renderColor;

varying vec3 vNormal;    
varying vec3 vPosWorld;  
varying vec3 vColor;
varying vec2 vUv;

void main(void) {
    vec3 position = aVertexPosition;
    vec2 uv = aUv;
    gl_Position = projMatrix * viewMatrix * modelMatrix * vec4(position, 1.0);
    

    vPosWorld=(modelMatrix*vec4(position,1.0)).xyz;
    vNormal=(normalMatrix*vec4(aVertexNormal,1.0)).xyz;        
    vColor = uColor;
    vUv=uv;	
}