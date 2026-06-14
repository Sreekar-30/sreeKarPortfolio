import * as THREE from "three";
import { RGBELoader } from "three-stdlib";
import { gsap } from "gsap";

const setLighting = (scene: THREE.Scene) => {
  const directionalLight = new THREE.DirectionalLight(0xffe0b4, 0);
  directionalLight.intensity = 0;
  directionalLight.position.set(-2, 3, 5);
  directionalLight.castShadow = true;
  directionalLight.shadow.mapSize.width = 1024;
  directionalLight.shadow.mapSize.height = 1024;
  directionalLight.shadow.camera.near = 0.5;
  directionalLight.shadow.camera.far = 50;
  scene.add(directionalLight);

  const rimLight = new THREE.PointLight(0xae3cff, 0, 40, 2);
  rimLight.position.set(2.5, 6, -5);
  rimLight.castShadow = false;
  scene.add(rimLight);

  const fillLight = new THREE.PointLight(0x88b8ff, 0, 35, 2);
  fillLight.position.set(-4, 6, 4);
  fillLight.castShadow = false;
  scene.add(fillLight);

  const ambientLight = new THREE.AmbientLight(0xffffff, 0.14);
  scene.add(ambientLight);

  new RGBELoader()
    .setPath("/models/")
    .load("char_enviorment.hdr", function (texture) {
      texture.mapping = THREE.EquirectangularReflectionMapping;
      scene.environment = texture;
      scene.environmentIntensity = 0;
      scene.environmentRotation.set(5.76, 85.85, 1);
    });


  function setPointLight(screenLight: any) {
    if (screenLight.material.opacity > 0.9) {
      rimLight.intensity = screenLight.material.emissiveIntensity * 14;
      fillLight.intensity = screenLight.material.emissiveIntensity * 10;
    } else {
      rimLight.intensity = 0.35;
      fillLight.intensity = 0.25;
    }
  }
  const duration = 2;
  const ease = "power2.inOut";
  function turnOnLights() {
    gsap.to(scene, {
      environmentIntensity: 0.86,
      duration: duration,
      ease: ease,
    });
    gsap.to(directionalLight, {
      intensity: 0.95,
      duration: duration,
      ease: ease,
    });
    gsap.to(fillLight, {
      intensity: 0.65,
      duration: duration,
      ease: ease,
    });
    gsap.to(rimLight, {
      intensity: 0.78,
      duration: duration,
      ease: ease,
    });
    gsap.to(".character-rim", {
      y: "55%",
      opacity: 1,
      delay: 0.2,
      duration: 2,
    });
  }

  return { setPointLight, turnOnLights };
};

export default setLighting;
