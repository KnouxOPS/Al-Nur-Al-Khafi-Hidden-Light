<template>
  <canvas 
    ref="canvasRef" 
    class="particles-canvas"
    :style="canvasStyle"
  ></canvas>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed, watch } from 'vue';

const props = defineProps({
  particleCount: {
    type: Number,
    default: 50
  },
  show: {
    type: Boolean,
    default: true
  }
});

const canvasRef = ref(null);
const particles = ref([]);
const animationId = ref(null);

const canvasStyle = computed(() => ({
  display: props.show ? 'block' : 'none',
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  pointerEvents: 'none',
  zIndex: -1
}));

// Particle class
class Particle {
  constructor(canvasWidth, canvasHeight) {
    this.x = Math.random() * canvasWidth;
    this.y = Math.random() * canvasHeight;
    this.size = Math.random() * 3 + 1;
    this.speedX = Math.random() * 0.5 - 0.25;
    this.speedY = Math.random() * 0.5 - 0.25;
    this.color = this.getRandomColor();
    this.alpha = Math.random() * 0.5 + 0.1;
    this.canvasWidth = canvasWidth;
    this.canvasHeight = canvasHeight;
    this.originalSize = this.size;
  }

  getRandomColor() {
    const colors = [
      'rgba(255, 215, 0, 0.8)', // Gold
      'rgba(16, 185, 129, 0.6)',  // Emerald Green
      'rgba(255, 255, 255, 0.4)'   // White
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  update() {
    this.x += this.speedX;
    this.y += this.speedY;

    // Bounce off edges
    if (this.x <= 0 || this.x >= this.canvasWidth) {
      this.speedX *= -1;
    }
    if (this.y <= 0 || this.y >= this.canvasHeight) {
      this.speedY *= -1;
    }

    // Gentle breathing effect
    const time = Date.now() * 0.001;
    this.size = this.originalSize + Math.sin(time + this.x * 0.01) * 0.5;
    
    // Slow alpha pulsing
    this.alpha = 0.3 + Math.sin(time * 0.5 + this.y * 0.01) * 0.2;
  }

  draw(ctx) {
    ctx.fillStyle = this.color;
    ctx.globalAlpha = this.alpha;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
  }
}

// Initialize canvas
const initCanvas = () => {
  if (!canvasRef.value || !props.show) return;
  
  const canvas = canvasRef.value;
  const ctx = canvas.getContext('2d');
  
  // Set canvas size
  const resizeCanvas = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  };
  
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  // Create particles
  const createParticles = () => {
    particles.value = [];
    for (let i = 0; i < props.particleCount; i++) {
      particles.value.push(new Particle(canvas.width, canvas.height));
    }
  };

  createParticles();

  // Animation loop
  const animate = () => {
    if (!ctx) return;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    particles.value.forEach(particle => {
      particle.update();
      particle.draw(ctx);
    });
    
    animationId.value = requestAnimationFrame(animate);
  };

  animate();

  // Cleanup function
  const cleanup = () => {
    if (animationId.value) {
      cancelAnimationFrame(animationId.value);
    }
    window.removeEventListener('resize', resizeCanvas);
  };

  return cleanup;
};

// Initialize on mount
let cleanupFn = null;
onMounted(() => {
  if (props.show) {
    cleanupFn = initCanvas();
  }
});

// Watch for changes
watch(() => props.show, (newVal) => {
  if (newVal && !cleanupFn) {
    cleanupFn = initCanvas();
  } else if (!newVal && cleanupFn) {
    cleanupFn();
    cleanupFn = null;
  }
});

// Cleanup on unmount
onUnmounted(() => {
  if (cleanupFn) {
    cleanupFn();
  }
});
</script>

<style scoped>
.particles-canvas {
  transition: opacity 0.3s ease;
}
</style>