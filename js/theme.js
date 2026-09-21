// ========== THEME ENGINE ==========
const ThemeEngine = {
    toggle: null,

    init() {
        this.toggle = document.getElementById('theme-toggle');
        if (!this.toggle) return;

        this.toggle.addEventListener('click', () => this.cycle());
    },

    cycle() {
        AV.themeIndex = (AV.themeIndex + 1) % AV.themes.length;
        AV.theme = AV.themes[AV.themeIndex];

        // Transition class
        document.body.classList.add('theme-transitioning');

        document.documentElement.setAttribute('data-theme', AV.theme);
        localStorage.setItem('av-theme', AV.theme);

        // Dispatch event
        document.dispatchEvent(new CustomEvent('av:theme', {
            detail: { theme: AV.theme }
        }));

        // Remove transition class after animation
        setTimeout(() => {
            document.body.classList.remove('theme-transitioning');
        }, 1000);

        // Recreate particles and smoke with new colors
        if (!AV.isReduced) {
            if (ParticleEngine.particles) {
                ParticleEngine.createParticles();
            }
            if (SmokeEngine.blobs) {
                SmokeEngine.createBlobs();
            }
        }
    }
};