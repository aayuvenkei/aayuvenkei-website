// ========== SMOKE / ATMOSPHERE ENGINE ==========
const SmokeEngine = {
    canvas: null,
    ctx: null,
    blobs: [],
    rafId: null,
    time: 0,

    init() {
        if (AV.isReduced) return;

        this.canvas = document.getElementById('smoke-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.resize();
        this.createBlobs();
        this.animate();

        document.addEventListener('av:resize', () => this.resize());
    },

    resize() {
        // Use lower resolution for performance
        const scale = AV.isMobile ? 0.25 : 0.5;
        this.canvas.width = AV.windowW * scale;
        this.canvas.height = AV.windowH * scale;
        this.canvas.style.width = AV.windowW + 'px';
        this.canvas.style.height = AV.windowH + 'px';
        this.scale = scale;
    },

    createBlobs() {
        const count = AV.isMobile ? 4 : 7;
        this.blobs = [];
        for (let i = 0; i < count; i++) {
            this.blobs.push({
                x: Math.random(),
                y: Math.random(),
                radius: Math.random() * 0.3 + 0.15,
                speedX: (Math.random() - 0.5) * 0.0003,
                speedY: (Math.random() - 0.5) * 0.0003,
                phase: Math.random() * Math.PI * 2,
                phaseSpeed: Math.random() * 0.001 + 0.0005
            });
        }
    },

    animate() {
        if (!AV.isTabVisible) {
            this.rafId = requestAnimationFrame(() => this.animate());
            return;
        }

        this.time++;
        const w = this.canvas.width;
        const h = this.canvas.height;

        this.ctx.clearRect(0, 0, w, h);

        const style = getComputedStyle(document.documentElement);
        const smoke1 = style.getPropertyValue('--smoke-1').trim();
        const smoke2 = style.getPropertyValue('--smoke-2').trim();

        // Mouse influence
        const mx = (AV.mouseX / AV.windowW) * w;
        const my = (AV.mouseY / AV.windowH) * h;

        for (const blob of this.blobs) {
            blob.x += blob.speedX + Math.sin(this.time * blob.phaseSpeed) * 0.0001;
            blob.y += blob.speedY + Math.cos(this.time * blob.phaseSpeed) * 0.0001;

            // Subtle mouse influence
            if (!AV.isTouch) {
                const bx = blob.x * w;
                const by = blob.y * h;
                const dx = mx - bx;
                const dy = my - by;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < w * 0.3) {
                    blob.x += (dx / dist) * 0.00005;
                    blob.y += (dy / dist) * 0.00005;
                }
            }

            // Wrap
            if (blob.x < -0.3) blob.x = 1.3;
            if (blob.x > 1.3) blob.x = -0.3;
            if (blob.y < -0.3) blob.y = 1.3;
            if (blob.y > 1.3) blob.y = -0.3;

            const cx = blob.x * w;
            const cy = blob.y * h;
            const r = blob.radius * Math.min(w, h);

            const breathe = Math.sin(this.time * 0.005 + blob.phase) * 0.1 + 1;

            const gradient = this.ctx.createRadialGradient(cx, cy, 0, cx, cy, r * breathe);
            gradient.addColorStop(0, smoke1);
            gradient.addColorStop(0.5, smoke2);
            gradient.addColorStop(1, 'transparent');

            this.ctx.fillStyle = gradient;
            this.ctx.fillRect(0, 0, w, h);
        }

        this.rafId = requestAnimationFrame(() => this.animate());
    },

    destroy() {
        cancelAnimationFrame(this.rafId);
    }
};