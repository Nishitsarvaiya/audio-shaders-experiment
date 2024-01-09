import { Color, DirectionalLight, MathUtils, PerspectiveCamera, Scene, WebGLRenderer } from "three";
import { OrbitControls } from "three/examples/jsm/Addons";
import Plane from "./objects/Plane";

export default class App {
	//THREE objects
	static holder = null;
	static gui = null;

	//Managers
	static audioManager = null;
	static bpmManager = null;

	constructor() {
		this.init();
	}

	init() {
		this.width = window.innerWidth;
		this.height = window.innerHeight;

		this.renderer = new WebGLRenderer({ antialias: true, alpha: true });
		this.renderer.setSize(this.width, this.height);
		this.renderer.autoClear = false;
		document.getElementById("app").appendChild(this.renderer.domElement);

		this.camera = new PerspectiveCamera(75, this.width / this.height, 0.1, 50);
		this.camera.position.set(0, 0, 20);

		this.controls = new OrbitControls(this.camera, this.renderer.domElement);
		this.controls.enableDamping = true;
		this.controls.enablePan = false;
		this.controls.update();

		this.scene = new Scene();
		this.scene.background = new Color(0x444444);

		this.lights = [];
		this.lights[0] = new DirectionalLight(0xffffff, 10);
		this.lights[1] = new DirectionalLight(0xffffff, 10);
		this.lights[2] = new DirectionalLight(0xffffff, 10);

		this.lights[0].position.set(0, 20, 0);
		this.lights[1].position.set(10, 20, 10);
		this.lights[2].position.set(-10, -20, -10);

		this.scene.add(this.lights[0]);
		this.scene.add(this.lights[1]);
		this.scene.add(this.lights[2]);

		this.resize();
		window.addEventListener("resize", () => this.resize());
		this.createObjects();
		this.update();
	}

	resize() {
		this.width = window.innerWidth;
		this.height = window.innerHeight;
		this.camera.aspect = this.width / this.height;
		this.camera.updateProjectionMatrix();
		this.renderer.setSize(this.width, this.height);
	}

	update() {
		requestAnimationFrame(() => this.update());
		const time = Date.now() * 0.01;
		this.renderer.render(this.scene, this.camera);
		this.controls.update();
		this.plane.material.uniforms.uTime.value += time;
		this.plane.uniforms.uAmp.value = 2.5 * Math.sin(0.125);

		for (let i = 0; i < this.plane.displacement.length; i++) {
			this.plane.displacement[i] = Math.sin(0.1 * i + time);

			this.plane.noise[i] += 0.5 * (0.5 - Math.random());
			this.plane.noise[i] = MathUtils.clamp(this.plane.noise[i], -5, 5);

			this.plane.displacement[i] += this.plane.noise[i];
		}

		this.plane.geometry.attributes.displacement.needsUpdate = true;
	}

	createObjects() {
		this.plane = new Plane();
		this.scene.add(this.plane.mesh);
	}
}
