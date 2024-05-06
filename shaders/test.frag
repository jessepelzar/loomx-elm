#ifdef GL_ES
precision mediump float;
#endif

//uniform float time;
uniform vec2 mouse;
//uniform vec2 resolution;

uniform float iHueShiftRad; // enable hue shift param

const float lineScale = 12.0;

vec4 testFrag(out vec4 fragColor, in vec2 fragCoord)
{
    vec2 position = -1.0 + 2.0 * (fragCoord.xy / iResolution.xy);
    position.x *= iResolution.x / iResolution.y;
    
    position += vec2(cos(iTime * 0.2), sin(iTime * 0.5)) * 3.8;

    vec3 colour = vec3(0.0);
    
    float u = sqrt(dot(position, position));
    float v = atan(position.y, position.x);
    
    float t = iTime + 1.0 / u;
    
    float val = smoothstep(0.0, 1.0, sin(5.0 * (iTime + sin(1.0*u * 3.7)) + 10.0 * v) + cos(t * 10.0));
    
    colour = vec3(val / 0.1, val, val*1.0) + (0.9 - val) * vec3(0.05, 0.05, 0.05);
    colour *= clamp(1.0, 1.0, 1.0);
    
    fragColor = vec4(colour, 1.0);

    return fragColor;
}

void mainImage(out vec4 fragColor, in vec2 fragCoord)
{
    // Define a placeholder value or ensure `iForce2` is defined and passed correctly
   // float iForce2 = 1.0; // Placeholder value, adjust as needed

    float power = pow(iForce / 5.5, 3.0) * 0.02 + 0.0;
    fragColor = testFrag(fragColor, fragCoord);
}

