// ========== MAGNETIC BUTTON ENGINE ==========
const MagneticEngine = {
    elements: [],

    init() {
        if (AV.isTouch) return;

        this.elements = document.querySelectorAll('[data-magnetic]');
        this.bind();

        // Re-bind on DOM changes (for dynamically added elements)
        const observer = new MutationObserver(() => {
            this.elements = document.querySelectorAll('[data-magnetic]');
        });
        observer.observe(document.body, { childList: true, subtree: true });
    },

    bind() {
        document.addEventListener('av:mousemove', (e) => {
            this.elements.forEach(el => {
                const rect = el.getBoundingClientRect();
                const centerX = rect.left + rect.width / 2;
                const centerY = rect.top + rect.height / 2;
                const dx = e.detail.x - centerX;
                const dy = e.detail.y - centerY;
                const dist = Math.sqrt(dx * dx + dy * dy);
                const maxDist = 100;

                if (dist < maxDist) {
                    const force = (maxDist - dist) / maxDist;
                    const moveX = dx * force * 0.3;
                    const moveY = dy * force * 0.3;
                    el.style.transform = `translate(${moveX}px, ${moveY}px)`;
                } else {
                    el.style.transform = '';
                }
            });
        });

        // Reset on mouse leave
        this.elements.forEach(el => {
            el.addEventListener('mouseleave', () => {
                el.style.transform = '';
                el.style.transition = 'transform 0.4s var(--ease-out-expo)';
                setTimeout(() => {
                    el.style.transition = '';
                }, 400);
            });
        });
    }
};