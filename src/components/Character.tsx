import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Image } from '@react-three/drei';
import * as THREE from 'three';

export const Character = () => {
  const groupRef = useRef<THREE.Group>(null);
  
  // 숨쉬는 애니메이션
  useFrame((state) => {
    if (groupRef.current) {
      // 천천히 위아래로 부유 (숨쉬기)
      groupRef.current.position.y = -0.5 + Math.sin(state.clock.elapsedTime * 1) * 0.05;
    }
  });

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {/* 
        이미지 캐릭터
        url: public 폴더 내 이미지 경로
        transparent: 투명 배경 지원
        scale: 크기 조절 (가로, 세로)
      */}
      <Image 
        url="/character.png" 
        transparent 
        scale={[4, 4]} // 이미지 크기에 맞춰 조절하세요
        position={[0, 1, 0]}
      />
      
      {/* 바닥 그림자 (선택 사항) */}
      <mesh position={[0, -1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[1.5, 32]} />
        <meshBasicMaterial color="#000000" opacity={0.5} transparent />
      </mesh>
    </group>
  );
};
