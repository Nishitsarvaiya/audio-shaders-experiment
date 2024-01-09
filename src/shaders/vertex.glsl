uniform float uAmp;
attribute float displacement;
varying vec3 vNormal;
varying vec2 vUv;

void main() {
    vNormal = normal;
    vUv = ( 0.5 + uAmp ) * uv + vec2( uAmp );
    vec3 newPosition = position + uAmp * normal * vec3( displacement );
    gl_Position = projectionMatrix * modelViewMatrix * vec4( newPosition, 1.0 );
}