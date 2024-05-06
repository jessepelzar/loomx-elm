/*
 * Eyeball Explosion
 * 
 * Copyright (C) 2018  Alexander Kraus <nr4@z10.info>
 * 
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 * 
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 * 
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

const float pi = acos(-1.);
const vec2 c = vec2(1.,0.);

float rand(vec2 a0)
{
    return fract(sin(dot(a0.xy ,vec2(12.9898,78.233)))*43758.5453);
}

float smoothstep_noise(float x)
{
    float r1 = -1.+2.*rand(floor(x)*c.xx), r2 = -1.+2.*rand(ceil(x)*c.xx);
    return mix(r1, r2, smoothstep(.25, .75, fract(x)));
}

float mfsmoothstep_noise(float x, float f0, float f1, float phi)
{
    float sum = 0.;
    float a = 1.;
    
    for(float f = f0; f<f1; f = f*2.)
    {
        sum = a*smoothstep_noise(f*x) + sum;
        a = a*phi;
    }
    
    return sum;
}

vec2 rot(vec2 x, float p)
{
    return mat2(cos(p), sin(p), -sin(p), cos(p))*x;
}

mat3 rot(vec3 p)
{
    vec3 cp = cos(p), sp = sin(p);
    mat3 m = mat3(cp.y*cp.x, cp.x*sp.z+cp.z*sp.x*sp.y, sp.x*sp.z-cp.x*cp.z*sp.y, 
           -cp.y*sp.z, cp.x*cp.z-sp.x*sp.y*sp.z, cp.z*sp.x+cp.x*sp.y*sp.z, 
           sp.y, -cp.y*sp.x, cp.x*cp.y);
    return m;
}

float rect(vec2 x, vec2 b)
{
    return length(max(abs(x)-b,0.));
}

vec3 synthcol(float scale, float phase)
{
    if(mColorMode == 1)
    {
       return vec3(scale*scale);
    }


    vec3 c2 = vec3(207.,30.,102.)/255.,
        c3 = vec3(245., 194., 87.)/255.;
    mat3 r1 = rot((5.e-1*phase)*vec3(1.1,1.3,1.5));
    return 
        (
            1.1*mix
            (
                -(cross(c2, r1*c2)),
                -(r1*c2), 
                scale
            )
        );
}

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    float time = iTime * 0.65 + 100.;
    vec2 uv = (fragCoord.xy / iResolution.xy-0.5);
    if(iResolution.x < iResolution.y)
    {
        uv.x *= iResolution.x/iResolution.y;
    }
    else
    {
        uv.y *= iResolution.y/iResolution.x;
    }
    uv *= 1.3;
    uv = rot(uv, .025*time);
    
    vec4 sdf = vec4(0., c.yyy);
    float power = pow(iForce/5.5, 3.);
    float N = pow(iComplexity/2.0, 4.)+1.0,
        r_inner = .2;
    
    for(int i=0; i<12; ++i)
    {
        uv = rot(uv, 1.1);
        vec2 p = vec2(length(uv), atan(uv.y/uv.x)-float(i)*.1*time),
        q = vec2(p.x-.05*float(i), mod(p.y, 2.*pi/N)-pi/N),
        q0 = vec2(r_inner, q.y);
    
        float index = (p-q).y;
        
        r_inner = .0+float(i)*.005+ .0005*12.;
        
        float dr = .1*mfsmoothstep_noise(index-time-4.*float(i), 1., 100., .45) + .05*rand(index*c.xx+.2*c.yx),
            len = abs(.005*float(i)+dr),
            width = abs(.015+.005*rand(index*c.xx+.4))*10.0*power;

        vec4 sda = vec4(rect(q-r_inner*c.xy, len*c.xy+width*c.yx), synthcol(((q.x-r_inner)/.05+(q.y/2./pi)), iTime+sin(iTime+1.*float(i))));
        sdf = mix(sdf, sda, step(sda.x, sdf.x));
    }
    
    vec3 col = sdf.gba*step(sdf.x, 0.);

    
    
    fragColor = vec4(col,1.0);
}