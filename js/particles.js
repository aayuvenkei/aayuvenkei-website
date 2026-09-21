// ========== PARTICLE ENGINE ==========
const ParticleEngine = {
    canvas: null,
    ctx: null,
    particles: [],
    maxParticles: 80,
    rafId: null,

    init() {
        if (AV.isReduced) return;

        this.canvas = document.getElementById('particle-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.resize();
        this.createParticles();
        this.animate();

        document.addEventListener('av:resize', () => this.resize());
        document.addEventListener('av:visibility', (e) => {
            if (e.detail.visible && !this.rafId) this.animate();
        });

        // Reduce on mobile
        if (AV.isMobile) {
            this.maxParticles = 30;
        }
    },

    resize() {
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        this.canvas.width = AV.windowW * dpr;
        this.canvas.height = AV.windowH * dpr;
        this.canvas.style.width = AV.windowW + 'px';
        this.canvas.style.height = AV.windowH + 'px';
        this.ctx.scale(dpr, dpr);
    },

    createParticles() {
        this.particles = [];
        for (let i = 0; i < this.maxParticles; i++) {
            this.particles.push(this.createParticle());
        }
    },

    createParticle(fromTop = false) {
        const size = Math.random() * 2 + 0.5;
        return {
            x: Math.random() * AV.windowW,
            y: fromTop ? -10 : Math.random() * AV.windowH,
            size,
            speedY: Math.random() * 0.3 + 0.1,
            speedX: (Math.random() - 0.5) * 0.15,
            opacity: Math.random() * 0.4 + 0.1,
            flickerSpeed: Math.random() * 0.02 + 0.005,
            flickerOffset: Math.random() * Math.PI * 2,
            isGlow: Math.random() > 0.85
        };
    },

    animate() {
        if (!AV.isTabVisible) {
            this.rafId = requestAnimationFrame(() => this.animate());
            return;
        }

        this.ctx.clearRect(0, 0, AV.windowW, AV.windowH);

        const style = getComputedStyle(document.documentElement);
        const particleColor = style.getPropertyValue('--particle-color').trim() || 'rgba(255,255,255,0.3)';
        const glowColor = style.getPropertyValue('--particle-glow').trim() || 'rgba(0,240,255,0.15)';

        for (let i = 0; i < this.particles.length; i++) {
            const p = this.particles[i];

            // Update position
            p.y += p.speedY;
            p.x += p.speedX;

            // Subtle mouse influence
            if (!AV.isTouch) {
                const dx = AV.mouseX - p.x;
                const dy = AV.mouseY - p.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 150) {
                    const force = (150 - dist) / 150 * 0.3;
                    p.x -= (dx / dist) * force;
                    p.y -= (dy / dist) * force;
                }
            }

            // Flicker
            const flicker = Math.sin(Date.now() * p.flickerSpeed + p.flickerOffset) * 0.3 + 0.7;
            const finalOpacity = p.opacity * flicker;

            // Reset if out of bounds
            if (p.y > AV.windowH + 10 || p.x < -10 || p.x > AV.windowW + 10) {
                Object.assign(p, this.createParticle(true));
            }

            // Draw
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);

            if (p.isGlow) {
                this.ctx.fillStyle = glowColor.replace(/[\d.]+\)$/, (finalOpacity * 0.8) + ')');
                this.ctx.shadowColor = glowColor;
                this.ctx.shadowBlur = 6;
            } else {
                this.ctx.fillStyle = particleColor.replace(/[\d.]+\)$/, finalOpacity + ')');
                this.ctx.shadowBlur = 0;
            }

            this.ctx.fill();
            this.ctx.shadowBlur = 0;
        }

        this.rafId = requestAnimationFrame(() => this.animate());
    },

    destroy() {
        cancelAnimationFrame(this.rafId);
        this.rafId = null;
    }
};