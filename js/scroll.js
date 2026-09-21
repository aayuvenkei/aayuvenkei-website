const ScrollEngine = {
    init() {
        this.setupReveals();
        this.setupProgressBar();
        this.setupBuildHover();
    },

    setupReveals() {
        const reveals = document.querySelectorAll('[data-reveal]');
        
        // Force all sections to be visible immediately on load
        reveals.forEach(el => {
            el.classList.add('is-revealed');
            el.style.opacity = '1';
            el.style.transform = 'none';
        });
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