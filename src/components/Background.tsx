import React, { useEffect, useRef } from 'react';

const Background: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };
    window.addEventListener('resize', resize);
    resize();

    // Star configuration
    const stars: {x: number, y: number, r: number, a: number, speed: number}[] = [];
    const starCount = Math.min(Math.floor((width * height) / 3500), 200); // Limit count for performance

    for (let i = 0; i < starCount; i++) {
      stars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        r: Math.random() * 1.5,
        a: Math.random() * 0.5 + 0.1,
        speed: Math.random() * 0.15 + 0.05
      });
    }

    let animationFrameId: number;

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      
      // Update and Draw Stars
      stars.forEach(star => {
        // Move star
        star.y -= star.speed;
        
        // Reset if off screen (loop)
        if (star.y < 0) {
          star.y = height;
          star.x = Math.random() * width;
        }

        // Twinkle effect
        if (Math.random() > 0.99) {
           star.a = Math.random() * 0.6 + 0.2;
        } else {
           star.a += (Math.random() - 0.5) * 0.01;
           // Clamp alpha
           if(star.a < 0.1) star.a = 0.1;
           if(star.a > 0.7) star.a = 0.7;
        }

        ctx.globalAlpha = star.a;
        ctx.fillStyle = 'white';
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
        ctx.fill();
      });
      
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-0 bg-orbit-dark overflow-hidden pointer-events-none">
      {/* Animated Nebulas (CSS Blobs) */}
      <div 
        className="absolute top-[-10%] left-[-10%] w-[70vw] h-[70vw] bg-indigo-900/20 rounded-full blur-[100px] mix-blend-screen animate-blob" 
      />
      <div 
        className="absolute bottom-[-10%] right-[-10%] w-[70vw] h-[70vw] bg-purple-900/10 rounded-full blur-[100px] mix-blend-screen animate-blob" 
        style={{ animationDelay: '5s', animationDirection: 'reverse' }} 
      />
      <div 
        className="absolute top-[40%] left-[20%] w-[50vw] h-[50vw] bg-cyan-900/10 rounded-full blur-[120px] mix-blend-screen animate-blob" 
        style={{ animationDelay: '10s' }} 
      />
      
      {/* Starfield Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full opacity-70" />
      
      {/* Vignette Overlay for depth */}
      <div className="absolute inset-0 bg-[radial-gradient(transparent_0%,#0B0F19_100%)] opacity-50" />
    </div>
  );
};

export default Background;