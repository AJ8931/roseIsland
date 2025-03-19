import { useEffect } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";

const RoseTown = () => {
  useEffect(() => {
    const canvas = document.querySelector("canvas.webgl");
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
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
    directionalLight.position.set(30, 55, -30);
    directionalLight.castShadow = true;
    directionalLight.shadow.camera.top = 50;
    directionalLight.shadow.camera.bottom = -50;
    directionalLight.shadow.camera.left = -50;
    directionalLight.shadow.camera.right = 50;
    directionalLight.shadow.mapSize.set(4096, 4096); // Higher resolution
    directionalLight.shadow.bias = -0.000045;
    scene.add(directionalLight);

    const ambientLight = new THREE.AmbientLight(0x404040, 35);
    scene.add(ambientLight);

    camera.position.set(0, 8, 0);
    camera.lookAt(0, 0, 0);

    // OrbitControls
    // OrbitControls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.1;

    // Disable rotation
    controls.enableRotate = false; // Disable rotation

    // Enable panning only on left-click and drag
    controls.mouseButtons = {
      LEFT: THREE.MOUSE.PAN, // Left-click for panning
      MIDDLE: THREE.MOUSE.DOLLY, // Middle-click for zooming (optional)
      RIGHT: THREE.MOUSE.NONE, // Disable right-click
    };

    // Enable zooming
    controls.enableZoom = true; // Enable zooming (scroll wheel)

    // Draco Loader
    const loader = new GLTFLoader();
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath("/path/to/draco/"); // Set the path to Draco decoder
    loader.setDRACOLoader(dracoLoader);

    // Lazy Load Model
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        const modelUrl = new URL("../MODELS/RoosIsland.gltf", import.meta.url)
          .href;
        loader.load(modelUrl, (gltf) => {
          const model = gltf.scene;
          scene.add(model);
          model.traverse((child) => {
            if (child.isMesh) {
              child.castShadow = true;
              child.receiveShadow = true;
              // child.material.roughness = 0.5;
              child.material.metalness = 0.05;
            }
          });
          model.position.set(-5, 0, -35);
          model.scale.set(0.9, 0.9, 0.9);
        });
        observer.disconnect();
      }
    });

    observer.observe(canvas);

    // Animation Loop
    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    // Handle Window Resize
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
