﻿vec4 hue(vec4 color, float shift) {

    const vec4  kRGBToYPrime = vec4 (0.299, 0.587, 0.114, 0.0);
    const vec4  kRGBToI     = vec4 (0.596, -0.275, -0.321, 0.0);
    const vec4  kRGBToQ     = vec4 (0.212, -0.523, 0.311, 0.0);

    const vec4  kYIQToR   = vec4 (1.0, 0.956, 0.621, 0.0);
    const vec4  kYIQToG   = vec4 (1.0, -0.272, -0.647, 0.0);
    const vec4  kYIQToB   = vec4 (1.0, -1.107, 1.704, 0.0);

    // Convert to YIQ
    float   YPrime  = dot (color, kRGBToYPrime);
    float   I      = dot (color, kRGBToI);
    float   Q      = dot (color, kRGBToQ);

    // Calculate the hue and chroma
    float   hue     = atan (Q, I);
    float   chroma  = sqrt (I * I + Q * Q);

    // Make the user's adjustments
    hue += shift;

    // Convert back to YIQ
    Q = chroma * sin (hue);
    I = chroma * cos (hue);

    // Convert back to RGB
    vec4    yIQ   = vec4 (YPrime, I, Q, 0.0);
    color.r = dot (yIQ, kYIQToR);
    color.g = dot (yIQ, kYIQToG);
    color.b = dot (yIQ, kYIQToB);

    return color;
}

vec2 kale(vec2 uv, float angle, float base, float spin) {
    float a = atan(uv.y,uv.x)+spin;
    float d = length(uv);
    a = mod(a,angle*2.0);
    a = abs(a-angle);
    uv.x = sin(a+base)*d;
    uv.y = cos(a+base)*d;
    return uv;
}

vec2 rotate(float px, float py, float angle){
    vec2 r = vec2(0);
    r.x = cos(angle)*px - sin(angle)*py;
    r.y = sin(angle)*px + cos(angle)*py;
    return r;
}

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    float p = 3.14159265359;
    float i = iTime*.6;
    vec2 uv = fragCoord.xy / iResolution.xy*5.0-2.5;
    uv = kale(uv, p/(iComplexity+1.0),i,i*0.2);
    vec4 c = vec4(1.0);
    mat2 m = mat2(sin(uv.y*cos(uv.x+i)+i*0.1)*3.6*pow(iForce/5.5, 3.0),-6.0,sin(uv.x+i*1.5)*3.0,-cos(uv.y-i)*2.0);
    uv = rotate(uv.x,uv.y,length(uv)+i*.4);
    c.rg = cos(sin(uv.xx+uv.yy)*m-i);
    c.b = sin(rotate(uv.x,uv.x,length(uv.xx)*3.0+i).x-uv.y+i);
    fragColor = vec4(1.0-hue(c,i).rgb,1.0);
}