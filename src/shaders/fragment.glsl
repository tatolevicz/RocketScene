precision mediump float;

uniform vec3 uStartColor;
uniform vec3 uEndColor;
uniform sampler2D uTexture;

varying float vTime;
varying float vLifeTime;
void main(){

    vec4 orange = vec4(uStartColor, 1.0);
    vec4 white = vec4(uEndColor, 1.0);
    vec4 mixC = mix(orange, white, vLifeTime*0.2);
    gl_FragColor = mixC;

}   