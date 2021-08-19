uniform mat4 projectionMatrix;
uniform mat4 viewMatrix;
uniform mat4 modelMatrix;
uniform mat4 modelViewMatrix;


attribute vec3 position;
attribute vec3 translate;
attribute float lifeTime;


attribute vec2 uv;
uniform float uYSpam;
uniform float uTime;
varying float vTime;
varying float vLifeTime;


float speed = 2.0;
float lifeTimeLimit = 10.0;
// varying vec2 vUv;

void main(){

    // vec4 modelPosition = modelMatrix * vec4(position, 1.0);

    // modelPosition.y +=  uTime * speed ;
    // vTime = uTime;
    vLifeTime = lifeTime;
    // // vUv = uv;
    // vec4 viewPosition = viewMatrix * modelPosition;
    // vec4 projectionPosition = projectionMatrix * viewPosition;

    // gl_Position = projectionPosition;

    vec3 trTime = vec3(translate.x,translate.y - lifeTime,translate.z);
    vec4 mvPosition = modelViewMatrix * vec4( trTime, 1.0 );
    
    // float scale =  sin( trTime.x * 2.1 ) + sin( trTime.y * 3.2 ) + sin( trTime.z * 4.3 );
    // vScale = scale;
    float scale = 1.0 - lifeTime/lifeTimeLimit;
    mvPosition.xyz += position*scale;
    // vUv = uv;
	gl_Position = projectionMatrix * mvPosition;

}   