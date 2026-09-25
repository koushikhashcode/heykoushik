import "./Contact.css";
import React, { useEffect, useMemo, useRef, useState, useCallback } from "react";
import * as THREE from "three";
import { Canvas, extend, useFrame, useThree } from "@react-three/fiber";
import { Environment, Lightformer, useTexture, useGLTF } from "@react-three/drei";
import { BallCollider, CuboidCollider, Physics, RigidBody, useRopeJoint, useSphericalJoint } from "@react-three/rapier";
import { MeshLineGeometry, MeshLineMaterial } from "meshline";
import { Mail, User, PenTool, Send, ArrowRight, Phone, CheckCircle2 } from "lucide-react";

// ==================== audio.js ====================
class TelephoneAudio {
  ctx = null;
  dialToneNodes = null;
  ringTimer = null;
  ringGain = null;
  activeRingNodes = [];
  onRingChangeCallback = null;
  isMuted = false;
  initContext() {
    if (!this.ctx && typeof window !== "undefined") {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume();
    }
  }
  setMuted(muted) {
    this.isMuted = muted;
    if (muted) {
      this.stopDialTone();
      this.stopRing();
    }
  }
  getMuted() {
    return this.isMuted;
  }
  // Mechanical switch-hook click when grabbed or released
  playClick(pitch = 1) {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();
      filter.type = "bandpass";
      filter.frequency.setValueAtTime(1200 * pitch, now);
      filter.Q.setValueAtTime(3, now);
      osc.type = "triangle";
      osc.frequency.setValueAtTime(400 * pitch, now);
      osc.frequency.exponentialRampToValueAtTime(80, now + 0.04);
      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(1e-3, now + 0.04);
      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.04);
    } catch {
    }
  }
  // Subtle stretch / spring twang when pulled fast
  playCordStretch() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(140, now);
      osc.frequency.exponentialRampToValueAtTime(260, now + 0.08);
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(1e-3, now + 0.09);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.09);
    } catch {
    }
  }
  // Continuous vintage dial tone (350Hz + 440Hz)
  startDialTone() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx || this.dialToneNodes) return;
    try {
      const now = this.ctx.currentTime;
      const osc1 = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc1.type = "sine";
      osc1.frequency.setValueAtTime(350, now);
      osc2.type = "sine";
      osc2.frequency.setValueAtTime(440, now);
      gain.gain.setValueAtTime(1e-3, now);
      gain.gain.linearRampToValueAtTime(0.07, now + 0.15);
      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(this.ctx.destination);
      osc1.start(now);
      osc2.start(now);
      this.dialToneNodes = { osc1, osc2, gain };
    } catch {
    }
  }
  stopDialTone() {
    if (!this.dialToneNodes || !this.ctx) return;
    try {
      const { osc1, osc2, gain } = this.dialToneNodes;
      const now = this.ctx.currentTime;
      gain.gain.linearRampToValueAtTime(1e-3, now + 0.08);
      osc1.stop(now + 0.09);
      osc2.stop(now + 0.09);
    } catch {
    }
    this.dialToneNodes = null;
  }
  // Vintage twin-gong mechanical telephone bell ("BRRR-ING... BRRR-ING...")
  startRing(cycles = 2, onCycle) {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;
    this.stopRing();
    this.onRingChangeCallback = onCycle || null;
    let currentCycle = 0;
    const ringBurst = () => {
      if (!this.ctx || this.isMuted) {
        this.stopRing();
        return;
      }
      if (currentCycle >= cycles) {
        this.stopRing();
        return;
      }
      currentCycle++;
      this.onRingChangeCallback?.(true);
      const burstDuration = 1.6;
      const startTime = this.ctx.currentTime;
      const t = startTime;
      const masterGain = this.ctx.createGain();
      masterGain.gain.setValueAtTime(1, t);
      masterGain.connect(this.ctx.destination);
      this.ringGain = masterGain;
      const bellFreqs = [1050, 853];
      bellFreqs.forEach((freq) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const clapper = this.ctx.createOscillator();
        const clapperGain = this.ctx.createGain();
        clapper.type = "square";
        clapper.frequency.setValueAtTime(16, t);
        clapperGain.gain.setValueAtTime(0.12, t);
        clapper.connect(clapperGain.gain);
        osc.type = "triangle";
        osc.frequency.setValueAtTime(freq, t);
        gain.gain.setValueAtTime(0.09, t);
        gain.gain.setValueAtTime(0.09, t + burstDuration - 0.2);
        gain.gain.exponentialRampToValueAtTime(1e-3, t + burstDuration);
        clapper.connect(gain.gain);
        osc.connect(gain);
        gain.connect(masterGain);
        clapper.start(t);
        osc.start(t);
        clapper.stop(t + burstDuration);
        osc.stop(t + burstDuration);
        this.activeRingNodes.push({ osc, clapper });
      });
      this.ringTimer = window.setTimeout(() => {
        this.onRingChangeCallback?.(false);
        this.activeRingNodes = [];
        this.ringGain = null;
        this.ringTimer = window.setTimeout(ringBurst, 1800);
      }, burstDuration * 1e3);
    };
    ringBurst();
  }
  stopRing() {
    if (this.ringTimer) {
      clearTimeout(this.ringTimer);
      this.ringTimer = null;
    }
    if (this.ringGain && this.ctx) {
      try {
        const now = this.ctx.currentTime;
        this.ringGain.gain.setValueAtTime(this.ringGain.gain.value, now);
        this.ringGain.gain.linearRampToValueAtTime(1e-4, now + 0.03);
      } catch {
      }
    }
    this.activeRingNodes.forEach(({ osc, clapper }) => {
      try {
        osc.stop();
        clapper.stop();
      } catch {
      }
    });
    this.activeRingNodes = [];
    this.ringGain = null;
    if (this.onRingChangeCallback) {
      const cb = this.onRingChangeCallback;
      this.onRingChangeCallback = null;
      cb(false);
    }
  }
  // Dual-tone multi-frequency (DTMF) telephone keypad touch tones
  playDtmf(digit) {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;
    const dtmfFreqs = {
      "1": [697, 1209],
      "2": [697, 1336],
      "3": [697, 1477],
      "4": [770, 1209],
      "5": [770, 1336],
      "6": [770, 1477],
      "7": [852, 1209],
      "8": [852, 1336],
      "9": [852, 1477],
      "*": [941, 1209],
      "0": [941, 1336],
      "#": [941, 1477]
    };
    const freqs = dtmfFreqs[String(digit)] || [697, 1336];
    try {
      const now = this.ctx.currentTime;
      const osc1 = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc1.type = "sine";
      osc1.frequency.setValueAtTime(freqs[0], now);
      osc2.type = "sine";
      osc2.frequency.setValueAtTime(freqs[1], now);
      gain.gain.setValueAtTime(0.09, now);
      gain.gain.exponentialRampToValueAtTime(1e-3, now + 0.12);
      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(this.ctx.destination);
      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + 0.12);
      osc2.stop(now + 0.12);
    } catch {
    }
  }
  // Classic high-pitched answering machine beep
  playBeep() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(880, now);
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.setValueAtTime(0.12, now + 0.3);
      gain.gain.exponentialRampToValueAtTime(1e-3, now + 0.35);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.35);
    } catch {
    }
  }
}
export const telephoneAudio = new TelephoneAudio();


