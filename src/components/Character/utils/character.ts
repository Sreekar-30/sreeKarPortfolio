import * as THREE from "three";
import { DRACOLoader, GLTF, GLTFLoader } from "three-stdlib";
import { setCharTimeline, setAllTimeline } from "../../utils/GsapScroll";
import { decryptFile } from "./decrypt";

const setCharacter = (
  renderer: THREE.WebGLRenderer,
  scene: THREE.Scene,
  camera: THREE.PerspectiveCamera
) => {
  const loader = new GLTFLoader();
  const dracoLoader = new DRACOLoader();
  dracoLoader.setDecoderPath("/draco/");
  loader.setDRACOLoader(dracoLoader);

  const loadCharacter = () => {
    return new Promise<GLTF | null>(async (resolve, reject) => {
      try {
        const encryptedBlob = await decryptFile(
          "/models/character.enc",
          "Character3D#@"
        );
        const blobUrl = URL.createObjectURL(new Blob([encryptedBlob]));
        let character: THREE.Object3D;
        loader.load(
          blobUrl,
          async (gltf) => {
            character = gltf.scene;
            await renderer.compileAsync(character, camera, scene);

            const createPhysicalMaterial = (material: any) => {
              if (!material || !material.isMaterial) return material;
              if (material.isMeshPhysicalMaterial) return material;

              return new THREE.MeshPhysicalMaterial({
                color: material.color ? material.color.clone() : new THREE.Color(0xffffff),
                map: material.map,
                normalMap: material.normalMap,
                roughnessMap: material.roughnessMap,
                metalnessMap: material.metalnessMap,
                emissiveMap: material.emissiveMap,
                aoMap: material.aoMap,
                displacementMap: material.displacementMap,
                alphaMap: material.alphaMap,
                envMap: material.envMap,
                envMapIntensity: material.envMapIntensity ?? 1,
                roughness: material.roughness !== undefined ? material.roughness : 0.55,
                metalness: material.metalness !== undefined ? material.metalness : 0.05,
                emissive: material.emissive ? material.emissive.clone() : new THREE.Color(0x000000),
                emissiveIntensity: material.emissiveIntensity ?? 0,
                clearcoat: material.clearcoat ?? 0,
                clearcoatRoughness: material.clearcoatRoughness ?? 0.5,
                side: material.side,
                transparent: false,
                opacity: 1,
              });
            };

            const applyMaterialStyle = (material: any) => {
              if (!material || !material.isMaterial) return material;
              let mat = material;
              if (!mat.isMeshPhysicalMaterial) {
                mat = createPhysicalMaterial(mat);
              }

              const name = (mat.name || "").toLowerCase();
              const isSkin = /skin|face|cheek|brow|lip|ear|neck/.test(name);
              const isHair = /hair|curly|beard|eyebrow/.test(name);
              const isShirt = /shirt|tshirt|cloth|top|torso|sleeve|tee/.test(name);
              const isEye = /eye|iris|pupil|cornea/.test(name);

              mat.transparent = false;
              mat.opacity = 1;
              mat.alphaTest = 0;
              mat.depthWrite = true;

              if (isSkin) {
                mat.color = new THREE.Color("#8b5a2b");
                mat.roughness = 0.48;
                mat.metalness = 0.02;
                mat.clearcoat = 0.1;
                mat.clearcoatRoughness = 0.4;
                mat.envMapIntensity = 1;
                mat.emissive = new THREE.Color(0x000000);
              } else if (isHair) {
                mat.color = new THREE.Color("#070707");
                mat.roughness = 0.72;
                mat.metalness = 0.05;
                mat.clearcoat = 0.05;
                mat.clearcoatRoughness = 0.55;
                mat.emissive = new THREE.Color(0x040404);
                mat.envMapIntensity = 0.9;
              } else if (isShirt) {
                mat.color = new THREE.Color("#040404");
                mat.roughness = 0.32;
                mat.metalness = 0.08;
                mat.clearcoat = 0.18;
                mat.clearcoatRoughness = 0.25;
                mat.emissive = new THREE.Color("#2c0960");
                mat.emissiveIntensity = 0.06;
                mat.envMapIntensity = 1.1;
              } else if (isEye) {
                mat.color = new THREE.Color("#4d2d14");
                mat.roughness = 0.12;
                mat.metalness = 0.05;
                mat.clearcoat = 1;
                mat.clearcoatRoughness = 0.03;
                mat.emissive = new THREE.Color(0x101010);
                mat.envMapIntensity = 1.3;
              } else {
                if (mat.color && mat.color.equals(new THREE.Color(0xffffff))) {
                  mat.color = new THREE.Color("#c8c8c8");
                }
                if (mat.color) {
                  mat.color.lerp(new THREE.Color("#b0b0b0"), 0.1);
                }
                mat.roughness = mat.roughness !== undefined ? Math.min(mat.roughness * 1.05, 0.85) : 0.7;
                mat.metalness = mat.metalness !== undefined ? Math.min(mat.metalness, 0.15) : 0.05;
                mat.envMapIntensity = Math.max(mat.envMapIntensity ?? 1, 0.9);
                mat.emissiveIntensity = Math.min(mat.emissiveIntensity ?? 0, 0.05);
              }
              return mat;
            };

            character.traverse((child: any) => {
              if (child.isMesh) {
                const mesh = child as THREE.Mesh;
                mesh.castShadow = true;
                mesh.receiveShadow = true;
                mesh.frustumCulled = true;
                mesh.material = Array.isArray(mesh.material)
                  ? mesh.material.map((material) => applyMaterialStyle(material))
                  : applyMaterialStyle(mesh.material);
              }
            });
            resolve(gltf);
            setCharTimeline(character, camera);
            setAllTimeline();
            const footR = character.getObjectByName("footR");
            const footL = character.getObjectByName("footL");
            if (footR) footR.position.y = 3.36;
            if (footL) footL.position.y = 3.36;
            dracoLoader.dispose();
          },
          undefined,
          (error) => {
            console.error("Error loading GLTF model:", error);
            reject(error);
          }
        );
      } catch (err) {
        reject(err);
        console.error(err);
      }
    });
  };

  return { loadCharacter };
};

export default setCharacter;
