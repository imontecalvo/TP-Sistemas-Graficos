uniform bool renderColor;

precision highp float;

varying vec3 vNormal;
varying vec3 vPosWorld;
varying vec3 vColorDifuso;
varying vec2 vUv;

varying float vKa;   // Ambient reflection coefficient
varying float vKd;   // Diffuse reflection coefficient
varying float vKs;   // Specular reflection coefficient
varying float vGlossiness;


void main(void) {
    vec3 colorAmbiente = vec3(0.04,0.0,0.25);
    vec3 colorEspecular = vec3(1.,1.,1.);
    vec3 luzDireccional = normalize(vec3(1., 1., 1.));

    float lambertian = max(dot(vNormal, luzDireccional), 0.0);
    float specular = 0.0;
  
    if(lambertian > 0.0) {
        vec3 R = reflect(-luzDireccional, vNormal);      // Reflected light vector
        vec3 V = normalize(-vPosWorld); // Vector to viewer

        // Compute the specular term
        float specAngle = max(dot(R, V), 0.0);
        specular = pow(specAngle, vGlossiness);
    }

    vec3 componenteAmbiente = colorAmbiente;
    vec3 componenteDifusa = vKd * lambertian * vColorDifuso;
    vec3 componenteEspecular = vKs * specular * colorEspecular;


    if (renderColor==true){
        gl_FragColor = vec4(componenteAmbiente + componenteDifusa + componenteEspecular,1.0);
    }else{
        gl_FragColor = vec4(vNormal,1.0);
    }
}