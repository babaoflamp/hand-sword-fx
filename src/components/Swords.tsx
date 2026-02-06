import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { HandLandmarkerResult } from '@mediapipe/tasks-vision';
import { SoundEngine } from '../utils/SoundEngine';
import { useControls, folder } from 'leva';

interface SwordsProps {
  handData: HandLandmarkerResult | null;
}

const DUMMY = new THREE.Object3D();

export const Swords = ({ handData }: SwordsProps) => {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const prevModeRef = useRef<string>('IDLE');

  // Leva 컨트롤 설정
  const { 
    count, 
    moveSpeed, 
    rotSpeed,
    colorAttack,
    colorShield,
    colorSpread,
    colorRock,
    colorVictory,
    colorOk,
    colorThumb,
    colorIdle
  } = useControls('Sword Settings', {
    System: folder({
        count: { value: 10, min: 1, max: 200, step: 1, label: 'Sword Count' },
    }),
    Physics: folder({
        moveSpeed: { value: 0.04, min: 0.01, max: 0.2, step: 0.01, label: 'Follow Speed' },
        rotSpeed: { value: 0.1, min: 0.01, max: 0.5, step: 0.01, label: 'Rotation Smooth' },
    }),
    Colors: folder({
        colorAttack: { value: '#ff0000', label: 'Attack (Red)' },
        colorShield: { value: '#ffaa00', label: 'Shield (Gold)' },
        colorSpread: { value: '#00ffaa', label: 'Spread (Teal)' },
        colorRock: { value: '#ff00ff', label: 'Rock (Purple)' },
        colorVictory: { value: '#00ffff', label: 'Victory (Cyan)' },
        colorOk: { value: '#ffff00', label: 'OK (Yellow)' },
        colorThumb: { value: '#0088ff', label: 'Thumb (Blue)' },
        colorIdle: { value: '#8800ff', label: 'Idle (Violet)' },
    })
  });
  
  // 검 기하구조 생성 (한 번만 계산)
  const swordGeometry = useMemo(() => {
    const shape = new THREE.Shape();
    
    // 검의 반쪽 단면
    const wHandle = 0.04;
    const wGuard = 0.15;
    const wBlade = 0.06;
    const lHandle = 0.4;
    const lGuard = 0.1;
    const lBlade = 1.4;
    
    shape.moveTo(-wHandle, -lHandle);
    shape.lineTo(wHandle, -lHandle);
    shape.lineTo(wHandle, 0);
    shape.lineTo(wGuard, 0.05);
    shape.lineTo(wBlade, 0.15);
    shape.lineTo(wBlade * 0.8, lBlade * 0.8);
    shape.lineTo(0, lBlade); 
    shape.lineTo(-wBlade * 0.8, lBlade * 0.8);
    shape.lineTo(-wBlade, 0.15);
    shape.lineTo(-wGuard, 0.05);
    shape.lineTo(-wHandle, 0);
    shape.lineTo(-wHandle, -lHandle);

    const geom = new THREE.ExtrudeGeometry(shape, {
      depth: 0.04, 
      bevelEnabled: true,
      bevelThickness: 0.02,
      bevelSize: 0.02,
      bevelSegments: 2
    });

    geom.center(); 
    geom.rotateX(-Math.PI / 2);
    
    return geom;
  }, []);

  // 파티클 데이터 (Count 변경 시 재생성)
  const particles = useMemo(() => {
    return new Array(count).fill(0).map(() => ({
      speed: 0.05 + Math.random() * 0.05,
      offset: new THREE.Vector3(
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 5
      ),
      rotationSpeed: (Math.random() - 0.5) * 0.1,
      phase: Math.random() * Math.PI * 2
    }));
  }, [count]);

  useFrame((state) => {
    if (!meshRef.current) return;

    // 1. 손 상태 분석
    let mode = 'IDLE';
    let targetPos = new THREE.Vector3(0, 0, 0);

    if (handData && handData.landmarks.length > 0) {
      const landmarks = handData.landmarks[0];
      const wrist = landmarks[0];
      const thumbTip = landmarks[4];
      const indexTip = landmarks[8];
      const middleTip = landmarks[12];
      const ringTip = landmarks[16];
      const pinkyTip = landmarks[20];
      
      const isIndexOpen = indexTip.y < landmarks[6].y;
      const isMiddleOpen = middleTip.y < landmarks[10].y;
      const isRingOpen = ringTip.y < landmarks[14].y;
      const isPinkyOpen = pinkyTip.y < landmarks[18].y;
      
      const openCount = [isIndexOpen, isMiddleOpen, isRingOpen, isPinkyOpen].filter(Boolean).length;

      targetPos.set(
        (wrist.x - 0.5) * -15, 
        (wrist.y - 0.5) * -10, 
        -wrist.z * 10
      );

      // 제스처 인식
      const distThumbIndex = Math.hypot(thumbTip.x - indexTip.x, thumbTip.y - indexTip.y);
      
      if (distThumbIndex < 0.05 && isMiddleOpen && isRingOpen && isPinkyOpen) {
          mode = 'OK';
      } else if (isIndexOpen && isPinkyOpen && !isMiddleOpen && !isRingOpen) {
          mode = 'ROCK';
      } else if (isIndexOpen && isMiddleOpen && !isRingOpen && !isPinkyOpen) {
          mode = 'VICTORY';
      } else if (openCount === 0 && Math.abs(thumbTip.y - wrist.y) > 0.1) { 
           mode = 'THUMB';
      } else if (openCount >= 4) {
        mode = 'SPREAD';
      } else if (openCount === 0) {
        mode = 'SHIELD';
      } else if (isIndexOpen && !isMiddleOpen && !isRingOpen && !isPinkyOpen) {
        mode = 'ATTACK';
      } else {
        mode = 'FOLLOW';
      }
    }

    if (mode !== prevModeRef.current) {
        if (mode === 'ATTACK') SoundEngine.playAttack();
        else if (mode === 'SHIELD') SoundEngine.playShield();
        else if (mode === 'SPREAD') SoundEngine.playSpread();
        else if (mode === 'ROCK') SoundEngine.playRock();
        else if (mode === 'VICTORY') SoundEngine.playVictory();
        else if (mode === 'OK') SoundEngine.playOk();
        else if (mode === 'THUMB') SoundEngine.playThumb();
        
        prevModeRef.current = mode;
    }

    // 2. 각 검 업데이트
    const time = state.clock.getElapsedTime();
    const activeCount = Math.min(count, particles.length);

    for(let i=0; i < activeCount; i++) {
      const particle = particles[i];

      meshRef.current.getMatrixAt(i, DUMMY.matrix);
      DUMMY.matrix.decompose(DUMMY.position, DUMMY.quaternion, DUMMY.scale);

      let nextPos = new THREE.Vector3();
      
      if (mode === 'IDLE') {
        nextPos.set(
            Math.sin(time * 0.5 + particle.phase) * 5,
            Math.cos(time * 0.3 + particle.phase) * 3,
            Math.sin(time * 0.2 + particle.phase) * 2 - 5
        );
        DUMMY.lookAt(new THREE.Vector3(0,0,10));
      } else if (mode === 'SHIELD') { 
        const radius = 3;
        const angle = time * 2 + particle.phase;
        nextPos.copy(targetPos).add(new THREE.Vector3(
            Math.cos(angle) * radius,
            Math.sin(angle) * radius,
            Math.sin(angle * 2) * 1
        ));
        DUMMY.position.copy(nextPos);
        DUMMY.lookAt(targetPos); 
      } else if (mode === 'ATTACK') { 
         const offset = new THREE.Vector3(
             (Math.random() - 0.5) * 2,
             (Math.random() - 0.5) * 2,
             (Math.random() - 0.5) * 5
         );
         nextPos.copy(targetPos).add(offset).add(new THREE.Vector3(0, 0, -2));
         DUMMY.position.copy(nextPos);
         DUMMY.lookAt(new THREE.Vector3(targetPos.x, targetPos.y, -100));
      } else if (mode === 'SPREAD') { 
         const spreadWidth = 8;
         nextPos.copy(targetPos).add(new THREE.Vector3(
             (Math.random() - 0.5) * spreadWidth * 2,
             (Math.random() - 0.5) * spreadWidth,
             -2
         ));
         DUMMY.position.copy(nextPos);
         DUMMY.lookAt(targetPos);
      } else if (mode === 'ROCK') { 
          const shake = 2.0;
          nextPos.copy(targetPos).add(new THREE.Vector3(
              (Math.random() - 0.5) * shake,
              (Math.random() - 0.5) * shake,
              (Math.random() - 0.5) * shake
          ));
          DUMMY.position.copy(nextPos);
          DUMMY.rotation.set(Math.random()*Math.PI, Math.random()*Math.PI, Math.random()*Math.PI);
      } else if (mode === 'VICTORY') { 
          const radius = 2;
          const height = 10;
          const t = time * 2 + (i / count) * Math.PI * 4; 
          nextPos.copy(targetPos).add(new THREE.Vector3(
              Math.cos(t) * radius,
              ((i / count) - 0.5) * height + Math.sin(time)*2, 
              Math.sin(t) * radius
          ));
          DUMMY.position.copy(nextPos);
          DUMMY.lookAt(new THREE.Vector3(nextPos.x, nextPos.y + 10, nextPos.z));
      } else if (mode === 'OK') { 
          const radius = 4; 
          nextPos.copy(targetPos).add(new THREE.Vector3(
              Math.cos(time + i) * radius,
              Math.sin(time + i) * radius,
              0
          ));
          DUMMY.position.copy(nextPos);
          DUMMY.lookAt(targetPos); 
      } else if (mode === 'THUMB') { 
          const spacing = 1.0;
          const xOffset = (i - count/2) * spacing;
          nextPos.copy(targetPos).add(new THREE.Vector3(
             xOffset,
             3, 
             -2 
          ));
          DUMMY.position.copy(nextPos);
          DUMMY.lookAt(new THREE.Vector3(nextPos.x, nextPos.y, 100)); 
      } else { 
          nextPos.copy(targetPos).add(particle.offset);
          DUMMY.position.copy(nextPos);
          DUMMY.lookAt(targetPos);
      }

      // 동적 파라미터 적용 (Speed)
      let currentSpeed = moveSpeed;
      if (mode === 'ROCK') currentSpeed = 0.5;
      
      DUMMY.position.lerp(nextPos, currentSpeed);
      
      // 동적 파라미터 적용 (Rotation)
      const targetQuat = DUMMY.quaternion.clone(); 
      meshRef.current.getMatrixAt(i, DUMMY.matrix);
      const currentQuat = new THREE.Quaternion();
      const currentPos = new THREE.Vector3();
      const currentScale = new THREE.Vector3();
      DUMMY.matrix.decompose(currentPos, currentQuat, currentScale);
      
      currentQuat.slerp(targetQuat, rotSpeed); 
      DUMMY.quaternion.copy(currentQuat);
      
      // 3. 색상 변경 (동적 파라미터 적용)
      const color = new THREE.Color();
      
      if (mode === 'ATTACK') { 
          const c = new THREE.Color(colorAttack);
          const hue = c.getHSL({ h:0, s:0, l:0 }).h + Math.sin(time * 2 + i * 0.1) * 0.05; 
          color.setHSL(hue, 1.0, 0.5); 
      } else if (mode === 'SHIELD') {
          const c = new THREE.Color(colorShield);
          const lightness = 0.5 + Math.sin(time * 1 + i * 0.2) * 0.2;
          color.setHSL(c.getHSL({ h:0, s:0, l:0 }).h, 1.0, lightness);
      } else if (mode === 'SPREAD') { 
          const c = new THREE.Color(colorSpread);
          const hue = c.getHSL({ h:0, s:0, l:0 }).h + (i / count) * 0.1; 
          color.setHSL(hue, 1.0, 0.6);
      } else if (mode === 'ROCK') { 
          const c = new THREE.Color(colorRock);
          color.setHSL(c.getHSL({ h:0, s:0, l:0 }).h + Math.random()*0.1, 1.0, 0.6); 
      } else if (mode === 'VICTORY') { 
          const c = new THREE.Color(colorVictory);
          color.setHSL(c.getHSL({ h:0, s:0, l:0 }).h + (i/count)*0.1, 1.0, 0.7);
      } else if (mode === 'OK') { 
          const c = new THREE.Color(colorOk);
          color.setHSL(c.getHSL({ h:0, s:0, l:0 }).h, 1.0, 0.5 + Math.sin(time*10)*0.2); 
      } else if (mode === 'THUMB') { 
          const c = new THREE.Color(colorThumb);
          color.setHSL(c.getHSL({ h:0, s:0, l:0 }).h, 1.0, 0.5);
      } else { // IDLE
          const c = new THREE.Color(colorIdle);
          const hue = c.getHSL({ h:0, s:0, l:0 }).h + Math.sin(time * 0.2 + i * 0.01) * 0.15;
          color.setHSL(hue, 0.8, 0.6);
      }
      
      meshRef.current.setColorAt(i, color);

      DUMMY.updateMatrix();
      meshRef.current.setMatrixAt(i, DUMMY.matrix);
    } // end for

    meshRef.current.instanceMatrix.needsUpdate = true;
    if (meshRef.current.instanceColor) meshRef.current.instanceColor.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]} geometry={swordGeometry}>
      <meshStandardMaterial 
        color="#ffffff"
        emissive="#000000" 
        roughness={0.1}
        metalness={0.9}
      />
    </instancedMesh>
  );
};