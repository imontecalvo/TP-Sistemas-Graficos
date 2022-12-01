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

varying vec3 vPosCamaraMundo;


void main(void) {
    vec3 camVec = normalize(vPosWorld - vPosCamaraMundo);
    vec3 lightPos = vec3(1,10,1.);
    vec3 N = normalize(vNormal);
    //vec3 L = normalize(lightPos - vPosWorld);
    vec3 L = normalize(vec3(0,15,50));

    vec3 colorAmbiente = vec3(78./255.,78./255.,86./255.);
    //vec3 colorAmbiente = vec3(41./255.,42./255.,87./255.);
    //vec3 colorAmbiente = vec3(0.04,0.0,0.25);
    vec3 colorEspecular = vec3(0.95,0.67,0.03);

    // Lambert's cosine law
    float lambertian = max(dot(N, L), 0.0);
    float specular = 0.0;
    if(lambertian > 0.0) {
        vec3 R = normalize(reflect(-L, N));      // Reflected light vector
        vec3 V = normalize(-camVec); // Vector to viewer
        // Compute the specular term
        float specAngle = max(dot(R, V), 0.0);
        specular = pow(specAngle, vGlossiness);
    }
    gl_FragColor = vec4(vKa * colorAmbiente +
                      vKd * lambertian * vColorDifuso +
                      vKs * specular * colorEspecular, 1.0);

    // specularColor: vec3(0.95,0.67,0.03), 1.0)

    //if (renderColor==true){
    //    gl_FragColor = vec4(componenteAmbiente + componenteDifusa + componenteEspecular,1.0);
    //}else{
    //    gl_FragColor = vec4(vNormal,1.0);
    //}
}