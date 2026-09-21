// ========== CUSTOM CURSOR ==========
const CursorEngine = {
    cursor: null,
    dot: null,
    ring: null,
    trail: null,
    dotX: 0, dotY: 0,
    ringX: 0, ringY: 0,
    trailX: 0, trailY: 0,
    targetX: 0, targetY: 0,
    isHovering: false,
    currentState: 'normal',
    rafId: null,

    init() {
        if (AV.isTouch) return;

        this.cursor = document.getElementById('cursor');
        this.dot = this.cursor.querySelector('.cursor__dot');
        this.ring = this.cursor.querySelector('.cursor__ring');
        this.trail = this.cursor.querySelector('.cursor__trail');

        this.bindEvents();
        this.animate();
    },

    bindEvents() {
        document.addEventListener('av:mousemove', (e) => {
            this.targetX = e.detail.x;
            this.targetY = e.detail.y;
        });

        // Interactive elements
        const interactives = document.querySelectorAll('[data-cursor]');
        interactives.forEach(el => {
            el.addEventListener('mouseenter', () => {
                const state = el.getAttribute('data-cursor');
                this.setState(state);
            });
            el.addEventListener('mouseleave', () => {
                this.setState('normal');
            });
        });

        // Also handle dynamically added elements
        document.addEventListener('mouseover', (e) => {
            const target = e.target.closest('[data-cursor]');
            if (target) {
                this.setState(target.getAttribute('data-cursor'));
            }
        });

        document.addEventListener('mouseout', (e) => {
            const target = e.target.closest('[data-cursor]');
            if (target && !target.contains(e.relatedTarget)) {
                this.setState('normal');
            }
        });

        // Hide when leaving window
        document.addEventListener('mouseleave', () => {
            this.cursor.classList.add('cursor--hidden');
        });
        document.addEventListener('mouseenter', () => {
            this.cursor.classList.remove('cursor--hidden');
        });
    },

    setState(state) {
        this.cursor.className = 'cursor';
        if (state !== 'normal') {
            this.cursor.classList.add(`cursor--${state}`);
        }
        this.currentState = state;
    },

    animate() {
        // Dot follows closely
        this.dotX += (this.targetX - this.dotX) * 0.35;
        this.dotY += (this.targetY - this.dotY) * 0.35;

        // Ring follows with lag
        this.ringX += (this.targetX - this.ringX) * 0.15;
        this.ringY += (this.targetY - this.ringY) * 0.15;

        // Trail follows with more lag
        this.trailX += (this.targetX - this.trailX) * 0.08;
        this.trailY += (this.targetY - this.trailY) * 0.08;

        this.dot.style.transform = `translate(${this.dotX - 3}px, ${this.dotY - 3}px)`;
        this.ring.style.transform = `translate(${this.ringX - 20}px, ${this.ringY - 20}px)`;
        this.trail.style.transform = `translate(${this.trailX - 40}px, ${this.trailY - 40}px)`;

        if (AV.isTabVisible) {
            this.rafId = requestAnimationFrame(() => this.animate());
        } else {
            this.rafId = requestAnimationFrame(() => this.animate());
        }
    },

    destroy() {
        cancelAnimationFrame(this.rafId);
    }
};