import { DoubleSide, Mesh, MeshStandardMaterial, PlaneGeometry, ShaderMaterial } from 'three';
import fragmentShader from '../shaders/fragment.glsl';
import vertexShader from '../shaders/vertex.glsl';

export default class Plane {
	constructor() {
		this.init();
	}

	init() {
		this.properties = {
			width: 16,
			height: 16,
			widthSegments: 36,
			heightSegments: 36,
			wireframe: false,
			color: 0xffffff,
		};
		this.uniforms = {
			uTime: { value: 0 },
			uResolution: { value: { x: window.innerWidth, y: window.innerHeight } },
		};
		this.geometry = new PlaneGeometry(
			this.properties.width,
			this.properties.height,
			this.properties.widthSegments,
			this.properties.heightSegments
		);
		this.material = new ShaderMaterial({
			side: DoubleSide,
			wireframe: this.properties.wireframe,
			fragmentShader: fragmentShader,
			vertexShader: vertexShader,
			uniforms: this.uniforms,
		});
		this.mesh = new Mesh(this.geometry, this.material);
	}
}
