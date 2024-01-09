varying vec3 vPosition;
varying vec3 vNormal;
varying vec2 vUv;


void main() {
    vPosition = position;
    vNormal = normal;
    vUv = uv;
    // vec3 newPosition = position + normal * displacement;
    vec4 modelViewPosition = modelViewMatrix * vec4(position, 1.0);
    vec4 projectedPosition = projectionMatrix * modelViewPosition;
    gl_Position = projectedPosition;
}