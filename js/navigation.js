// ========== NAVIGATION ENGINE ==========
const NavigationEngine = {
    nav: null,
    mobileNav: null,
    mobileToggle: null,
    links: [],
    lastScrollY: 0,
    isHidden: false,
    isMobileOpen: false,

    init() {
        this.nav = document.getElementById('nav');
        this.mobileNav = document.getElementById('mobile-nav');
        this.mobileToggle = document.getElementById('nav-mobile-toggle');
        this.links = document.querySelectorAll('.nav__link');

        this.bindScroll();
        this.bindMobile();
        this.setupActiveSection();
    },

    bindScroll() {
        document.addEventListener('av:scroll', (e) => {
            const scrollY = e.detail.y;

            // Show/hide on scroll direction
            if (scrollY > this.lastScrollY && scrollY > 100 && !this.isMobileOpen) {
                if (!this.isHidden) {
                    this.nav.classList.add('is-hidden');
                    this.isHidden = true;
                }
            } else {
                if (this.isHidden) {
                    this.nav.classList.remove('is-hidden');
                    this.isHidden = false;
                }
            }

            // Background on scroll
            if (scrollY > 50) {
                this.nav.classList.add('is-scrolled');
            } else {
                this.nav.classList.remove('is-scrolled');
            }

            this.lastScrollY = scrollY;
        });
    },

    bindMobile() {
        if (!this.mobileToggle) return;

        this.mobileToggle.addEventListener('click', () => {
            this.isMobileOpen = !this.isMobileOpen;
            this.mobileToggle.classList.toggle('is-active', this.isMobileOpen);
            this.mobileNav.classList.toggle('is-open', this.isMobileOpen);
            document.body.style.overflow = this.isMobileOpen ? 'hidden' : '';
        });

        // Close on link click
        this.mobileNav.querySelectorAll('[data-mobile-nav-link]').forEach(link => {
            link.addEventListener('click', () => {
                this.isMobileOpen = false;
                this.mobileToggle.classList.remove('is-active');
                this.mobileNav.classList.remove('is-open');
                document.body.style.overflow = '';
            });
        });
    },

    setupActiveSection() {
        const sections = document.querySelectorAll('.section[id]');
        const options = {
            rootMargin: '-40% 0px -40% 0px',
            threshold: 0
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = entry.target.id;
                    this.setActive(id);
                }
            });
        }, options);

        sections.forEach(section => observer.observe(section));
    },

    setActive(id) {
        this.links.forEach(link => {
            const href = link.getAttribute('href').replace('#', '');
            link.classList.toggle('is-active', href === id);
        });
    }
};