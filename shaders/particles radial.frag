// Created by Stephane Cuillerdier - @Aiekick/2016
// License Creative Commons Attribution-NonCommercial-ShareAlike 3.0 Unported License.

void mainImage( out vec4 f, vec2 fragCoord )
{
    float 
        t = iTime*0.5,
        p;

    vec2 uv = (fragCoord.xy / iResolution.xy-0.5)*4.0;
    if(iResolution.x < iResolution.y)
    {
        uv.x *= iResolution.x/iResolution.y;
    }
    else
    {
        uv.y *= iResolution.y/iResolution.x;
    }
    
    vec2 
        s = iResolution.xy,
        
        ar = vec2(
            atan(uv.x, uv.y) * 3.18*0.2*iComplexity + t*2., 
            length(uv)*3. + sin(t*.5)*10.);
    
    p = floor(ar.y)/5.;
    
    ar = abs(fract(ar)-.5);
    float power = pow(iForce/5.5, 3.);
    f = 
        mix(
            vec4(1,.3,0,1), 
            vec4(.3,.2,.5,1), 
            vec4(p)) 
        * power*0.4/dot(ar,ar) * .1;
}
