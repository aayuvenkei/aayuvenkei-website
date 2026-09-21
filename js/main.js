const AV = {
    isTouch: false,
    isMobile: false,
    isReduced: false,
    mouseX: 0,
    mouseY: 0,
    scrollY: 0,
    windowW: 0,
    windowH: 0,
    isTabVisible: true,
    theme: 'dark',
    themes: ['dark', 'light', 'void'],
    themeIndex: 0,

    init() {
        this.detectCapabilities();
        this.bindEvents();
        this.startSystems();
    },

    detectCapabilities() {
        this.isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
        this.isMobile = window.innerWidth < 768;
        this.isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        this.windowW = window.innerWidth;
        this.windowH = window.innerHeight;

        if (this.isTouch) document.body.classList.add('is-touch');
        if (this.isMobile) document.body.classList.add('is-mobile');

        const saved = localStorage.getItem('av-theme');
        if (saved && this.themes.includes(saved)) {
            this.theme = saved;
            this.themeIndex = this.themes.indexOf(saved);
            document.documentElement.setAttribute('data-theme', saved);
        }
    },

    bindEvents() {
        let mouseTick = false;
        document.addEventListener('mousemove', (e) => {
            this.mouseX = e.clientX;
            this.mouseY = e.clientY;
            if (!mouseTick) {
                mouseTick = true;
                requestAnimationFrame(() => {
                    document.dispatchEvent(new CustomEvent('av:mousemove', {
                        detail: { x: this.mouseX, y: this.mouseY }
                    }));
                    mouseTick = false;
                });
            }
        });

        let scrollTick = false;
        window.addEventListener('scroll', () => {
            this.scrollY = window.scrollY;
            if (!scrollTick) {
                scrollTick = true;
                requestAnimationFrame(() => {
                    document.dispatchEvent(new CustomEvent('av:scroll', {
                        detail: { y: this.scrollY }
                    }));
                    scrollTick = false;
                });
            }
        }, { passive: true });

        window.addEventListener('resize', () => {
            this.windowW = window.innerWidth;
            this.windowH = window.innerHeight;
            this.isMobile = window.innerWidth < 768;
            document.dispatchEvent(new CustomEvent('av:resize'));
        });

        document.addEventListener('visibilitychange', () => {
            this.isTabVisible = !document.hidden;
        });
    },

    startSystems() {
        document.addEventListener('av:loaded', () => {
            document.body.classList.remove('is-loading');

            setTimeout(() => {
                // Initializing all systems smoothly
                if (!this.isTouch && typeof CursorEngine !== 'undefined') CursorEngine.init();
                if (!this.isReduced) {
                    if (typeof SmokeEngine !== 'undefined') SmokeEngine.init();
                    if (typeof ParticleEngine !== 'undefined') ParticleEngine.init();
                }
                if (typeof NavigationEngine !== 'undefined') NavigationEngine.init();
                if (typeof ScrollEngine !== 'undefined') ScrollEngine.init();
                if (typeof HeroEngine !== 'undefined') HeroEngine.init();
                if (typeof SkillsEngine !== 'undefined') SkillsEngine.init();
                
                // IMPORTANT: Added BuildEngine here so it works!
                if (typeof BuildEngine !== 'undefined') BuildEngine.init(); 
                
                if (typeof ProjectsEngine !== 'undefined') ProjectsEngine.init();
                if (typeof SystemEngine !== 'undefined') SystemEngine.init();
                if (typeof MagneticEngine !== 'undefined') MagneticEngine.init();
                if (typeof ThemeEngine !== 'undefined') ThemeEngine.init();
                if (typeof BonusEngine !== 'undefined') BonusEngine.init();
            }, 80);
        });
    }
};

document.addEventListener('DOMContentLoaded', () => {
    document.body.classList.add('is-loading');
    AV.init();

    // Start loader
    if (typeof LoaderEngine !== 'undefined') {
        LoaderEngine.init();
    } else {
        // Safe fallback if loader is missing
        document.body.classList.remove('is-loading');
        document.dispatchEvent(new CustomEvent('av:loaded'));
    }

    // Ultimate safety wrapper: force reveal after 3 seconds if stuck
    setTimeout(() => {
        if (document.body.classList.contains('is-loading')) {
            document.body.classList.remove('is-loading');
            document.dispatchEvent(new CustomEvent('av:loaded'));
            console.warn('AAYUVENKEI: force-revealed after timeout');
        }
    }, 3000);
});