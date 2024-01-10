import {
	BufferAttribute,
	DoubleSide,
	IcosahedronGeometry,
	MathUtils,
	Mesh,
	MeshStandardMaterial,
	PlaneGeometry,
	ShaderMaterial,
} from "three";
import fragmentMain from "../shaders/fragment_main.glsl";
import fragmentPars from "../shaders/fragment_pars.glsl";
import vertexMain from "../shaders/vertex_main.glsl";
import vertexPars from "../shaders/vertex_pars.glsl";
import App from "../App";

export default class Plane {
	constructor() {
		this.init();
	}

	init() {
		this.properties = {
			width: 16,
			height: 16,
			widthSegments: 400,
			heightSegments: 400,
			wireframe: false,
			color: 0xffffff,
		};
		this.uniforms = {
			uTime: { value: 0 },
			uAmplitude: { value: 0.1 },
		};
		// this.geometry = new PlaneGeometry(
		// 	this.properties.width,
		// 	this.properties.height,
		// 	this.properties.widthSegments,
		// 	this.properties.heightSegments
		// );
		this.geometry = new IcosahedronGeometry(5, 100);
		this.material = new MeshStandardMaterial({
			onBeforeCompile: (shader) => {
				// storing a reference to the shader object
				this.material.userData.shader = shader;

				// uniforms
				shader.uniforms.uTime = this.uniforms.uTime;
				shader.uniforms.uAmplitude = this.uniforms.uAmplitude;

				const parsVertexString = /* glsl */ `#include <displacementmap_pars_vertex>\n`;
				shader.vertexShader = shader.vertexShader.replace(
					parsVertexString,
					parsVertexString + "\n" + vertexPars + "\n"
				);

				const mainVertexString = /* glsl */ `#include <displacementmap_vertex>\n`;
				shader.vertexShader = shader.vertexShader.replace(
					mainVertexString,
					mainVertexString + "\n" + vertexMain + "\n"
				);

				const mainFragmentString = /* glsl */ `#include <normal_fragment_maps>`;
				const parsFragmentString = /* glsl */ `#include <bumpmap_pars_fragment>`;
				shader.fragmentShader = shader.fragmentShader.replace(
					parsFragmentString,
					parsFragmentString + "\n" + fragmentPars + "\n"
				);
				shader.fragmentShader = shader.fragmentShader.replace(
					mainFragmentString,
					mainFragmentString + "\n" + fragmentMain + "\n"
				);
			},
			side: DoubleSide,
			wireframe: this.properties.wireframe,
			// fragmentShader: fragmentShader,
			// vertexShader: vertexShader,
			// uniforms: this.uniforms,
		});
		this.material.needsUpdate = true;
		this.mesh = new Mesh(this.geometry, this.material);
	}

	update() {
		if (App.audioManager?.isPlaying) {
			// Dynamically update amplitude based on the high frequency data from the audio manager
			this.material.userData.shader.uniforms.uAmplitude.value =
				0.8 + MathUtils.mapLinear(App.audioManager.frequencyData.high, 0, 0.4, 0, 8);
		}
	}
}
