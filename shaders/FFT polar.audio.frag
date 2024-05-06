﻿// https://www.shadertoy.com/view/MlXyzN
#define PI     3.14159265358
#define TWO_PI 6.28318530718

float random1d(float n){
    return fract(sin(n) * 43758.5453);
}

vec3 hsv2rgb(vec3 c){
    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

vec2 rotate2D(vec2 position, float theta){
    mat2 m = mat2( cos(theta), -sin(theta), sin(theta), cos(theta) );
    return m * position;
}

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
     
    vec2 uv = fragCoord.xy / iResolution.xy;
    uv -= 0.5;
    //fix aspect ratio
    uv.x *= iResolution.x/iResolution.y;
    
    //get a bass level
    float bass  = iAudioLow*iForce/4.5; 
    //bass bounce
    //uv *= 1.0 + (1.0 - bass)*0.5;
    //bass shake
    //uv += (vec2(random1d(iTime),random1d(iTime + 1.0)) - 0.5)* 0.015;
    //spin
    uv = rotate2D(uv, 0.2);
    
    uv += 0.5;
    
    // get polar angle and radius
    vec2 pos = vec2(0.5)-uv;
    float r = length(pos)*2.0 ;
    float a = atan(pos.y,pos.x);   
    float normAng = fract(0.75 -(a /PI) /2.0); //0 - 1 clockwise
    
    //get stepped angle
    float SPOKES = iNbItems;
    float sa = floor(normAng * SPOKES)/ SPOKES;
   
    // the sound texture is 512x2
    float tx = sa;
    // first row is frequency data (48Khz/4 in 512 texels, meaning 23 Hz per texel)
    float fft  = texture( iAudioFFT, vec2(tx,0.25) ).x*iForce/4.5; 
    
    //white spokes
    vec3 fgCol = vec3(1.0);  

    //mask spokes by angle
    float aEdge = 1.0;
    float s = fract(normAng * SPOKES);
    float mask = smoothstep(0.4, 0.4 + aEdge, s);
    float edgerr = smoothstep(aEdge, 0.0, s);
    mask = max(mask,edgerr);
    
    //mask radial center and edges
    float rEdge = 0.01;
    float maxLen = 1.0;
    float innerRad = 0.4;
    float inner = 1.0 - smoothstep(innerRad,innerRad + rEdge, r);
    
    //outer edge dependent on volume
    float top = innerRad + maxLen * fft * fft;
    float outer = smoothstep(top, top + rEdge,r);
    mask = max(mask,inner);
    mask = max(mask,outer);
    fgCol -= mask;
    
    //add a glowy rainbow
    float radialGrad = (1.0 - r * 0.4) * 2.0;
    vec3 bgCol = hsv2rgb(vec3(normAng + 0.,0.9,fft*fft * radialGrad + 0.1));
    
    //knockout inner circ
    float inner2 = 1.0 - step(0.2, r);
    bgCol = min(bgCol,1.0 - inner2);
    
    //vec3 col = mix(fgCol,bgCol,mask);
    vec3 col = bgCol + fgCol;
    
    // output final color
    fragColor = vec4(col,1.0);
    
}