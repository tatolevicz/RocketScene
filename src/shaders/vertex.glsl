uniform mat4 projectionMatrix;
uniform mat4 viewMatrix;
uniform mat4 modelMatrix;

attribute vec3 position;
attribute vec2 uv;
uniform float uYSpam;
uniform float uTime;
varying float vTime;
varying vec2 vUv;

void main(){

    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    // modelPosition.y -=  uTime;
    vTime = uTime;
    vUv = uv;

    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectionPosition = projectionMatrix * viewPosition;

    gl_Position = projectionPosition;

}   