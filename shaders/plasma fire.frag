﻿// I started working a bit on the colors of Remix 2, ended up with something like this. :)
// https://www.shadertoy.com/view/4ttGWM
// Remix 2 here: https://www.shadertoy.com/view/MtcGD7
// Remix 1 here: https://www.shadertoy.com/view/llc3DM
// Original here: https://www.shadertoy.com/view/XsXXRN

#define iBaseHueRad 0.92

float rand(vec2 n) {
    return fract(sin(cos(dot(n, vec2(12.9898,12.1414)))) * 83758.5453);
}

float noise(vec2 n) {
    const vec2 d = vec2(0.0, 1.0);
    vec2 b = floor(n), f = smoothstep(vec2(0.0), vec2(1.0), fract(n));
    return mix(mix(rand(b), rand(b + d.yx), f.x), mix(rand(b + d.xy), rand(b + d.yy), f.x), f.y);
}

float fbm(vec2 n) {
    float total = 0.0, amplitude = 1.0;
    for (int i = 0; i <5; i++) {
        total += noise(n) * amplitude;
        n += n*1.7;
        amplitude *= 0.47;
    }
    return total;
}

void mainImage( out vec4 fragColor, in vec2 fragCoord ) {

    const vec3 c1 = vec3(0.5, 0.0, 0.1);
    const vec3 c2 = vec3(0.9, 0.1, 0.0);
    const vec3 c3 = vec3(0.2, 0.1, 0.7);
    const vec3 c4 = vec3(1.0, 0.9, 0.1);
    const vec3 c5 = vec3(0.1);
    const vec3 c6 = vec3(0.9);

    vec2 speed = vec2(0.1, 0.9);
    
    float alpha = 1.0;
    float time = iTime * 0.3;
    
    float dist = 3.5-sin(time*0.4)/1.89;
    
    
    vec2 p = fragCoord.xy * dist;



    if(iResolution.x < iResolution.y)
    {
        p /= iResolution.xx;
    }
    else
    {
        p /= iResolution.yy;
    }

    p += sin(p.yx*4.0+vec2(.2,-.3)*time)*0.04;
    p += sin(p.yx*8.0+vec2(.6,+.1)*time)*0.01;
    
    p.x -= time/1.1;
    float q = fbm(p - time * 0.3+1.0*sin(time+0.5)/2.0);
    float qb = fbm(p - time * 0.4+0.1*cos(time)/2.0);
    float q2 = fbm(p - time * 0.44 - 5.0*cos(time)/2.0) - 6.0;
    float q3 = fbm(p - time * 0.9 - 10.0*cos(time)/15.0)-4.0;
    float q4 = fbm(p - time * 1.4 - 20.0*sin(time)/14.0)+2.0;
    q = (q + qb - .4 * q2 -2.0*q3  + .6*q4)/3.8;
    vec2 r = vec2(fbm(p + q /2.0 + time * speed.x - p.x - p.y), fbm(p + q - time * speed.y));
    vec3 c = mix(c1, c2, fbm(p + r)) + mix(c3, c4, r.x) - mix(c5, c6, r.y);
    
    float force = (10.0-iForce)*0.75;
    float force2 = pow(iForce2/2.0,3.);    

    vec3 color=vec3(1.0,.2,.05)/(pow((r.y+r.y)* max(.0,p.y)+0.1, force));;
    color *= force2;
    
    color = color/(1.0+max(vec3(0),color));
    fragColor = vec4(color.x, color.y, color.z, alpha);
}