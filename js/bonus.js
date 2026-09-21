// ========== BONUS CREATIVE DETAILS ==========
// These are loaded as part of the main init sequence

// 1. KONAMI CODE EASTER EGG — Triggers a "void burst" animation
(function() {
    const konamiCode = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65]; // up up down down left right left right B A
    let konamiIndex = 0;

    document.addEventListener('keydown', (e) => {
        if (e.keyCode === konamiCode[konamiIndex]) {
            konamiIndex++;
            if (konamiIndex === konamiCode.length) {
                konamiIndex = 0;
                triggerVoidBurst();
            }
        } else {
            konamiIndex = 0;
        }
    });

    function triggerVoidBurst() {
        const burst = document.createElement('div');
        burst.style.cssText = `
            position: fixed; inset: 0; z-index: 99997;
            background: radial-gradient(circle at center, transparent 0%, var(--accent) 50%, transparent 100%);
            pointer-events: none;
            animation: voidBurst 1.5s ease-out forwards;
        `;

        const style = document.createElement('style');
        style.textContent = `
            @keyframes voidBurst {
                0% { opacity: 0; transform: scale(0); }
                30% { opacity: 0.6; transform: scale(1.5); }
                100% { opacity: 0; transform: scale(3); }
            }
        `;
        document.head.appendChild(style);
        document.body.appendChild(burst);
        setTimeout(() => {
            burst.remove();
            style.remove();
        }, 1600);
    }
})();

// 2. AMBIENT SOUND ARCHITECTURE — Ready for optional sound (no autoplay)
(function() {
    // Create hidden toggle in footer for sound enthusiasts
    const footer = document.querySelector('.footer__inner');
    if (!footer) return;

    const soundToggle = document.createElement('button');
    soundToggle.className = 'footer__sound-toggle';
    soundToggle.setAttribute('data-cursor', 'button');
    soundToggle.setAttribute('aria-label', 'Toggle ambient sound');
    soundToggle.style.cssText = `
        font-family: var(--font-mono);
        font-size: 0.55rem;
        letter-spacing: 0.1em;
        color: var(--text-muted);
        opacity: 0.4;
        transition: opacity 0.3s, color 0.3s;
        padding: 4px 8px;
    `;
    soundToggle.textContent = '♪ SOUND OFF';
    soundToggle.addEventListener('mouseenter', () => { soundToggle.style.opacity = '1'; });
    soundToggle.addEventListener('mouseleave', () => { soundToggle.style.opacity = '0.4'; });

    let soundOn = false;
    let audioCtx = null;

    soundToggle.addEventListener('click', () => {
        soundOn = !soundOn;
        soundToggle.textContent = soundOn ? '♪ SOUND ON' : '♪ SOUND OFF';
        soundToggle.style.color = soundOn ? 'var(--accent)' : 'var(--text-muted)';

        if (soundOn && !audioCtx) {
            // Create subtle ambient tone using Web Audio API
            audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(60, audioCtx.currentTime);
            gain.gain.setValueAtTime(0.015, audioCtx.currentTime);
            osc.connect(gain);
            gain.connect(audioCtx.destination);
            osc.start();

            // Very subtle LFO
            const lfo = audioCtx.createOscillator();
            const lfoGain = audioCtx.createGain();
            lfo.frequency.setValueAtTime(0.1, audioCtx.currentTime);
            lfoGain.gain.setValueAtTime(5, audioCtx.currentTime);
            lfo.connect(lfoGain);
            lfoGain.connect(osc.frequency);
            lfo.start();
        }

        if (!soundOn && audioCtx) {
            audioCtx.close();
            audioCtx = null;
        }
    });

    footer.appendChild(soundToggle);
})();

