// ========== SKILLS ENGINE ==========
const SkillsEngine = {
    data: {
        'DEVELOPMENT': [
            { name: 'HTML', desc: 'Semantic, accessible markup' },
            { name: 'CSS', desc: 'Advanced layouts, animations, custom properties' },
            { name: 'JavaScript', desc: 'ES6+, DOM, async patterns' },
            { name: 'TypeScript', desc: 'Type-safe development' },
            { name: 'Python', desc: 'Automation, scripting, backends' },
            { name: 'Node.js', desc: 'Server-side JavaScript runtime' }
        ],
        'FRONTEND': [
            { name: 'React', desc: 'Component architecture, hooks, state' },
            { name: 'Next.js', desc: 'SSR, SSG, full-stack React' },
            { name: 'Tailwind CSS', desc: 'Utility-first styling' },
            { name: 'Framer Motion', desc: 'Declarative animations' },
            { name: 'GSAP', desc: 'Professional-grade animation' }
        ],
        'BACKEND': [
            { name: 'Node.js', desc: 'APIs, servers, real-time' },
            { name: 'Python', desc: 'Flask, FastAPI, scripting' },
            { name: 'REST APIs', desc: 'Design, integration, consumption' },
            { name: 'Automation', desc: 'Workflows, CI/CD, scripts' },
            { name: 'Bots', desc: 'Discord, Telegram, custom agents' },
            { name: 'API Integration', desc: 'Third-party service connections' }
        ],
        'TOOLS': [
            { name: 'Git', desc: 'Version control, branching strategies' },
            { name: 'GitHub', desc: 'Collaboration, CI/CD, open source' },
            { name: 'VS Code', desc: 'Primary development environment' },
            { name: 'Linux', desc: 'Server management, shell scripting' },
            { name: 'Figma', desc: 'Design, prototyping, collaboration' }
        ]
    },

    canvas: null,
    ctx: null,
    connections: [],

    init() {
        this.renderClusters();
        this.setupCanvas();
        this.setupInteraction();
    },

    renderClusters() {
        const container = document.getElementById('skills-clusters');
        if (!container) return;

        const categories = Object.keys(this.data);
        const positions = this.getPositions(categories.length);

        container.innerHTML = '';

        categories.forEach((category, i) => {
            const cluster = document.createElement('div');
            cluster.className = 'skills__cluster';
            cluster.setAttribute('data-reveal', '');

            if (!AV.isMobile) {
                cluster.style.left = positions[i].x + '%';
                cluster.style.top = positions[i].y + '%';
                cluster.style.transform = 'translate(-50%, -50%)';
            }

            const label = document.createElement('div');
            label.className = 'skills__cluster-label';
            label.textContent = category;
            cluster.appendChild(label);

            const items = document.createElement('div');
            items.className = 'skills__cluster-items';

            this.data[category].forEach(skill => {
                const el = document.createElement('div');
                el.className = 'skills__skill';
                el.setAttribute('data-cursor', 'link');
                el.setAttribute('data-skill-category', category);
                el.setAttribute('data-skill-name', skill.name);
                el.setAttribute('data-skill-desc', skill.desc);
                el.innerHTML = `<span class="skills__skill-dot"></span>${skill.name}`;
                items.appendChild(el);
            });

            cluster.appendChild(items);
            container.appendChild(cluster);
        });
    },

    getPositions(count) {
        // Position clusters around center
        return [
            { x: 15, y: 25 },   // DEVELOPMENT - top left
            { x: 80, y: 20 },   // FRONTEND - top right
            { x: 15, y: 75 },   // BACKEND - bottom left
            { x: 80, y: 80 }    // TOOLS - bottom right
        ];
    },

    setupCanvas() {
        if (AV.isMobile) return;

        this.canvas = document.getElementById('skills-canvas');
        if (!this.canvas) return;

        this.ctx = this.canvas.getContext('2d');

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.drawConnections();
                }
            });
        }, { threshold: 0.3 });

        const section = document.getElementById('skills');
        if (section) observer.observe(section);
    },

    drawConnections() {
        if (!this.canvas || !this.ctx) return;

        const universe = this.canvas.parentElement;
        const rect = universe.getBoundingClientRect();
        this.canvas.width = rect.width;
        this.canvas.height = rect.height;

        const center = document.getElementById('skills-center');
        if (!center) return;
        const centerRect = center.getBoundingClientRect();
        const cx = centerRect.left + centerRect.width / 2 - rect.left;
        const cy = centerRect.top + centerRect.height / 2 - rect.top;

        const clusters = document.querySelectorAll('.skills__cluster');
        const style = getComputedStyle(document.documentElement);
        const accentColor = style.getPropertyValue('--accent').trim();

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        clusters.forEach(cluster => {
            const cRect = cluster.getBoundingClientRect();
            const clx = cRect.left + cRect.width / 2 - rect.left;
            const cly = cRect.top + cRect.height / 2 - rect.top;

            this.ctx.beginPath();
            this.ctx.moveTo(cx, cy);

            // Curved line
            const midX = (cx + clx) / 2 + (Math.random() - 0.5) * 40;
            const midY = (cy + cly) / 2 + (Math.random() - 0.5) * 40;
            this.ctx.quadraticCurveTo(midX, midY, clx, cly);

            this.ctx.strokeStyle = accentColor + '15';
            this.ctx.lineWidth = 1;
            this.ctx.setLineDash([4, 8]);
            this.ctx.stroke();
            this.ctx.setLineDash([]);
        });
    },

    setupInteraction() {
        const detail = document.getElementById('skills-detail');
        if (!detail) return;

        const detailCategory = detail.querySelector('.skills__detail-category');
        const detailName = detail.querySelector('.skills__detail-name');
        const detailDesc = detail.querySelector('.skills__detail-desc');

        document.addEventListener('mouseover', (e) => {
            const skill = e.target.closest('.skills__skill');
            if (skill) {
                const category = skill.getAttribute('data-skill-category');
                const name = skill.getAttribute('data-skill-name');
                const desc = skill.getAttribute('data-skill-desc');

                detailCategory.textContent = category;
                detailName.textContent = name;
                detailDesc.textContent = desc;
                detail.classList.add('is-visible');

                // Illuminate related skills
                document.querySelectorAll(`.skills__skill[data-skill-category="${category}"]`).forEach(s => {
                    s.style.borderColor = 'var(--border-accent)';
                });
            }
        });

        document.addEventListener('mouseout', (e) => {
            const skill = e.target.closest('.skills__skill');
            if (skill && !skill.contains(e.relatedTarget)) {
                detail.classList.remove('is-visible');
                document.querySelectorAll('.skills__skill').forEach(s => {
                    s.style.borderColor = '';
                });
            }
        });

        // Touch support
        if (AV.isTouch) {
            document.addEventListener('click', (e) => {
                const skill = e.target.closest('.skills__skill');
                if (skill) {
                    const category = skill.getAttribute('data-skill-category');
                    const name = skill.getAttribute('data-skill-name');
                    const desc = skill.getAttribute('data-skill-desc');

                    detailCategory.textContent = category;
                    detailName.textContent = name;
                    detailDesc.textContent = desc;
                    detail.classList.add('is-visible');

                    setTimeout(() => detail.classList.remove('is-visible'), 3000);
                }
            });
        }
    }
};