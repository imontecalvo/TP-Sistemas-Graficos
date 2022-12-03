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

varying vec3 vPosicionAntorcha1;
varying vec3 vPosicionAntorcha2;
varying vec3 vPosicionMunicion;

uniform sampler2D uTextura1;
uniform sampler2D uTextura2;
uniform sampler2D uTextura3;

void main(void) {

    if (renderColor==true){
        vec3 camVec = normalize(vPosWorld - vPosCamaraMundo);

        // Textura 1
        vec3 colorTextura3D_1_1 = texture2D(uTextura1, vUv).xyz;
        vec3 colorTextura3D_1_2 = texture2D(uTextura1, vUv * 0.77).xyz;
        vec3 colorTextura3D_1_3 = texture2D(uTextura1, vUv * 3.8813).xyz;
        vec3 colorTextura3D_1 = mix(mix(colorTextura3D_1_1, colorTextura3D_1_2, 0.5), colorTextura3D_1_3, 0.3);

        // Textura 2
        vec3 colorTextura3D_2_1 = texture2D(uTextura2, vUv).xyz;
        vec3 colorTextura3D_2_2 = texture2D(uTextura2, vUv * 2.17).xyz;
        vec3 colorTextura3D_2_3 = texture2D(uTextura2, vUv * 3.8).xyz;
        vec3 colorTextura3D_2 = mix(mix(colorTextura3D_2_1, colorTextura3D_2_2, 0.5), colorTextura3D_2_3, 0.3);

        // Textura 3
        vec3 colorTextura3D_3_1 = texture2D(uTextura3, vUv).xyz;
        vec3 colorTextura3D_3_2 = texture2D(uTextura3, vUv * 2.9).xyz;
        vec3 colorTextura3D_3_3 = texture2D(uTextura3, vUv * 1.5).xyz;
        vec3 colorTextura3D_3 = mix(mix(colorTextura3D_3_1, colorTextura3D_3_2, 0.5), colorTextura3D_3_3, 0.3);

        // Color textura final
        vec3 colorTexturaFinal = mix(colorTextura3D_1, colorTextura3D_2, colorTextura3D_3);

        //Sol
        vec3 lightPos = vec3(1,10,1.);
        vec3 N = normalize(vNormal);
        vec3 L = normalize(vec3(0,15,50));

        //vec3 colorAmbiente = vec3(78./255.,78./255.,86./255.);
        vec3 colorAmbiente = vec3(41./255.,42./255.,87./255.);
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

        vec3 luzAmbienteBase = vec3(0.3,0.3,0.2);
        vec3 color = (vKa * colorAmbiente) + (vKd * lambertian * vColorDifuso * colorTexturaFinal + luzAmbienteBase * colorTexturaFinal) + (vKs * specular * colorEspecular);
        
        // Antorcha1
        vec3 lightVecAntorcha1 = normalize(vPosicionAntorcha1 - vPosWorld);
        vec3 componenteDifusaAntorcha1 = dot(lightVecAntorcha1, vNormal) * vColorDifuso;
        vec3 reflexVecAntorcha1 = normalize(reflect(-lightVecAntorcha1, vNormal));
        vec3 componenteEspecularAntorcha1 = pow(max(0.0, dot(reflexVecAntorcha1, camVec)), vGlossiness) * colorEspecular;

        vec3 colorAntorcha1 = vKd * componenteDifusaAntorcha1 + vKa * colorAmbiente + vKs * componenteEspecularAntorcha1;

        vec3 colorLuzAntorcha1 = vec3(245./255., 182./255., 66./255.);
        float factorAtenuacionAntorcha1 = 1.0 / pow(distance(vPosicionAntorcha1, vPosWorld),1.);
        vec3 intensidadLuzAntorcha1 = 0.3 * colorLuzAntorcha1 * factorAtenuacionAntorcha1;


        // Antorcha2
        vec3 lightVecAntorcha2 = normalize(vPosicionAntorcha2 - vPosWorld);
        vec3 componenteDifusaAntorcha2 = dot(lightVecAntorcha2, vNormal) * vColorDifuso;
        vec3 reflexVecAntorcha2 = normalize(reflect(-lightVecAntorcha2, vNormal));
        vec3 componenteEspecularAntorcha2 = pow(max(0.0, dot(reflexVecAntorcha2, camVec)), vGlossiness) * colorEspecular;

        vec3 colorAntorcha2 = vKd * componenteDifusaAntorcha2 + vKa * colorAmbiente + vKs * componenteEspecularAntorcha2;

        vec3 colorLuzAntorcha2 = vec3(245./255., 182./255., 66./255.);
        float factorAtenuacionAntorcha2 = 1.0 / pow(distance(vPosicionAntorcha2, vPosWorld),1.);
        vec3 intensidadLuzAntorcha2 = 0.3 * colorLuzAntorcha2 * factorAtenuacionAntorcha2;

        // Municion
        vec3 lightVecMunicion = normalize(vPosicionMunicion - vPosWorld);
        vec3 componenteDifusaMunicion = dot(lightVecMunicion, vNormal) * vColorDifuso;
        vec3 reflexVecMunicion = normalize(reflect(-lightVecMunicion, vNormal));
        vec3 componenteEspecularMunicion = pow(max(0.0, dot(reflexVecMunicion, camVec)), vGlossiness) * colorEspecular;

        vec3 colorMunicion = vKd * componenteDifusaMunicion + vKa * colorAmbiente + vKs * componenteEspecularMunicion;

        vec3 colorLuzMunicion = vec3(245./255., 182./255., 66./255.);
        float factorAtenuacionMunicion = 2. * 1.0 / pow(distance(vPosicionMunicion, vPosWorld),0.5);
        vec3 intensidadLuzMunicion = colorLuzMunicion * factorAtenuacionMunicion;


        vec3 colorTotal = color + (colorAntorcha1 * intensidadLuzAntorcha1) + (colorAntorcha2 * intensidadLuzAntorcha2) + (colorMunicion * intensidadLuzMunicion);

        gl_FragColor = vec4(colorTotal , 1.0);
        //gl_FragColor = vec4(colorTexturaFinal , 1.0);

        // specularColor: vec3(0.95,0.67,0.03), 1.0)
    }else{
        gl_FragColor = vec4(vNormal,1.0);
    }
}