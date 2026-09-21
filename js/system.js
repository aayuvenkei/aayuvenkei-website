// ========== AAYUVENKEI.OS ENGINE ==========
const SystemEngine = {
    terminal: null,
    bootLog: null,
    output: null,
    outputContent: null,
    nodes: [],
    currentNode: 'identity',
    isBooted: false,

    bootLines: [
        { text: '> boot sequence initiated...', delay: 0 },
        { text: '> loading <span class="accent">AAYUVENKEI.OS</span> v2.0', delay: 200 },
        { text: '> checking systems... <span class="success">OK</span>', delay: 400 },
        { text: '> mounting /skills /projects /experiments', delay: 600 },
        { text: '> establishing connections... <span class="success">DONE</span>', delay: 800 },
        { text: '> <span class="accent">SYSTEM ONLINE</span>', delay: 1000 },
        { text: '> type or click a node to explore <span class="dim">_</span>', delay: 1200 }
    ],

    nodeData: {
        identity: [
            { key: 'NAME', value: 'AAYUVENKEI' },
            { key: 'ROLE', value: 'Creative Developer' },
            { key: 'FOCUS', value: 'Web · Automation · Experiments' },
            { key: 'LOCATION', value: 'India' },
            { key: 'MODE', value: 'Always Building' }
        ],
        stack: [
            { key: 'LANGUAGES', value: 'JavaScript · TypeScript · Python · HTML · CSS' },
            { key: 'FRONTEND', value: 'React · Next.js · Tailwind · Framer Motion · GSAP' },
            { key: 'BACKEND', value: 'Node.js · Python · REST APIs' },
            { key: 'TOOLS', value: 'Git · GitHub · VS Code · Linux · Figma' },
            { key: 'RUNTIME', value: 'Node.js · Browser · Python 3' }
        ],
        build: [
            { key: 'WEBSITES', value: 'Performance-first digital spaces' },
            { key: 'INTERFACES', value: 'Interactive, responsive, alive' },
            { key: 'AUTOMATION', value: 'Scripts, bots, workflows' },
            { key: 'TOOLS', value: 'Developer utilities & CLI tools' },
            { key: 'EXPERIMENTS', value: 'Things without a category' }
        ],
        experiment: [
            { key: 'CURRENT', value: 'This portfolio you\'re looking at' },
            { key: 'INTEREST', value: 'Generative art · Creative coding · WebGL' },
            { key: 'APPROACH', value: 'Build first, categorize later' },
            { key: 'PHILOSOPHY', value: '"Make it feel different."' }
        ],
        status: [
            { key: 'SYSTEM', value: '● ONLINE' },
            { key: 'UPTIME', value: 'Indefinite' },
            { key: 'LAST BUILD', value: new Date().toISOString().split('T')[0] },
            { key: 'AVAILABLE', value: 'For interesting projects' },
            { key: 'RESPONSE', value: '< 24 hours' }
        ]
    },

    init() {
        this.terminal = document.getElementById('system-terminal');
        this.bootLog = document.getElementById('system-boot');
        this.output = document.getElementById('system-output');
        this.outputContent = document.getElementById('system-output-content');
        this.nodes = document.querySelectorAll('[data-system-node]');

        this.setupBootSequence();
        this.setupNodes();
    },

    setupBootSequence() {
        const section = document.getElementById('system');
        if (!section) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !this.isBooted) {
                    this.isBooted = true;
                    this.runBootSequence();
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });

        observer.observe(section);
    },

    runBootSequence() {
        if (!this.bootLog) return;

        this.bootLines.forEach((line, i) => {
            setTimeout(() => {
                const el = document.createElement('div');
                el.className = 'system__boot-line';
                el.innerHTML = line.text;
                this.bootLog.appendChild(el);

                requestAnimationFrame(() => {
                    el.classList.add('is-visible');
                });
            }, line.delay);
        });

        // Show initial node data
        setTimeout(() => {
            this.showNodeData('identity');
        }, 1500);
    },

    setupNodes() {
        this.nodes.forEach(node => {
            node.addEventListener('click', () => {
                const nodeType = node.getAttribute('data-system-node');
                this.setActiveNode(node);
                this.showNodeData(nodeType);
            });
        });
    },

    setActiveNode(activeNode) {
        this.nodes.forEach(n => n.classList.remove('system__node--active'));
        activeNode.classList.add('system__node--active');
    },

    showNodeData(nodeType) {
        if (!this.outputContent) return;

        const data = this.nodeData[nodeType];
        if (!data) return;

        this.currentNode = nodeType;
        this.outputContent.innerHTML = '';

        data.forEach((item, i) => {
            const line = document.createElement('div');
            line.className = 'system__output-line';
            line.innerHTML = `<span class="system__output-key">${item.key}:</span><span class="system__output-value">${item.value}</span>`;

            this.outputContent.appendChild(line);

            setTimeout(() => {
                line.classList.add('is-visible');
            }, i * 80);
        });

        // Add blinking cursor at end
        setTimeout(() => {
            const cursor = document.createElement('span');
            cursor.className = 'system__output-cursor';
            this.outputContent.appendChild(cursor);
        }, data.length * 80 + 100);
    }
};