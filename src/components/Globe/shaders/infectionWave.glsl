// Infection wave fragment shader
// Renders a pulsating red heatmap on the globe surface

uniform float uTime;
uniform float uIntensity;
uniform vec3 uCenter;
uniform float uRadius;

varying vec3 vPosition;
varying vec2 vUv;

void main() {
    float dist = distance(vPosition, uCenter);
    float wave = sin(dist * 10.0 - uTime * 3.0) * 0.5 + 0.5;
    float falloff = exp(-dist * dist / (uRadius * uRadius * 2.0));
    float pulse = sin(uTime * 2.0) * 0.15 + 0.85;

    float intensity = uIntensity * falloff * pulse;

    vec3 innerColor = vec3(0.9, 0.1, 0.05);
    vec3 outerColor = vec3(0.95, 0.5, 0.0);
    vec3 color = mix(outerColor, innerColor, falloff);

    float glow = wave * falloff * 0.3;
    color += vec3(glow, glow * 0.2, 0.0);

    float alpha = intensity * 0.7;
    alpha = clamp(alpha, 0.0, 0.85);

    gl_FragColor = vec4(color, alpha);
}
