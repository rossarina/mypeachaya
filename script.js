// ============================================================
//  QUIZ CONFIG — แก้ไขคำถามและคำตอบตรงนี้ได้เลยครับ! 🔧
// ============================================================
const QUIZ_QUESTION = '"วันนี้วันเกิดใครน้า?"';
const QUIZ_ANSWER = 'ด.ญ พีชญา รัตนะเดชาวัน';  // 🔧 เปลี่ยนตรงนี้!

// ============================================================
//  ANNIVERSARY DATE — วันที่เริ่มคบกัน 🔧
// ============================================================
const ANNIVERSARY = new Date('2025-07-01T00:00:00');

// ============================================================
//  LOVE COUPONS — แก้ไขรายการคูปองตรงนี้ได้เลย 🎁
// ============================================================
const COUPONS = [
    { icon: '🍜', text: 'คูปองพาไปกินของอร่อย 1 มื้อ\n(เมนูอะไรก็ได้ที่คิมอยากกิน!)' },
    { icon: '😤', text: 'คูปองห้ามงอน 1 วัน\n(วันนี้ห้ามโกรธกันนะ ยิ้มๆ ไว้ 😘)' },
    { icon: '💆', text: 'คูปองนวดหลัง 20 นาที\n(เมื่อไหรจะใช้ก็ได้เลย!)' },
    { icon: '🎯', text: 'คูปองยอมตามใจ 1 ข้อ\n(จะขออะไรก็ได้ ยอมหมด 💕)' },
    { icon: '🎬', text: 'คูปองดูหนังด้วยกัน\n(เลือกเรื่องเองได้เลย!)' },
    { icon: '🍰', text: 'คูปองซื้อของหวานให้\n(เค้ก ไอศกรีม บิงซู เลือกได้เลย!)' },
    { icon: '🤗', text: 'คูปองกอดพิเศษ 1 ครั้ง\n(กอดแน่นๆ นานเท่าที่อยากได้!)' },
    { icon: '📸', text: 'คูปองถ่ายรูปคู่ให้หน่อย\n(จัดมุมสวยๆ ไม่บ่น สัญญา!)' },
    { icon: '🌙', text: 'คูปองคุยโทรศัพท์คืนนี้\n(คุยถึงกี่ทุ่มก็ได้ จะไม่โวย~)' },
    { icon: '🛍️', text: 'คูปองช้อปปิ้งด้วยกัน\n(ตามใจ ซื้ออะไรก็ได้ 1 อย่าง!)' },
];

// ============================================================
//  SCRATCH CARD MESSAGE — แก้ข้อความลับตรงนี้ได้เลย 🤫
// ============================================================
// (แก้ตรง HTML ใน <p class="scratch-message"> ก็ได้นะ)

// ============================================================
//  EASTER EGG MESSAGES — อยู่ใน HTML ใน data-* attributes
// ============================================================


