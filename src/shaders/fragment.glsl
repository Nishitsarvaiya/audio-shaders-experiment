varying vec3 vNormal;
varying vec2 vUv;

void main() {
    vec3 light = vec3( 1.0, 1.0, 1.0 );
    light = normalize( light );
    float dProd = dot( vNormal, light ) * 0.5 + 0.5;
    gl_FragColor = vec4(vec3( dProd ), 1.0 );
}