import { useEffect } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

const RoseTown = () => {
  let camera;
  useEffect(() => {
    const canvas = document.querySelector("canvas.webgl");
    const scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // Lighting
    const directionalLight = new THREE.DirectionalLight(0xffffff, 3);
    directionalLight.position.set(30, 60, -30);
    directionalLight.castShadow = true;
    directionalLight.shadow.camera.top = 50;
    directionalLight.shadow.camera.bottom = -50;
    directionalLight.shadow.camera.left = -50;
    directionalLight.shadow.camera.right = 50;
    directionalLight.shadow.mapSize.set(4096, 4096);
    // directionalLight.shadow.bias = -0.0005; // Small negative value to reduce dark artifacts

    scene.add(directionalLight);

    const helper = new THREE.DirectionalLightHelper(directionalLight, 12);
    scene.add(helper);

    const ambientLight = new THREE.AmbientLight(0x404040, 40);
    scene.add(ambientLight);

    camera.position.set(0, 35, 0);
    camera.lookAt(0, 0, 0);

    // Enable full OrbitControls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.1;
    controls.enableZoom = true;
    controls.enableRotate = true;
    controls.enablePan = true;

    // Load GLTF model
    const loader = new GLTFLoader();
    const modelUrl = new URL("../MODELS/RoosIsland.gltf", import.meta.url).href;
    loader.load(modelUrl, (gltf) => {
      const model = gltf.scene;
      scene.add(model);
      model.traverse((child) => {
        if (child.isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;
          child.material.roughness = -0.5; // Lower roughness for smoother appearance
        }
      });
      model.position.set(-5, 0, 0);
      // camera.position.set(0, 35, 0);
      model.scale.set(0.9, 0.9, 0.9);
    });
    const axesHelper = new THREE.AxesHelper(50);
    scene.add(axesHelper);
    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    // Handle window resize
    const onWindowResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", onWindowResize);

    return () => {
      window.removeEventListener("resize", onWindowResize);
      renderer.dispose();
    };
  }, []);

  return <canvas className="webgl" />;
};

export default RoseTown;
