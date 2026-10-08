const ScrollEngine = {
    init() {
        this.setupReveals();
        this.setupProgressBar();
        this.setupBuildHover();
    },

    setupReveals() {
        // Reveals are driven by VibeEngine (IntersectionObserver + failsafe).
        // Nothing is force-shown here any more, otherwise every section would
        // pop in at once and the page would feel flat.
    },

    setupProgressBar() {
        const bar = document.querySelector('.scroll-progress__bar');
        document.addEventListener('av:scroll', () => {
            if (!bar) return;
            const max = document.documentElement.scrollHeight - window.innerHeight;
            bar.style.width = (max > 0 ? Math.min(100, (window.scrollY / max) * 100) : 0) + '%';
        });
    },

    setupBuildHover() {
        document.querySelectorAll('.build__item').forEach(item => {
            item.addEventListener('mousemove', (e) => {
                const r = item.getBoundingClientRect();
                item.style.setProperty('--mx', ((e.clientX - r.left) / r.width * 100) + '%');
                item.style.setProperty('--my', ((e.clientY - r.top) / r.height * 100) + '%');
            });
        });
    }
};