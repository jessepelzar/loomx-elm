void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    float time=iTime*1.12;
    vec2 uv = ((fragCoord.xy / iResolution.xy)-0.5)*8.0;     
    
    if(iResolution.x < iResolution.y)
    {
        uv.x *= iResolution.x/iResolution.y;
    }
    else
    {
        uv.y *= iResolution.y/iResolution.x;
    }
    vec2 uv0=uv;
    float i0=1.0;
    float i1=1.0;
    float i2=1.0;
    float i4=0.0;
    float power = pow(iForce/5.5, 2.);
    for(int s=0;s<iComplexity;s++)
    {
        vec2 r;
        r=vec2(cos(uv.y*i0-i4+time/i1+sin(.728 + 0.2324*time)),sin(uv.x*i0-i4+time/i1-cos(.128 + 0.165*time)))/i2;
        r+=vec2(-r.y,r.x)*0.3;
        uv.xy+=r;
        
        i0*=1.93*power;
        i1*=1.15;
        i2*=1.7;
        i4+=0.05+0.1*time*i1;
    }
    float r=sin(uv.x-time+cos(.628 + 0.065*time)-sin(.1628 + 0.285*time))*0.5+0.5;
    float b=sin(uv.y+time+cos(.228 + 0.1*time)-sin(.0828 + 0.385*time))*0.5+0.5;
    float g=sin((uv.x+uv.y+sin(time*0.5+cos(.328 + 0.1*time)))*0.5)*0.5+0.5;
    
    fragColor = vec4(r,g,b,1.0);
    
    fragColor *= vec4(1, .7, .4, 1) 
        *  pow(max(normalize(vec3(length(dFdx(fragColor)), length(dFdy(fragColor)), .5/iResolution.y)).z, 0.), 2.)
        + .75; 
}