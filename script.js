document.addEventListener('DOMContentLoaded', () => {
    // --- 1. Jigsaw/Photo Floating Logic ---
    const photos = document.querySelectorAll('.floating-photo');
    const photoData = [];
    const photoSize = 150; // Match width/height in CSS

    // Initialize random positions and speeds for each photo
    photos.forEach(photo => {
        const x = Math.random() * (window.innerWidth - photoSize);
        const y = Math.random() * (window.innerHeight - photoSize);
        const dx = (Math.random() - 0.5) * 2; // Random speed X
        const dy = (Math.random() - 0.5) * 2; // Random speed Y
        
        photoData.push({
            element: photo,
            x: x,
            y: y,
            dx: dx,
            dy: dy,
            isDragging: false
        });

        photo.style.transform = `translate(${x}px, ${y}px)`;
    });

    // Animation Loop
    function animatePhotos() {
        photoData.forEach(data => {
            if (data.isDragging) return; // Skip if user is dragging it

            // Update position
            data.x += data.dx;
            data.y += data.dy;

            // Bounce off walls
            if (data.x <= 0 || data.x + photoSize >= window.innerWidth) {
                data.dx *= -1;
            }
            if (data.y <= 0 || data.y + photoSize >= window.innerHeight) {
                data.dy *= -1;
            }

            // Apply transform
            data.element.style.transform = `translate(${data.x}px, ${data.y}px)`;
        });

        requestAnimationFrame(animatePhotos);
    }
    animatePhotos();

    // --- 2. Drag and Drop Logic ---
    let activeData = null;
    let initialX, initialY, currentX, currentY;

    photos.forEach((photo, index) => {
        photo.addEventListener('pointerdown', (e) => {
            // Bring to front handled by CSS :active z-index
            activeData = photoData[index];
            activeData.isDragging = true;
            
            initialX = e.clientX - activeData.x;
            initialY = e.clientY - activeData.y;
            
            // Optional: stop event propagation so heart doesn't spawn when dragging photo
            e.stopPropagation();
        });
    });

    window.addEventListener('pointermove', (e) => {
        if (!activeData) return;
        
        e.preventDefault();
        
        currentX = e.clientX - initialX;
        currentY = e.clientY - initialY;
        
        // Boundaries check (optional, but good for keeping photos in screen)
        currentX = Math.max(0, Math.min(currentX, window.innerWidth - photoSize));
        currentY = Math.max(0, Math.min(currentY, window.innerHeight - photoSize));
        
        activeData.x = currentX;
        activeData.y = currentY;
        activeData.element.style.transform = `translate(${currentX}px, ${currentY}px)`;
    });

    window.addEventListener('pointerup', () => {
        if (activeData) {
            activeData.isDragging = false;
            activeData = null;
        }
    });

    // --- 3. Gift Box Click & Confetti Logic ---
    const giftBox = document.getElementById('giftBox');
    const messageCard = document.getElementById('messageCard');
    const bgMusic = document.getElementById('bgMusic');

    giftBox.addEventListener('click', (e) => {
        e.stopPropagation(); // Prevent heart spawn on gift box click
        
        // Hide Gift Box
        giftBox.classList.add('hidden');
        
        // Show Message Card
        messageCard.classList.remove('hidden');
        // Small delay to allow display:block to render before transitioning opacity/transform
        setTimeout(() => {
            messageCard.classList.add('show');
        }, 10);
        
        // Fire Confetti
        fireConfetti();
        
        // Try playing background music (browsers require user interaction to play audio, which this is!)
        bgMusic.play().catch(err => {
            console.log("No music file found or playback blocked.", err);
        });
    });

    function fireConfetti() {
        var duration = 3 * 1000;
        var animationEnd = Date.now() + duration;
        var defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

        function randomInRange(min, max) {
            return Math.random() * (max - min) + min;
        }

        var interval = setInterval(function() {
            var timeLeft = animationEnd - Date.now();

            if (timeLeft <= 0) {
                return clearInterval(interval);
            }

            var particleCount = 50 * (timeLeft / duration);
            // since particles fall down, start a bit higher than random
            confetti(Object.assign({}, defaults, { particleCount,
                origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
            }));
            confetti(Object.assign({}, defaults, { particleCount,
                origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
            }));
        }, 250);
    }

    // --- 4. Floating Heart Click Effect ---
    document.body.addEventListener('pointerdown', (e) => {
        // Create heart element
        const heart = document.createElement('div');
        heart.classList.add('floating-heart');
        
        // Set position to click coordinates
        heart.style.left = `${e.clientX}px`;
        heart.style.top = `${e.clientY}px`;
        
        document.body.appendChild(heart);
        
        // Remove after animation (1.5s)
        setTimeout(() => {
            heart.remove();
        }, 1500);
    });
});
