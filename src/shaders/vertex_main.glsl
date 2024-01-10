vec3 coords = position * 0.2;
coords.y += uTime;
vec3 noisePattern = vec3(noise(coords / 1.5));
float pattern = wave(noisePattern + uTime);

vDisplacement = pattern;

float displacement = vDisplacement / 3.0;
float amp = uAmplitude;

transformed += normalize(objectNormal) * displacement * amp;
