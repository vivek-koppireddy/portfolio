(function () {
    // ===== DOM =====
    const ntg = document.getElementById('ntg');
    const nis = document.querySelectorAll('.ni');
    const btt = document.getElementById('btt');
    const cform = document.getElementById('cform');
    const canvas = document.getElementById('pc');
    const ctx = canvas.getContext('2d');
    let menuOpen = false;

    // ===== FLOATING NAV — ARC EXPANSION =====
    function getArcR() { return window.innerWidth < 768 ? 105 : 150; }

    function openMenu() {
        menuOpen = true;
        ntg.classList.add('on');
        ntg.setAttribute('aria-expanded', 'true');
        const R = getArcR();
        const total = nis.length;
        const spread = 150; // total arc degrees
        const startA = spread / 2;
        nis.forEach(function (item, i) {
            const angle = startA - (spread / (total - 1)) * i;
            const rad = angle * Math.PI / 180;
            const x = -R * Math.cos(rad);
            const y = -R * Math.sin(rad);
            const delay = i * 55;
            setTimeout(function () {
                item.style.transform = 'translate(' + x + 'px,' + y + 'px) scale(1)';
                item.style.opacity = '1';
                item.classList.add('vis');
            }, delay);
        });
    }

    function closeMenu() {
        menuOpen = false;
        ntg.classList.remove('on');
        ntg.setAttribute('aria-expanded', 'false');
        const total = nis.length;
        nis.forEach(function (item, i) {
            const delay = (total - 1 - i) * 35;
            setTimeout(function () {
                item.style.transform = 'scale(0)';
                item.style.opacity = '0';
                item.classList.remove('vis');
            }, delay);
        });
    }

    ntg.addEventListener('click', function () {
        menuOpen ? closeMenu() : openMenu();
    });

    nis.forEach(function (item) {
        item.addEventListener('click', function (e) {
            e.preventDefault();
            var sec = document.getElementById(item.dataset.section);
            if (sec) sec.scrollIntoView({ behavior: 'smooth' });
            setTimeout(closeMenu, 200);
        });
    });

    document.addEventListener('click', function (e) {
        if (menuOpen && !e.target.closest('.fnav')) closeMenu();
    });

    window.addEventListener('resize', function () { if (menuOpen) closeMenu(); });

    // ===== ACTIVE SECTION TRACKING =====
    var secs = document.querySelectorAll('section[id]');
    var secObs = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
            if (en.isIntersecting) {
                var id = en.target.id;
                nis.forEach(function (n) {
                    n.classList.toggle('act', n.dataset.section === id);
                });
            }
        });
    }, { rootMargin: '-40% 0px -40% 0px', threshold: 0 });
    secs.forEach(function (s) { secObs.observe(s); });

    // ===== PARTICLE SYSTEM =====
    var particles = [];
    var PCOUNT = window.innerWidth < 768 ? 40 : 70;
    var CONN = 120;

    function resizeC() {
        var h = document.getElementById('home');
        canvas.width = h.offsetWidth;
        canvas.height = h.offsetHeight;
    }

    function Particle() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = (Math.random() - 0.5) * 0.5;
        this.r = Math.random() * 2 + 0.8;
        var cols = ['rgba(249,115,22,', 'rgba(6,182,212,', 'rgba(226,232,240,'];
        this.cb = cols[Math.floor(Math.random() * cols.length)];
        this.a = Math.random() * 0.5 + 0.2;
    }
    Particle.prototype.update = function () {
        this.x += this.vx;
        this.y += this.vy;
        if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
        if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
    };
    Particle.prototype.draw = function () {
        ctx.beginPath();
        ctx.arc(this.x, this.y, Math.max(0.5, this.r), 0, Math.PI * 2);
        ctx.fillStyle = this.cb + this.a + ')';
        ctx.fill();
    };

    function initP() {
        particles = [];
        for (var i = 0; i < PCOUNT; i++) particles.push(new Particle());
    }

    function drawConns() {
        for (var i = 0; i < particles.length; i++) {
            for (var j = i + 1; j < particles.length; j++) {
                var dx = particles[i].x - particles[j].x;
                var dy = particles[i].y - particles[j].y;
                var d = Math.sqrt(dx * dx + dy * dy);
                if (d < CONN) {
                    var al = (1 - d / CONN) * 0.15;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = 'rgba(249,115,22,' + al + ')';
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            }
        }
    }

    function animP() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(function (p) { p.update(); p.draw(); });
        drawConns();
        requestAnimationFrame(animP);
    }

    resizeC();
    initP();
    animP();
    window.addEventListener('resize', function () { resizeC(); initP(); });

    // ===== TYPEWRITER =====
    var phrases = ['Full-Stack Developer', 'Frontend Developer', 'Python Developer for AI Solutions'];
    var pIdx = 0, cIdx = 0, isDel = false, twEl = document.getElementById('tw');

    function typewrite() {
        var current = phrases[pIdx];
        if (isDel) {
            twEl.textContent = current.substring(0, cIdx - 1);
            cIdx--;
        } else {
            twEl.textContent = current.substring(0, cIdx + 1);
            cIdx++;
        }
        var speed = isDel ? 40 : 80;
        if (!isDel && cIdx === current.length) {
            speed = 2000;
            isDel = true;
        } else if (isDel && cIdx === 0) {
            isDel = false;
            pIdx = (pIdx + 1) % phrases.length;
            speed = 400;
        }
        setTimeout(typewrite, speed);
    }
    typewrite();

    // ===== SCROLL REVEAL =====
    var rvs = document.querySelectorAll('.rv');
    var rvObs = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
            if (en.isIntersecting) {
                en.target.classList.add('on');
            }
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    rvs.forEach(function (el) { rvObs.observe(el); });

    // ===== SKILL BARS =====
    var skfs = document.querySelectorAll('.skf');
    var skObs = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
            if (en.isIntersecting) {
                en.target.style.width = en.target.dataset.w + '%';
            }
        });
    }, { threshold: 0.5 });
    skfs.forEach(function (el) { skObs.observe(el); });

    // ===== QUALIFICATION TABS =====
    var qtbs = document.querySelectorAll('.qtb');
    var qcs = document.querySelectorAll('.qc');
    qtbs.forEach(function (btn) {
        btn.addEventListener('click', function () {
            qtbs.forEach(function (b) { b.classList.remove('on'); });
            btn.classList.add('on');
            qcs.forEach(function (c) { c.classList.remove('on'); });
            document.getElementById('tab-' + btn.dataset.tab).classList.add('on');
            // Re-trigger reveals in newly shown tab
            var newRvs = document.getElementById('tab-' + btn.dataset.tab).querySelectorAll('.rv');
            newRvs.forEach(function (r) {
                r.classList.remove('on');
                void r.offsetWidth; // force reflow
                setTimeout(function () { r.classList.add('on'); }, 50);
            });
        });
    });

    // ===== ANIMATED COUNTERS =====
    var stns = document.querySelectorAll('.stn');
    var counted = false;
    var ctrObs = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
            if (en.isIntersecting && !en.target.dataset.counted) {
                en.target.dataset.counted = '1';
                var target = parseInt(en.target.dataset.target);
                var dur = 2000;
                var start = 0;
                var startTime = null;
                function step(ts) {
                    if (!startTime) startTime = ts;
                    var prog = Math.min((ts - startTime) / dur, 1);
                    var eased = 1 - Math.pow(1 - prog, 3); // ease out cubic
                    en.target.textContent = Math.floor(eased * target);
                    if (prog < 1) requestAnimationFrame(step);
                    else en.target.textContent = target + '+';
                }
                requestAnimationFrame(step);
            }
        });
    }, { threshold: 0.5 });
    stns.forEach(function (el) { ctrObs.observe(el); });

    // ===== BACK TO TOP =====
    window.addEventListener('scroll', function () {
        btt.classList.toggle('vis', window.scrollY > 500);
    });
    btt.addEventListener('click', function () {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // ===== CONTACT FORM =====
    var toastEl = document.getElementById('toast');
    var toastMsg = document.getElementById('toast-msg');
    var toastTimer = null;

    function showToast(msg, type) {
        toastMsg.textContent = msg;
        toastEl.className = 'tst ' + type;
        var icon = toastEl.querySelector('i');
        icon.className = type === 'ok' ? 'fas fa-check-circle' : 'fas fa-exclamation-circle';
        setTimeout(function () { toastEl.classList.add('shw'); }, 10);
        clearTimeout(toastTimer);
        toastTimer = setTimeout(function () { toastEl.classList.remove('shw'); }, 3500);
    }

    function validateEmail(e) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e); }

    cform.addEventListener('submit', function (e) {
        e.preventDefault();
        var ok = true;
        var name = document.getElementById('fname');
        var email = document.getElementById('femail');
        var sub = document.getElementById('fsub');
        var msg = document.getElementById('fmsg');

        // Reset
        [name, email, sub, msg].forEach(function (f) { f.parentElement.classList.remove('err'); });

        if (!name.value.trim()) { name.parentElement.classList.add('err'); ok = false; }
        if (!validateEmail(email.value.trim())) { email.parentElement.classList.add('err'); ok = false; }
        if (!sub.value.trim()) { sub.parentElement.classList.add('err'); ok = false; }
        if (msg.value.trim().length < 10) { msg.parentElement.classList.add('err'); ok = false; }

        if (ok) {
            showToast('Message sent successfully! I\'ll get back to you soon.', 'ok');
            cform.reset();
        } else {
            showToast('Please fill in all fields correctly.', 'no');
        }
    });

    // Live validation — remove error on input
    ['fname', 'femail', 'fsub', 'fmsg'].forEach(function (id) {
        document.getElementById(id).addEventListener('input', function () {
            this.parentElement.classList.remove('err');
        });
    });

    // ===== KEYBOARD NAVIGATION for floating menu =====
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && menuOpen) closeMenu();
    });

    // ===== SHOW MORE / SHOW LESS for Certifications =====
    (function () {
        var tabCer = document.getElementById('tab-cer');
        var btn = document.getElementById('show-more');
        if (!tabCer || !btn) return;
        // Ensure initial state: hide items beyond the first 9
        var crcs = tabCer.querySelectorAll('.crc');
        crcs.forEach(function (el, i) { if (i >= 9) el.classList.add('is-hidden'); });
        if (crcs.length <= 9) btn.style.display = 'none';

        btn.addEventListener('click', function () {
            var hidden = tabCer.querySelectorAll('.crc.is-hidden');
            if (hidden.length) {
                hidden.forEach(function (el) { el.classList.remove('is-hidden'); });
                btn.textContent = 'Show less';
            } else {
                crcs.forEach(function (el, i) { if (i >= 9) el.classList.add('is-hidden'); });
                btn.textContent = 'Show more';
                document.getElementById('qualification').scrollIntoView({ behavior: 'smooth' });
            }
        });
    })();

})();