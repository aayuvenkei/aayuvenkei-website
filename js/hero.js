// ========== HERO ENGINE ==========
const HeroEngine = {
    chars: [],
    timeEl: null,
    timeInterval: null,

    init() {
        this.chars = document.querySelectorAll('[data-hero-char]');
        this.timeEl = document.getElementById('hero-time');

        this.setupCharInteraction();
        this.startClock();
        this.animateEntry();

        if (!AV.isReduced) {
            this.setupParallax();
            this.setupGlitchEffect();
        }
    },

    setupCharInteraction() {
        if (AV.isTouch) return;

        document.addEventListener('av:mousemove', (e) => {
            const titleEl = document.getElementById('hero-title');
            if (!titleEl) return;

            const rect = titleEl.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;

            this.chars.forEach((char, i) => {
                const dx = e.detail.x - (rect.left + (i / this.chars.length) * rect.width);
                const dy = e.detail.y - centerY;
                const dist = Math.sqrt(dx * dx + dy * dy);
                const maxDist = 300;

                if (dist < maxDist) {
                    const force = (maxDist - dist) / maxDist;
                    const moveX = -(dx / dist) * force * 3;
                    const moveY = -(dy / dist) * force * 2;
                    char.style.transform = `translate(${moveX}px, ${moveY}px)`;
                    char.style.textShadow = `0 0 ${force * 30}px var(--accent-strong)`;
                } else {
                    char.style.transform = 'translate(0, 0)';
                    char.style.textShadow = 'none';
                }
            });
        });
    },

    startClock() {
        const update = () => {
            const now = new Date();
            const options = { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false };
            const time = now.toLocaleTimeString('en-US', options);
            if (this.timeEl) this.timeEl.textContent = time + ' IST';
        };
        update();
        this.timeInterval = setInterval(update, 1000);
    },

    animateEntry() {
        // Stagger character reveal
        this.chars.forEach((char, i) => {
            char.style.opacity = '0';
            char.style.transform = 'translateY(20px)';
            setTimeout(() => {
                char.style.transition = 'opacity 0.6s var(--ease-out-expo), transform 0.6s var(--ease-out-expo)';
                char.style.opacity = '1';
                char.style.transform = 'translateY(0)';
            }, 200 + i * 50);
        });

        // Reveal other elements
        const reveals = document.querySelectorAll('.hero [data-reveal]');
        reveals.forEach((el, i) => {
            setTimeout(() => {
                el.classList.add('is-revealed');
            }, 800 + i * 150);
        });
    },

    setupParallax() {
        const signature = document.querySelector('.hero__signature');
        const depths = document.querySelectorAll('.hero__depth-layer');

        document.addEventListener('av:mousemove', (e) => {
            const mx = (e.detail.x / AV.windowW - 0.5) * 2;
            const my = (e.detail.y / AV.windowH - 0.5) * 2;

            if (signature) {
                signature.style.transform = `translate(${mx * 15}px, ${my * 15}px)`;
            }

            depths.forEach((d, i) => {
                const factor = (i + 1) * 8;
                d.style.transform = `translate(calc(-50% + ${mx * factor}px), calc(-50% + ${my * factor}px))`;
            });
        });
    },

    setupGlitchEffect() {
        // Occasional micro-glitch on title
        const title = document.getElementById('hero-title');
        if (!title) return;

        const glitch = () => {
            title.classList.add('glitch-micro');
            setTimeout(() => title.classList.remove('glitch-micro'), 150);
        };

        // Random glitch every 5-15 seconds
        const scheduleGlitch = () => {
            const delay = Math.random() * 10000 + 5000;
            setTimeout(() => {
                if (AV.isTabVisible) glitch();
                scheduleGlitch();
            }, delay);
        };
        scheduleGlitch();
    },

    destroy() {
        clearInterval(this.timeInterval);
    }
};