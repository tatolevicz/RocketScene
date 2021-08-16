precision mediump float;

uniform vec3 uStartColor;
uniform vec3 uEndColor;
uniform sampler2D uTexture;

varying float vTime;
varying vec2 vUv;

void main(){
    vec4 textureColor = texture2D(uTexture,vUv);
    gl_FragColor = vec4(textureColor.xy, vTime*0.01, 1.0);
}   