uniform bool renderColor;

precision highp float;

varying vec3 vNormal;
varying vec3 vTangente;
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
uniform sampler2D uTexturaNMap;
uniform sampler2D uMapaReflexion;

uniform vec3 colorLuzAntorcha;
uniform vec3 colorLuzMunicion;
uniform vec3 colorLuzSol;
uniform vec3 colorLuzAmbiente;

float map(float value, float inMin, float inMax, float outMin, float outMax) {
  return outMin + (outMax - outMin) * (value - inMin) / (inMax - inMin);
}

void main(void) {

    if (renderColor==true){
        vec3 camVec = normalize(vPosWorld - vPosCamaraMundo);

        // Textura 1
        vec3 colorTextura3D_1 = texture2D(uTextura1, vUv).xyz;
        //vec3 colorTextura3D_1_2 = texture2D(uTextura1, vUv * 0.77).xyz;
        //vec3 colorTextura3D_1_3 = texture2D(uTextura1, vUv * 3.8813).xyz;
        //vec3 colorTextura3D_1 = mix(mix(colorTextura3D_1_1, colorTextura3D_1_2, 0.5), colorTextura3D_1_3, 0.3);

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

        vec3 vNormalMP = vNormal;
        vec3 colorTextura3D_NM = texture2D(uTexturaNMap, vUv).rgb;

        if ((colorTextura3D_NM.r != 0.) || (colorTextura3D_NM.g != 0.) || (colorTextura3D_NM.b != 0.)){

            vec3 T = (2.*colorTextura3D_NM.r - 1.)*vTangente;
            vec3 B = (2.*colorTextura3D_NM.g - 1.)*cross(vTangente, vNormal);
            vec3 N = (2.*colorTextura3D_NM.b - 1.)*vNormal;

            vNormalMP = T + N + B;
        }

        //Sol
        vec3 lightPos = vec3(1,10,1.);
        vec3 N = normalize(vNormalMP);
        vec3 L = normalize(vec3(0,15,50));

        //vec3 colorAmbiente = vec3(78./255.,78./255.,86./255.);
        vec3 colorAmbiente = vec3(41./255.,42./255.,87./255.);
        //vec3 colorAmbiente = vec3(0.04,0.0,0.25);
        vec3 colorEspecular = colorLuzSol;

        // Lambert's cosine law
        float lambertian =  (colorLuzSol.x != 0. || colorLuzSol.y != 0. || colorLuzSol.z != 0.) ? max(dot(N, L), 0.0) : 0.0;
        //float lambertian = max(dot(N, L), 0.0);
        float specular = 0.0;
        if(lambertian > 0.0) {
            vec3 R = normalize(reflect(-L, N));      // Reflected light vector
            vec3 V = normalize(-camVec); // Vector to viewer
            // Compute the specular term
            float specAngle = max(dot(R, V), 0.0);
            specular = pow(specAngle, vGlossiness);
        }

        vec3 auxMapaReflexion = texture2D(uMapaReflexion, vUv).rgb;
        vec3 mapaReflexion = vec3(0.,0.,0.);
        if ((auxMapaReflexion.r != 0.) || (auxMapaReflexion.g != 0.) || (auxMapaReflexion.b != 0.)){
            float PI = 3.141592;
            vec3 reflexion = reflect(camVec, vNormalMP);
            float m = length(reflexion);
            float alfa = map(atan(reflexion.y, reflexion.x), -PI, PI, 0., 1.);
            float beta = map(acos(reflexion.z / m), 0., PI, 0., 1.);
            mapaReflexion = colorLuzSol * texture2D(uMapaReflexion, vec2(alfa,beta)).xyz*vKs*0.4;
        }


        //vec3 luzAmbienteBase = mix(0.3*colorLuzSol,vec3(0.7,0.7,0.7),0.3);
        //vec3 color = (vKa * colorAmbiente) + (vKd * lambertian * vColorDifuso * colorTexturaFinal + colorLuzAmbiente * colorTexturaFinal) + (vKs * specular * colorEspecular);
        vec3 color = (vKa * colorAmbiente) + (vKd * lambertian * vColorDifuso * colorLuzSol * colorTexturaFinal + colorLuzAmbiente * colorTexturaFinal) + (vKs * specular * colorEspecular) + mapaReflexion;
        
        // Antorcha1
        vec3 lightVecAntorcha1 = normalize(vPosicionAntorcha1 - vPosWorld);
        vec3 componenteDifusaAntorcha1 = dot(lightVecAntorcha1, vNormalMP) * vColorDifuso;
        vec3 reflexVecAntorcha1 = normalize(reflect(-lightVecAntorcha1, vNormalMP));
        vec3 componenteEspecularAntorcha1 = pow(max(0.0, dot(reflexVecAntorcha1, camVec)), vGlossiness) * colorEspecular;

        vec3 colorAntorcha1 = vKd * componenteDifusaAntorcha1 + vKa * colorAmbiente + vKs * componenteEspecularAntorcha1;

        float factorAtenuacionAntorcha1 = 1.0 / pow(distance(vPosicionAntorcha1, vPosWorld),1.);
        vec3 intensidadLuzAntorcha1 = 0.3 * colorLuzAntorcha * factorAtenuacionAntorcha1;


        // Antorcha2
        vec3 lightVecAntorcha2 = normalize(vPosicionAntorcha2 - vPosWorld);
        vec3 componenteDifusaAntorcha2 = dot(lightVecAntorcha2, vNormalMP) * vColorDifuso;
        vec3 reflexVecAntorcha2 = normalize(reflect(-lightVecAntorcha2, vNormalMP));
        vec3 componenteEspecularAntorcha2 = pow(max(0.0, dot(reflexVecAntorcha2, camVec)), vGlossiness) * colorEspecular;

        vec3 colorAntorcha2 = vKd * componenteDifusaAntorcha2 + vKa * colorAmbiente + vKs * componenteEspecularAntorcha2;

        float factorAtenuacionAntorcha2 = 1.0 / pow(distance(vPosicionAntorcha2, vPosWorld),1.);
        vec3 intensidadLuzAntorcha2 = 0.3 * colorLuzAntorcha * factorAtenuacionAntorcha2;

        // Municion
        vec3 lightVecMunicion = normalize(vPosicionMunicion - vPosWorld);
        vec3 componenteDifusaMunicion = dot(lightVecMunicion, vNormalMP) * vColorDifuso;
        vec3 reflexVecMunicion = normalize(reflect(-lightVecMunicion, vNormalMP));
        vec3 componenteEspecularMunicion = pow(max(0.0, dot(reflexVecMunicion, camVec)), vGlossiness) * colorEspecular;

        vec3 colorMunicion = vKd * componenteDifusaMunicion + vKa * colorAmbiente + vKs * componenteEspecularMunicion;

        float factorAtenuacionMunicion = 2.0 / pow(distance(vPosicionMunicion, vPosWorld),0.5);
        vec3 intensidadLuzMunicion = colorLuzMunicion * factorAtenuacionMunicion;


        vec3 colorTotal = color + (colorAntorcha1 * intensidadLuzAntorcha1) + (colorAntorcha2 * intensidadLuzAntorcha2) + (colorMunicion * intensidadLuzMunicion);

        gl_FragColor = vec4(colorTotal , 1.0);
        //gl_FragColor = vec4(colorTexturaFinal , 1.0);
        

        // specularColor: vec3(0.95,0.67,0.03), 1.0)
    }else{
        gl_FragColor = vec4(vNormal,1.0);
    }
}

