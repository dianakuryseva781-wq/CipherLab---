function initParticles() {
    const canvas = document.getElementById('particlesCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', () => {
        resize();
    });

    const isMobile = window.innerWidth < 768;
    const count = isMobile ? 25 : 70;
    const particles = [];

    for (let i = 0; i < count; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            size: Math.random() * 2 + 0.5,
            vx: (Math.random() - 0.5) * (isMobile ? 0.2 : 0.35),
            vy: (Math.random() - 0.5) * (isMobile ? 0.2 : 0.35),
            opacity: Math.random() * 0.35 + 0.05,
            color: Math.random() > 0.5 ? '#00e05a' : '#00c8ff',
            pulseSpeed: Math.random() * 0.02 + 0.005,
            pulseOffset: Math.random() * Math.PI * 2
        });
    }

    function animate() {
        if (document.hidden) {
            animId = requestAnimationFrame(animate);
            return;
        }
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const time = Date.now() * 0.001;
        const connLimit = isMobile ? 30 : 50;

        for (let i = 0; i < particles.length; i++) {
            const p = particles[i];
            p.x += p.vx; p.y += p.vy;
            if (p.x < 0) p.x = canvas.width; if (p.x > canvas.width) p.x = 0;
            if (p.y < 0) p.y = canvas.height; if (p.y > canvas.height) p.y = 0;

            const pulse = Math.sin(time * p.pulseSpeed * 60 + p.pulseOffset) * 0.3 + 0.7;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size * pulse, 0, Math.PI * 2);
            ctx.fillStyle = p.color;
            ctx.globalAlpha = p.opacity * pulse;
            ctx.fill();

            let connections = 0;
            for (let j = i + 1; j < particles.length && connections < connLimit; j++) {
                const p2 = particles[j];
                const dx = p.x - p2.x, dy = p.y - p2.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                const maxDist = isMobile ? 90 : 130;
                if (dist < maxDist) {
                    connections++;
                    ctx.beginPath();
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(p2.x, p2.y);
                    ctx.strokeStyle = p.color;
                    ctx.globalAlpha = 0.05 * (1 - dist / maxDist);
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            }
        }
        ctx.globalAlpha = 1;
        animId = requestAnimationFrame(animate);
    }

    animate();

    window.addEventListener('beforeunload', () => {
        if (animId) cancelAnimationFrame(animId);
    });
}

document.addEventListener('DOMContentLoaded', initParticles);