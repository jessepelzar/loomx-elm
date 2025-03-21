// Created by inigo quilez - iq/2014
// License Creative Commons Attribution-NonCommercial-ShareAlike 3.0 Unported License.

// { 2d cell id, distance to border, distnace to center )
vec4 hexagon( vec2 p ) 
{
	vec2 q = vec2( p.x*2.0*0.5773503, p.y + p.x*0.5773503 );
	
	vec2 pi = floor(q);
	vec2 pf = fract(q);

	float v = mod(pi.x + pi.y, 3.0);

	float ca = step(1.0,v);
	float cb = step(2.0,v);
	vec2  ma = step(pf.xy,pf.yx);
	
    // distance to borders
	float e = dot( ma, 1.0-pf.yx + ca*(pf.x+pf.y-1.0) + cb*(pf.yx-2.0*pf.xy) );

	// distance to center	
	p = vec2( q.x + floor(0.5+p.y/1.5), 4.0*p.y/3.0 )*0.5 + 0.5;
	float f = length( (fract(p) - 0.5)*vec2(1.0,0.85) );		
	
	return vec4( pi + ca - cb*ma, e, f );
}

float hash1( vec2  p ) { float n = dot(p,vec2(127.1,311.7) ); return fract(sin(n)*43758.5453); }

float noise( in vec3 x )
{
    vec3 p = floor(x);
    vec3 f = fract(x);
	f = f*f*(3.0-2.0*f);
	vec2 uv = (p.xy+vec2(37.0,17.0)*p.z) + f.xy;
	vec2 rg = textureLod( iChannel0, (uv+0.5)/256.0, 0.0 ).yx;
	return mix( rg.x, rg.y, f.z );
}


void mainImage( out vec4 fragColor, in vec2 fragCoord ) 
{
    vec2 pos = (fragCoord.xy / iResolution.xy-0.5)*3.0;
    if(iResolution.x < iResolution.y)
    {
        pos.x *= iResolution.x/iResolution.y;
    }
    else
    {
        pos.y *= iResolution.y/iResolution.x;
    }


    vec3 col = vec3(0.);

	vec4 h = hexagon(6.0*pos);	
	float n = noise( vec3(0.3*h.xy+iTime*0.1,iTime) );
	vec3 colb = 0.6 + 0.8*sin( hash1(h.xy)*1.5 + 2.0 + vec3(0.0,0.0,0.0) );
	colb *= smoothstep( 0.10, 0.11, h.z );	
	colb *= 0.75 + 0.5*h.z*n;

	col = mix( col, colb, smoothstep(0.45,0.451,n) );

	fragColor = vec4( col, 1.0 );
}