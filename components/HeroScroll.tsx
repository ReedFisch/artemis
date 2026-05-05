"use client";
import { useEffect, useRef } from "react";

export default function HeroScroll() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameCount = 6;
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;
    
    // Set canvas dimensions
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    // Preload images
    const images: HTMLImageElement[] = [];
    for (let i = 0; i < frameCount; i++) {
      const img = new Image();
      img.src = `/hero-sequence/${i + 6}.jpg`;
      images.push(img);
    }
    
    // Draw function
    const drawImage = (index: number) => {
      const img = images[index];
      if (!img || !img.complete) return;
      
      // Cover logic to fill canvas perfectly
      const scale = Math.max(canvas.width / img.width, canvas.height / img.height);
      const x = (canvas.width / 2) - (img.width / 2) * scale;
      const y = (canvas.height / 2) - (img.height / 2) * scale;
      
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.drawImage(img, x, y, img.width * scale, img.height * scale);
    };
    
    // Draw first frame once loaded
    images[0].onload = () => drawImage(0);
    
    // Handle scroll
    const handleScroll = () => {
      // Hero section is 200vh tall, so 100vh is available for scrubbing
      const scrollTop = window.scrollY;
      const maxScroll = window.innerHeight * 0.08; 
      const scrollFraction = Math.min(Math.max(scrollTop / maxScroll, 0), 1);
      
      const frameIndex = Math.floor(scrollFraction * (frameCount - 1));
      requestAnimationFrame(() => drawImage(frameIndex));
    };
    
    window.addEventListener("scroll", handleScroll);
    
    // Handle resize
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      handleScroll();
    };
    window.addEventListener("resize", handleResize);
    
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, zIndex: -1 }}>
      <canvas ref={canvasRef} style={{ display: "block" }} />
      {/* Intense Vignette Overlay */}
      <div style={{ 
        position: "absolute", top: 0, left: 0, right: 0, bottom: 0, 
        background: "radial-gradient(ellipse 70% 90% at center, transparent 40%, #050505 85%, #050505 100%)",
        pointerEvents: "none"
      }}></div>
      {/* Premium dark gradient overlay for text readability */}
      <div style={{ 
        position: "absolute", top: 0, left: 0, right: 0, bottom: 0, 
        background: "linear-gradient(to right, rgba(5,5,5,0.95) 0%, rgba(5,5,5,0.5) 50%, transparent 100%)",
        pointerEvents: "none"
      }}></div>
    </div>
  );
}
