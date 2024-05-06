﻿// mi-ku/Altair
// https://www.shadertoy.com/view/Xsj3zy

float MULT =4.0*pow(iForce/5.5, 2.0);
int FNS = iComplexity*2;
#define FNSF float(FNS)
#define FNSFinv (1.0/FNSF)
#define BLUR_EPS 0.001

float fn(vec2 uv, vec2 suv)
{
    float val = ( texture(iAudioFFT,uv).r + 
                  texture(iAudioFFT,uv-vec2(BLUR_EPS,0.0)).r + 
                  texture(iAudioFFT,uv+vec2(BLUR_EPS,0.0)).r ) * 0.333;
    val *= smoothstep( 0.0, 1.0, clamp( ( 3.0 - abs( suv.x - 0.5 ) * 8.0 ), 0.0, 1.0 ) ) * 0.8 + 0.1;
    return val;
}

vec3 colorize(vec2 uv)
{
    for(int i = 0; i < FNS; i++)
    {
        vec2 pt = uv;
        float val = fn( uv * vec2( FNSFinv, 0.0 ) + vec2( float(i)/FNSF, 0.0 ), uv ) 
            * FNSFinv * MULT + ( float(i) + 0.2 )/FNSF;
        if ( val > pt.y )
        {
            float colv = float(i)/FNSF;
            vec3 col = vec3( colv );
            col += min( .14, max( .4 - abs( val - pt.y ) * 80.0, 0.0 ) );
            return col;
            break;
        }
    }
    return vec3( .0 );
}

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    vec2 uv = fragCoord.xy / iResolution.xy;
    uv.y = abs(uv.y);
    vec3 c1 = colorize(uv);
    fragColor = vec4(c1,1.0);
}