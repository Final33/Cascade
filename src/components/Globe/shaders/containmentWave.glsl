// Containment wave fragment shader
// Renders expanding blue rings from intervention points

uniform float uTime;
uniform vec3 uCenter;
uniform float uMaxRadius;
uniform float uSpeed;

varying vec3 vPosition;

void main() {
    float dist = distance(vPosition, uCenter);

    float waveRadius = mod(uTime * uSpeed, uMaxRadius);

    float ringWidth = 0.15;
    float ringDist = abs(dist - waveRadius);
    float ring = smoothstep(ringWidth, 0.0, ringDist);

    float trailDist = dist - waveRadius;
    float trail = smoothstep(0.0, -ringWidth * 3.0, trailDist) * 0.3;

    float fade = 1.0 - smoothstep(0.0, uMaxRadius, waveRadius);

    vec3 coreColor = vec3(0.3, 0.8, 1.0);
    vec3 edgeColor = vec3(0.1, 0.3, 0.9);
    vec3 color = mix(edgeColor, coreColor, ring);

    float alpha = (ring + trail) * fade;
    alpha = clamp(alpha, 0.0, 0.7);

    gl_FragColor = vec4(color, alpha);
}
