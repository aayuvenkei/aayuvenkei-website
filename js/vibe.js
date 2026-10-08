// =========================================================
// VIBE ENGINE — reveals, counters, code stream, live feed
// =========================================================
const VibeEngine = {
    observers: [],
    timers: [],

    init() {
        this.dupeMarquees();
        this.initReveals();
        this.initMasks();
        this.initCounters();
        this.initSpotlight();
        this.buildCodeStream();
        this.initLiveFeed();
        this.initPhaseCycle();

        // Hard safety net — content must never stay hidden.
        const failSafe = setTimeout(() => {
            document.documentElement.classList.add('no-reveal');
        }, 4000);
        this.timers.push(failSafe);
    },

    /* ---------- 1. Marquee: duplicate group so -50% loops seamlessly ---------- */
    dupeMarquees() {
        document.querySelectorAll('.marquee__track').forEach(track => {
            if (track.dataset.duped) return;
            const group = track.querySelector('.marquee__group');
            if (!group) return;
            const clone = group.cloneNode(true);
            clone.setAttribute('aria-hidden', 'true');
            track.appendChild(clone);
            track.dataset.duped = '1';
        });
    },

    /* ---------- 2. Real scroll reveals ---------- */
    initReveals() {
        const targets = document.querySelectorAll('[data-reveal]');
        if (!targets.length) return;

        if (!('IntersectionObserver' in window) || AV.isReduced) {
            targets.forEach(el => el.classList.add('is-revealed'));
            return;
        }

        // Stagger siblings that share a parent.
        const groups = new Map();
        targets.forEach(el => {
            const p = el.parentElement;
            if (!groups.has(p)) groups.set(p, []);
            groups.get(p).push(el);
        });
        groups.forEach(list => {
            if (list.length < 2) return;
            list.forEach((el, i) => {
                if (!el.style.getPropertyValue('--reveal-delay')) {
                    el.style.setProperty('--reveal-delay', Math.min(i * 70, 560) + 'ms');
                }
            });
        });

        const io = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-revealed');
                    io.unobserve(entry.target);
                }
            });
        }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });

        targets.forEach(el => io.observe(el));
        this.observers.push(io);
    },

    /* ---------- 3. Line-mask reveals ---------- */
    initMasks() {
        const masks = document.querySelectorAll('[data-mask]');
        if (!masks.length || !('IntersectionObserver' in window)) {
            document.querySelectorAll('.mask > span').forEach(s => (s.style.transform = 'none'));
            return;
        }

        const io = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-in');
                    io.unobserve(entry.target);
                }
            });
        }, { threshold: 0.2 });

        masks.forEach(m => io.observe(m));
        this.observers.push(io);
    },

    /* ---------- 4. Animated counters ---------- */
    initCounters() {
        const nodes = document.querySelectorAll('[data-count]');
        if (!nodes.length) return;

        const run = (el) => {
            const target = parseFloat(el.dataset.count || '0');
            const decimals = parseInt(el.dataset.countDecimals || '0', 10);
            const dur = parseInt(el.dataset.countDuration || '1500', 10);
            const suffix = el.dataset.countSuffix || '';
            const t0 = performance.now();

            if (AV.isReduced) {
                el.textContent = target.toFixed(decimals) + suffix;
                return;
            }

            const tick = (now) => {
                const p = Math.min(1, (now - t0) / dur);
                const eased = 1 - Math.pow(1 - p, 4);
                el.textContent = (target * eased).toFixed(decimals) + suffix;
                if (p < 1) requestAnimationFrame(tick);
            };
            requestAnimationFrame(tick);
        };

        if (!('IntersectionObserver' in window)) {
            nodes.forEach(run);
            return;
        }

        const io = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    run(entry.target);
                    io.unobserve(entry.target);
                }
            });
        }, { threshold: 0.4 });

        nodes.forEach(n => io.observe(n));
        this.observers.push(io);
    },

    /* ---------- 5. Cursor spotlight on cards ---------- */
    initSpotlight() {
        if (AV.isTouch) return;
        document.querySelectorAll('.step, .tier, .build__item').forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const r = card.getBoundingClientRect();
                card.style.setProperty('--mx', ((e.clientX - r.left) / r.width * 100) + '%');
                card.style.setProperty('--my', ((e.clientY - r.top) / r.height * 100) + '%');
            });
        });
    },

    /* ---------- 6. Code token stream ---------- */
    buildCodeStream() {
        const host = document.getElementById('codestream');
        if (!host) return;

        const tokens = [
            ['k', 'const vibe = await ship(idea)'],
            ['c', '// no frameworks. no excuses.'],
            ['n', '&lt;canvas id="fx" /&gt;'],
            ['k', 'requestAnimationFrame(tick)'],
            ['s', '"pixels that respond"'],
            ['n', 'ctx.globalCompositeOperation'],
            ['k', 'export default function Page()'],
            ['c', '/* hover → glow → release */'],
            ['n', 'document.querySelector(sel)'],
            ['k', 'if (isTouch) return'],
            ['s', "'IntersectionObserver'"],
            ['n', 'transform: translate3d(0,0,0)'],
            ['k', 'addEventListener(\'av:scroll\')'],
            ['c', '// ship it, then sharpen it'],
            ['n', 'clip-path: inset(0 0 100% 0)'],
            ['k', 'new CustomEvent(\'av:loaded\')'],
            ['s', '"built with curiosity"'],
            ['n', 'will-change: transform'],
            ['k', 'matchMedia(\'prefers-reduced-motion\')'],
            ['c', '/* the loader is the handshake */'],
            ['n', 'cubic-bezier(.16, 1, .3, 1)'],
            ['k', 'localStorage.setItem(\'av-theme\')'],
            ['s', "'00 DEPENDENCIES'"],
            ['n', 'mix-blend-mode: overlay'],
            ['k', 'async function automate(job)'],
            ['c', '// bots run while you sleep'],
            ['n', 'backdrop-filter: blur(20px)'],
            ['k', 'import { motion } from \'intent\''],
            ['s', '"feel inevitable"'],
            ['n', 'font-variant-numeric: tabular'],
            ['k', 'observer.observe(section)'],
            ['c', '/* break → build → ship */'],
            ['n', 'grid-template-columns: 1fr'],
            ['k', 'performance.now()'],
            ['s', "'aayuvenkei@system:~'"],
            ['n', '--ease-out-expo'],
            ['k', 'canvas.getContext(\'2d\')'],
            ['c', '// every pixel earns its place'],
            ['n', 'letter-spacing: -0.05em'],
            ['k', 'setInterval(sync, 1000)'],
        ];

        const colCount = AV.isMobile ? 4 : 8;
        const w = 100 / colCount;
        const pick = () => tokens[Math.floor(Math.random() * tokens.length)];

        for (let c = 0; c < colCount; c++) {
            const lane = document.createElement('div');
            lane.className = 'codestream__lane';
            lane.style.setProperty('--lane-x', (c * w + w / 2) + '%');
            // Depth: outer lanes dimmer, centre lanes brighter.
            const edge = Math.abs(c - (colCount - 1) / 2) / ((colCount - 1) / 2 || 1);
            lane.style.opacity = (0.95 - edge * 0.65).toFixed(2);

            const col = document.createElement('div');
            col.className = 'codestream__col';
            col.style.setProperty('--col-speed', (34 + Math.random() * 34).toFixed(1) + 's');
            col.style.animationDelay = `-${(Math.random() * 30).toFixed(1)}s`;

            const count = 18;
            let html = '';
            for (let i = 0; i < count * 2; i++) {
                const t = pick();
                html += `<span class="codestream__tok codestream__tok--${t[0]}">${t[1]}</span>`;
            }
            col.innerHTML = html;

            lane.appendChild(col);
            host.appendChild(lane);
        }
    },

    /* ---------- 7. Live feed ---------- */
    initLiveFeed() {
        const rows = document.getElementById('feed-rows');
        const rpm = document.getElementById('live-rpm');
        if (!rows) return;

        const services = ['portfolio-api', 'bot-runner', 'scraper-01', 'cron-sync', 'fx-worker'];
        const regions = ['ap-south', 'us-east', 'eu-central', 'ap-south'];
        const tasks = [
            'Rendering particle field',
            'Polling GitHub activity',
            'Compiling CSS bundle',
            'Queueing scheduled post',
            'Scraping release notes',
            'Flushing canvas buffer',
            'Rotating theme tokens',
            'Verifying webhook',
            'Warming cache layer',
            'Streaming boot log',
            'Indexing project cards',
            'Syncing clock source',
        ];
        const states = [
            { c: 'run', t: 'running' },
            { c: 'ok', t: '200 ok' },
            { c: 'wait', t: 'queued' },
            { c: 'ok', t: '200 ok' },
            { c: 'run', t: 'running' },
        ];

        const pad = (n) => String(n).padStart(2, '0');
        const stamp = () => {
            const d = new Date();
            return `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
        };

        const makeRow = () => {
            const s = states[Math.floor(Math.random() * states.length)];
            const row = document.createElement('div');
            row.className = 'feed__row';
            row.innerHTML =
                `<span class="feed__time">${stamp()}</span>` +
                `<span class="feed__svc">${services[Math.floor(Math.random() * services.length)]}</span>` +
                `<span class="feed__task">${tasks[Math.floor(Math.random() * tasks.length)]}</span>` +
                `<span class="feed__status feed__status--${s.c}">${s.t}</span>`;
            return row;
        };

        for (let i = 0; i < 8; i++) rows.appendChild(makeRow());

        if (AV.isReduced) return;

        const push = () => {
            if (!AV.isTabVisible) return;
            rows.insertBefore(makeRow(), rows.firstChild);
            while (rows.children.length > 9) rows.removeChild(rows.lastChild);
        };
        this.timers.push(setInterval(push, 1900));

        // RPM counter jitter
        if (rpm) {
            let base = 3847;
            const jitter = () => {
                if (!AV.isTabVisible) return;
                base += Math.round((Math.random() - 0.48) * 90);
                base = Math.max(3100, Math.min(4700, base));
                rpm.textContent = base.toLocaleString('en-US');
            };
            this.timers.push(setInterval(jitter, 1600));
        }

        // Bars
        const bars = document.querySelectorAll('.live__bar');
        if (bars.length) {
            bars.forEach(b => (b.style.height = 18 + Math.random() * 70 + '%'));
            this.timers.push(setInterval(() => {
                if (!AV.isTabVisible) return;
                bars.forEach(b => (b.style.height = 12 + Math.random() * 84 + '%'));
            }, 1400));
        }
    },

    /* ---------- 8. Hero phase marker cycling ---------- */
    initPhaseCycle() {
        const phases = document.querySelectorAll('.hero__phase');
        if (!phases.length || AV.isReduced) return;

        let i = 0;
        const step = () => {
            phases.forEach(p => p.classList.remove('is-live'));
            phases[i % phases.length].classList.add('is-live');
            i++;
        };
        step();
        this.timers.push(setInterval(() => { if (AV.isTabVisible) step(); }, 2600));
    },

    destroy() {
        this.observers.forEach(o => o.disconnect());
        this.timers.forEach(t => { clearInterval(t); clearTimeout(t); });
        this.observers = [];
        this.timers = [];
    },
};
