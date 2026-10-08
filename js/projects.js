const ProjectsEngine = {
    projects: [
        {
            name: 'Aayuvenkei.OS',
            tag: 'Portfolio / Identity',
            desc: 'This site. A hand-written digital identity with custom canvas engines, a boot loader, magnetic cursor, particle field and three switchable themes — no framework anywhere in the stack.',
            tech: ['HTML', 'CSS', 'JavaScript', 'Canvas 2D'],
            metrics: [
                { v: '6,205', k: 'lines' },
                { v: '16', k: 'engines' },
                { v: '0', k: 'deps' }
            ],
            live: 'https://aayuvenkei.cyou',
            github: 'https://github.com/aayuvenkei/aayuvenkei-website'
        },
        {
            name: 'AniPulse',
            tag: 'Web app / Live API',
            desc: 'Cyberpunk anime discovery engine wired straight into the Jikan v4 API. Matrix-rain canvas, glitch boot screen, 3D card tilt, reactive neon particles, debounced search and in-page trailers. No backend, no keys, no signup.',
            tech: ['HTML', 'CSS', 'JavaScript', 'Jikan API'],
            metrics: [
                { v: '1,764', k: 'lines' },
                { v: '10K+', k: 'titles' },
                { v: '0', k: 'backend' }
            ],
            live: 'https://aayuvenkei.github.io/anipulse-anime-vault/',
            github: 'https://github.com/aayuvenkei/anipulse-anime-vault'
        },
        {
            name: 'My Task Manager',
            tag: 'Tool / Vanilla JS',
            desc: 'A clean task manager with live counters, status filters, per-task timestamps and auto-save to localStorage. Responsive down to a phone screen.',
            tech: ['HTML', 'CSS', 'JavaScript', 'localStorage'],
            metrics: [
                { v: '871', k: 'lines' },
                { v: '3', k: 'filters' },
                { v: 'auto', k: 'save' }
            ],
            live: null,
            github: 'https://github.com/aayuvenkei/TO-DO-LIST-APP'
        },
        {
            name: 'Automation Suite',
            tag: 'Scripts & bots / Ongoing',
            desc: 'Modular Python and Node.js automation — scrapers, workflow scripts and chat bots that run on a schedule, so the boring work happens without anyone watching.',
            tech: ['Python', 'Node.js', 'REST APIs', 'Cron'],
            metrics: [
                { v: '24/7', k: 'uptime' },
                { v: 'CLI', k: 'surface' },
                { v: '∞', k: 'scope' }
            ],
            live: null,
            github: 'https://github.com/aayuvenkei'
        }
    ],

    init() {
        this.modal = document.getElementById('project-modal');
        this.inner = document.getElementById('project-modal-inner');
        if (this.modal) this.modal.classList.remove('is-open');
        this.render();
        this.bind();
    },

    render() {
        const list = document.getElementById('projects-list');
        if (!list) return;

        list.innerHTML = '';

        this.projects.forEach((p, i) => {
            const row = document.createElement('div');
            row.className = 'project';
            row.setAttribute('data-reveal', '');
            row.setAttribute('data-cursor', 'project');
            row.setAttribute('tabindex', '0');
            row.setAttribute('role', 'button');
            row.setAttribute('aria-label', `Open project ${p.name}`);

            const metrics = (p.metrics || []).map(m =>
                `<span class="project__metric"><b>${m.v}</b>${m.k}</span>`
            ).join('');

            row.innerHTML = `
                <div class="project__inner">
                    <div class="project__info">
                        <span class="project__number">${String(i + 1).padStart(2, '0')} — ${p.tag || ''}</span>
                        <h3 class="project__name">${p.name}</h3>
                        <p class="project__desc">${p.desc}</p>
                        <div class="project__tech">
                            ${p.tech.map(t => `<span class="project__tech-tag">${t}</span>`).join('')}
                        </div>
                        <div class="project__metrics">${metrics}</div>
                    </div>
                    <div class="project__preview">
                        <div class="project__preview-placeholder">[ VIEW ]</div>
                    </div>
                </div>
            `;

            row.addEventListener('click', (e) => {
                if (!e.target.closest('a')) this.open(p, i);
            });
            row.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.open(p, i);
                }
            });

            list.appendChild(row);
        });
    },

    bind() {
        if (!this.modal) return;
        this.modal.querySelector('.project-modal__overlay')?.addEventListener('click', () => this.close());
        this.modal.querySelector('.project-modal__close')?.addEventListener('click', (e) => {
            e.stopPropagation();
            this.close();
        });
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') this.close();
        });
    },

    open(p, i) {
        if (!this.inner) return;
        const metrics = (p.metrics || []).map(m =>
            `<div style="display:flex;flex-direction:column;gap:2px">
                <span style="font-family:var(--font-display);font-weight:700;font-size:1.15rem;color:var(--text-primary);letter-spacing:-.02em">${m.v}</span>
                <span style="font-family:var(--font-mono);font-size:.55rem;letter-spacing:.16em;text-transform:uppercase;color:var(--text-tertiary)">${m.k}</span>
            </div>`
        ).join('');

        this.inner.innerHTML = `
            <div style="font-family:var(--font-mono);font-size:.6rem;color:var(--accent);letter-spacing:.18em;margin-bottom:12px">PROJECT ${String(i + 1).padStart(2, '0')} — ${(p.tag || '').toUpperCase()}</div>
            <h2 style="font-family:var(--font-display);font-size:clamp(1.6rem,4vw,2.4rem);font-weight:700;margin-bottom:14px;letter-spacing:-.04em;text-transform:uppercase;color:var(--text-primary);">${p.name}</h2>
            <p style="color:var(--text-secondary);font-size:.9rem;line-height:1.75;margin-bottom:22px">${p.desc}</p>
            <div style="display:flex;gap:28px;flex-wrap:wrap;padding:18px 0;margin-bottom:20px;border-block:1px solid var(--border)">${metrics}</div>
            <div style="display:flex;flex-wrap:wrap;gap:6px;margin-bottom:24px">
                ${p.tech.map(t => `<span style="font-family:var(--font-mono);font-size:.55rem;letter-spacing:.14em;text-transform:uppercase;padding:5px 10px;border:1px solid var(--border);color:var(--text-tertiary);background:rgba(255,255,255,0.02)">${t}</span>`).join('')}
            </div>
            <div style="display:flex;gap:22px;flex-wrap:wrap">
                ${p.live ? `<a href="${p.live}" target="_blank" rel="noopener" style="font-family:var(--font-mono);font-size:.7rem;letter-spacing:.16em;color:var(--accent)">LIVE DEMO ↗</a>` : ''}
                ${p.github ? `<a href="${p.github}" target="_blank" rel="noopener" style="font-family:var(--font-mono);font-size:.7rem;letter-spacing:.16em;color:var(--text-secondary)">SOURCE CODE ↗</a>` : ''}
            </div>
        `;
        this.modal.classList.add('is-open');
        document.body.style.overflow = 'hidden';
    },

    close() {
        if (!this.modal) return;
        this.modal.classList.remove('is-open');
        document.body.style.overflow = '';
    }
};