// 3. SECTION TRANSITION WIPE — Cinematic wipe between major sections
(function() {
    if (AV && AV.isReduced) return;

    const sections = document.querySelectorAll('.section');
    const wipe = document.createElement('div');
    wipe.style.cssText = `
        position: fixed; top: 0; left: 0; width: 100%; height: 3px;
        background: linear-gradient(90deg, transparent, var(--accent), transparent);
        z-index: 9998; pointer-events: none;
        opacity: 0; transition: opacity 0.3s;
    `;
    document.body.appendChild(wipe);

    let lastSection = null;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.id;
                if (lastSection && lastSection !== id) {
                    // Flash the wipe line
                    wipe.style.opacity = '1';
                    setTimeout(() => { wipe.style.opacity = '0'; }, 600);
                }
                lastSection = id;
            }
        });
    }, { threshold: 0.5 });

    sections.forEach(s => observer.observe(s));
})();

// 4. DIGITAL FINGERPRINT — Unique session-based visual pattern in hero
(function() {
    const hero = document.querySelector('.hero__container');
    if (!hero) return;

    // Generate unique pattern from timestamp
    const seed = Date.now() % 10000;
    const fingerprint = document.createElement('div');
    fingerprint.style.cssText = `
        position: absolute; bottom: 24px; right: 24px;
        display: grid; grid-template-columns: repeat(8, 4px);
        gap: 2px; opacity: 0.08; pointer-events: none; z-index: 4;
    `;

    const binary = seed.toString(2).padStart(16, '0');
    for (let i = 0; i < 64; i++) {
        const cell = document.createElement('div');
        const bit = binary[i % binary.length] === '1';
        cell.style.cssText = `
            width: 4px; height: 4px;
            background: ${bit ? 'var(--accent)' : 'var(--text-muted)'};
            opacity: ${bit ? '1' : '0.3'};
            border-radius: 1px;
        `;
        fingerprint.appendChild(cell);
    }

    hero.appendChild(fingerprint);
})();

// 5. CURSOR TRAIL CONSTELLATION — When moving cursor fast, leave fading dots that connect
(function() {
    if (typeof AV !== 'undefined' && AV.isTouch) return;

    const trailCanvas = document.createElement('canvas');
    trailCanvas.style.cssText = `
        position: fixed; top: 0; left: 0; width: 100%; height: 100%;
        pointer-events: none; z-index: 99996; opacity: 0.3;
    `;
    document.body.appendChild(trailCanvas);

    const ctx = trailCanvas.getContext('2d');
    const points = [];
    const maxPoints = 20;
    let lastX = 0, lastY = 0;

    function resize() {
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        trailCanvas.width = window.innerWidth * dpr;
        trailCanvas.height = window.innerHeight * dpr;
        trailCanvas.style.width = window.innerWidth + 'px';
        trailCanvas.style.height = window.innerHeight + 'px';
        ctx.scale(dpr, dpr);
    }
    resize();
    window.addEventListener('resize', resize);

    document.addEventListener('mousemove', (e) => {
        const dx = e.clientX - lastX;
        const dy = e.clientY - lastY;
        const speed = Math.sqrt(dx * dx + dy * dy);

        if (speed > 30) {
            points.push({
                x: e.clientX,
                y: e.clientY,
                life: 1,
                size: Math.min(speed * 0.02, 3)
            });
            if (points.length > maxPoints) points.shift();
        }

        lastX = e.clientX;
        lastY = e.clientY;
    });

    function animate() {
        ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

        const style = getComputedStyle(document.documentElement);
        const accent = style.getPropertyValue('--accent').trim() || '#00f0ff';

        for (let i = points.length - 1; i >= 0; i--) {
            const p = points[i];
            p.life -= 0.015;

            if (p.life <= 0) {
                points.splice(i, 1);
                continue;
            }

            // Draw dot
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2);
            ctx.fillStyle = accent;
            ctx.globalAlpha = p.life * 0.5;
            ctx.fill();

            // Connect to next point
            if (i > 0) {
                const next = points[i - 1];
                ctx.beginPath();
                ctx.moveTo(p.x, p.y);
                ctx.lineTo(next.x, next.y);
                ctx.strokeStyle = accent;
                ctx.globalAlpha = p.life * 0.15;
                ctx.lineWidth = 0.5;
                ctx.stroke();
            }
        }

        ctx.globalAlpha = 1;
        requestAnimationFrame(animate);
    }
    animate();
})();