// ==================== CoiledCordTube.jsx ====================
export const CoiledCordTube = ({
  curve,
  coils = 30,
  coilRadius = 0.155,
  wireRadius = 0.025,
  color = "#0a0a0d",
  roughness = 0.16,
  metalness = 0.05,
  clearcoat = 0.92
}) => {
  const meshRef = useRef(null);
  const spineSamples = 320;
  const radialSegments = 10;
  const { geometry, positions, normals, uvs } = useMemo(() => {
    const totalVertices = (spineSamples + 1) * (radialSegments + 1);
    const totalTriangles = spineSamples * radialSegments * 2;
    const posArray = new Float32Array(totalVertices * 3);
    const normArray = new Float32Array(totalVertices * 3);
    const uvArray = new Float32Array(totalVertices * 2);
    const indexArray = new Uint32Array(totalTriangles * 3);
    let idx = 0;
    for (let i = 0; i < spineSamples; i++) {
      for (let j = 0; j < radialSegments; j++) {
        const a = i * (radialSegments + 1) + j;
        const b = (i + 1) * (radialSegments + 1) + j;
        const c = (i + 1) * (radialSegments + 1) + (j + 1);
        const d = i * (radialSegments + 1) + (j + 1);
        indexArray[idx++] = a;
        indexArray[idx++] = b;
        indexArray[idx++] = d;
        indexArray[idx++] = b;
        indexArray[idx++] = c;
        indexArray[idx++] = d;
      }
    }
    const geom = new THREE.BufferGeometry();
    geom.setAttribute("position", new THREE.BufferAttribute(posArray, 3));
    geom.setAttribute("normal", new THREE.BufferAttribute(normArray, 3));
    geom.setAttribute("uv", new THREE.BufferAttribute(uvArray, 2));
    geom.setIndex(new THREE.BufferAttribute(indexArray, 1));
    return { geometry: geom, positions: posArray, normals: normArray, uvs: uvArray };
  }, [spineSamples, radialSegments]);
  const currentT = useMemo(() => new THREE.Vector3(), []);
  const currentN = useMemo(() => new THREE.Vector3(), []);
  const currentB = useMemo(() => new THREE.Vector3(), []);
  const nextT = useMemo(() => new THREE.Vector3(), []);
  const axis = useMemo(() => new THREE.Vector3(), []);
  const centerPt = useMemo(() => new THREE.Vector3(), []);
  useFrame(() => {
    if (!meshRef.current) return;
    const spinePoints = curve.getPoints(spineSamples);
    curve.getTangent(0, currentT).normalize();
    currentN.set(1, 0, 0);
    if (Math.abs(currentT.dot(currentN)) > 0.85) {
      currentN.set(0, 0, 1);
    }
    currentN.crossVectors(currentT, currentN).normalize();
    currentB.crossVectors(currentT, currentN).normalize();
    const wireN = new THREE.Vector3();
    const wireB = new THREE.Vector3();
    const wireT = new THREE.Vector3();
    let vertexOffset = 0;
    let uvOffset = 0;
    const allHelicalPoints = [];
    for (let i = 0; i <= spineSamples; i++) {
      const u = i / spineSamples;
      const pt = spinePoints[i];
      if (i > 0) {
        curve.getTangent(u, nextT).normalize();
        axis.crossVectors(currentT, nextT);
        const dot = Math.max(-1, Math.min(1, currentT.dot(nextT)));
        if (axis.lengthSq() > 1e-7) {
          axis.normalize();
          const angle = Math.acos(dot);
          currentN.applyAxisAngle(axis, angle).normalize();
          currentB.crossVectors(nextT, currentN).normalize();
        }
        currentT.copy(nextT);
      }
      const topEnvelope = Math.min(1, Math.max(0, (u - 0.015) / 0.035));
      const bottomEnvelope = Math.min(1, Math.max(0, (0.89 - u) / 0.07));
      const envelope = topEnvelope * bottomEnvelope;
      const theta = u * (coils * Math.PI * 2);
      const r = coilRadius * envelope;
      const offX = Math.cos(theta) * r;
      const offZ = Math.sin(theta) * r;
      const helicalPos = new THREE.Vector3().copy(pt).addScaledVector(currentN, offX).addScaledVector(currentB, offZ);
      allHelicalPoints.push(helicalPos);
    }
    for (let i = 0; i <= spineSamples; i++) {
      const u = i / spineSamples;
      centerPt.copy(allHelicalPoints[i]);
      if (i === 0) {
        wireT.subVectors(allHelicalPoints[1], allHelicalPoints[0]).normalize();
      } else if (i === spineSamples) {
        wireT.subVectors(allHelicalPoints[spineSamples], allHelicalPoints[spineSamples - 1]).normalize();
      } else {
        wireT.subVectors(allHelicalPoints[i + 1], allHelicalPoints[i - 1]).normalize();
      }
      wireN.set(0, 1, 0);
      if (Math.abs(wireT.dot(wireN)) > 0.85) {
        wireN.set(1, 0, 0);
      }
      wireN.crossVectors(wireT, wireN).normalize();
      wireB.crossVectors(wireT, wireN).normalize();
      for (let j = 0; j <= radialSegments; j++) {
        const phi = j / radialSegments * Math.PI * 2;
        const cosPhi = Math.cos(phi);
        const sinPhi = Math.sin(phi);
        const nx = wireN.x * cosPhi + wireB.x * sinPhi;
        const ny = wireN.y * cosPhi + wireB.y * sinPhi;
        const nz = wireN.z * cosPhi + wireB.z * sinPhi;
        positions[vertexOffset] = centerPt.x + nx * wireRadius;
        positions[vertexOffset + 1] = centerPt.y + ny * wireRadius;
        positions[vertexOffset + 2] = centerPt.z + nz * wireRadius;
        normals[vertexOffset] = nx;
        normals[vertexOffset + 1] = ny;
        normals[vertexOffset + 2] = nz;
        uvs[uvOffset] = u * coils;
        uvs[uvOffset + 1] = j / radialSegments;
        vertexOffset += 3;
        uvOffset += 2;
      }
    }
    geometry.attributes.position.needsUpdate = true;
    geometry.attributes.normal.needsUpdate = true;
    geometry.computeBoundingSphere();
    geometry.computeBoundingBox();
  });
  return <mesh ref={meshRef} geometry={geometry} castShadow receiveShadow frustumCulled={false}>
      <meshPhysicalMaterial
    color={color}
    roughness={roughness}
    metalness={metalness}
    clearcoat={clearcoat}
    clearcoatRoughness={0.08}
    reflectivity={0.98}
  />
    </mesh>;
};


// ==================== CustomTelephoneModel.jsx ====================
export const CustomTelephoneModel = ({
  color = "#08080b",
  isHovered = false,
  isDragged = false,
  onPointerDown,
  onPointerUp,
  onPointerOver,
  onPointerOut,
  scale = 1.45
}) => {
  const { scene } = useGLTF("/models/telephone.glb");
  const rotGroupRef = useRef(null);
  const BASE_Y_ROTATION = Math.PI / 2;
  const currentRotY = useRef(BASE_Y_ROTATION);
  const currentRotX = useRef(0);
  const telephoneMaterial = useMemo(() => {
    return new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(color),
      roughness: 0.16,
      metalness: 0.08,
      clearcoat: 0.94,
      clearcoatRoughness: 0.1,
      reflectivity: 0.9,
      envMapIntensity: 1.6,
      emissive: isDragged ? new THREE.Color(2236962) : isHovered ? new THREE.Color(1118481) : new THREE.Color(0)
    });
  }, [color, isHovered, isDragged]);
  const rubberGrommetMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: "#08080a",
      roughness: 0.75,
      metalness: 0.05
    });
  }, []);
  const clonedScene = useMemo(() => {
    const clone = scene.clone(true);
    clone.traverse((child) => {
      if (child.isMesh) {
        const mesh = child;
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        if (!mesh.geometry.attributes.normal) {
          mesh.geometry.computeVertexNormals();
        }
        mesh.material = telephoneMaterial;
      }
    });
    return clone;
  }, [scene, telephoneMaterial]);
  useFrame((state, delta) => {
    if (!rotGroupRef.current) return;
    if (!isDragged) {
      const hoverYaw = isHovered ? state.pointer.x * 0.12 : 0;
      const hoverPitch = isHovered ? -state.pointer.y * 0.065 : 0;
      const hoverRoll = isHovered ? state.pointer.x * 0.04 : 0;
      const idleSway = Math.sin(state.clock.elapsedTime * 0.6) * 0.014;
      const targetY = BASE_Y_ROTATION + hoverYaw + idleSway;
      const targetX = hoverPitch;
      const targetZ = hoverRoll;
      currentRotY.current = THREE.MathUtils.damp(currentRotY.current, targetY, 3.5, delta);
      currentRotX.current = THREE.MathUtils.damp(currentRotX.current, targetX, 3.5, delta);
      rotGroupRef.current.rotation.y = currentRotY.current;
      rotGroupRef.current.rotation.x = currentRotX.current;
      rotGroupRef.current.rotation.z = targetZ;
    }
  });
  const topGrommetY = 0.961 * scale;
  return <group
    onPointerDown={onPointerDown}
    onPointerUp={onPointerUp}
    onPointerOver={onPointerOver}
    onPointerOut={onPointerOut}
  >
      {
    /* Handset group with 180° interactive rotation and default side-profile orientation */
  }
      <group ref={rotGroupRef}>
        {
    /* User's custom 3D telephone handset model */
  }
        <primitive
    object={clonedScene}
    scale={[scale, scale, scale]}
    position={[0, 0, 0]}
  />

        {
    /* Rubber strain-relief boot collar connecting the cord to the handset summit */
  }
        <group position={[0, topGrommetY - 0.02, 0]}>
          {
    /* Flanged base collar */
  }
          <mesh position={[0, 0.02, 0]} castShadow receiveShadow>
            <cylinderGeometry args={[0.085, 0.11, 0.05, 24]} />
            <primitive object={rubberGrommetMaterial} />
          </mesh>
          {
    /* Tapered strain-relief sleeve */
  }
          <mesh position={[0, 0.065, 0]} castShadow receiveShadow>
            <cylinderGeometry args={[0.048, 0.08, 0.07, 24]} />
            <primitive object={rubberGrommetMaterial} />
          </mesh>
          {
    /* Flexible cord exit nipple */
  }
          <mesh position={[0, 0.11, 0]} castShadow receiveShadow>
            <cylinderGeometry args={[0.038, 0.048, 0.04, 20]} />
            <primitive object={rubberGrommetMaterial} />
          </mesh>
        </group>
      </group>

      {
    /* Subtle interaction point light on hover */
  }
      {isHovered && !isDragged && <pointLight position={[0.2, 0, 0.9]} intensity={0.4} distance={3.5} color="#60a5fa" />}
    </group>;
};
useGLTF.preload("/models/telephone.glb");


