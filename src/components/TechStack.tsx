import * as THREE from "three";
import { useRef, useMemo, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment } from "@react-three/drei";
import { EffectComposer, N8AO } from "@react-three/postprocessing";
import {
  BallCollider,
  Physics,
  RigidBody,
  CylinderCollider,
  RapierRigidBody,
} from "@react-three/rapier";

const textureLoader = new THREE.TextureLoader();
const imageUrls = [
  "/images/python.webp.png",
  "/images/fastapi.webp.png",
  "/images/flask.webp.png",
  "/images/springboot.webp.png",
  "/images/javascript.webp",
  "/images/react2.webp",
  "/images/github.webp.png",
  "/images/postman.webp.png",
];
const textures = imageUrls.map((url) => textureLoader.load(url));

const sphereGeometry = new THREE.SphereGeometry(1, 28, 28);

const spheres = [...Array(9)].map(() => ({
  scale: [0.8, 0.9, 1][Math.floor(Math.random() * 3)],
}));
type SphereProps = {
  vec?: THREE.Vector3;
  scale: number;
  r?: typeof THREE.MathUtils.randFloatSpread;
  material: THREE.MeshPhysicalMaterial;
  isActive: boolean;
};

function SphereGeo({
  vec = new THREE.Vector3(),
  scale,
  r = THREE.MathUtils.randFloatSpread,
  material,
  isActive,
}: SphereProps) {
  const api = useRef<RapierRigidBody | null>(null);

  useFrame((_state, delta) => {
    if (!isActive) return;
    delta = Math.min(0.1, delta);
    const impulse = vec
      .copy(api.current!.translation())
      .normalize()
      .multiply(
        new THREE.Vector3(
          -50 * delta * scale,
          -150 * delta * scale,
          -50 * delta * scale
        )
      );

    api.current?.applyImpulse(impulse, true);
  });

  return (
    <RigidBody
      linearDamping={0.75}
      angularDamping={0.15}
      friction={0.2}
      position={[r(0.5), r(0.5) + 2, r(0.5)]}
      ref={api}
      colliders={false}
    >
      <BallCollider args={[scale]} />
      <CylinderCollider
        rotation={[Math.PI / 2, 0, 0]}
        position={[0, 0, 1.2 * scale]}
        args={[0.15 * scale, 0.275 * scale]}
      />
      <mesh
        castShadow
        receiveShadow
        scale={scale}
        geometry={sphereGeometry}
        material={material}
        rotation={[0.3, 1, 1]}
      />
    </RigidBody>
  );
}

type PointerProps = {
  vec?: THREE.Vector3;
  isActive: boolean;
};

function Pointer({ vec = new THREE.Vector3(), isActive }: PointerProps) {
  const ref = useRef<RapierRigidBody>(null);

  useFrame(({ pointer, viewport }) => {
  if (!isActive) return;

  const targetVec = vec.lerp(
    new THREE.Vector3(
      (pointer.x * viewport.width) / 2,
      (pointer.y * viewport.height) / 2,
      0
    ),
    0.2
  );

  ref.current?.setNextKinematicTranslation(targetVec);
});

  return (
    <RigidBody
      position={[100, 100, 100]}
      type="kinematicPosition"
      colliders={false}
      ref={ref}
    >
      <BallCollider args={[2]} />
    </RigidBody>
  );
}
const TechStack = () => {
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const techSection = document.querySelector(".techstack");

      if (!techSection) return;

      const rect = techSection.getBoundingClientRect();

      // Activate only when TechStack section is actually visible
      setIsActive(rect.top < window.innerHeight && rect.bottom > 0);
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const materials = useMemo(() => {
    return textures.map(
      (texture) =>
        new THREE.MeshPhysicalMaterial({
          map: texture,
          emissive: "#ffffff",
          emissiveMap: texture,
          emissiveIntensity: 0.3,
          metalness: 0.5,
          roughness: 1,
          clearcoat: 0.1,
        })
    );
  }, []);

  return (
    <div
      className="techstack"
      style={{
        position: "relative",
        overflow: "hidden",
        zIndex: 1,
      }}
    >
      <h2>My Tech Stack</h2>

      <Canvas
        style={{
          width: "100%",
          height: "100%",
        }}
        shadows
        gl={{
          alpha: true,
          stencil: false,
          depth: false,
          antialias: false,
        }}
        camera={{
  position: [0, 0, 15],
  fov: 35,
  near: 1,
  far: 100,
}}
        onCreated={(state) => {
          state.gl.toneMappingExposure = 1.5;
        }}
        className="tech-canvas"
      >
        <ambientLight intensity={1} />

        <spotLight
          position={[20, 20, 25]}
          penumbra={1}
          angle={0.2}
          color="white"
          castShadow
          shadow-mapSize={[512, 512]}
        />

        <directionalLight
          position={[0, 5, -4]}
          intensity={2}
        />

        <Physics gravity={[0, -8, 0]}>
          <Pointer isActive={isActive} />
          <RigidBody
  type="fixed"
  position={[0, -2.5, 0]}
>
  <mesh visible={false}>
    <boxGeometry args={[20, 1, 20]} />
    <meshBasicMaterial />
  </mesh>
</RigidBody>

          {spheres.map((props, i) => (
            <SphereGeo
              key={i}
              {...props}
              material={
                materials[
                  Math.floor(Math.random() * materials.length)
                ]
              }
              isActive={isActive}
            />
          ))}
        </Physics>

        <Environment
          files="/models/char_enviorment.hdr"
          environmentIntensity={0.5}
          environmentRotation={[0, 4, 2]}
        />

        <EffectComposer enableNormalPass={false}>
          <N8AO
            color="#0f002c"
            aoRadius={2}
            intensity={1.15}
          />
        </EffectComposer>
      </Canvas>
    </div>
  );
};
export default TechStack;
