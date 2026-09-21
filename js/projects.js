const ProjectsEngine = {
    projects: [
        {
            name: 'Portfolio v2',
            desc: 'Experimental digital identity with custom canvas engines, futuristic glowing themes, and interactive system nodes.',
            tech: ['HTML', 'CSS', 'JavaScript', 'Canvas'],
            live: 'https://aayuvenkei.cyou',
            github: 'https://github.com/aayuvenkei'
        },
        {
            name: 'Automation Suite',
            desc: 'Modular Python/Node.js automation scripts, intelligent bots, and workflow CLI tools.',
            tech: ['Python', 'Node.js', 'REST APIs'],
            live: null,
            github: 'https://github.com/aayuvenkei'
        },
        {
            name: 'Experimental Web Visuals',
            desc: 'Collection of generative code experiments, canvas particles, and UI shaders.',
            tech: ['JavaScript', 'Canvas', 'CSS3'],
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
            row.style.opacity = '1';
            row.style.display = 'block';
            row.setAttribute('data-cursor', 'project');

            row.innerHTML = `
                <div class="project__inner">
                    <div class="project__info">
                        <span class="project__number">0${i + 1}</span>
                        <h3 class="project__name">${p.name}</h3>
                        <p class="project__desc">${p.desc}</p>
                        <div class="project__tech">
                            ${p.tech.map(t => `<span class="project__tech-tag">${t}</span>`).join('')}
                        </div>
                    </div>
                    <div class="project__preview">
                        <div class="project__preview-placeholder">[ VIEW ]</div>
                    </div>
                </div>
            `;

            row.addEventListener('click', (e) => {
                if (!e.target.closest('a')) this.open(p, i);
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
        this.inner.innerHTML = `
            <div style="font-family:var(--font-mono);font-size:.6rem;color:var(--accent);letter-spacing:.18em;margin-bottom:12px">PROJECT 0${i + 1}</div>
            <h2 style="font-family:var(--font-primary);font-size:1.7rem;font-weight:400;margin-bottom:12px;letter-spacing:.06em;color:#ffffff;">${p.name}</h2>
            <p style="color:var(--text-secondary);font-size:.88rem;line-height:1.6;margin-bottom:20px">${p.desc}</p>
            <div style="display:flex;flex-wrap:wrap;gap:6px;margin-bottom:22px">
                ${p.tech.map(t => `<span style="font-family:var(--font-mono);font-size:.55rem;padding:3px 8px;border:1px solid var(--border);color:var(--text-tertiary);background:rgba(255,255,255,0.02)">${t}</span>`).join('')}
            </div>
            <div style="display:flex;gap:16px">
                ${p.live ? `<a href="${p.live}" target="_blank" rel="noopener" style="font-family:var(--font-mono);font-size:.7rem;color:var(--accent)">LIVE DEMO ↗</a>` : ''}
                ${p.github ? `<a href="${p.github}" target="_blank" rel="noopener" style="font-family:var(--font-mono);font-size:.7rem;color:var(--text-secondary)">SOURCE CODE ↗</a>` : ''}
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