// ==================== TelephoneHandset.jsx ====================
function createCapTextures(baseColorHex) {
  const size = 2048;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  const center = size / 2;
  const outerRadius = size / 2 - 24;
  const bevelRadius = outerRadius * 0.92;
  const grooveRadius = outerRadius * 0.84;
  const recessedRadius = outerRadius * 0.78;
  ctx.fillStyle = baseColorHex;
  ctx.fillRect(0, 0, size, size);
  const rimGrad = ctx.createRadialGradient(
    center - 40,
    center - 40,
    bevelRadius,
    center,
    center,
    outerRadius
  );
  rimGrad.addColorStop(0, "#1c1c22");
  rimGrad.addColorStop(0.4, "#2c2c36");
  rimGrad.addColorStop(0.85, "#121217");
  rimGrad.addColorStop(1, "#060608");
  ctx.fillStyle = rimGrad;
  ctx.beginPath();
  ctx.arc(center, center, outerRadius, 0, Math.PI * 2);
  ctx.fill();
  const notchCount = 48;
  ctx.strokeStyle = "rgba(255, 255, 255, 0.09)";
  ctx.lineWidth = 4;
  for (let i = 0; i < notchCount; i++) {
    const angle = i / notchCount * Math.PI * 2;
    const x1 = center + Math.cos(angle) * (outerRadius - 32);
    const y1 = center + Math.sin(angle) * (outerRadius - 32);
    const x2 = center + Math.cos(angle) * outerRadius;
    const y2 = center + Math.sin(angle) * outerRadius;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
  }
  ctx.strokeStyle = "#040405";
  ctx.lineWidth = 14;
  ctx.beginPath();
  ctx.arc(center, center, grooveRadius, 0, Math.PI * 2);
  ctx.stroke();
  ctx.strokeStyle = "rgba(255, 255, 255, 0.18)";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(center, center, grooveRadius - 8, Math.PI * 0.75, Math.PI * 1.75);
  ctx.stroke();
  const plateGrad = ctx.createRadialGradient(
    center - 30,
    center - 30,
    20,
    center,
    center,
    recessedRadius
  );
  plateGrad.addColorStop(0, "#18181e");
  plateGrad.addColorStop(0.65, "#121216");
  plateGrad.addColorStop(0.92, "#0c0c10");
  plateGrad.addColorStop(1, "#040406");
  ctx.fillStyle = plateGrad;
  ctx.beginPath();
  ctx.arc(center, center, recessedRadius, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "rgba(255, 255, 255, 0.04)";
  ctx.lineWidth = 1.5;
  for (let r = 80; r < recessedRadius - 20; r += 32) {
    ctx.beginPath();
    ctx.arc(center, center, r, 0, Math.PI * 2);
    ctx.stroke();
  }
  const holeRings = [
    { count: 1, radius: 0, holeR: 28 },
    { count: 6, radius: 140, holeR: 26 },
    { count: 12, radius: 275, holeR: 24 },
    { count: 18, radius: 410, holeR: 22 },
    { count: 24, radius: 540, holeR: 20 }
  ];
  holeRings.forEach(({ count, radius, holeR }) => {
    for (let i = 0; i < count; i++) {
      const angle = i / count * Math.PI * 2;
      const x = center + Math.cos(angle) * radius;
      const y = center + Math.sin(angle) * radius;
      ctx.fillStyle = "#000000";
      ctx.beginPath();
      ctx.arc(x, y, holeR, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "#050507";
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.arc(x, y - 2, holeR - 2, 0, Math.PI);
      ctx.stroke();
      ctx.strokeStyle = "rgba(255, 255, 255, 0.45)";
      ctx.lineWidth = 3.5;
      ctx.beginPath();
      ctx.arc(x, y + 2.2, holeR + 0.5, Math.PI * 0.85, Math.PI * 2.15);
      ctx.stroke();
    }
  });
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 16;
  return texture;
}
export const TelephoneHandset = ({
  color = "#08080b",
  isHovered = false,
  isDragged = false,
  onPointerDown,
  onPointerUp,
  onPointerOver,
  onPointerOut,
  scale = 1.35
}) => {
  const capTexture = useMemo(() => createCapTextures(color), [color]);
  const bakeliteMaterial = useMemo(
    () => new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(color),
      roughness: 0.08,
      metalness: 0.04,
      clearcoat: 1,
      clearcoatRoughness: 0.04,
      reflectivity: 1
    }),
    [color]
  );
  const rubberMaterial = useMemo(
    () => new THREE.MeshStandardMaterial({
      color: "#141418",
      roughness: 0.7,
      metalness: 0.05
    }),
    []
  );
  const metalCollarMaterial = useMemo(
    () => new THREE.MeshStandardMaterial({
      color: "#2a2a30",
      roughness: 0.35,
      metalness: 0.85
    }),
    []
  );
  const bellCupGeometry = useMemo(() => {
    const points = [];
    points.push(new THREE.Vector2(0.24, 0));
    points.push(new THREE.Vector2(0.27, 0.1));
    points.push(new THREE.Vector2(0.34, 0.22));
    points.push(new THREE.Vector2(0.44, 0.36));
    points.push(new THREE.Vector2(0.53, 0.48));
    points.push(new THREE.Vector2(0.56, 0.54));
    points.push(new THREE.Vector2(0.56, 0.58));
    points.push(new THREE.Vector2(0.5, 0.59));
    return new THREE.LatheGeometry(points, 56);
  }, []);
  const capRingGeometry = useMemo(() => {
    const points = [];
    points.push(new THREE.Vector2(0.52, 0));
    points.push(new THREE.Vector2(0.57, 0.03));
    points.push(new THREE.Vector2(0.58, 0.14));
    points.push(new THREE.Vector2(0.55, 0.18));
    points.push(new THREE.Vector2(0.48, 0.2));
    points.push(new THREE.Vector2(0.46, 0.17));
    return new THREE.LatheGeometry(points, 56);
  }, []);
  const handleGeometry = useMemo(() => {
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0.08, 1.25, 0),
      new THREE.Vector3(-0.06, 0.98, 0),
      new THREE.Vector3(-0.35, 0.55, 0),
      new THREE.Vector3(-0.48, 0.02, 0),
      // Peak left outward bow
      new THREE.Vector3(-0.35, -0.55, 0),
      new THREE.Vector3(-0.04, -0.98, 0),
      new THREE.Vector3(0.1, -1.25, 0)
    ]);
    curve.curveType = "chordal";
    const shape = new THREE.Shape();
    const halfWidth = 0.17;
    const innerDepth = 0.1;
    const outerDepth = 0.15;
    const r = 0.06;
    shape.moveTo(-outerDepth + r, -halfWidth);
    shape.lineTo(innerDepth - r, -halfWidth);
    shape.quadraticCurveTo(innerDepth, -halfWidth, innerDepth, -halfWidth + r);
    shape.lineTo(innerDepth, halfWidth - r);
    shape.quadraticCurveTo(innerDepth, halfWidth, innerDepth - r, halfWidth);
    shape.lineTo(-outerDepth + r, halfWidth);
    shape.quadraticCurveTo(-outerDepth, halfWidth, -outerDepth, halfWidth - r);
    shape.lineTo(-outerDepth, -halfWidth + r);
    shape.quadraticCurveTo(-outerDepth, -halfWidth, -outerDepth + r, -halfWidth);
    return new THREE.ExtrudeGeometry(shape, {
      extrudePath: curve,
      steps: 72,
      bevelEnabled: false
    });
  }, []);
  const capYawAngle = 0.65;
  const topPitchAngle = -0.26;
  const bottomPitchAngle = 0.32;
  const rotGroupRef = useRef(null);
  const BASE_Y_ROTATION = Math.PI / 2;
  const currentRotY = useRef(BASE_Y_ROTATION);
  const currentRotX = useRef(0);
  useFrame((state, delta) => {
    if (!rotGroupRef.current) return;
    if (!isDragged) {
      const hoverYaw = isHovered ? state.pointer.x * 0.12 : 0;
      const hoverPitch = isHovered ? -state.pointer.y * 0.065 : 0;
      const hoverRoll = isHovered ? state.pointer.x * 0.04 : 0;
      const idleSway = Math.sin(state.clock.elapsedTime * 0.6) * 0.014;
      const targetY = BASE_Y_ROTATION + hoverYaw + idleSway;
      const targetX = hoverPitch;
      const targetZ = hoverRoll;
      currentRotY.current = THREE.MathUtils.damp(currentRotY.current, targetY, 3.5, delta);
      currentRotX.current = THREE.MathUtils.damp(currentRotX.current, targetX, 3.5, delta);
      rotGroupRef.current.rotation.y = currentRotY.current;
      rotGroupRef.current.rotation.x = currentRotX.current;
      rotGroupRef.current.rotation.z = targetZ;
    }
  });
  return <group
    scale={scale}
    onPointerDown={onPointerDown}
    onPointerUp={onPointerUp}
    onPointerOver={onPointerOver}
    onPointerOut={onPointerOut}
  >
      <group ref={rotGroupRef}>
      {
    /* ========================================================
       STRAIN-RELIEF RUBBER GROMMET & CORD INLET
       Emerges from the top summit of the earpiece dome,
       pointing vertically to receive the hanging coiled cord.
       ======================================================== */
  }
      <group position={[0, 1.96, 0]}>
        {
    /* Recessed metal grommet collar base */
  }
        <mesh position={[0, -0.04, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[0.08, 0.1, 0.06, 24]} />
          <primitive object={metalCollarMaterial} />
        </mesh>

        {
    /* Flexible rubber strain-relief sleeve */
  }
        <mesh position={[0, 0.08, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[0.038, 0.075, 0.22, 24]} />
          <primitive object={rubberMaterial} />
        </mesh>

        {
    /* Ribbed rings along the rubber sleeve */
  }
        <mesh position={[0, 0.14, 0]} castShadow receiveShadow>
          <torusGeometry args={[0.044, 0.012, 12, 24]} />
          <primitive object={rubberMaterial} />
        </mesh>
        <mesh position={[0, 0.09, 0]} castShadow receiveShadow>
          <torusGeometry args={[0.052, 0.013, 12, 24]} />
          <primitive object={rubberMaterial} />
        </mesh>
        <mesh position={[0, 0.04, 0]} castShadow receiveShadow>
          <torusGeometry args={[0.062, 0.014, 12, 24]} />
          <primitive object={rubberMaterial} />
        </mesh>
      </group>

      {
    /* ========================================================
       TOP RECEIVER (EARPIECE HOUSING & PERFORATED CAP)
       Oriented at 3/4 angle so the acoustic face is clearly
       visible to the camera, exactly as in the reference image.
       ======================================================== */
  }
      <group position={[0.08, 1.38, 0]} rotation={[topPitchAngle, capYawAngle, 0]}>
        {
    /* Rear hemispherical dome shell of the earpiece */
  }
        <mesh position={[-0.12, 0.15, 0]} rotation={[0, 0, 0.45]} castShadow receiveShadow>
          <sphereGeometry args={[0.39, 40, 28, 0, Math.PI * 2, 0, Math.PI * 0.6]} />
          <primitive object={bakeliteMaterial} />
        </mesh>

        {
    /* Flared bell cup housing */
  }
        <mesh geometry={bellCupGeometry} position={[0, 0, 0]} rotation={[0, 0, -Math.PI / 2]} castShadow receiveShadow>
          <primitive object={bakeliteMaterial} />
        </mesh>

        {
    /* Screw-on cap ring */
  }
        <mesh geometry={capRingGeometry} position={[0.58, 0, 0]} rotation={[0, 0, -Math.PI / 2]} castShadow receiveShadow>
          <primitive object={bakeliteMaterial} />
        </mesh>

        {
    /* Perforated acoustic ear disc face */
  }
        <mesh position={[0.72, 0, 0]} rotation={[0, Math.PI / 2, 0]} castShadow receiveShadow>
          <circleGeometry args={[0.47, 56]} />
          <meshStandardMaterial
    map={capTexture}
    roughness={0.25}
    metalness={0.12}
  />
        </mesh>
      </group>

      {
    /* ========================================================
       CENTRAL ERGONOMIC BAKELITE HANDLE
       Smooth continuous sweep with subtle molded parting line
       ======================================================== */
  }
      <mesh geometry={handleGeometry} castShadow receiveShadow>
        <primitive object={bakeliteMaterial} />
      </mesh>

      {
    /* Parting line seam running down the outer spine of the handle */
  }
      <mesh position={[-0.49, 0.02, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[7e-3, 7e-3, 2.35, 12]} />
        <meshStandardMaterial color="#040406" roughness={0.35} metalness={0.08} />
      </mesh>

      {
    /* ========================================================
       BOTTOM TRANSMITTER (MOUTHPIECE HOUSING & PERFORATED CAP)
       Angled upward toward speaker's mouth and facing forward
       at 3/4 angle, matching reference image.
       ======================================================== */
  }
      <group position={[0.1, -1.38, 0]} rotation={[bottomPitchAngle, capYawAngle, 0]}>
        {
    /* Rear cup dome */
  }
        <mesh position={[-0.12, -0.15, 0]} rotation={[0, 0, -0.45]} castShadow receiveShadow>
          <sphereGeometry args={[0.39, 40, 28, 0, Math.PI * 2, 0, Math.PI * 0.6]} />
          <primitive object={bakeliteMaterial} />
        </mesh>

        {
    /* Flared bell cup housing */
  }
        <mesh geometry={bellCupGeometry} position={[0, 0, 0]} rotation={[0, 0, -Math.PI / 2]} castShadow receiveShadow>
          <primitive object={bakeliteMaterial} />
        </mesh>

        {
    /* Screw-on cap ring */
  }
        <mesh geometry={capRingGeometry} position={[0.58, 0, 0]} rotation={[0, 0, -Math.PI / 2]} castShadow receiveShadow>
          <primitive object={bakeliteMaterial} />
        </mesh>

        {
    /* Perforated acoustic mic transmitter disc face */
  }
        <mesh position={[0.72, 0, 0]} rotation={[0, Math.PI / 2, 0]} castShadow receiveShadow>
          <circleGeometry args={[0.47, 56]} />
          <meshStandardMaterial
    map={capTexture}
    roughness={0.25}
    metalness={0.12}
  />
        </mesh>
      </group>
      </group>

      {
    /* Subtle blue accent glow on hover */
  }
      {isHovered && !isDragged && <pointLight position={[0.2, 0, 0.9]} intensity={0.4} distance={3.5} color="#60a5fa" />}
    </group>;
};


// ==================== LanyardCard.jsx ====================
"use client";
extend({ MeshLineGeometry, MeshLineMaterial });
const DEFAULT_CARD_MODEL = "/card.glb";
const DEFAULT_BAND_TEXTURE = "/kroul.png";
export function LanyardCard({
  maxSpeed = 50,
  minSpeed = 10,
  className = "",
  width = "100%",
  height = "100vh",
  cardModel = DEFAULT_CARD_MODEL,
  bandTexture = DEFAULT_BAND_TEXTURE
}) {
  return <div className={`${className}`} style={{ width, height }}>
      <Canvas camera={{ position: [0, 0, 13], fov: 25 }}>
        <ambientLight intensity={Math.PI} />
        <Physics interpolate gravity={[0, -40, 0]} timeStep={1 / 60}>
          <Band
    cardModel={cardModel}
    bandTexture={bandTexture}
    maxSpeed={maxSpeed}
    minSpeed={minSpeed}
  />
        </Physics>
        <Environment background blur={0.75}>
          <color attach="background" args={["black"]} />
          <Lightformer
    intensity={2}
    color="white"
    position={[0, -1, 5]}
    rotation={[0, 0, Math.PI / 3]}
    scale={[100, 0.1, 1]}
  />
          <Lightformer
    intensity={3}
    color="white"
    position={[-1, -1, 1]}
    rotation={[0, 0, Math.PI / 3]}
    scale={[100, 0.1, 1]}
  />
          <Lightformer
    intensity={3}
    color="white"
    position={[1, 1, 1]}
    rotation={[0, 0, Math.PI / 3]}
    scale={[100, 0.1, 1]}
  />
          <Lightformer
    intensity={10}
    color="white"
    position={[-10, 0, 14]}
    rotation={[0, Math.PI / 2, Math.PI / 3]}
    scale={[100, 10, 1]}
  />
        </Environment>
      </Canvas>
    </div>;
}
function Band({ bandTexture, maxSpeed, minSpeed }) {
  const band = useRef(null);
  const fixed = useRef(null);
  const j1 = useRef(null);
  const j2 = useRef(null);
  const j3 = useRef(null);
  const card = useRef(null);
  const vec = useRef(new THREE.Vector3());
  const ang = useRef(new THREE.Vector3());
  const rot = useRef(new THREE.Vector3());
  const dir = useRef(new THREE.Vector3());
  const segmentProps = {
    type: "dynamic",
    canSleep: true,
    colliders: void 0,
    angularDamping: 2,
    linearDamping: 2
  };
  const defaultGeometries = useMemo(() => {
    return {
      card: new THREE.BoxGeometry(0.8 * 2, 1.125 * 2, 0.02),
      clip: new THREE.TorusGeometry(0.08, 0.02, 16, 32),
      clamp: new THREE.BoxGeometry(0.3, 0.12, 0.05)
    };
  }, []);
  const defaultMaterials = useMemo(() => {
    return {
      base: new THREE.MeshPhysicalMaterial({
        color: 1184536,
        clearcoat: 1,
        clearcoatRoughness: 0.15,
        roughness: 0.3,
        metalness: 0.5
      }),
      metal: new THREE.MeshStandardMaterial({
        color: 13686242,
        roughness: 0.25,
        metalness: 0.9
      })
    };
  }, []);
  let texture;
  try {
    texture = useTexture(bandTexture);
  } catch {
    const canvas = document.createElement("canvas");
    canvas.width = 128;
    canvas.height = 128;
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "#16181f";
    ctx.fillRect(0, 0, 128, 128);
    ctx.fillStyle = "#656a7d";
    ctx.fillRect(2, 0, 4, 128);
    ctx.fillRect(122, 0, 4, 128);
    texture = new THREE.CanvasTexture(canvas);
  }
  const { width, height } = useThree((state) => state.size);
  const [curve] = useState(
    () => new THREE.CatmullRomCurve3([
      new THREE.Vector3(),
      new THREE.Vector3(),
      new THREE.Vector3(),
      new THREE.Vector3()
    ])
  );
  const [dragged, drag] = useState(false);
  const [hovered, hover] = useState(false);
  useRopeJoint(fixed, j1, [[0, 0, 0], [0, 0, 0], 1]);
  useRopeJoint(j1, j2, [[0, 0, 0], [0, 0, 0], 1]);
  useRopeJoint(j2, j3, [[0, 0, 0], [0, 0, 0], 1]);
  useSphericalJoint(j3, card, [
    [0, 0, 0],
    [0, 1.45, 0]
  ]);
  useEffect(() => {
    if (hovered) {
      document.body.style.cursor = dragged ? "grabbing" : "grab";
      return () => void (document.body.style.cursor = "auto");
    }
  }, [hovered, dragged]);
  useFrame((state, delta) => {
    if (!fixed.current || !j1.current || !j2.current || !j3.current || !card.current || !band.current) {
      return;
    }
    const v = vec.current;
    const a = ang.current;
    const r = rot.current;
    const d = dir.current;
    if (dragged) {
      v.set(state.pointer.x, state.pointer.y, 0.5).unproject(state.camera);
      d.copy(v).sub(state.camera.position).normalize();
      v.add(d.multiplyScalar(state.camera.position.length()));
      if (card.current?.wakeUp) card.current.wakeUp();
      if (j1.current?.wakeUp) j1.current.wakeUp();
      if (j2.current?.wakeUp) j2.current.wakeUp();
      if (j3.current?.wakeUp) j3.current.wakeUp();
      if (fixed.current?.wakeUp) fixed.current.wakeUp();
      if (card.current?.setNextKinematicTranslation) {
        card.current.setNextKinematicTranslation({
          x: v.x - dragged.x,
          y: v.y - dragged.y,
          z: v.z - dragged.z
        });
      }
    }
    if (fixed.current && j1.current && j2.current && j3.current && card.current) {
      [j1, j2].forEach((ref) => {
        if (!ref.current.lerped && ref.current.translation) {
          ref.current.lerped = new THREE.Vector3().copy(
            ref.current.translation()
          );
        }
        if (ref.current.lerped && ref.current.translation) {
          const translation = ref.current.translation();
          if (translation && !isNaN(translation.x) && !isNaN(translation.y) && !isNaN(translation.z)) {
            const clampedDistance = Math.max(
              0.1,
              Math.min(1, ref.current.lerped.distanceTo(translation))
            );
            ref.current.lerped.lerp(
              translation,
              delta * (minSpeed + clampedDistance * (maxSpeed - minSpeed))
            );
          }
        }
      });
      if (j3.current.translation && j2.current.lerped && j1.current.lerped && fixed.current.translation && band.current?.geometry) {
        curve.points[0].copy(j3.current.translation());
        curve.points[1].copy(j2.current.lerped);
        curve.points[2].copy(j1.current.lerped);
        curve.points[3].copy(fixed.current.translation());
        band.current.geometry.setPoints(curve.getPoints(32));
      }
      if (card.current.angvel && card.current.rotation) {
        a.copy(card.current.angvel());
        r.copy(card.current.rotation());
        card.current.setAngvel({ x: a.x, y: a.y - r.y * 0.25, z: a.z });
      }
    }
  });
  curve.curveType = "chordal";
  if (texture) {
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  }
  return <>
      <group position={[0, 4, 0]}>
        <RigidBody ref={fixed} {...segmentProps} type="fixed" />
        <RigidBody position={[0.5, 0, 0]} ref={j1} {...segmentProps}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody position={[1, 0, 0]} ref={j2} {...segmentProps}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody position={[1.5, 0, 0]} ref={j3} {...segmentProps}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody
    position={[2, 0, 0]}
    ref={card}
    {...segmentProps}
    type={dragged ? "kinematicPosition" : "dynamic"}
  >
          <CuboidCollider args={[0.8, 1.125, 0.01]} />
          <group
    scale={2.25}
    position={[0, -1.2, -0.05]}
    onPointerOver={() => hover(true)}
    onPointerOut={() => hover(false)}
    onPointerUp={(e) => (e.target.releasePointerCapture(e.pointerId), drag(false))}
    onPointerDown={(e) => {
      e.target.setPointerCapture(e.pointerId);
      if (card.current && card.current.translation) {
        const translation = card.current.translation();
        drag(
          new THREE.Vector3().copy(e.point).sub(vec.current.copy(translation))
        );
      }
    }}
  >
            <mesh geometry={defaultGeometries.card} material={defaultMaterials.base} />
            <mesh
    geometry={defaultGeometries.clip}
    material={defaultMaterials.metal}
    position={[0, 1.25, 0]}
  />
            <mesh
    geometry={defaultGeometries.clamp}
    material={defaultMaterials.metal}
    position={[0, 1.15, 0]}
  />
          </group>
        </RigidBody>
      </group>
      <mesh ref={band}>
        <meshLineGeometry />
        <meshLineMaterial
    color="white"
    depthTest={false}
    resolution={[width, height]}
    useMap
    map={texture}
    repeat={[-3, 1]}
    lineWidth={1}
  />
      </mesh>
    </>;
}
export function Demo() {
  return <div className="w-full relative rounded-lg">
      <LanyardCard className="rounded-lg shadow-xl" height="80vh" />
    </div>;
}
// LanyardCard;


// ==================== ContactCard.jsx ====================

export const ContactCard = ({
  isRinging,
  onTriggerRing,
  userEmail = "koushikwpbackup@gmail.com"
}) => {
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formState.name.trim() || !formState.email.trim()) return;
    setIsSubmitting(true);
    telephoneAudio.playDtmf("5");
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      telephoneAudio.playBeep();
    }, 750);
  };

  return (
    <div className="contact-card-container">
      {/* OUTER APPARATUS CHASSIS */}
      <div className="contact-chassis">
        {/* WHITE CANVAVS BACKDROP WITH VISIBLE CURVED CORNERS */}
        <div className="contact-top-canvas">
          {/* Top Bar: Corner Gold Camera + GET IN TOUCH + Tagline */}
          <div className="top-bar">
            <div className="top-bar-left">
              {/* Corner Circular Camera Lens with Solid Gold Bezel Accent */}
              <div className="camera-lens-outer">
                <div className="camera-lens-inner">
                  <div className="camera-glint" />
                </div>
              </div>

              {/* GET IN TOUCH Spaced Sans Typography */}
              <span className="get-in-touch-label">Get In Touch</span>
            </div>

            {/* Tagline */}
            <span className="top-bar-tagline">
              — Let's create something awesome together.
            </span>
          </div>

          {/* Headline & Hand-Drawn Sketch Note */}
          <div className="headline-row">
            <div className="headline-content">
              <h2 className="headline-title">
                Have a project,
                <br />
                collaboration or just
                <br />
                want to say hi?
              </h2>
              <p className="headline-subtitle">
                Drop a message, and I'll get back to you as soon as possible.
              </p>
            </div>

            {/* Hand-Drawn Sketch Oval Bubble Annotation */}
            <div className="sketch-bubble-container">
              <div className="sketch-bubble">
                <p className="sketch-bubble-text">
                  Good
                  <br />
                  ideas start
                  <br />
                  with a hello.
                </p>
              </div>
              <svg
                width="28"
                height="16"
                viewBox="0 0 34 20"
                fill="none"
                className="sketch-arrow-svg"
              >
                <path
                  d="M 28 2 C 18 6 8 12 3 17"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
                <path
                  d="M 3 10 L 2 17 L 9 17"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>

          {/* FLOATING BLACK CARD INSIDE THE WHITE CANVAS */}
          <div className="contact-floating-card">
            {/* Header Row: Phone Trigger + SEND A MESSAGE */}
            <div className="card-header-row">
              <button
                id="box-ring-phone-button"
                type="button"
                onClick={() => {
                  telephoneAudio.playClick(1.15);
                  onTriggerRing();
                }}
                className={`phone-trigger-btn ${
                  isRinging ? "animate-pulse" : ""
                }`}
                title="Click to ring the hanging telephone handset"
              >
                <Phone
                  className={`phone-trigger-icon ${
                    isRinging ? "animate-bounce" : ""
                  }`}
                  style={{ color: isRinging ? "#dc2626" : "#18191c" }}
                />
              </button>

              <span className="send-message-title">Send A Message</span>
            </div>

            {isSubmitted ? (
              <div className="submitted-success-state">
                <div className="success-badge">
                  <CheckCircle2 style={{ width: "1rem", height: "1rem" }} />
                </div>
                <h3 className="success-title">Message Transmitted</h3>
                <p className="success-msg">
                  Thank you, {formState.name || "friend"}. Dispatched to{" "}
                  <span className="user-email-tag">{userEmail}</span>.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setIsSubmitted(false);
                    setFormState({ name: "", email: "", message: "" });
                  }}
                  className="reset-form-btn"
                >
                  Send Another Note
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="contact-form">
                {/* Side-by-Side Capsules: Your Name & Your Email */}
                <div className="form-grid">
                  {/* Capsule 1: Your Name */}
                  <div className="form-capsule">
                    <User className="form-icon" />
                    <div className="form-field-body">
                      <label htmlFor="ref-name-input" className="form-label">
                        Your Name
                      </label>
                      <input
                        id="ref-name-input"
                        type="text"
                        required
                        placeholder="John Doe"
                        value={formState.name}
                        onChange={(e) =>
                          setFormState({ ...formState, name: e.target.value })
                        }
                        className="form-input"
                      />
                    </div>
                  </div>

                  {/* Capsule 2: Your Email */}
                  <div className="form-capsule">
                    <Mail className="form-icon" />
                    <div className="form-field-body">
                      <label htmlFor="ref-email-input" className="form-label">
                        Your Email
                      </label>
                      <input
                        id="ref-email-input"
                        type="email"
                        required
                        placeholder="name@company.com"
                        value={formState.email}
                        onChange={(e) =>
                          setFormState({ ...formState, email: e.target.value })
                        }
                        className="form-input"
                      />
                    </div>
                  </div>
                </div>

                {/* Capsule 3: Project Details / Message */}
                <div className="form-capsule form-capsule-start">
                  <PenTool className="form-icon form-icon-top" />
                  <div className="form-field-body">
                    <label htmlFor="ref-message-input" className="form-label">
                      Project Details / Message
                    </label>
                    <textarea
                      id="ref-message-input"
                      required
                      rows={2.5}
                      placeholder="Briefly describe your project, budget, timeline, or say hello..."
                      value={formState.message}
                      onChange={(e) =>
                        setFormState({ ...formState, message: e.target.value })
                      }
                      className="form-textarea"
                    />
                  </div>
                </div>

                {/* Submit Pill Button */}
                <button
                  id="ref-submit-button"
                  type="submit"
                  disabled={isSubmitting}
                  className="submit-btn"
                >
                  <div className="submit-btn-left">
                    <Send className="submit-icon" />
                    <span>
                      {isSubmitting ? "Transmitting..." : "Send Message"}
                    </span>
                  </div>
                  <ArrowRight className="submit-arrow-icon" />
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};


