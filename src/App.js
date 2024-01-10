import {
	AudioAnalyser,
	AudioListener,
	AudioLoader,
	Clock,
	Color,
	DirectionalLight,
	MathUtils,
	PerspectiveCamera,
	Scene,
	Vector2,
	WebGLRenderTarget,
	WebGLRenderer,
} from "three";
import { EffectComposer, OrbitControls, RenderPass, UnrealBloomPass } from "three/examples/jsm/Addons";
import Plane from "./objects/Plane";
import AudioManager from "./managers/AudioManager";
import BPMManager from "./managers/BPMManager";

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

		this.renderer = new WebGLRenderer({ antialias: true });
		this.renderer.setPixelRatio(window.devicePixelRatio * 1.5);
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
		this.scene.background = new Color(0x222222);

		this.lights = [];
		this.lights[0] = new DirectionalLight(0x526cff, 10);
		this.lights[1] = new DirectionalLight(0x4255ff, 10);
		this.lights[2] = new DirectionalLight(0x526cff, 10);

		this.lights[0].position.set(0, 20, 0);
		this.lights[1].position.set(10, 20, 10);
		this.lights[2].position.set(-10, -20, -10);

		this.scene.add(this.lights[0]);
		this.scene.add(this.lights[1]);
		this.scene.add(this.lights[2]);

		const target = new WebGLRenderTarget(this.width, this.height, {
			samples: 8,
		});

		this.composer = new EffectComposer(this.renderer, target);
		const renderPass = new RenderPass(this.scene, this.camera);
		this.composer.addPass(renderPass);
		this.composer.addPass(new UnrealBloomPass(new Vector2(this.width, this.height), 0.7, 0.4, 0.4));

		this.clock = new Clock();

		window.addEventListener("click", () => {
			this.createManagers();
		});

		this.resize();
		window.addEventListener("resize", () => this.resize());
	}

	async createManagers() {
		App.audioManager = new AudioManager();
		await App.audioManager.loadAudioBuffer();
		// App.audioManager.addGUI();

		App.bpmManager = new BPMManager();
		// App.bpmManager.addEventListener("beat", () => {
		// 	this.particles.onBPMBeat();
		// });
		await App.bpmManager.detectBPM(App.audioManager.audio.buffer);

		App.audioManager.play();

		this.createObjects();

		this.update();
	}

	resize() {
		this.width = window.innerWidth;
		this.height = window.innerHeight;
		this.camera.aspect = this.width / this.height;
		this.renderer.setPixelRatio(window.devicePixelRatio * 1.5);
		this.camera.updateProjectionMatrix();
		this.renderer.setSize(this.width, this.height);
		this.composer.setSize(this.width, this.height);
	}

	update() {
		requestAnimationFrame(() => this.update());
		this.composer.render();
		const time = this.clock.getDelta();
		this.controls.update();
		this.plane.update();
		App.audioManager.update();
		this.plane.material.userData.shader.uniforms.uTime.value += time * 0.08;
	}

	createObjects() {
		this.plane = new Plane();
		this.scene.add(this.plane.mesh);
	}
}
