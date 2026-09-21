const BuildEngine = {
    // Yahan hum har category ki details aur images define kar rahe hain
    data: {
        "Websites": {
            subtitle: "PREMIUM DIGITAL SPACES",
            desc: "I build blazing-fast, SEO-optimized websites that don't just look good, but feel alive. Focusing on smooth scroll experiences, micro-interactions, and flawless responsive design.",
            tags: ["React / Next.js", "Framer Motion", "SEO Optimized", "Responsive"],
            image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2000&auto=format&fit=crop"
        },
        "Interactive Interfaces": {
            subtitle: "DYNAMIC USER EXPERIENCES",
            desc: "Moving beyond static pages, I create interfaces that respond, morph, and stick in memory. Using WebGL, Canvas, and advanced CSS to build engaging digital products.",
            tags: ["WebGL", "Three.js", "State Management", "UI/UX Motion"],
            image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2000&auto=format&fit=crop"
        },
        "Automation": {
            subtitle: "SYSTEMS THAT WORK FOR YOU",
            desc: "Writing intelligent scripts and pipelines that automate repetitive tasks, scrape data, and connect different APIs seamlessly while you sleep.",
            tags: ["Python", "Node.js", "Data Pipelines", "Web Scraping"],
            image: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=2000&auto=format&fit=crop"
        },
        "Bots": {
            subtitle: "INTELLIGENT AGENTS",
            desc: "Custom Discord, Telegram, and Slack bots equipped with custom commands, moderation tools, and API integrations to manage communities effectively.",
            tags: ["Discord.js", "Telegram API", "Serverless", "Webhooks"],
            image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=2000&auto=format&fit=crop"
        },
        "Developer Tools": {
            subtitle: "CLI & UTILITIES",
            desc: "Crafting command-line interfaces and developer tools that make building, testing, and deploying code faster and much more intuitive.",
            tags: ["Bash/Shell", "NPM Packages", "Git Workflows", "CI/CD"],
            image: "https://images.unsplash.com/photo-1629654297299-c8506221ca97?q=80&w=2000&auto=format&fit=crop"
        },
        "Experiments": {
            subtitle: "PUSHING THE BOUNDARIES",
            desc: "A playground for generative art, complex algorithms, and weird web experiences that don't fit into a standard category. Built just for the love of code.",
            tags: ["Generative Art", "Shaders", "Audio Visualizers", "Math"],
            image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=2000&auto=format&fit=crop"
        }
    },

    init() {
        this.createModal();
        this.bindEvents();
    },

    createModal() {
        // Modal ka HTML dynamically inject kar rahe hain
        const modalHTML = `
        <div id="build-modal" class="build-modal">
            <div class="build-modal__overlay"></div>
            <div class="build-modal__content">
                <button class="build-modal__close" data-cursor="button">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                </button>
                <div class="build-modal__layout">
                    <div class="build-modal__image"></div>
                    <div class="build-modal__info">
                        <span class="build-modal__subtitle"></span>
                        <h2 class="build-modal__title"></h2>
                        <p class="build-modal__desc"></p>
                        <div class="build-modal__tags"></div>
                    </div>
                </div>
            </div>
        </div>`;
        document.body.insertAdjacentHTML('beforeend', modalHTML);

        this.modal = document.getElementById('build-modal');
        this.img = this.modal.querySelector('.build-modal__image');
        this.sub = this.modal.querySelector('.build-modal__subtitle');
        this.title = this.modal.querySelector('.build-modal__title');
        this.desc = this.modal.querySelector('.build-modal__desc');
        this.tags = this.modal.querySelector('.build-modal__tags');
    },

    bindEvents() {
        // Cards par click event
        document.querySelectorAll('.build__item').forEach(item => {
            item.addEventListener('click', () => {
                const title = item.querySelector('.build__item-title').innerText;
                this.open(title);
            });
        });

        // Close events
        this.modal.querySelector('.build-modal__overlay').addEventListener('click', () => this.close());
        this.modal.querySelector('.build-modal__close').addEventListener('click', () => this.close());
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') this.close();
        });
    },

    open(titleName) {
        const d = this.data[titleName];
        if(!d) return;

        this.img.style.backgroundImage = `url(${d.image})`;
        this.sub.innerText = d.subtitle;
        this.title.innerText = titleName;
        this.desc.innerText = d.desc;
        this.tags.innerHTML = d.tags.map(t => `<span>${t}</span>`).join('');

        this.modal.classList.add('is-open');
        document.body.style.overflow = 'hidden';
    },

    close() {
        this.modal.classList.remove('is-open');
        document.body.style.overflow = '';
    }
};