// ==================== Lanyard.jsx ====================
"use client";
function Lanyard({
  position = [0, 0, 21.5],
  gravity = [0, -36, 0],
  fov = 24,
  transparent = true,
  phoneColor = "#08080b",
  cordColor = "#0a0a0d",
  cordWidth = 1,
  coils = 38,
  coilRadius = 0.155,
  enableSound = true,
  isRinging = false,
  isLocked = false,
  modelType = "custom",
  shadowOpacity = 0.038,
  shadowDistance = 0.95,
  shadowBlur = 18,
  anchorX,
  onPickup,
  onHangup,
  onDragChange
}) {
  const [isMobile, setIsMobile] = useState(() => typeof window !== "undefined" && window.innerWidth < 768);
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return <div className="lanyard-wrapper" id="lanyard-container">
      <Canvas
    shadows
    camera={{ position, fov }}
    dpr={[1, isMobile ? 1.5 : 2]}
    gl={{ alpha: transparent, antialias: true, powerPreference: "high-performance" }}
    onCreated={({ gl }) => {
      gl.shadowMap.enabled = true;
      gl.shadowMap.type = THREE.PCFSoftShadowMap;
      gl.toneMapping = THREE.ACESFilmicToneMapping;
      gl.toneMappingExposure = 1.18;
      gl.setClearColor(new THREE.Color(0), transparent ? 0 : 1);
    }}
  >
        {
    /* Soft diffused studio ambient light */
  }
        <ambientLight intensity={1.15} />

        {
    /* Master Studio Key Light (Gently Offset Front-Top-Left):
       Positioned at [-1.2, 2.8, 5.5] so the shadow falls closely and naturally
       right behind the telephone and coiled spring cord without jumping far away */
  }
        <directionalLight
    position={[-1.2, 2.8, 5.5]}
    intensity={2.8}
    color="#ffffff"
    castShadow
    shadow-mapSize-width={512}
    shadow-mapSize-height={512}
    shadow-camera-near={0.5}
    shadow-camera-far={20}
    shadow-camera-left={-5}
    shadow-camera-right={5}
    shadow-camera-top={5}
    shadow-camera-bottom={-6}
    shadow-bias={-3e-4}
    shadow-normalBias={0.035}
    shadow-radius={shadowBlur}
  />

        {
    /* Top Overhead Light: Highlights each coil loop crest and the top earpiece dome */
  }
        <directionalLight
    position={[0, 9, 3]}
    intensity={1.8}
    color="#ffffff"
  />

        {
    /* Front-Right Fill Light: Softly softens shadow density for natural studio contrast */
  }
        <directionalLight
    position={[5.5, 0.5, 6.5]}
    intensity={1.2}
    color="#e2e8f0"
  />

        {
    /* Rim / Silhouette Kicker (Back-Left): Defines the cord wire edges and outer handle silhouette */
  }
        <directionalLight
    position={[-6.5, -1, -3.5]}
    intensity={1.6}
    color="#f8fafc"
  />

        {
    /* Studio Wall Backdrop Shadow Catcher:
       Positioned closely behind the dangling phone (z = -shadowDistance),
       producing an ultra-soft, blurry, very subtle natural drop shadow with true depth */
  }
        <mesh position={[0, -0.6, -shadowDistance]} receiveShadow>
          <planeGeometry args={[54, 40]} />
          <shadowMaterial transparent opacity={shadowOpacity} color="#27272a" />
        </mesh>

        {
    /* Subtle ground/floor plane shadow catcher for downward contact depth */
  }
        <mesh position={[0, -4.8, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <planeGeometry args={[54, 30]} />
          <shadowMaterial transparent opacity={shadowOpacity * 0.35} color="#27272a" />
        </mesh>

        {
    /* Physics Simulation */
  }
        <Physics gravity={gravity} timeStep={isMobile ? 1 / 45 : 1 / 60}>
          <TelephoneSuspension
    isMobile={isMobile}
    phoneColor={phoneColor}
    cordColor={cordColor}
    cordWidth={cordWidth}
    coils={coils}
    coilRadius={coilRadius}
    enableSound={enableSound}
    isRinging={isRinging}
    isLocked={isLocked}
    modelType={modelType}
    anchorX={anchorX}
    onPickup={onPickup}
    onHangup={onHangup}
    onDragChange={onDragChange}
  />
        </Physics>

        {
    /* Studio Softbox Reflectors for Authentic Bakelite Plastic Specular Sheen */
  }
        <Environment blur={0.6}>
          {
    /* Vertical left softbox strip (produces the classic long highlight in the reference photo) */
  }
          <Lightformer
    intensity={6}
    color="#ffffff"
    position={[-5, 0, 3.5]}
    rotation={[0, Math.PI / 4, 0]}
    scale={[1.8, 16, 1]}
  />
          {
    /* Top horizontal softbox for coils */
  }
          <Lightformer
    intensity={4.5}
    color="#ffffff"
    position={[0, 7, 2.5]}
    rotation={[-Math.PI / 3, 0, 0]}
    scale={[10, 2.5, 1]}
  />
          {
    /* Front right fill panel */
  }
          <Lightformer
    intensity={2}
    color="#ffffff"
    position={[5, -1, 5]}
    rotation={[0, -Math.PI / 4, 0]}
    scale={[5, 10, 1]}
  />
          {
    /* Ambient wide fill */
  }
          <Lightformer
    intensity={1.2}
    color="#f1f5f9"
    position={[0, 0, 10]}
    scale={[20, 20, 1]}
  />
        </Environment>
      </Canvas>
    </div>;
}
function TelephoneSuspension({
  isMobile,
  phoneColor,
  cordColor,
  cordWidth,
  coils,
  coilRadius,
  enableSound,
  isRinging,
  isLocked = false,
  modelType = "custom",
  anchorX,
  onPickup,
  onHangup,
  onDragChange,
  maxSpeed = 45,
  minSpeed = 0
}) {
  const { gl } = useThree();
  const fixedRef = useRef(null);
  const j1Ref = useRef(null);
  const j2Ref = useRef(null);
  const j3Ref = useRef(null);
  const phoneRef = useRef(null);
  const prevLockedRef = useRef(isLocked);

  useEffect(() => {
    if (prevLockedRef.current !== isLocked) {
      prevLockedRef.current = isLocked;

      if (phoneRef.current) {
        phoneRef.current.wakeUp?.();

        if (isLocked) {
          // Sharp kinetic jerk impulse when Buckle Lock snaps SHUT
          phoneRef.current.applyImpulse?.({ x: (Math.random() - 0.5) * 1.6, y: -5.5, z: 2.8 }, true);
          phoneRef.current.applyTorqueImpulse?.({ x: 0.22, y: (Math.random() - 0.5) * 0.6, z: -0.35 }, true);

          j1Ref.current?.wakeUp?.();
          j1Ref.current?.applyImpulse?.({ x: 1.0, y: -2.8, z: 0.7 }, true);

          j2Ref.current?.wakeUp?.();
          j2Ref.current?.applyImpulse?.({ x: -0.8, y: -2.2, z: -0.6 }, true);

          j3Ref.current?.wakeUp?.();
          j3Ref.current?.applyImpulse?.({ x: 0.6, y: -3.8, z: 1.4 }, true);
        } else {
          // Recoil spring jerk when Buckle Lock snaps OPEN
          phoneRef.current.applyImpulse?.({ x: (Math.random() - 0.5) * 1.2, y: 4.2, z: -1.8 }, true);
          phoneRef.current.applyTorqueImpulse?.({ x: -0.15, y: (Math.random() - 0.5) * 0.4, z: 0.25 }, true);

          j1Ref.current?.wakeUp?.();
          j1Ref.current?.applyImpulse?.({ x: -0.6, y: 2.0, z: -0.5 }, true);

          j2Ref.current?.wakeUp?.();
          j2Ref.current?.applyImpulse?.({ x: 0.6, y: 1.8, z: 0.4 }, true);

          j3Ref.current?.wakeUp?.();
          j3Ref.current?.applyImpulse?.({ x: -0.5, y: 2.8, z: -1.0 }, true);
        }

        if (enableSound) {
          telephoneAudio.playClick(1.4);
        }
      }
    }
  }, [isLocked, enableSound]);
  const effectiveAnchorX = anchorX ?? (isMobile ? 0 : -3.8);
  const [dragged, setDragged] = useState(false);
  const [hovered, setHovered] = useState(false);
  const vec = useRef(new THREE.Vector3());
  const ang = useRef(new THREE.Vector3());
  const rot = useRef(new THREE.Vector3());
  const dir = useRef(new THREE.Vector3());
  const lastPos = useRef(new THREE.Vector3());
  const lastVelocityTime = useRef(0);
  const dragVelocity = useRef(new THREE.Vector3());
  const prevDragPos = useRef(new THREE.Vector3());
  const dragYaw = useRef(0);
  const currentDragQuat = useRef(new THREE.Quaternion());
  const wasDragged = useRef(false);
  const isDraggingRef = useRef(false);
  const activePointerId = useRef(null);
  const justReleased = useRef(null);
  const segmentProps = {
    type: "dynamic",
    canSleep: false,
    colliders: false,
    angularDamping: 1.4,
    // Natural rotational resistance of a hanging cord & weighty handset
    linearDamping: 0.95
    // Realistic air resistance for smooth, normal swing decay
  };
  const isCustom = modelType === "custom";
  const scale = isCustom ? 1.45 : 1.25;
  const jointY = isCustom ? 0.961 * 1.45 + 0.12 : 1.96 * scale;
  useRopeJoint(fixedRef, j1Ref, [[0, 0, 0], [0, 0, 0], 1.2]);
  useRopeJoint(j1Ref, j2Ref, [[0, 0, 0], [0, 0, 0], 1.2]);
  useRopeJoint(j2Ref, j3Ref, [[0, 0, 0], [0, 0, 0], 1.2]);
  useSphericalJoint(j3Ref, phoneRef, [
    [0, 0, 0],
    [0, jointY, 0]
  ]);
  const curve = useMemo(
    () => new THREE.CatmullRomCurve3([
      new THREE.Vector3(effectiveAnchorX, 4.8, 0),
      new THREE.Vector3(effectiveAnchorX, 3.4, 0),
      new THREE.Vector3(effectiveAnchorX, 1.8, 0),
      new THREE.Vector3(effectiveAnchorX, 0.2, 0)
    ]),
    [effectiveAnchorX]
  );
  curve.curveType = "chordal";
  const handleRelease = useCallback(() => {
    if (!isDraggingRef.current && !wasDragged.current) return;
    isDraggingRef.current = false;
    onDragChange?.(false);
    if (activePointerId.current !== null && gl?.domElement) {
      try {
        if (gl.domElement.releasePointerCapture) {
          gl.domElement.releasePointerCapture(activePointerId.current);
        }
      } catch {
      }
      activePointerId.current = null;
    }
    setDragged(false);
    if (phoneRef.current && wasDragged.current) {
      const vx = THREE.MathUtils.clamp(dragVelocity.current.x, -4.5, 4.5);
      const vy = THREE.MathUtils.clamp(dragVelocity.current.y, -4.5, 4.5);
      const vz = THREE.MathUtils.clamp(dragVelocity.current.z, -3.5, 3.5);
      const spinY = THREE.MathUtils.clamp(
        dragVelocity.current.x * 0.08 - dragVelocity.current.z * 0.04,
        -1.2,
        1.2
      );
      const spinX = THREE.MathUtils.clamp(dragVelocity.current.z * 0.04, -0.5, 0.5);
      const spinZ = THREE.MathUtils.clamp(-dragVelocity.current.x * 0.04, -0.5, 0.5);
      justReleased.current = { vx, vy, vz, spinX, spinY, spinZ };
      try {
        phoneRef.current.wakeUp?.();
        phoneRef.current.setLinvel?.({ x: vx, y: vy, z: vz }, true);
        phoneRef.current.setAngvel?.({ x: spinX, y: spinY, z: spinZ }, true);
      } catch {
      }
    }
    wasDragged.current = false;
    if (enableSound) {
      telephoneAudio.playClick(0.92);
      telephoneAudio.stopRing();
      telephoneAudio.stopDialTone();
    }
    onHangup?.();
  }, [gl, enableSound, onHangup, onDragChange]);
  const handlePointerDown = useCallback(
    (e) => {
      e.stopPropagation();
      const pointerId = e.pointerId ?? (e.nativeEvent && e.nativeEvent.pointerId);
      activePointerId.current = pointerId ?? null;
      isDraggingRef.current = true;
      onDragChange?.(true);
      setHovered(true);
      if (pointerId !== null && pointerId !== void 0 && gl?.domElement) {
        try {
          if (gl.domElement.setPointerCapture) {
            gl.domElement.setPointerCapture(pointerId);
          }
        } catch {
        }
      }
      const phoneTrans = phoneRef.current?.translation();
      if (phoneTrans) {
        vec.current.set(phoneTrans.x, phoneTrans.y, phoneTrans.z);
        setDragged(new THREE.Vector3().copy(e.point).sub(vec.current));
        prevDragPos.current.set(phoneTrans.x, phoneTrans.y, phoneTrans.z);
        dragVelocity.current.set(0, 0, 0);
        if (phoneRef.current) {
          const currentRot = phoneRef.current.rotation();
          dragYaw.current = currentRot.y || 0;
        }
        wasDragged.current = true;
      }
      telephoneAudio.stopRing();
      telephoneAudio.stopDialTone();
      if (enableSound) {
        telephoneAudio.playClick(1);
      }
      onPickup?.();
    },
    [gl, enableSound, onPickup, onDragChange]
  );
  const handlePointerUp = useCallback(
    (e) => {
      e.stopPropagation();
      handleRelease();
    },
    [handleRelease]
  );
  const handlePointerOver = useCallback(() => {
    setHovered(true);
    if (phoneRef.current && !isDraggingRef.current) {
      phoneRef.current.wakeUp?.();
      phoneRef.current.applyImpulse?.({ x: 0.018, y: 5e-3, z: 0.016 }, true);
      phoneRef.current.applyTorqueImpulse?.({ x: 2e-3, y: 4e-3, z: -2e-3 }, true);
    }
  }, []);
  useEffect(() => {
    const onGlobalUp = () => {
      if (isDraggingRef.current || wasDragged.current) {
        handleRelease();
      }
    };
    window.addEventListener("pointerup", onGlobalUp, { passive: true });
    window.addEventListener("pointercancel", onGlobalUp, { passive: true });
    window.addEventListener("mouseup", onGlobalUp, { passive: true });
    window.addEventListener("touchend", onGlobalUp, { passive: true });
    window.addEventListener("touchcancel", onGlobalUp, { passive: true });
    window.addEventListener("blur", onGlobalUp, { passive: true });
    return () => {
      window.removeEventListener("pointerup", onGlobalUp);
      window.removeEventListener("pointercancel", onGlobalUp);
      window.removeEventListener("mouseup", onGlobalUp);
      window.removeEventListener("touchend", onGlobalUp);
      window.removeEventListener("touchcancel", onGlobalUp);
      window.removeEventListener("blur", onGlobalUp);
    };
  }, [handleRelease]);
  useEffect(() => {
    document.body.style.cursor = dragged ? "grabbing" : hovered ? "grab" : "auto";
    return () => {
      document.body.style.cursor = "auto";
    };
  }, [hovered, dragged]);
  useFrame((state) => {
    if (isRinging && phoneRef.current && !dragged) {
      const t = Date.now() * 0.05;
      const jx = Math.sin(t * 1.8) * 0.045;
      const jz = Math.cos(t * 2.3) * 0.045;
      phoneRef.current.applyImpulse({ x: jx, y: 0.02, z: jz }, true);
      phoneRef.current.applyTorqueImpulse({ x: jz * 0.08, y: jx * 0.15, z: -jx * 0.08 }, true);
    } else if (hovered && phoneRef.current && !dragged) {
      const t = state.clock.getElapsedTime();
      const cursorX = state.pointer.x - (isMobile ? 0 : -0.25);
      const nudgeX = cursorX * 6e-3 + Math.sin(t * 2.2) * 38e-4;
      const nudgeZ = Math.cos(t * 1.8) * 32e-4;
      phoneRef.current.applyImpulse({ x: nudgeX, y: 1e-3, z: nudgeZ }, true);
      phoneRef.current.applyTorqueImpulse({ x: nudgeZ * 0.025, y: nudgeX * 0.045, z: -nudgeX * 0.025 }, true);
    }
  });
  useFrame((state, delta) => {
    if (justReleased.current && phoneRef.current) {
      const { vx, vy, vz, spinX, spinY, spinZ } = justReleased.current;
      justReleased.current = null;
      try {
        phoneRef.current.wakeUp?.();
        phoneRef.current.setLinvel?.({ x: vx, y: vy, z: vz }, true);
        phoneRef.current.setAngvel?.({ x: spinX, y: spinY, z: spinZ }, true);
      } catch {
      }
    }
    if (dragged && phoneRef.current) {
      vec.current.set(state.pointer.x, state.pointer.y, 0.5).unproject(state.camera);
      dir.current.copy(vec.current).sub(state.camera.position).normalize();
      vec.current.add(dir.current.multiplyScalar(state.camera.position.length()));
      [phoneRef, j1Ref, j2Ref, j3Ref, fixedRef].forEach((ref) => ref.current?.wakeUp());
      const rawNextX = vec.current.x - dragged.x;
      const rawNextY = vec.current.y - dragged.y;
      const rawNextZ = vec.current.z - dragged.z;
      const camera = state.camera;
      const camZ = camera.position.z;
      const currentPhoneZ = phoneRef.current.translation()?.z ?? 0;
      const distFromCam = Math.max(8, camZ - currentPhoneZ);
      const vFovRad = camera.fov * Math.PI / 180;
      const halfVisH = Math.tan(vFovRad / 2) * distFromCam;
      const halfVisW = halfVisH * camera.aspect;
      const maxX = halfVisW - 0.75;
      const minX = -halfVisW + 0.75;
      const maxY = halfVisH - 0.75;
      const minY = -halfVisH + 0.85;
      const nextX = THREE.MathUtils.clamp(rawNextX, minX, maxX);
      const nextY = THREE.MathUtils.clamp(rawNextY, minY, maxY);
      const nextZ = THREE.MathUtils.clamp(rawNextZ, -2.5, 2.5);
      const dt = Math.max(8e-3, Math.min(0.05, delta));
      dragVelocity.current.set(
        (nextX - prevDragPos.current.x) / dt,
        (nextY - prevDragPos.current.y) / dt,
        (nextZ - prevDragPos.current.z) / dt
      );
      prevDragPos.current.set(nextX, nextY, nextZ);
      const topPos = fixedRef.current ? fixedRef.current.translation() : { x: 0, y: 4.8, z: 0 };
      const dx = nextX - topPos.x;
      const dy = Math.max(1, topPos.y - nextY);
      const dz = nextZ - topPos.z;
      const subtleTiltZ = -Math.atan2(dx, dy) * 0.22;
      const subtleTiltX = Math.atan2(dz, dy) * 0.22;
      const yawDelta = THREE.MathUtils.clamp(
        dragVelocity.current.x * 5e-3 - dragVelocity.current.z * 3e-3,
        -0.05,
        0.05
      );
      dragYaw.current += yawDelta;
      const euler = new THREE.Euler(subtleTiltX, dragYaw.current, subtleTiltZ, "YXZ");
      currentDragQuat.current.setFromEuler(euler);
      phoneRef.current.setNextKinematicTranslation({
        x: nextX,
        y: nextY,
        z: nextZ
      });
      phoneRef.current.setNextKinematicRotation(currentDragQuat.current);
      const grommetWorld = new THREE.Vector3(0, jointY, 0).applyQuaternion(currentDragQuat.current).add(new THREE.Vector3(nextX, nextY, nextZ));
      const topAnchorWorld = new THREE.Vector3(topPos.x, topPos.y, topPos.z);
      const spanDist = topAnchorWorld.distanceTo(grommetWorld);
      const sag = Math.max(0.08, 0.85 - spanDist * 0.08);
      const j1Target = new THREE.Vector3().lerpVectors(topAnchorWorld, grommetWorld, 0.33);
      j1Target.y -= sag * 0.7;
      const j2Target = new THREE.Vector3().lerpVectors(topAnchorWorld, grommetWorld, 0.66);
      j2Target.y -= sag * 0.8;
      j1Ref.current?.setNextKinematicTranslation?.(j1Target);
      j2Ref.current?.setNextKinematicTranslation?.(j2Target);
      j3Ref.current?.setNextKinematicTranslation?.(grommetWorld);
      const now = state.clock.getElapsedTime();
      if (now - lastVelocityTime.current > 0.18) {
        const currentPos = new THREE.Vector3(nextX, nextY, nextZ);
        const distMoved = currentPos.distanceTo(lastPos.current);
        if (distMoved > 0.55 && enableSound) {
          telephoneAudio.playCordStretch();
        }
        lastPos.current.copy(currentPos);
        lastVelocityTime.current = now;
      }
    }
    if (fixedRef.current) {
      [j1Ref, j2Ref].forEach((ref) => {
        if (!ref.current) return;
        if (!ref.current.lerped) {
          ref.current.lerped = new THREE.Vector3().copy(ref.current.translation());
        }
        const currentTrans = ref.current.translation();
        const dist = Math.max(0.1, Math.min(1, ref.current.lerped.distanceTo(currentTrans)));
        ref.current.lerped.lerp(currentTrans, delta * (minSpeed + dist * (maxSpeed - minSpeed)));
      });
      const topPos = fixedRef.current.translation();
      const j1Pos = j1Ref.current ? j1Ref.current.lerped || j1Ref.current.translation() : topPos;
      const j2Pos = j2Ref.current ? j2Ref.current.lerped || j2Ref.current.translation() : topPos;
      const j3Pos = j3Ref.current ? j3Ref.current.translation() : topPos;
      curve.points[0].set(topPos.x, topPos.y, topPos.z);
      curve.points[1].set(j1Pos.x, j1Pos.y, j1Pos.z);
      curve.points[2].set(j2Pos.x, j2Pos.y, j2Pos.z);
      curve.points[3].set(j3Pos.x, j3Pos.y, j3Pos.z);
      if (phoneRef.current && !dragged) {
        const angVel = phoneRef.current.angvel();
        phoneRef.current.setAngvel({
          x: angVel.x * 0.93,
          y: angVel.y * 0.94,
          z: angVel.z * 0.93
        });
        const currentTrans = phoneRef.current.translation();
        if (currentTrans) {
          const camera = state.camera;
          const distFromCam = Math.max(8, camera.position.z - currentTrans.z);
          const vFovRad = camera.fov * Math.PI / 180;
          const halfVisW = Math.tan(vFovRad / 2) * distFromCam * camera.aspect;
          const boundX = Math.max(0.6, halfVisW - (isCustom ? 1.25 : 1.15));
          if (currentTrans.x > boundX) {
            const push = (currentTrans.x - boundX) * -0.3;
            phoneRef.current.applyImpulse({ x: push, y: 0, z: 0 }, true);
          } else if (currentTrans.x < -boundX) {
            const push = (-boundX - currentTrans.x) * -0.3;
            phoneRef.current.applyImpulse({ x: push, y: 0, z: 0 }, true);
          }
        }
      }
    }
  });
  return <>
      {
    /* Physics Chain */
  }
      <group position={[effectiveAnchorX, 4.8, 0]}>
        {
    /* Fixed Ceiling Mount */
  }
        <RigidBody ref={fixedRef} {...segmentProps} type="fixed" />

        {
    /* Vintage architectural ceiling rosette collar where cord is anchored */
  }
        <group position={[0, 0.04, 0]}>
          <mesh position={[0, 0.04, 0]} castShadow receiveShadow>
            <cylinderGeometry args={[0.26, 0.3, 0.06, 32]} />
            <meshStandardMaterial color="#18181b" roughness={0.3} metalness={0.7} />
          </mesh>
          <mesh position={[0, 5e-3, 0]} castShadow receiveShadow>
            <cylinderGeometry args={[0.11, 0.15, 0.05, 24]} />
            <meshStandardMaterial color="#27272a" roughness={0.4} metalness={0.8} />
          </mesh>
        </group>

        {
    /* Intermediate Joint 1 */
  }
        <RigidBody
    position={[0, -1.2, 0]}
    ref={j1Ref}
    {...segmentProps}
    type={dragged ? "kinematicPosition" : "dynamic"}
  >
          <BallCollider args={[0.15]} />
        </RigidBody>

        {
    /* Intermediate Joint 2 */
  }
        <RigidBody
    position={[0, -2.4, 0]}
    ref={j2Ref}
    {...segmentProps}
    type={dragged ? "kinematicPosition" : "dynamic"}
  >
          <BallCollider args={[0.15]} />
        </RigidBody>

        {
    /* Intermediate Joint 3 */
  }
        <RigidBody
    position={[0, -3.6, 0]}
    ref={j3Ref}
    {...segmentProps}
    type={dragged ? "kinematicPosition" : "dynamic"}
  >
          <BallCollider args={[0.15]} />
        </RigidBody>

        {
    /* Vintage Telephone Handset Rigid Body */
  }
        <RigidBody
    position={[0, -4.9, 0]}
    ref={phoneRef}
    {...segmentProps}
    type={dragged ? "kinematicPosition" : "dynamic"}
  >
          {
    /* Handset physical collider calibrated to the 3D model */
  }
          <CuboidCollider
    args={isCustom ? [0.38, 1.42, 0.42] : [0.45, 1.45, 0.35]}
    position={isCustom ? [0, -0.05, -0.05] : [-0.1, -0.2, 0]}
  />

          {
    /* 3D Handset Model with Suspense Fallback */
  }
          <React.Suspense
    fallback={<TelephoneHandset
      color={phoneColor}
      isHovered={hovered}
      isDragged={!!dragged}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      scale={1.25}
    />}
  >
            {isCustom ? <CustomTelephoneModel
    color={phoneColor}
    isHovered={hovered}
    isDragged={!!dragged}
    onPointerDown={handlePointerDown}
    onPointerUp={handlePointerUp}
    onPointerOver={() => setHovered(true)}
    onPointerOut={() => setHovered(false)}
    scale={scale}
  /> : <TelephoneHandset
    color={phoneColor}
    isHovered={hovered}
    isDragged={!!dragged}
    onPointerDown={handlePointerDown}
    onPointerUp={handlePointerUp}
    onPointerOver={() => setHovered(true)}
    onPointerOut={() => setHovered(false)}
    scale={scale}
  />}
          </React.Suspense>
        </RigidBody>
      </group>

      {
    /* Photorealistic 3D Coiled Tube Cord */
  }
      <CoiledCordTube
    curve={curve}
    coils={coils}
    coilRadius={coilRadius}
    wireRadius={cordWidth * 0.025}
    color={cordColor}
    roughness={0.16}
    metalness={0.05}
    clearcoat={0.92}
  />
    </>;
}


// ==================== Contact.jsx ====================

const PHONE_BLACK = {
  value: "#08080b",
  cord: "#0a0a0d"
};

export default function Contact({ isLocked }) {
  const [modelType, setModelType] = useState("custom");
  const [selectedShadowPreset, setSelectedShadowPreset] = useState("subtle");
  const [shadowOpacity, setShadowOpacity] = useState(0.035);
  const [shadowDistance, setShadowDistance] = useState(0.95);
  const [shadowBlur, setShadowBlur] = useState(20);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isRinging, setIsRinging] = useState(false);
  const [isOffHook, setIsOffHook] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [resetKey, setResetKey] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const toggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    telephoneAudio.setMuted(!next);
  };

  const triggerRing = useCallback(() => {
    if (isRinging) {
      telephoneAudio.stopRing();
      setIsRinging(false);
      return;
    }
    setHasInteracted(true);
    setIsRinging(true);
    telephoneAudio.startRing(3, (ringing) => {
      setIsRinging(ringing);
    });
  }, [isRinging]);

  const handlePickup = () => {
    setHasInteracted(true);
    setIsOffHook(true);
    telephoneAudio.stopRing();
    telephoneAudio.stopDialTone();
    setIsRinging(false);
  };

  const handleHangup = () => {
    setIsOffHook(false);
  };

  const handleReset = () => {
    telephoneAudio.stopRing();
    telephoneAudio.stopDialTone();
    setIsRinging(false);
    setIsOffHook(false);
    setResetKey((prev) => prev + 1);
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }
      if (e.code === "Space" && !e.repeat) {
        triggerRing();
      } else if (e.code === "KeyM") {
        toggleSound();
      } else if (e.code === "KeyR") {
        handleReset();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [triggerRing, soundEnabled]);

  return (
    <div className="app-wrapper">
      {/* MAIN WORKSPACE: SPLIT SCREEN */}
      <main className="main-workspace">
        {/* FULL-PAGE 3D WEBGL CANVAS */}
        <div
          className={`canvas-overlay ${
            isDragging ? "canvas-z-active" : "canvas-z-normal"
          }`}
        >
          <Lanyard
            key={resetKey}
            position={[-2.2, 1.8, 21.5]}
            gravity={[0, -36, 0]}
            fov={24}
            transparent={true}
            phoneColor={PHONE_BLACK.value}
            cordColor={PHONE_BLACK.cord}
            cordWidth={1.05}
            coils={38}
            enableSound={soundEnabled}
            isRinging={isRinging}
            isLocked={isLocked}
            modelType={modelType}
            shadowOpacity={shadowOpacity}
            shadowDistance={shadowDistance}
            shadowBlur={shadowBlur}
            onPickup={handlePickup}
            onHangup={handleHangup}
            onDragChange={(dragging) => setIsDragging(dragging)}
          />
        </div>

        {/* FOREGROUND WORKSPACE */}
        <div className="foreground-workspace">
          {/* Left Column Annotation Area */}
          <div className="left-column">
            {/* Handwritten "Let's connect →" annotation */}
            <button
              id="lets-connect-scribble-btn"
              type="button"
              onClick={() => {
                telephoneAudio.playClick(1.2);
                triggerRing();
              }}
              className="lets-connect-btn"
              title="Click to ring the hanging telephone"
            >
              <span className="lets-connect-text">
                Let's
                <br />
                connect
              </span>
              <svg
                width="48"
                height="22"
                viewBox="0 0 48 22"
                fill="none"
                className="lets-connect-arrow"
              >
                <path
                  d="M 2 11 C 16 10 32 11 42 11"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                />
                <path
                  d="M 33 4 L 43 11 L 33 18"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>


          </div>

          {/* Right Column: The Contact Card Apparatus */}
          <div className="right-column">
            <div className="contact-card-wrapper">
              <ContactCard
                isRinging={isRinging}
                isOffHook={isOffHook}
                onTriggerRing={triggerRing}
                userEmail="koushikwpbackup@gmail.com"
                recipientName="Koushik"
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
