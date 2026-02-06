// Web Audio API를 사용한 심플 사운드 신디사이저

let audioCtx: AudioContext | null = null;

const getCtx = () => {
    if (!audioCtx) {
        const AudioContext = (window.AudioContext || (window as any).webkitAudioContext);
        audioCtx = new AudioContext();
    }
    return audioCtx;
};

export const SoundEngine = {
    // 🗡️ 공격: 날카로운 금속음
    playAttack: () => {
        try {
            const ctx = getCtx();
            if (ctx.state === 'suspended') ctx.resume();
            
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(800, ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.3);
            
            gain.gain.setValueAtTime(0.1, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
            
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start();
            osc.stop(ctx.currentTime + 0.3);
        } catch (e) {
            console.warn("Audio play failed", e);
        }
    },

    // 🛡️ 방어: 웅장한 에너지 쉴드 (Triangle 파형으로 변경 및 볼륨 업)
    playShield: () => {
        try {
            const ctx = getCtx();
            if (ctx.state === 'suspended') ctx.resume();
            
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            
            // Sine보다 배음이 있는 Triangle 사용
            osc.type = 'triangle'; 
            // 주파수를 조금 높여서(150Hz) 잘 들리게 함
            osc.frequency.setValueAtTime(180, ctx.currentTime); 
            osc.frequency.exponentialRampToValueAtTime(80, ctx.currentTime + 0.6);
            
            // 볼륨 증가
            gain.gain.setValueAtTime(0.4, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.6);
            
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start();
            osc.stop(ctx.currentTime + 0.6);
        } catch (e) {
             console.warn("Audio play failed", e);
        }
    },

        // 🦅 확산: 바람 소리

        playSpread: () => {

            try {

                const ctx = getCtx();

                if (ctx.state === 'suspended') ctx.resume();

                

                const osc = ctx.createOscillator();

                const gain = ctx.createGain();

                

                osc.type = 'triangle';

                osc.frequency.setValueAtTime(200, ctx.currentTime);

                osc.frequency.linearRampToValueAtTime(600, ctx.currentTime + 0.4);

                

                gain.gain.setValueAtTime(0.0, ctx.currentTime);

                gain.gain.linearRampToValueAtTime(0.1, ctx.currentTime + 0.1); 

                gain.gain.linearRampToValueAtTime(0.01, ctx.currentTime + 0.4); 

                

                osc.connect(gain);

                gain.connect(ctx.destination);

                osc.start();

                osc.stop(ctx.currentTime + 0.4);

            } catch (e) {

                 console.warn("Audio play failed", e);

            }

        },

    

        // 🤘 ROCK: 전기 지직거리는 소리

        playRock: () => {

            try {

                const ctx = getCtx();

                if (ctx.state === 'suspended') ctx.resume();

                const osc = ctx.createOscillator();

                const gain = ctx.createGain();

                osc.type = 'sawtooth';

                // 주파수 변조 (LFO 느낌)

                osc.frequency.setValueAtTime(100, ctx.currentTime);

                osc.frequency.linearRampToValueAtTime(50, ctx.currentTime + 0.1);

                osc.frequency.linearRampToValueAtTime(150, ctx.currentTime + 0.2);

                osc.frequency.linearRampToValueAtTime(50, ctx.currentTime + 0.3);

    

                gain.gain.setValueAtTime(0.1, ctx.currentTime);

                gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);

    

                osc.connect(gain);

                gain.connect(ctx.destination);

                osc.start();

                osc.stop(ctx.currentTime + 0.4);

            } catch(e) {}

        },

    

        // ✌️ VICTORY: 띠리링 (아르페지오 느낌)

        playVictory: () => {

            try {

                const ctx = getCtx();

                if (ctx.state === 'suspended') ctx.resume();

                

                [0, 0.1, 0.2].forEach((delay, i) => {

                    const osc = ctx.createOscillator();

                    const gain = ctx.createGain();

                    osc.type = 'sine';

                    osc.frequency.setValueAtTime(440 + i * 110, ctx.currentTime + delay); // A4, C#5, E5

                    

                    gain.gain.setValueAtTime(0.1, ctx.currentTime + delay);

                    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + delay + 0.3);

                    

                    osc.connect(gain);

                    gain.connect(ctx.destination);

                    osc.start(ctx.currentTime + delay);

                    osc.stop(ctx.currentTime + delay + 0.3);

                });

            } catch(e) {}

        },

    

        // 👌 OK: 기 모으는 소리 (Charging)

        playOk: () => {

            try {

                const ctx = getCtx();

                if (ctx.state === 'suspended') ctx.resume();

                const osc = ctx.createOscillator();

                const gain = ctx.createGain();

                osc.type = 'square';

                osc.frequency.setValueAtTime(200, ctx.currentTime);

                osc.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.5);

    

                gain.gain.setValueAtTime(0.05, ctx.currentTime);

                gain.gain.linearRampToValueAtTime(0.01, ctx.currentTime + 0.5);

    

                osc.connect(gain);

                gain.connect(ctx.destination);

                osc.start();

                osc.stop(ctx.currentTime + 0.5);

            } catch(e) {}

        },

    

        // 👍 THUMB: 따봉 (성공음)

        playThumb: () => {

            try {

                const ctx = getCtx();

                if (ctx.state === 'suspended') ctx.resume();

                const osc = ctx.createOscillator();

                const gain = ctx.createGain();

                osc.type = 'sine';

                osc.frequency.setValueAtTime(300, ctx.currentTime);

                osc.frequency.exponentialRampToValueAtTime(600, ctx.currentTime + 0.15);

    

                gain.gain.setValueAtTime(0.2, ctx.currentTime);

                gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);

    

                osc.connect(gain);

                gain.connect(ctx.destination);

                osc.start();

                osc.stop(ctx.currentTime + 0.3);

            } catch(e) {}

        }

    };

    