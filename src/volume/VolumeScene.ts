import * as THREE from "three";
import { OrbitControls } from './OrbitControls';
import { Volume } from './Volume';
import { VolumeShader } from './VolumeShader';
import { isWebGL2Available } from './webgl-utils';
// import { ColorBar } from "../model/colorBar";


export interface VolumeOptions {
    value1: number;
    value2: number;
    isoThreshold: number;
    renderMode: "mip" | "iso";
    cmName: string;
    // colorBar: ColorBar;
}

export class VolumeScene {

    readonly canvas: HTMLCanvasElement;
    private readonly camera: THREE.OrthographicCamera;
    private readonly controls: THREE.EventDispatcher;
    private readonly renderer: THREE.WebGLRenderer;
    private readonly cmTextures: { [cmName: string]: THREE.Texture };

    // Instantiated after volume is set
    private scene: THREE.Scene | null;
    private texture: THREE.Data3DTexture | null;
    private material: THREE.ShaderMaterial | null;

    constructor(canvas: HTMLCanvasElement) {

        if (!isWebGL2Available()) {
            throw new Error("Missing WebGL2");
        }

        this.render = this.render.bind(this);

        // Create renderer
        const renderer = new THREE.WebGLRenderer({canvas});
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(canvas.clientWidth, canvas.clientHeight);
        // document.body.appendChild(renderer.domElement);

        // Create camera (The volume renderer does not work very well with perspective yet)
        const h = 100; // frustum height
        const aspect = canvas.clientWidth / canvas.clientHeight;
        const camera = new THREE.OrthographicCamera(
            -h * aspect,
            h * aspect,
            h,
            -h ,
            -1000,
            1000
        );
        camera.position.set(0, 0, 100);
        camera.up.set(0, 1, 0);

        // Create controls
        const controls = new OrbitControls(camera, renderer.domElement);
        controls.target.set(100, 50, 0);
        controls.minZoom = 0.1;
        controls.maxZoom = 500;
        controls.enablePan = true;
        controls.update();

        // scene.add( new AxesHelper( 128 ) );

        // Lighting is baked into the shader a.t.m.
        // let dirLight = new DirectionalLight( 0xffffff );

        this.canvas = canvas;
        this.renderer = renderer;
        this.camera = camera;
        this.controls = controls;

        this.scene = null;
        this.texture = null;
        this.material = null;

        // Colormap textures
        this.cmTextures = {
            viridis: new THREE.TextureLoader().load('images/textures/cm_viridis.png', this.render),
            gray: new THREE.TextureLoader().load('images/textures/cm_gray.png', this.render)
        };

        controls.addEventListener('change', this.render);
        canvas.addEventListener('resize', this.onCanvasResize);
    }

    setVolume(volume: Volume, options: VolumeOptions) {

        // Texture to hold the volume. We have scalars, so we put our data in the red channel.
        // THREEJS will select R32F (33326) based on the THREE.RedFormat and THREE.FloatType.
        // Also see https://www.khronos.org/registry/webgl/specs/latest/2.0/#TEXTURE_TYPES_FORMATS_FROM_DOM_ELEMENTS_TABLE
        // TODO: look the dtype up in the volume metadata

        const texture = new THREE.Data3DTexture(volume.data, volume.xLength, volume.yLength, volume.zLength);
        texture.format = THREE.RedFormat;
        texture.type = THREE.FloatType;
        texture.minFilter = texture.magFilter = THREE.LinearFilter;
        texture.unpackAlignment = 1;
        texture.needsUpdate = true;

        const shader = VolumeShader;

        const uniforms = THREE.UniformsUtils.clone(shader.uniforms);

        const [sx, sy, sz] = volume.spacing;
        console.log("volume.spacing:", volume.spacing);
        const sizeX = Math.floor(sx * volume.xLength);
        const sizeY = Math.floor(sy * volume.yLength);
        const sizeZ = Math.floor(sz * volume.zLength);

        uniforms['u_data'].value = texture;
        uniforms['u_size'].value.set(sizeX, sizeY, sizeZ);

        const material = new THREE.ShaderMaterial({
            uniforms: uniforms,
            vertexShader: shader.vertexShader,
            fragmentShader: shader.fragmentShader,
            side: THREE.BackSide // The volume shader uses the backface as its "reference point"
        });

        // THREE.Mesh
        // const geometry = new THREE.BoxGeometry(
        //     volume.xLength,
        //     volume.yLength,
        //     volume.zLength
        // );
        // geometry.translate(
        //     volume.xLength / 2 - 0.5,
        //     volume.yLength / 2 - 0.5,
        //     volume.zLength / 2 - 0.5
        // );

        const geometry = new THREE.BoxGeometry(
            sizeX,
            sizeY,
            sizeZ
        );

        geometry.translate(
            sizeX / 2,
            sizeY / 2,
            sizeZ / 2
        );

        const mesh = new THREE.Mesh(geometry, material);
        const scene = new THREE.Scene();
        scene.add(mesh);
        scene.add(new THREE.BoxHelper(mesh));

        // const gridXZ = new THREE.GridHelper(1, 10, 0xffffff, 0xff3333);
        // gridXZ.scale.set(sizeX, 1, sizeZ);
        // gridXZ.position.set(-sizeX / 2, 0, -sizeZ / 2);
        //
        // const gridXY = new THREE.GridHelper(1, 10, 0xffffff, 0x33ff33);
        // gridXY.scale.set(sizeX, 1, sizeY);
        // gridXY.rotateX(-Math.PI / 2);
        // gridXZ.position.set(sizeX / 2, sizeY / 2, 0);

        // const gridZY = new THREE.GridHelper(1, 10, 0xffffff, 0x3333ff);
        // gridZY.scale.set(sizeZ , 1, sizeY);
        // gridZY.rotateY(Math.PI / 2);
        // gridZY.rotateZ(Math.PI / 2);
        // gridZY.translateY(sizeY / 2);
        // gridZY.translateZ(sizeZ / 2);

        // scene.add(gridXZ);
        // scene.add(gridXY);
        // scene.add(gridZY);

        this.scene = scene;
        this.material = material;
        this.texture = texture;

        this.setVolumeOptions(options);
    }

    setVolumeOptions(options: VolumeOptions) {
        const material = this.material;
        console.log('material', material)
        if (material !== null) {
            const {value1, value2, isoThreshold, renderMode, cmName} = options;
            const uniforms = material.uniforms;
            uniforms['u_clim'].value.set(value1, value2);
            uniforms['u_renderthreshold'].value = isoThreshold;
            uniforms['u_renderstyle'].value = (renderMode === 'mip') ? 0 : 1;  // 0: MIP, 1: ISO;
            uniforms['u_cmdata'].value = this.cmTextures[cmName];
            this.render();
        }
    }

    getMaterial(): THREE.ShaderMaterial {
        if (this.material===null) {
            throw new Error("Volume not set!");
        }
        return this.material!;
    }

    onCanvasResize() {
        console.warn("Alarm: Canvas resize!")
        const canvas = this.renderer.domElement;
        this.renderer.setSize(canvas.clientWidth, canvas.clientHeight);
        const aspect = canvas.clientWidth / canvas.clientHeight;
        const frustumHeight = this.camera.top - this.camera.bottom;
        this.camera.left = -frustumHeight * aspect / 2;
        this.camera.right = frustumHeight * aspect / 2;
        this.camera.updateProjectionMatrix();
        this.render();
    }

    render() {
        if (this.scene !== null) {
            this.renderer.render(this.scene, this.camera);
        }
    }
}