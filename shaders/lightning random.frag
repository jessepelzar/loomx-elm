﻿ 
 

#define LIGHTNING_PARTS 11

float hash(float x)
{
    return fract(21654.6512 * sin(385.51 * x));
}

float hash(vec2 p)
{
    return fract(21654.65155 * sin(35.51 * p.x + 45.51 * p.y));
}

float lhash(float x, float y)
{
    float h = 0.0;
    
    for(int i = 0;i < 5;i++)
    {
        h += (fract(21654.65155 * float(i) * sin(35.51 * x + 45.51 * float(i) * y * (5.0 / float(i))))* 2.0 - 1.0) / 10.0;
    }
    return h / 5.0 + 0.02;
    return (fract(21654.65155 * sin(35.51 * x + 45.51 * y))* 2.0 - 1.0) / 20.0;
}

float noise(vec2 p)
{
    vec2 fl = floor(p);
    vec2 fr = fract(p);
    
    fr.x = smoothstep(0.0,1.0,fr.x);
    fr.y = smoothstep(0.0,1.0,fr.y);
    
    float a = mix(hash(fl + vec2(0.0,0.0)), hash(fl + vec2(1.0,0.0)),fr.x);
    float b = mix(hash(fl + vec2(0.0,1.0)), hash(fl + vec2(1.0,1.0)),fr.x);
    
    return mix(a,b,fr.y);
}


float distanceToSegment( vec2 a, vec2 b, vec2 p )
{
    vec2 pa = p - a;
    vec2 ba = b - a;
    float h = clamp( dot(pa,ba)/dot(ba,ba), 0.0, 1.0 );
    
    return length( pa - ba*h );
}

float fbm(vec2 p)
{
    float v = 0.0, f = 1.0, a = 0.5;
    
    for(int i = 0;i < 5; i++)
    {
        v += noise(p * f) * a;
        
        f *= 2.0;
        a *= 0.5;
    }
    
    return v;
}
float lightning2(vec2 ls, vec2 le, float intensity,vec2 uv)
{
    float f = 1.0;
    
    for(int i = 0;i < LIGHTNING_PARTS;i++)
    {
        
        vec2 ltemp1 = mix(ls,le,float(i) / float(LIGHTNING_PARTS));
        vec2 ltemp2 = mix(ls,le,float(i+1) / float(LIGHTNING_PARTS));
        float h3= fract(21654.65155 * sin(35.51 * ls.x));
        float lh1 = lhash(ltemp1.y, iTime*0.1);
        float lh2 = lhash(ltemp2.y, iTime*0.1);
        ltemp1.x += lh1;
        ltemp2.x += lh2;
        
        if(i == 0)
            f = min(f,distanceToSegment(ls, ltemp2, uv ));
        //else if(i == LIGHTNING_PARTS - 1)
            //f = min(f,distanceToSegment(ltemp1, le, uv ));
        else            
            f = min(f,distanceToSegment(ltemp1, ltemp2, uv ));
        //if(abs(h3) > 0.07 && intensity > 0.1)         
            //f = min(f,lightning(ltemp1, vec2(mix(ltemp1, le, 0.5) + vec2(lh1 * 3.0 - h3 * 5.0,h3 * 5.0)),intensity * 0.5,uv));
    
        //  f = min(f,distanceToSegment(ltemp1, vec2(mix(ltemp1, le, 0.5) + vec2(lh1 * 3.0 - h3 * 5.0,h3 * 5.0)),uv));
    }
    
    return f;
}

float lightning(vec2 ls, vec2 le, float intensity,vec2 uv)
{
    if(intensity < 0.3)
        return 1.0;
    
    float f = 1.0;
    
    for(int i = 0;i < LIGHTNING_PARTS;i++)
    {
        
        vec2 ltemp1 = mix(ls,le,float(i) / float(LIGHTNING_PARTS));
        vec2 ltemp2 = mix(ls,le,float(i+1) / float(LIGHTNING_PARTS));
        float h3 = fract(22654.65155 * ls.x * sin(3542.51 * ltemp1.y * le.y)) - sqrt(ltemp1.y) + 0.6;
        float lh1 = lhash(ltemp1.y + ltemp1.x, iTime*0.1);
        float lh2 = lhash(ltemp2.y + ltemp2.x, iTime*0.1);
        ltemp1.x += lh1;
        ltemp2.x += lh2;
        
        if(i == 0)
            f = min(f,distanceToSegment(ls, ltemp2, uv ));
        else            
            f = min(f,distanceToSegment(ltemp1, ltemp2, uv ));
        if(h3 > 0.9)            
            f = min(f,sqrt(float(i + 2)) * lightning2(ltemp1, vec2(le.x + ltemp1.y + sqrt(h3) - 1.0 + lh1 * 7.0,le.y),intensity * 0.5,uv)) ;
    }
    
    return f;
}

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    vec2 uv = (fragCoord.xy / iResolution.xy-0.5)*2.0;
    if(iResolution.x < iResolution.y)
    {
        uv.x *= iResolution.x/iResolution.y;
    }
    else
    {
        uv.y *= iResolution.y/iResolution.x;
    }
        
    //fractal brownian motion
    vec2 cad = uv + vec2(iTime*0.1,0.0);     
    float p = fbm(cad); 
    p = 1.0 - abs(p * 2.0 - 1.0);
    
    //Background
    vec3 col = vec3(0.);
    
    
    
    vec2 ls = vec2(0.0,1.01);
    vec2 le = vec2(0.0 ,-1.0);
    //ls.x = mod(-iTime*0.1,2.0)-1.0;
    //le.x = mod(-iTime*0.1,2.0)-1.0;
    
    float f = 1.0;
    for(int i = 0; i < 60*iComplexity; i++ )
    {
        //Lightning Seeds
        float h = hash(vec2(sqrt(float(i)),floor((iTime*0.1) * 7.0 + (float(i) / 10.0)) * float(i)));
        ls.x = hash(h) * 3.0  - mod(iTime*0.1,3.0);
        le.x = ls.x + sqrt(hash(sqrt(h + float(i)))) - 0.5;
        
        if(h > 0.96)
            f = min(f,lightning(ls,le,1.0,uv)); 
    }
    col = mix( col, vec3(1.0), 1.0-smoothstep(0.0,0.2,pow(f / (pow(iForce/5.5,2.) * 2.0),0.5) - uv.y/40.0) );
    
    fragColor = vec4(col,1.0);
}