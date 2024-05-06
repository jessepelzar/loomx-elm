// https://www.shadertoy.com/view/sdlfRj


void mainImage( out vec4 O, vec2 U )
{
    vec2 R = iResolution.xy;
    U *= 7./R;
    O-=O;
    for(float i=0.,v; i++ < 70.; )
        v = 9.-i/6.+2.*cos(U.x + sin(i/6. + iTime ) ) - U.y,
        O = mix(O, vec4(int(i)%2), smoothstep(0.,15./R.y, v) );
}


