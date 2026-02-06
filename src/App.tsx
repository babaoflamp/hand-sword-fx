import { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { HandLandmarkerResult } from '@mediapipe/tasks-vision';
import { HandTracker } from './components/HandTracker';
import { Swords } from './components/Swords';
import { Character } from './components/Character'; // 추가
import { Environment } from '@react-three/drei';

function App() {
  const [handResult, setHandResult] = useState<HandLandmarkerResult | null>(null);

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative', background: '#111' }}>
      
      {/* 1. 손 추적기 (왼쪽 상단 오버레이) */}
      <HandTracker onHandsDetected={setHandResult} />

      {/* 2. 설명 텍스트 */}
      <div className="instructions">
        <h2 style={{margin: '0 0 5px 0', fontSize: '1.2rem'}}>Hand Sword FX</h2>
        <p style={{margin: 0, fontSize: '0.8rem', lineHeight: '1.4'}}>
          ✋ Spread (Wing) | ✊ Fist (Shield) | ☝️ Index (Attack)<br/>
          🤘 Rock (Chaos) | ✌️ Victory (Spiral) | 👌 OK (Focus) | 👍 Thumb (Hero)
        </p>
      </div>

      {/* 3. 3D 씬 */}
      <Canvas camera={{ position: [0, 0, 10], fov: 60 }}>
        <color attach="background" args={['#050505']} />
        
        {/* 조명 */}
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="blue" />
        
        {/* 캐릭터 추가 (중앙) */}
        <Character />
        
        {/* 핵심 이펙트 컴포넌트 */}
        <Swords handData={handResult} />
        
        {/* 환경 맵 (반사 효과) */}
        <Environment preset="city" />
      </Canvas>
    </div>
  );
}

export default App;