/**
 * Liberland - Particle Animation
 * Creates floating particles effect for hero section
 */

class ParticleSystem {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    
    this.ctx = this.canvas.getContext('2d');
    this.particles = [];
    this.mouse = { x: null, y: null };
    this.particleCount = 80;
    this.connectionDistance = 150;
    
    this.init();
  }

  init() {
    this.resize();
    this.createParticles();
    this.bindEvents();
    this.animate();
  }

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  createParticles() {
    this.particles = [];
    const count = window.innerWidth < 768 ? 40 : this.particleCount;
    
    for (let i = 0; i < count; i++) {
      this.particles.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        size: Math.random() * 2 + 1,
        speedX: (Math.random() - 0.5) * 0.5,
        speedY: (Math.random() - 0.5) * 0.5,
        opacity: Math.random() * 0.5 + 0.2,
        color: Math.random() > 0.5 ? '252, 210, 5' : '248, 156, 14'
      });
    }
  }

  bindEvents() {
    window.addEventListener('resize', () => {
      this.resize();
      this.createParticles();
    });

    this.canvas.addEventListener('mousemove', (e) => {
      this.mouse.x = e.clientX;
      this.mouse.y = e.clientY;
    });

    this.canvas.addEventListener('mouseleave', () => {
      this.mouse.x = null;
      this.mouse.y = null;
    });
  }

  drawParticle(particle) {
    this.ctx.beginPath();
    this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
    this.ctx.fillStyle = `rgba(${particle.color}, ${particle.opacity})`;
    this.ctx.fill();
  }

  drawConnections() {
    for (let i = 0; i < this.particles.length; i++) {
      for (let j = i + 1; j < this.particles.length; j++) {
        const dx = this.particles[i].x - this.particles[j].x;
        const dy = this.particles[i].y - this.particles[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < this.connectionDistance) {
          const opacity = (1 - distance / this.connectionDistance) * 0.15;
          this.ctx.beginPath();
          this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
          this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
          this.ctx.strokeStyle = `rgba(252, 210, 5, ${opacity})`;
          this.ctx.lineWidth = 0.5;
          this.ctx.stroke();
        }
      }
    }
  }

  updateParticle(particle) {
    particle.x += particle.speedX;
    particle.y += particle.speedY;

    // Mouse interaction
    if (this.mouse.x && this.mouse.y) {
      const dx = this.mouse.x - particle.x;
      const dy = this.mouse.y - particle.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance < 200) {
        const force = (200 - distance) / 200;
        particle.speedX -= (dx / distance) * force * 0.02;
        particle.speedY -= (dy / distance) * force * 0.02;
      }
    }

    // Boundary check
    if (particle.x < 0 || particle.x > this.canvas.width) {
      particle.speedX *= -1;
      particle.x = Math.max(0, Math.min(particle.x, this.canvas.width));
    }
    if (particle.y < 0 || particle.y > this.canvas.height) {
      particle.speedY *= -1;
      particle.y = Math.max(0, Math.min(particle.y, this.canvas.height));
    }

    // Speed limit
    const speed = Math.sqrt(particle.speedX ** 2 + particle.speedY ** 2);
    if (speed > 1) {
      particle.speedX *= 0.99;
      particle.speedY *= 0.99;
    }
  }

  animate() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    this.drawConnections();
    
    this.particles.forEach(particle => {
      this.updateParticle(particle);
      this.drawParticle(particle);
    });

    requestAnimationFrame(() => this.animate());
  }
}

// Initialize particles when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  new ParticleSystem('particles');
});