document.addEventListener('DOMContentLoaded', () => {

    // ============================================================
    // 0. QUIZ SCREEN
    // ============================================================
    const quizOverlay = document.getElementById('quizOverlay');
    const quizInput = document.getElementById('quizInput');
    const quizSubmit = document.getElementById('quizSubmit');
    const quizFeedback = document.getElementById('quizFeedback');
    const quizCard = document.querySelector('.quiz-card');
    const quizQuestion = document.getElementById('quizQuestion');

    quizQuestion.textContent = QUIZ_QUESTION;

    function checkAnswer() {
        const userAnswer = quizInput.value.trim();
        if (userAnswer === '') {
            quizFeedback.textContent = 'พิมพ์คำตอบก่อนนะ 🥺';
            quizFeedback.className = 'quiz-feedback wrong';
            return;
        }
        const isCorrect = userAnswer.toLowerCase() === QUIZ_ANSWER.toLowerCase();
        if (isCorrect) {
            quizFeedback.textContent = '🎉 ถูกต้องแล้ว! เข้ามาได้เลยนะ 💖';
            quizFeedback.className = 'quiz-feedback correct';
            quizSubmit.disabled = true;
            confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 }, colors: ['#ff4081', '#ffd740', '#ea80fc', '#ff80ab', '#ffffff'] });
            setTimeout(() => { quizOverlay.classList.add('dismissed'); }, 900);
        } else {
            quizFeedback.textContent = 'ยังไม่ถูกเลยนะ ลองใหม่อีกทีนะ 🙈';
            quizFeedback.className = 'quiz-feedback wrong';
            quizCard.classList.remove('shake');
            void quizCard.offsetWidth;
            quizCard.classList.add('shake');
            quizInput.value = '';
            quizInput.focus();
        }
    }

    quizSubmit.addEventListener('click', (e) => { e.stopPropagation(); checkAnswer(); });
    quizInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') checkAnswer(); });


    // ============================================================
    // 1. CURSOR TRAIL (Stars & Hearts)
    // ============================================================
    const canvas = document.getElementById('trailCanvas');
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });

    const particles = [];
    const trailColors = ['#ff4081', '#ff80ab', '#ffd740', '#ff6ec7', '#ea80fc', '#ffffff'];

    function Particle(x, y) {
        this.x = x; this.y = y;
        this.size = Math.random() * 6 + 3;
        this.alpha = 1;
        this.dx = (Math.random() - 0.5) * 3;
        this.dy = (Math.random() - 0.5) * 3 - 1;
        this.color = trailColors[Math.floor(Math.random() * trailColors.length)];
        this.shape = Math.random() > 0.4 ? 'heart' : (Math.random() > 0.5 ? 'star' : 'circle');
    }

    Particle.prototype.update = function () {
        this.x += this.dx; this.y += this.dy;
        this.alpha -= 0.025; this.size *= 0.97;
    };

    Particle.prototype.draw = function () {
        ctx.save();
        ctx.globalAlpha = Math.max(0, this.alpha);
        ctx.fillStyle = this.color;
        ctx.shadowColor = this.color;
        ctx.shadowBlur = 8;
        if (this.shape === 'heart') {
            drawHeart(ctx, this.x, this.y, this.size);
        } else if (this.shape === 'star') {
            drawStar(ctx, this.x, this.y, 5, this.size, this.size / 2);
        } else {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size / 2, 0, Math.PI * 2);
            ctx.fill();
        }
        ctx.restore();
    };

    function drawHeart(ctx, x, y, size) {
        const s = size * 0.6;
        ctx.beginPath();
        ctx.moveTo(x, y + s * 0.3);
        ctx.bezierCurveTo(x, y - s * 0.3, x - s, y - s * 0.3, x - s, y + s * 0.3);
        ctx.bezierCurveTo(x - s, y + s, x, y + s * 1.5, x, y + s * 1.5);
        ctx.bezierCurveTo(x, y + s * 1.5, x + s, y + s, x + s, y + s * 0.3);
        ctx.bezierCurveTo(x + s, y - s * 0.3, x, y - s * 0.3, x, y + s * 0.3);
        ctx.closePath();
        ctx.fill();
    }

    function drawStar(ctx, cx, cy, spikes, outerR, innerR) {
        let rot = (Math.PI / 2) * 3;
        const step = Math.PI / spikes;
        ctx.beginPath();
        ctx.moveTo(cx, cy - outerR);
        for (let i = 0; i < spikes; i++) {
            ctx.lineTo(cx + Math.cos(rot) * outerR, cy + Math.sin(rot) * outerR);
            rot += step;
            ctx.lineTo(cx + Math.cos(rot) * innerR, cy + Math.sin(rot) * innerR);
            rot += step;
        }
        ctx.lineTo(cx, cy - outerR);
        ctx.closePath();
        ctx.fill();
    }

    function animateCanvas() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach((p, i) => { p.update(); p.draw(); if (p.alpha <= 0) particles.splice(i, 1); });
        requestAnimationFrame(animateCanvas);
    }
    animateCanvas();

    window.addEventListener('mousemove', (e) => {
        for (let i = 0; i < 4; i++) particles.push(new Particle(e.clientX, e.clientY));
    });


    // ============================================================
    // 2. FLOATING PHOTOS (Jigsaw) — Bounce + Drag
    // ============================================================
    const photos = document.querySelectorAll('.floating-photo');
    const photoData = [];
    const photoSize = 180;

    photos.forEach(photo => {
        const x = Math.random() * (window.innerWidth - photoSize);
        const y = Math.random() * (window.innerHeight - photoSize);
        const dx = (Math.random() - 0.5) * 1.5;
        const dy = (Math.random() - 0.5) * 1.5;
        const rotation = (Math.random() - 0.5) * 28; // -14 to +14 degrees
        photoData.push({ element: photo, x, y, dx, dy, isDragging: false, rotation });
        photo.style.transform = `translate(${x}px, ${y}px) rotate(${rotation}deg)`;
    });

    function animatePhotos() {
        photoData.forEach(data => {
            if (data.isDragging) return;
            data.x += data.dx; data.y += data.dy;
            if (data.x <= 0 || data.x + photoSize >= window.innerWidth) data.dx *= -1;
            if (data.y <= 0 || data.y + photoSize >= window.innerHeight) data.dy *= -1;
            data.element.style.transform = `translate(${data.x}px, ${data.y}px) rotate(${data.rotation}deg)`;
        });
        requestAnimationFrame(animatePhotos);
    }
    animatePhotos();

    let activeData = null, initX, initY;
    photos.forEach((photo, idx) => {
        photo.addEventListener('pointerdown', e => {
            activeData = photoData[idx];
            activeData.isDragging = true;
            photo.classList.add('dragging');
            initX = e.clientX - activeData.x;
            initY = e.clientY - activeData.y;
            e.stopPropagation();
        });
    });
    window.addEventListener('pointermove', e => {
        if (!activeData) return;
        e.preventDefault();
        activeData.x = Math.max(0, Math.min(e.clientX - initX, window.innerWidth - photoSize));
        activeData.y = Math.max(0, Math.min(e.clientY - initY, window.innerHeight - photoSize));
        activeData.element.style.transform = `translate(${activeData.x}px, ${activeData.y}px) rotate(${activeData.rotation}deg)`;
    });
    window.addEventListener('pointerup', () => {
        if (activeData) { activeData.isDragging = false; activeData.element.classList.remove('dragging'); activeData = null; }
    });


    // ============================================================
    // 3. BALLOONS — Spawn, Float Up, Pop on Click
    // ============================================================
    const balloonContainer = document.getElementById('balloon-container');
    const balloonEmojis = ['🎈', '🎀', '🎊', '🩷', '💗', '🌸', '🦋'];

    function spawnBalloon() {
        const b = document.createElement('div');
        b.classList.add('balloon');
        b.textContent = balloonEmojis[Math.floor(Math.random() * balloonEmojis.length)];
        b.style.left = `${Math.random() * 90 + 5}%`;
        b.style.setProperty('--duration', `${Math.random() * 5 + 7}s`);
        b.addEventListener('pointerdown', e => {
            e.stopPropagation();
            b.classList.add('pop');
            confetti({ particleCount: 40, spread: 60, origin: { x: e.clientX / window.innerWidth, y: e.clientY / window.innerHeight }, colors: ['#ff4081', '#ffd740', '#ea80fc', '#ff80ab'], scalar: 0.8, ticks: 50 });
            setTimeout(() => b.remove(), 400);
        });
        b.addEventListener('animationend', () => b.remove());
        balloonContainer.appendChild(b);
    }
    spawnBalloon();
    setInterval(spawnBalloon, 2800);


    // ============================================================
    // 4. GIFT BOX — Click to Reveal + Confetti
    // ============================================================
    const giftBox = document.getElementById('giftBox');
    const messageCard = document.getElementById('messageCard');
    const bgMusic = document.getElementById('bgMusic');
    const hbdTitle = document.getElementById('hbd-title');
    const pageWrapper = document.getElementById('pageWrapper');

    function typeWriter(el, text, speed = 80) {
        el.textContent = '';
        let i = 0;
        const interval = setInterval(() => { el.textContent += text[i++]; if (i >= text.length) clearInterval(interval); }, speed);
    }

    giftBox.addEventListener('click', e => {
        e.stopPropagation();
        giftBox.classList.add('hidden');
        messageCard.classList.remove('hidden');
        setTimeout(() => {
            messageCard.classList.add('show');
            typeWriter(hbdTitle, 'Happy Birthday My Love! 🎂', 70);
        }, 20);
        fireConfetti();
        bgMusic.volume = 0.3;
        bgMusic.play().catch(() => { });

        // Show secret sections below
        document.getElementById('secretSections').classList.remove('hidden');
    });

    // Scroll-down button
    document.getElementById('scrollDownBtn').addEventListener('click', () => {
        document.getElementById('sectionCounter').scrollIntoView({ behavior: 'smooth' });
    });


    // ============================================================
    // 5. LOVE BUTTON — Heart explosion
    // ============================================================
    const loveBtn = document.getElementById('loveBtn');
    loveBtn.addEventListener('click', e => {
        e.stopPropagation();
        fireLoveHearts();
        confetti({ particleCount: 80, shapes: ['circle'], colors: ['#ff4081', '#ff80ab', '#ffd740', '#ea80fc'], origin: { x: e.clientX / window.innerWidth, y: e.clientY / window.innerHeight }, spread: 100, startVelocity: 35 });
    });

    function fireLoveHearts() {
        const heartEmojis = ['💖', '💕', '💗', '💝', '💓', '💞', '❤️', '🩷'];
        for (let i = 0; i < 20; i++) {
            setTimeout(() => {
                const h = document.createElement('div');
                h.classList.add('floating-heart');
                h.textContent = heartEmojis[Math.floor(Math.random() * heartEmojis.length)];
                h.style.left = `${Math.random() * 100}vw`;
                h.style.top = `${Math.random() * 80 + 10}vh`;
                h.style.fontSize = `${Math.random() * 1.5 + 1}rem`;
                document.body.appendChild(h);
                setTimeout(() => h.remove(), 1500);
            }, i * 60);
        }
    }


    // ============================================================
    // 6. CONFETTI BUTTON
    // ============================================================
    document.getElementById('confettiBtn').addEventListener('click', e => { e.stopPropagation(); fireConfetti(); });

    function fireConfetti() {
        const duration = 3500;
        const endTime = Date.now() + duration;
        const defaults = { spread: 360, ticks: 80, zIndex: 9998, startVelocity: 28 };
        const interval = setInterval(() => {
            const timeLeft = endTime - Date.now();
            if (timeLeft <= 0) return clearInterval(interval);
            const count = 55 * (timeLeft / duration);
            confetti({ ...defaults, particleCount: count, colors: ['#ff4081', '#ffd740', '#ea80fc', '#ff80ab', '#ffffff'], origin: { x: Math.random() * 0.3 + 0.1, y: Math.random() - 0.2 } });
            confetti({ ...defaults, particleCount: count, colors: ['#ff4081', '#ffd740', '#ea80fc', '#ff80ab', '#ffffff'], origin: { x: Math.random() * 0.3 + 0.6, y: Math.random() - 0.2 } });
        }, 220);
    }


    // ============================================================
    // 7. MUSIC TOGGLE
    // ============================================================
    const musicBtn = document.getElementById('musicBtn');
    let musicPlaying = false;

    musicBtn.addEventListener('click', e => {
        e.stopPropagation();
        if (musicPlaying) { bgMusic.pause(); musicBtn.textContent = '🔇'; }
        else { bgMusic.volume = 0.3; bgMusic.play().catch(() => { }); musicBtn.textContent = '🎵'; }
        musicPlaying = !musicPlaying;
    });


    // ============================================================
    // 8. CLICK ANYWHERE — Random Emoji Float Up
    // ============================================================
    const clickEmojis = ['💖', '✨', '🌸', '💕', '⭐', '🦋', '🌟', '💫'];
    document.body.addEventListener('pointerdown', e => {
        if (e.target.closest('.gift-box, .floating-photo, .ctrl-btn, .love-btn, .balloon, button, canvas, .easter-egg, .modal-overlay, .quiz-overlay, .cassette-tape, .gacha-machine, .scratch-container')) return;
        const el = document.createElement('div');
        el.classList.add('floating-heart');
        el.textContent = clickEmojis[Math.floor(Math.random() * clickEmojis.length)];
        el.style.left = `${e.clientX}px`;
        el.style.top = `${e.clientY}px`;
        el.style.fontSize = `${Math.random() * 1 + 1.2}rem`;
        document.body.appendChild(el);
        setTimeout(() => el.remove(), 1500);
    });


    // ============================================================
    // 9. DAYS TOGETHER COUNTER
    // ============================================================
    function updateCounter() {
        const now = new Date();
        const diff = now - ANNIVERSARY;
        if (diff < 0) {
            document.getElementById('counterDays').textContent = '000';
            document.getElementById('counterHours').textContent = '00';
            document.getElementById('counterMins').textContent = '00';
            document.getElementById('counterSecs').textContent = '00';
            return;
        }
        const totalSecs = Math.floor(diff / 1000);
        const days = Math.floor(totalSecs / 86400);
        const hours = Math.floor((totalSecs % 86400) / 3600);
        const mins = Math.floor((totalSecs % 3600) / 60);
        const secs = totalSecs % 60;

        document.getElementById('counterDays').textContent = String(days).padStart(3, '0');
        document.getElementById('counterHours').textContent = String(hours).padStart(2, '0');
        document.getElementById('counterMins').textContent = String(mins).padStart(2, '0');
        document.getElementById('counterSecs').textContent = String(secs).padStart(2, '0');
    }
    updateCounter();
    setInterval(updateCounter, 1000);


    // ============================================================
    // 10. LOVE QUESTION — Runaway "ไม่รัก" Button
    // ============================================================
    const btnNo = document.getElementById('btnNo');
    const loveWinEl = document.getElementById('loveWin');

    let noButtonPos = { x: null, y: null };
    let isRunaway = false;

    function moveNoButton(mouseX, mouseY) {
        const btnRect = btnNo.getBoundingClientRect();
        const btnCX = btnRect.left + btnRect.width / 2;
        const btnCY = btnRect.top + btnRect.height / 2;
        const dx = mouseX - btnCX;
        const dy = mouseY - btnCY;
        const dist = Math.sqrt(dx * dx + dy * dy);

        // When mouse gets really close (within 75px from center)
        if (dist < 75) {
            // First time running away: change to fixed position at current coordinates
            if (!isRunaway) {
                btnNo.style.left = btnRect.left + 'px';
                btnNo.style.top = btnRect.top + 'px';
                btnNo.classList.add('runaway');
                noButtonPos.x = btnRect.left;
                noButtonPos.y = btnRect.top;
                isRunaway = true;

                // Keep the Yes button centered by forcing the parent container to ignore the No button's space
                // No action needed since fixed position takes it out of flow.
            }

            const margin = 50; // flee distance (shorter so it doesn't jump far)
            const angle = Math.atan2(dy, dx);
            let newX = noButtonPos.x - Math.cos(angle) * margin;
            let newY = noButtonPos.y - Math.sin(angle) * margin;

            // Clamp to viewport
            const bw = btnRect.width;
            const bh = btnRect.height;
            newX = Math.max(10, Math.min(window.innerWidth - bw - 10, newX));
            newY = Math.max(10, Math.min(window.innerHeight - bh - 10, newY));

            noButtonPos.x = newX;
            noButtonPos.y = newY;
            btnNo.style.left = newX + 'px';
            btnNo.style.top = newY + 'px';
        }
    }

    window.addEventListener('mousemove', (e) => {
        // Only run logic if the love question section is visible
        if (!document.getElementById('secretSections').classList.contains('hidden')) {
            moveNoButton(e.clientX, e.clientY);
        }
    });

    // Touch support for no-button flee
    window.addEventListener('touchmove', (e) => {
        if (!document.getElementById('secretSections').classList.contains('hidden')) {
            const t = e.touches[0];
            moveNoButton(t.clientX, t.clientY);
        }
    }, { passive: true });

    // Clicking no button — still runs away, doesn't register click
    btnNo.addEventListener('click', (e) => {
        e.stopPropagation();
        if (!isRunaway) return; // If somehow clicked before running away
        const btnRect = btnNo.getBoundingClientRect();
        const randomX = Math.random() * (window.innerWidth - btnRect.width - 20) + 10;
        const randomY = Math.random() * (window.innerHeight - btnRect.height - 20) + 10;
        noButtonPos.x = randomX;
        noButtonPos.y = randomY;
        btnNo.style.left = randomX + 'px';
        btnNo.style.top = randomY + 'px';
    });

    // Yes button
    window.onPressYes = function () {
        loveWinEl.classList.remove('hidden');
        document.getElementById('loveWinModal').classList.remove('hidden');
        fireLoveHearts();
        confetti({ particleCount: 120, spread: 100, origin: { y: 0.5 }, colors: ['#ff4081', '#ffd740', '#ea80fc', '#ff80ab'] });
    };


    // ============================================================
    // 11. LOVE COUPON GACHA
    // ============================================================
    const gachaBtn = document.getElementById('gachaBtn');
    const gachaSaveBtn = document.getElementById('gachaSaveBtn');
    const gachaBall = document.getElementById('gachaBall');
    const gachaResult = document.getElementById('gachaResult');
    const gachaIdle = document.getElementById('gachaIdle');
    const couponIcon = document.getElementById('couponIcon');
    const couponText = document.getElementById('couponText');
    const gachaNote = document.getElementById('gachaNote');

    let currentCoupon = null;

    // Check daily limit
    function getTodayKey() {
        const d = new Date();
        return `gacha_${d.getFullYear()}_${d.getMonth()}_${d.getDate()}`;
    }

    function hasDrawnToday() {
        return !!localStorage.getItem(getTodayKey());
    }

    function markDrawnToday(couponIdx) {
        localStorage.setItem(getTodayKey(), String(couponIdx));
    }

    function getTodayCouponIdx() {
        return parseInt(localStorage.getItem(getTodayKey()) || '-1');
    }

    // Restore today's coupon if already drawn
    const todayIdx = getTodayCouponIdx();
    if (todayIdx >= 0 && todayIdx < COUPONS.length) {
        currentCoupon = COUPONS[todayIdx];
        showCouponResult(currentCoupon);
        gachaBtn.disabled = true;
        gachaBtn.textContent = '✅ สุ่มแล้ววันนี้!';
        gachaSaveBtn.classList.remove('hidden');
        gachaNote.textContent = '💡 สุ่มแล้ววันนี้! มาใหม่พรุ่งนี้นะ~ 🌸';
    }

    function showCouponResult(coupon) {
        gachaIdle.classList.add('hidden');
        gachaResult.classList.remove('hidden');
        couponIcon.textContent = coupon.icon;
        couponText.textContent = coupon.text;
    }

    gachaBtn.addEventListener('click', () => {
        if (hasDrawnToday()) return;

        // Animation phase
        gachaBtn.disabled = true;
        gachaBall.classList.add('pop-out');
        gachaBall.classList.remove('spinning');

        setTimeout(() => {
            // Pick random coupon
            const idx = Math.floor(Math.random() * COUPONS.length);
            currentCoupon = COUPONS[idx];
            markDrawnToday(idx);

            gachaBall.textContent = currentCoupon.icon;
            gachaBall.classList.remove('pop-out');
            gachaBall.classList.add('spinning');

            // Show result after brief delay
            setTimeout(() => {
                showCouponResult(currentCoupon);
                gachaBtn.textContent = '✅ สุ่มแล้ววันนี้!';
                gachaSaveBtn.classList.remove('hidden');
                gachaNote.textContent = '💡 สุ่มแล้ววันนี้! มาใหม่พรุ่งนี้นะ~ 🌸';

                confetti({ particleCount: 60, spread: 80, origin: { y: 0.5 }, colors: ['#ff4081', '#ffd740', '#ea80fc'] });
            }, 600);
        }, 600);
    });

    // Save coupon as image
    gachaSaveBtn.addEventListener('click', () => {
        if (!currentCoupon) return;
        const offCanvas = document.getElementById('couponCanvas');
        const w = 400, h = 250;
        offCanvas.width = w;
        offCanvas.height = h;
        const octx = offCanvas.getContext('2d');

        // Background
        const grad = octx.createLinearGradient(0, 0, w, h);
        grad.addColorStop(0, '#fff0f5');
        grad.addColorStop(0.5, '#ffd6e7');
        grad.addColorStop(1, '#ffb3c6');
        octx.fillStyle = grad;
        roundRect(octx, 0, 0, w, h, 20);
        octx.fill();

        // Border dashes
        octx.strokeStyle = '#ff80ab';
        octx.lineWidth = 3;
        octx.setLineDash([10, 6]);
        roundRect(octx, 8, 8, w - 16, h - 16, 16);
        octx.stroke();
        octx.setLineDash([]);

        // Emoji
        octx.font = '60px serif';
        octx.textAlign = 'center';
        octx.fillText(currentCoupon.icon, w / 2, 90);

        // Text
        octx.font = 'bold 18px Kanit, sans-serif';
        octx.fillStyle = '#c2185b';
        const lines = currentCoupon.text.split('\n');
        lines.forEach((line, i) => {
            octx.fillText(line, w / 2, 140 + i * 28);
        });

        // Footer
        octx.font = '12px Kanit, sans-serif';
        octx.fillStyle = '#e91e8c';
        octx.globalAlpha = 0.7;
        octx.fillText('💕 Love Coupon — ใช้ได้กับคนพิเศษของเราเท่านั้น! 💕', w / 2, h - 16);
        octx.globalAlpha = 1;

        // Download
        const link = document.createElement('a');
        link.download = `love-coupon-${currentCoupon.icon}.png`;
        link.href = offCanvas.toDataURL('image/png');
        link.click();
    });

    function roundRect(ctx, x, y, w, h, r) {
        ctx.beginPath();
        ctx.moveTo(x + r, y);
        ctx.lineTo(x + w - r, y);
        ctx.quadraticCurveTo(x + w, y, x + w, y + r);
        ctx.lineTo(x + w, y + h - r);
        ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
        ctx.lineTo(x + r, y + h);
        ctx.quadraticCurveTo(x, y + h, x, y + h - r);
        ctx.lineTo(x, y + r);
        ctx.quadraticCurveTo(x, y, x + r, y);
        ctx.closePath();
    }


    // ============================================================
    // 12. SCRATCH CARD
    // ============================================================
    const scratchCanvas = document.getElementById('scratchCanvas');
    const scratchContainer = document.getElementById('scratchContainer');
    const scratchCtx = scratchCanvas.getContext('2d');

    function initScratch() {
        const w = scratchContainer.offsetWidth;
        const h = scratchContainer.offsetHeight;
        scratchCanvas.width = w;
        scratchCanvas.height = h;

        // Fill with silver gradient (the "scratch" layer)
        const grad = scratchCtx.createLinearGradient(0, 0, w, h);
        grad.addColorStop(0, '#c0c0c0');
        grad.addColorStop(0.3, '#e8e8e8');
        grad.addColorStop(0.5, '#d0d0d0');
        grad.addColorStop(0.7, '#bdbdbd');
        grad.addColorStop(1, '#a0a0a0');
        scratchCtx.fillStyle = grad;
        scratchCtx.fillRect(0, 0, w, h);

        // Add heart pattern texture
        scratchCtx.font = '28px serif';
        scratchCtx.fillStyle = 'rgba(180,180,180,0.5)';
        for (let x = 30; x < w; x += 50) {
            for (let y = 30; y < h; y += 40) {
                scratchCtx.fillText('💝', x, y);
            }
        }

        // Overlay text instruction
        scratchCtx.font = 'bold 18px Kanit, sans-serif';
        scratchCtx.fillStyle = '#888';
        scratchCtx.textAlign = 'center';
        scratchCtx.fillText('ขูดที่นี่! 🪄', w / 2, h / 2 + 6);
        scratchCtx.textAlign = 'left';
    }

    initScratch();
    window.addEventListener('resize', initScratch);

    scratchCtx.globalCompositeOperation = 'destination-out';

    let isScratchingActive = false;
    const BRUSH_SIZE = 36;

    function scratchAt(x, y) {
        scratchCtx.beginPath();
        scratchCtx.arc(x, y, BRUSH_SIZE, 0, Math.PI * 2);
        scratchCtx.fill();
    }

    scratchCanvas.addEventListener('mousedown', (e) => {
        isScratchingActive = true;
        const rect = scratchCanvas.getBoundingClientRect();
        scratchAt(e.clientX - rect.left, e.clientY - rect.top);
    });

    scratchCanvas.addEventListener('mousemove', (e) => {
        if (!isScratchingActive) return;
        const rect = scratchCanvas.getBoundingClientRect();
        scratchAt(e.clientX - rect.left, e.clientY - rect.top);
    });

    scratchCanvas.addEventListener('mouseup', () => { isScratchingActive = false; });
    scratchCanvas.addEventListener('mouseleave', () => { isScratchingActive = false; });

    // Touch support
    scratchCanvas.addEventListener('touchstart', (e) => {
        e.preventDefault();
        isScratchingActive = true;
        const rect = scratchCanvas.getBoundingClientRect();
        const t = e.touches[0];
        scratchAt(t.clientX - rect.left, t.clientY - rect.top);
    }, { passive: false });

    scratchCanvas.addEventListener('touchmove', (e) => {
        e.preventDefault();
        if (!isScratchingActive) return;
        const rect = scratchCanvas.getBoundingClientRect();
        const t = e.touches[0];
        scratchAt(t.clientX - rect.left, t.clientY - rect.top);
    }, { passive: false });

    scratchCanvas.addEventListener('touchend', () => { isScratchingActive = false; });

    // Reset scratch card
    document.getElementById('scratchResetBtn').addEventListener('click', () => {
        scratchCtx.globalCompositeOperation = 'source-over';
        initScratch();
        scratchCtx.globalCompositeOperation = 'destination-out';
    });


    // ============================================================
    // 13. VOICE NOTE PLAYER (Cassette Tape)
    // ============================================================
    const voiceAudio = document.getElementById('voiceAudio');
    const voicePlayBtn = document.getElementById('voicePlayBtn');
    const voiceProgress = document.getElementById('voiceProgress');
    const voiceTime = document.getElementById('voiceTime');
    const leftReel = document.getElementById('leftReel');
    const rightReel = document.getElementById('rightReel');

    let voicePlaying = false;

    window.toggleVoice = function () {
        if (voicePlaying) {
            voiceAudio.pause();
            voicePlayBtn.textContent = '▶ เล่น';
            leftReel.classList.remove('spinning');
            rightReel.classList.remove('spinning');
        } else {
            voiceAudio.play().catch(() => {
                // No audio file — show fallback
                voicePlayBtn.textContent = '💕 ขอบคุณที่กดนะคะ!';
                leftReel.classList.add('spinning');
                rightReel.classList.add('spinning');
                setTimeout(() => {
                    voicePlayBtn.textContent = '▶ เล่น';
                    leftReel.classList.remove('spinning');
                    rightReel.classList.remove('spinning');
                }, 3000);
                return;
            });
            voicePlayBtn.textContent = '⏸ หยุด';
            leftReel.classList.add('spinning');
            rightReel.classList.add('spinning');
        }
        voicePlaying = !voicePlaying;
    };

    voiceAudio.addEventListener('timeupdate', () => {
        if (!voiceAudio.duration) return;
        const pct = (voiceAudio.currentTime / voiceAudio.duration) * 100;
        voiceProgress.style.width = pct + '%';
        const m = Math.floor(voiceAudio.currentTime / 60);
        const s = Math.floor(voiceAudio.currentTime % 60);
        voiceTime.textContent = `${m}:${String(s).padStart(2, '0')}`;
    });

    voiceAudio.addEventListener('ended', () => {
        voicePlaying = false;
        voicePlayBtn.textContent = '▶ เล่นอีกครั้ง';
        leftReel.classList.remove('spinning');
        rightReel.classList.remove('spinning');
        voiceProgress.style.width = '100%';
    });


    // ============================================================
    // 14. DAY / NIGHT THEME TOGGLE + STARFIELD
    // ============================================================
    const nightBtn = document.getElementById('nightBtn');
    const starCanvas = document.getElementById('starCanvas');
    const starCtx = starCanvas.getContext('2d');

    let isNight = false;
    let stars = [];
    let starAnim = null;

    function initStars() {
        starCanvas.width = window.innerWidth;
        starCanvas.height = window.innerHeight;
        stars = [];
        for (let i = 0; i < 200; i++) {
            stars.push({
                x: Math.random() * starCanvas.width,
                y: Math.random() * starCanvas.height,
                r: Math.random() * 2.5 + 0.5,
                alpha: Math.random(),
                dAlpha: (Math.random() * 0.01 + 0.003) * (Math.random() > 0.5 ? 1 : -1),
                color: ['#ffffff', '#ffe4ff', '#ffd6ff', '#ccaaff'][Math.floor(Math.random() * 4)],
            });
        }
    }

    function animateStars() {
        starCtx.clearRect(0, 0, starCanvas.width, starCanvas.height);
        stars.forEach(s => {
            s.alpha += s.dAlpha;
            if (s.alpha <= 0 || s.alpha >= 1) s.dAlpha *= -1;
            starCtx.save();
            starCtx.globalAlpha = Math.max(0, Math.min(1, s.alpha));
            starCtx.fillStyle = s.color;
            starCtx.shadowColor = s.color;
            starCtx.shadowBlur = 6;
            starCtx.beginPath();
            starCtx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
            starCtx.fill();
            starCtx.restore();
        });
        starAnim = requestAnimationFrame(animateStars);
    }

    window.addEventListener('resize', () => { if (isNight) initStars(); });

    nightBtn.addEventListener('click', e => {
        e.stopPropagation();
        isNight = !isNight;
        document.body.classList.toggle('night-mode', isNight);
        nightBtn.textContent = isNight ? '☀️' : '🌙';

        if (isNight) {
            initStars();
            animateStars();
        } else {
            if (starAnim) cancelAnimationFrame(starAnim);
            starCtx.clearRect(0, 0, starCanvas.width, starCanvas.height);
        }
    });


    // ============================================================
    // 15. EASTER EGGS
    // ============================================================
    const eggs = document.querySelectorAll('.easter-egg');
    const eggModal = document.getElementById('easterEggModal');
    const eggEmoji = document.getElementById('easterEmoji');
    const eggTitle = document.getElementById('easterTitle');
    const eggText = document.getElementById('easterText');

    eggs.forEach(egg => {
        egg.addEventListener('click', (e) => {
            e.stopPropagation();
            eggEmoji.textContent = egg.dataset.emoji || '💕';
            eggTitle.textContent = egg.dataset.title || 'แอบกดอะไยซน!';
            eggText.textContent = egg.dataset.text || 'แอบบอกรัก...';
            eggModal.classList.remove('hidden');

            confetti({ particleCount: 50, spread: 70, origin: { x: e.clientX / window.innerWidth, y: e.clientY / window.innerHeight }, colors: ['#ff4081', '#ffd740', '#ea80fc'] });
        });
    });

    // Close modal on backdrop click
    eggModal.addEventListener('click', (e) => {
        if (e.target === eggModal) eggModal.classList.add('hidden');
    });

    document.getElementById('loveWinModal').addEventListener('click', (e) => {
        if (e.target.id === 'loveWinModal') document.getElementById('loveWinModal').classList.add('hidden');
    });


    // ============================================================
    // 16. POLAROID SHAKE on click (Timeline)
    // ============================================================
    document.querySelectorAll('.timeline-polaroid').forEach(p => {
        p.addEventListener('click', () => {
            p.style.transition = 'transform 0.15s ease';
            p.style.transform = 'rotate(0deg) scale(1.12)';
            setTimeout(() => {
                p.style.transform = '';
                p.style.transition = '';
            }, 500);
            // Mini heart burst
            const rect = p.getBoundingClientRect();
            const cx = rect.left + rect.width / 2;
            const cy = rect.top + rect.height / 2;
            for (let i = 0; i < 6; i++) {
                setTimeout(() => {
                    const h = document.createElement('div');
                    h.classList.add('floating-heart');
                    h.textContent = ['💕', '💖', '✨', '🌸'][Math.floor(Math.random() * 4)];
                    h.style.left = cx + 'px';
                    h.style.top = cy + 'px';
                    h.style.fontSize = `${Math.random() * 0.8 + 1}rem`;
                    document.body.appendChild(h);
                    setTimeout(() => h.remove(), 1500);
                }, i * 80);
            }
        });
    });


}); // end DOMContentLoaded
