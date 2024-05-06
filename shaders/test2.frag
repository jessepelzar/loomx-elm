// ---------------------- Noise from procedural pseudo-Perlin ---------------------
// Adapted from IQ

// Hash function to generate a pseudorandom value
float hash3(vec3 p) {
    return fract(sin(dot(p, vec3(1.0, 57.0, -13.7))) * 4375.5453);
}

float noisey(vec3 x) {
    vec3 p = floor(x), f = fract(x);
    f = f * f * (3.0 - 2.0 * f); // Use smoothstep to make the derivative continuous at borders

    return mix(mix(mix(hash3(p + vec3(0.0, 0.0, 0.0)), hash3(p + vec3(1.0, 0.0, 0.0)), f.x),
                    mix(hash3(p + vec3(0.0, 1.0, 0.0)), hash3(p + vec3(1.0, 1.0, 0.0)), f.x), f.y),
               mix(mix(hash3(p + vec3(0.0, 0.0, 1.0)), hash3(p + vec3(1.0, 0.0, 1.0)), f.x),
                    mix(hash3(p + vec3(0.0, 1.0, 1.0)), hash3(p + vec3(1.0, 1.0, 1.0)), f.x), f.y), f.z);
}

#define noise(x) (noisey(x) + noisey(x + 11.5)) / 2.0

void mainImage(out vec4 fragColor, vec2 fragCoord) {
    vec2 R = iResolution.xy;
    float n = noise(vec3(fragCoord * 8.0 / R.y, 0.1 * iTime)),
          v = sin(6.28 * 10.0 * n),
          t = iTime;
    
    v = smoothstep(1.0, 0.0, 0.5 * abs(v) / fwidth(v));
    
    fragColor = mix(exp(-33.0 / R.y) * texture(iChannel0, (fragCoord + vec2(1.0, sin(t))) / R),
                    0.5 + 0.5 * sin(12.0 * n + vec4(0.0, 2.1, -2.1, 0.0)),
                    v);
}

