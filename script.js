// ============================================================
//  QUIZ CONFIG — แก้ไขคำถามและคำตอบตรงนี้ได้เลยครับ! 🔧
// ============================================================
const QUIZ_QUESTION = '"วันนี้วันเกิดใครน้า?"';
//  ⬇️  ใส่คำตอบที่ถูกต้องตรงนี้ (พิมพ์เล็กหรือใหญ่ก็ตรวจได้):
const QUIZ_ANSWER = 'ด.ญ พีชญา รัตนะเดชาวัน';   // 🔧 เปลี่ยนตรงนี้!
// ============================================================

document.addEventListener('DOMContentLoaded', () => {

    // ============================================================
    // 0. QUIZ SCREEN — ต้องตอบถูกก่อนเข้าเว็บหลัก
    // ============================================================
    const quizOverlay = document.getElementById('quizOverlay');
    const quizInput = document.getElementById('quizInput');
    const quizSubmit = document.getElementById('quizSubmit');
    const quizFeedback = document.getElementById('quizFeedback');
    const quizCard = document.querySelector('.quiz-card');
    const quizQuestion = document.getElementById('quizQuestion');

    // Set question text from config
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
            // ✅ Correct!
            quizFeedback.textContent = '🎉 ถูกต้องแล้ว! เข้ามาได้เลยนะ 💖';
            quizFeedback.className = 'quiz-feedback correct';
            quizSubmit.disabled = true;

            // Fire confetti burst
            confetti({
                particleCount: 120,
                spread: 80,
                origin: { y: 0.6 },
                colors: ['#ff4081', '#ffd740', '#ea80fc', '#ff80ab', '#ffffff'],
            });

            // Fade out overlay after short delay
            setTimeout(() => {
                quizOverlay.classList.add('dismissed');
            }, 900);

        } else {
            // ❌ Wrong — shake the card
            quizFeedback.textContent = 'ยังไม่ถูกเลยนะ ลองใหม่อีกทีนะ 🙈';
            quizFeedback.className = 'quiz-feedback wrong';

            quizCard.classList.remove('shake');
            // Force reflow so re-adding the class triggers the animation
            void quizCard.offsetWidth;
            quizCard.classList.add('shake');

            // Clear input and refocus
            quizInput.value = '';
            quizInput.focus();
        }
    }

    quizSubmit.addEventListener('click', (e) => {
        e.stopPropagation();
        checkAnswer();
    });

    // Allow pressing Enter to submit
    quizInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') checkAnswer();
    });

    // ============================================================
    // 1. CURSOR TRAIL (Sparkling Stars)
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

    function Particle(x, y) {
        this.x = x;
        this.y = y;
        this.size = Math.random() * 6 + 3;
        this.alpha = 1;
        this.dx = (Math.random() - 0.5) * 3;
        this.dy = (Math.random() - 0.5) * 3 - 1;
        const colors = ['#ff4081', '#ff80ab', '#ffd740', '#ff6ec7', '#ea80fc', '#ffffff'];
        this.color = colors[Math.floor(Math.random() * colors.length)];
        this.shape = Math.random() > 0.5 ? 'star' : 'circle';
    }

    Particle.prototype.update = function () {
        this.x += this.dx;
        this.y += this.dy;
        this.alpha -= 0.025;
        this.size *= 0.97;
    };

    Particle.prototype.draw = function () {
        ctx.save();
        ctx.globalAlpha = Math.max(0, this.alpha);
        ctx.fillStyle = this.color;
        ctx.shadowColor = this.color;
        ctx.shadowBlur = 8;
        if (this.shape === 'star') {
            drawStar(ctx, this.x, this.y, 5, this.size, this.size / 2);
        } else {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size / 2, 0, Math.PI * 2);
            ctx.fill();
        }
        ctx.restore();
    };

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
        particles.forEach((p, i) => {
            p.update();
            p.draw();
            if (p.alpha <= 0) particles.splice(i, 1);
        });
        requestAnimationFrame(animateCanvas);
    }
    animateCanvas();

    window.addEventListener('mousemove', (e) => {
        for (let i = 0; i < 4; i++) {
            particles.push(new Particle(e.clientX, e.clientY));
        }
    });


    // ============================================================
    // 2. FLOATING PHOTOS (Jigsaw) — Bounce + Drag & Drop
    // ============================================================
    const photos = document.querySelectorAll('.floating-photo');
    const photoData = [];
    const photoSize = 180;

    photos.forEach(photo => {
        const x = Math.random() * (window.innerWidth - photoSize);
        const y = Math.random() * (window.innerHeight - photoSize);
        const dx = (Math.random() - 0.5) * 1.5;
        const dy = (Math.random() - 0.5) * 1.5;
        photoData.push({ element: photo, x, y, dx, dy, isDragging: false });
        photo.style.transform = `translate(${x}px, ${y}px)`;
    });

    function animatePhotos() {
        photoData.forEach(data => {
            if (data.isDragging) return;
            data.x += data.dx;
            data.y += data.dy;
            if (data.x <= 0 || data.x + photoSize >= window.innerWidth) data.dx *= -1;
            if (data.y <= 0 || data.y + photoSize >= window.innerHeight) data.dy *= -1;
            data.element.style.transform = `translate(${data.x}px, ${data.y}px)`;
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
        activeData.element.style.transform = `translate(${activeData.x}px, ${activeData.y}px)`;
    });

    window.addEventListener('pointerup', () => {
        if (activeData) {
            activeData.isDragging = false;
            activeData.element.classList.remove('dragging');
            activeData = null;
        }
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
            // Spawn mini confetti burst at balloon position
            confetti({
                particleCount: 40,
                spread: 60,
                origin: { x: e.clientX / window.innerWidth, y: e.clientY / window.innerHeight },
                colors: ['#ff4081', '#ffd740', '#ea80fc', '#ff80ab'],
                scalar: 0.8,
                ticks: 50,
            });
            setTimeout(() => b.remove(), 400);
        });

        // Auto-remove when float animation ends
        b.addEventListener('animationend', () => b.remove());
        balloonContainer.appendChild(b);
    }

    // Spawn balloons periodically
    spawnBalloon(); // immediate
    setInterval(spawnBalloon, 2800);


    // ============================================================
    // 4. GIFT BOX — Click to Reveal + Confetti
    // ============================================================
    const giftBox = document.getElementById('giftBox');
    const messageCard = document.getElementById('messageCard');
    const bgMusic = document.getElementById('bgMusic');
    const hbdTitle = document.getElementById('hbd-title');
    const hbdDesc = document.getElementById('hbd-desc');

    // Typewriter effect for the birthday message
    function typeWriter(el, text, speed = 80) {
        el.textContent = '';
        let i = 0;
        const interval = setInterval(() => {
            el.textContent += text[i++];
            if (i >= text.length) clearInterval(interval);
        }, speed);
    }

    giftBox.addEventListener('click', e => {
        e.stopPropagation();
        giftBox.classList.add('hidden');
        messageCard.classList.remove('hidden');
        setTimeout(() => {
            messageCard.classList.add('show');
            // Typewriter on title
            typeWriter(hbdTitle, 'Happy Birthday! 🎂', 70);
        }, 20);

        fireConfetti();
        bgMusic.play().catch(() => { });
    });


    // ============================================================
    // 5. LOVE BUTTON — Heart explosion
    // ============================================================
    const loveBtn = document.getElementById('loveBtn');
    loveBtn.addEventListener('click', e => {
        e.stopPropagation();
        fireLoveHearts();
        // Ripple from button
        confetti({
            particleCount: 80,
            shapes: ['circle'],
            colors: ['#ff4081', '#ff80ab', '#ffd740', '#ea80fc'],
            origin: { x: e.clientX / window.innerWidth, y: e.clientY / window.innerHeight },
            spread: 100,
            startVelocity: 35,
        });
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
    // 6. CONFETTI BUTTON (top-right)
    // ============================================================
    const confettiBtn = document.getElementById('confettiBtn');
    confettiBtn.addEventListener('click', e => {
        e.stopPropagation();
        fireConfetti();
    });

    function fireConfetti() {
        const duration = 3500;
        const endTime = Date.now() + duration;
        const defaults = { spread: 360, ticks: 80, zIndex: 9998, startVelocity: 28 };

        const interval = setInterval(() => {
            const timeLeft = endTime - Date.now();
            if (timeLeft <= 0) return clearInterval(interval);
            const count = 55 * (timeLeft / duration);
            confetti({
                ...defaults, particleCount: count,
                colors: ['#ff4081', '#ffd740', '#ea80fc', '#ff80ab', '#ffffff'],
                origin: { x: Math.random() * 0.3 + 0.1, y: Math.random() - 0.2 }
            });
            confetti({
                ...defaults, particleCount: count,
                colors: ['#ff4081', '#ffd740', '#ea80fc', '#ff80ab', '#ffffff'],
                origin: { x: Math.random() * 0.3 + 0.6, y: Math.random() - 0.2 }
            });
        }, 220);
    }


    // ============================================================
    // 7. MUSIC TOGGLE BUTTON
    // ============================================================
    const musicBtn = document.getElementById('musicBtn');
    let musicPlaying = false;

    musicBtn.addEventListener('click', e => {
        e.stopPropagation();
        if (musicPlaying) {
            bgMusic.pause();
            musicBtn.textContent = '🔇';
        } else {
            bgMusic.play().catch(() => { });
            musicBtn.textContent = '🎵';
        }
        musicPlaying = !musicPlaying;
    });


    // ============================================================
    // 8. CLICK ANYWHERE — Random Emoji Float Up
    // ============================================================
    const clickEmojis = ['💖', '✨', '🌸', '💕', '⭐', '🦋', '🌟', '💫'];

    document.body.addEventListener('pointerdown', e => {
        // Don't spawn on interactive elements
        if (e.target.closest('.gift-box, .floating-photo, .ctrl-btn, .love-btn, .balloon')) return;

        const el = document.createElement('div');
        el.classList.add('floating-heart');
        el.textContent = clickEmojis[Math.floor(Math.random() * clickEmojis.length)];
        el.style.left = `${e.clientX}px`;
        el.style.top = `${e.clientY}px`;
        el.style.fontSize = `${Math.random() * 1 + 1.2}rem`;
        document.body.appendChild(el);
        setTimeout(() => el.remove(), 1500);
    });

}); // end DOMContentLoaded
