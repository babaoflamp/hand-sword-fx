# ⚔️ Hand Sword FX

**Hand Sword FX**는 Google MediaPipe의 손 인식 기술과 Three.js의 3D 그래픽을 결합한 인터랙티브 웹 애플리케이션입니다. 사용자의 손가락 모양과 위치를 실시간으로 추적하여 "무한의 검제" 스타일의 화려한 마법 검 효과를 연출합니다.

## ✨ 주요 기능

- **7가지 제스처 모드**: 손가락 모양에 따라 검들의 진형, 색상, 효과음이 실시간으로 변화합니다.
- **실시간 손 추적**: MediaPipe Tasks Vision을 사용한 빠르고 정확한 관절 인식.
- **화려한 3D 연출**: Three.js (React Three Fiber)를 이용한 수십 개의 검 인스턴스 렌더링.
- **다이내믹 사운드**: Web Audio API를 통해 별도의 파일 없이 실시간으로 합성된 효과음 제공.
- **라이브 컨트롤 패널**: Leva GUI를 통해 검의 개수, 속도, 색상을 실시간으로 튜닝 가능.
- **커스텀 캐릭터**: `public/character.png` 교체를 통해 자신만의 캐릭터 사용 가능.

## 🖐️ 제스처 가이드

| 제스처 | 모드 | 설명 |
| :--- | :--- | :--- |
| ✋ **Spread** | **Wings** | 등 뒤로 청록색 검들이 날개처럼 펼쳐집니다. |
| ✊ **Fist** | **Shield** | 황금색 검들이 손 주변을 빠르게 회전하며 보호막을 형성합니다. |
| ☝️ **Index** | **Attack** | 붉은 검들이 전방을 향해 정렬하며 공격 태세를 갖춥니다. |
| 🤘 **Rock** | **Chaos** | 보라색 전기를 내뿜으며 검들이 주변에서 폭주합니다. |
| ✌️ **Victory** | **Spiral** | 하늘색 검들이 나선형 DNA 구조를 그리며 상승합니다. |
| 👌 **OK Sign** | **Focus** | 노란색 에너지가 손바닥 중앙으로 강력하게 집중됩니다. |
| 👍 **Thumb Up** | **Hero** | 파란색 검들이 등 뒤에 일렬로 정렬하여 호위합니다. |

## 🛠 기술 스택

- **Frontend**: React, TypeScript, Vite
- **3D Graphics**: Three.js, React Three Fiber, React Three Drei
- **AI/Vision**: Google MediaPipe Tasks (Vision)
- **GUI**: Leva
- **Sound**: Web Audio API

## 🚀 시작하기

### 설치
```bash
git clone git@github.com:babaoflamp/hand-sword-fx.git
cd hand-sword-fx
npm install
```

### 실행
```bash
npm run dev
```

### 사내 망/네트워크 접속
Vite 설정(`host: true`)이 되어 있어 동일 네트워크 기기에서 IP 주소로 접속 가능합니다.
단, IP 주소 접속 시 브라우저 보안 정책상 **HTTPS**가 아니면 웹캠이 차단될 수 있습니다. 
Chrome의 경우 `chrome://flags/#unsafely-treat-insecure-origin-as-secure` 설정에서 해당 IP를 예외 등록하여 사용하세요.

## 🎨 캐릭터 커스텀
1. `public/character.png` 파일을 원하는 이미지로 교체하세요. (배경이 투명한 PNG 권장)
2. 애플리케이션 우측 상단 컨트롤 패널에서 검의 개수나 색상을 이미지에 맞게 조절하세요.