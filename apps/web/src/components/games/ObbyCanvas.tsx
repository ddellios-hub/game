"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera, Float } from "@react-three/drei";
import { Suspense, useMemo } from "react";

interface ObbyCanvasProps {
  onFinish?: () => void;
}

function Platform({ position }: { position: [number, number, number] }) {
  return (
    <mesh position={position}>
      <boxGeometry args={[2, 0.2, 2]} />
      <meshStandardMaterial color="#6366f1" />
    </mesh>
  );
}

function Obstacles() {
  const items = useMemo(() => Array.from({ length: 6 }, (_, i) => [i * 3, 0, 0] as [number, number, number]), []);
  return (
    <group>
      {items.map((position, index) => (
        <Float key={index} speed={2} rotationIntensity={0.1} floatIntensity={0.4}>
          <Platform position={position} />
        </Float>
      ))}
    </group>
  );
}

export function ObbyCanvas({ onFinish }: ObbyCanvasProps) {
  return (
    <div className="h-72 w-full rounded-2xl border border-slate-200 bg-slate-950" data-testid="obby-canvas">
      <Canvas shadows>
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 10, 5]} intensity={1.2} />
        <PerspectiveCamera makeDefault position={[6, 6, 10]} />
        <Suspense fallback={null}>
          <Obstacles />
        </Suspense>
        <OrbitControls enablePan={false} minDistance={5} maxDistance={15} />
      </Canvas>
      <button
        type="button"
        className="sr-only"
        aria-label="Finish course"
        onClick={() => onFinish?.()}
      />
    </div>
  );
}
