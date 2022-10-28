uniform bool renderColor;

precision highp float;

varying vec3 vNormal;
varying vec3 vPosWorld;
varying vec3 vColor;
varying vec2 vUv;

void main(void) {
    vec3 ambientColor = vec3(0.5,0.5,0.5);
    vec3 directionalColor = vec3(1., 1., 1.);
    vec3 lightVec=normalize(vec3(750.0,250.0,750.0)-vPosWorld);

    if (renderColor==true){
        vec3 color=(ambientColor+directionalColor*max(dot(vNormal,lightVec), 0.0))*vColor.xyz;
        gl_FragColor = vec4(vColor,1.0);
    }else{
        gl_FragColor = vec4(vNormal,1.0);
    }
}