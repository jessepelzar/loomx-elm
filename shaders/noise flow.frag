﻿//Noise animation - Flow
//by nimitz (stormoid.com) (twitter: @stormoid)


//Somewhat inspired by the concepts behind "flow noise"
//every octave of noise is modulated separately
//with displacement using a rotated vector field

//normalization is used to created "swirls"
//usually not a good idea, depending on the type of noise
//you are going for.

//Sinus ridged fbm is used for better effect.

#define time iTime*0.3
#define tau 6.2831853


#define iBaseHueRad 0.9563 

mat2 makem2(in float theta){float c = cos(theta);float s = sin(theta);return mat2(c,-s,s,c);}
float noise( in vec2 x ){return texture(iChannel0, x*.01).x;}
mat2 m2 = mat2( 0.80,  0.60, -0.60,  0.80 );

float grid(vec2 p)
{
    float s = sin(p.x)*cos(p.y);
    return s;
}

float flow(in vec2 p)
{
    float z=2.;
    float rz = 0.;
    vec2 bp = p;
    float power = pow(iForce/5.5, 3.);
    for (float i= 1.;i < 4.;i++ )
    {
        bp += time*1.5;
        vec2 gr = vec2(grid(p*3.-time*2.),grid(p*3.+4.-time*2.))*0.4;
        gr = normalize(gr)*0.4;
        gr *= makem2((p.x+p.y)*.3+time*10.);
        p += gr*0.5;
        
        rz+= (sin(noise(p)*8.)*0.5+0.5) /z;
        
        p = mix(bp,p,.5);
        z *= 1.7 * power;
        p *= 2.5;
        p*=m2;
        bp *= 2.5;
        bp*=m2;
    }
    return rz;  
}

float spiral(vec2 p,float scl) 
{
    float r = length(p);
    r = log(r);
    float a = atan(p.y, p.x);
    return abs(mod(scl*(r-(0.+iComplexity)/scl*a),tau)-1.)*2.;
}

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
	vec2 p = (fragCoord.xy / iResolution.xy-0.5);
	
    if(iResolution.x < iResolution.y)
    {
        p.x *= iResolution.x/iResolution.y;
    }
    else
    {
        p.y *= iResolution.y/iResolution.x;
    }
    p*= 3.;
	
	
	
    float rz = flow(p);
    p /= exp(mod(time*3.,2.1));
    rz *= (6.-spiral(p,3.))*.9;
    vec3 col = vec3(.2,0.07,0.01)/rz;
    col=pow(abs(col),vec3(1.01));
    fragColor = vec4(col,1.0);
}