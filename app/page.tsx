"use client";

import { useEffect, useRef, useState } from "react";

// Helper to generate realistic star patterns
const generateStars = (count: number) => {
  const shadows = [];
  for (let i = 0; i < count; i++) {
    const x = Math.floor(Math.random() * 3000);
    const y = Math.floor(Math.random() * 3000);
    const opacity = (Math.random() * 0.7 + 0.3).toFixed(2);
    const colors = ["255,255,255", "255,255,255", "200,220,255", "255,250,200"];
    const color = colors[Math.floor(Math.random() * colors.length)];
    const size = Math.random() > 0.95 ? 1 : 0;
    shadows.push(`${x}px ${y}px 0 ${size}px rgba(${color}, ${opacity})`);
  }
  return shadows.join(', ');
};



// Pre-compute random explosion trajectories for each letter
const ARTEMIS_LETTERS = "ARTEMIS".split("");

// Each letter fans outward like a rainbow — leftmost goes upper-left, center goes up, rightmost goes upper-right
const LETTER_TRAJECTORIES = ARTEMIS_LETTERS.map((_, i) => {
  // Fan from 150° (upper-left) to 30° (upper-right)
  const angleDeg = 150 - (i / (ARTEMIS_LETTERS.length - 1)) * 120;
  const angleRad = (angleDeg * Math.PI) / 180;
  const speed = 80 + Math.random() * 40; // vw units of travel
  const rotationSpeed = (Math.random() - 0.5) * 540; // degrees of spin
  return { angleRad, speed, rotationSpeed };
});

function Hero1() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const lastDrawnFrameIndex = useRef(-1);
  const frameCount = 111;

  useEffect(() => {
    const loaded: HTMLImageElement[] = new Array(frameCount);
    imagesRef.current = loaded;

    // 1. Load the first frame immediately so the site appears instantly
    const firstImg = new Image();
    firstImg.src = '/hero/Robotbackground.png';
    
    const revealSite = () => {
      loaded[0] = firstImg;
      setIsLoaded(true); // Reveal the site!
    };

    firstImg.onload = revealSite;
    firstImg.onerror = revealSite; // Fallback: show site even if bg fails

    // Force reveal after 3 seconds no matter what
    const fallbackTimeout = setTimeout(revealSite, 3000);

    // 2. Lazy-load the rest of the sequence in the background
    setTimeout(() => {
      for (let i = 1; i < frameCount; i++) {
        const img = new Image();
        if (i === frameCount - 1) {
          img.src = '/hero/110_highres.png'; // Maximum uncompressed quality for the final holding frame
        } else {
          img.src = `/hero/${i.toString().padStart(3,'0')}.webp`;
        }
        img.onload = () => { loaded[i] = img; };
        img.onerror = () => { loaded[i] = img; }; // keep array slot
      }
    }, 100);

    const c = canvasRef.current;
    if (c) { const x = c.getContext("2d"); if (x) { c.width = window.innerWidth; c.height = window.innerHeight; x.clearRect(0,0,c.width,c.height); }}

    return () => clearTimeout(fallbackTimeout);
  }, []);

  const drawFrame = (index: number) => {
    const images = imagesRef.current;
    if (!canvasRef.current || !images.length) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let vi = index;
    while (vi >= 0 && (!images[vi] || images[vi].naturalWidth === 0)) vi--;
    if (vi < 0) return;
    const img = images[vi];
    canvas.width = window.innerWidth; canvas.height = window.innerHeight;
    const ir = img.width / img.height, cr = canvas.width / canvas.height;
    let dw: number, dh: number, ox: number, oy: number;
    if (cr > ir) { dw = canvas.width; dh = canvas.width / ir; ox = 0; oy = (canvas.height - dh) / 2; }
    else { dw = canvas.height * ir; dh = canvas.height; ox = (canvas.width - dw) / 2; oy = 0; }
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, ox, oy, dw, dh);
  };

  useEffect(() => { if (isLoaded) drawFrame(0); }, [isLoaded]);

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      const { top, height } = containerRef.current.getBoundingClientRect();
      const maxScroll = height - window.innerHeight;
      const progress = Math.max(0, Math.min(1, -top / maxScroll));
      const frameIndex = Math.min(frameCount - 1, Math.floor(progress * frameCount));
      requestAnimationFrame(() => {
        if (frameIndex !== lastDrawnFrameIndex.current) {
          drawFrame(frameIndex);
          lastDrawnFrameIndex.current = frameIndex;
        }
        document.documentElement.style.setProperty('--scroll-progress', progress.toString());
        // Blur and fade the robot cutout when sequence starts playing
        const el = document.getElementById('hero1-robot-cutout');
        if (el) {
          if (progress > 0.001) {
            // Instantly hide — no blur, no fade, just gone
            el.style.display = "none";
          } else {
            el.style.display = "block";
          }
        }
      });
    };
    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleScroll);
    return () => { window.removeEventListener("scroll", handleScroll); window.removeEventListener("resize", handleScroll); };
  }, [isLoaded]);

  const getLetterStyle = (i: number): React.CSSProperties => {
    const t = LETTER_TRAJECTORIES[i];
    const dx = Math.cos(t.angleRad) * t.speed;
    const dy = -Math.sin(t.angleRad) * t.speed;
    return {
      display: "inline-block",
      transform: `translate(calc(var(--scroll-progress, 0) * ${dx}vw), calc(var(--scroll-progress, 0) * ${dy}vh)) rotate(calc(var(--scroll-progress, 0) * ${t.rotationSpeed}deg))`,
      opacity: "calc(1 - var(--scroll-progress, 0) * 5)",
      transition: "transform 0.08s ease-out, opacity 0.08s ease-out",
    };
  };

  return (
    <div ref={containerRef} style={{ height: "150vh", position: "relative" }}>
      <div style={{ position: "sticky", top: 0, height: "100vh", overflow: "hidden", backgroundColor: "#000" }}>

        {/* Layer 1: Full frame canvas (zIndex 1) */}
        <canvas ref={canvasRef} style={{ 
          width: "100%", height: "100%", display: "block", objectFit: "cover",
          opacity: isLoaded ? 1 : 0, transition: "opacity 1.5s ease-in",
          position: "absolute", top: 0, left: 0, zIndex: 1
        }} />

        {/* Vignette */}
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle, transparent 40%, rgba(0,0,0,0.95) 120%)", pointerEvents: "none", zIndex: 5 }} />

        {/* Layer 2: Text "ARTEMIS" (zIndex 2) — masked by robot silhouette persistently */}
        <div style={{
          position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center",
          pointerEvents: "none", zIndex: 2, opacity: isLoaded ? 1 : 0, transition: "opacity 2s ease-in",
          maskImage: "url(/hero/robot_text_mask.webp)",
          WebkitMaskImage: "url(/hero/robot_text_mask.webp)",
          maskSize: "cover",
          WebkitMaskSize: "cover",
          maskPosition: "center",
          WebkitMaskPosition: "center",
          maskRepeat: "no-repeat",
          WebkitMaskRepeat: "no-repeat",
        } as React.CSSProperties}>
          <h1 style={{ 
            fontSize: "clamp(6.5rem, 15.8vw, 17.3rem)", fontWeight: 900, textTransform: "uppercase",
            letterSpacing: "0.15em", color: "rgba(255, 255, 255, 0.5)", mixBlendMode: "overlay",
            margin: 0, fontFamily: "'Trebuchet MS', sans-serif", display: "flex", lineHeight: 1, transform: "translateY(-10vh)"
          }}>
            {ARTEMIS_LETTERS.map((letter, i) => (
              <span key={`a-${i}`} style={getLetterStyle(i)}>{letter}</span>
            ))}
          </h1>
        </div>

        {/* Layer 3: The Transparent Robot — ON TOP of text at zIndex 3
            Same as Hero 2's <img src="moon2_masked.png" zIndex 3 />
            Pre-generated via AI background removal (rembg) */}
        <img 
          id="hero1-robot-cutout"
          src="/hero/robot_masked.webp" 
          alt="Artemis Robot" 
          style={{ 
            width: "100%", height: "100%", objectFit: "cover",
            position: "absolute", top: 0, left: 0, zIndex: 3,
            pointerEvents: "none",
            opacity: isLoaded ? 1 : 0,
            transition: "opacity 1.5s ease-in"
          }} 
        />

        {/* Header */}
        <header style={{
          position: "absolute", top: 0, left: 0, right: 0, padding: "2rem 4vw",
          display: "flex", justifyContent: "space-between", alignItems: "center",
          zIndex: 50, color: "#F8FAFC", fontFamily: "'Trebuchet MS', sans-serif"
        }}>
          <div style={{ cursor: "pointer", display: "flex", alignItems: "center" }}>
            <img src="/branding/logo_4.jpeg" alt="Artemis Logo" style={{ height: "60px", objectFit: "contain", borderRadius: "8px" }} />
          </div>
          <nav style={{ display: "flex", gap: "3rem", fontSize: "1.925rem", fontWeight: "bold", fontFamily: "'Inter', sans-serif" }}>
            <a href="#" style={{ color: "#F8FAFC", textDecoration: "none", opacity: 0.6, transition: "color 0.2s, opacity 0.2s" }} onMouseEnter={e => { e.currentTarget.style.color = "#2563EB"; e.currentTarget.style.opacity = "1"; }} onMouseLeave={e => { e.currentTarget.style.color = "#F8FAFC"; e.currentTarget.style.opacity = "0.6"; }}>About</a>
            <a href="#" style={{ color: "#F8FAFC", textDecoration: "none", opacity: 0.6, transition: "color 0.2s, opacity 0.2s" }} onMouseEnter={e => { e.currentTarget.style.color = "#2563EB"; e.currentTarget.style.opacity = "1"; }} onMouseLeave={e => { e.currentTarget.style.color = "#F8FAFC"; e.currentTarget.style.opacity = "0.6"; }}>Robots</a>
            <a href="#" style={{ color: "#F8FAFC", textDecoration: "none", opacity: 0.6, transition: "color 0.2s, opacity 0.2s" }} onMouseEnter={e => { e.currentTarget.style.color = "#2563EB"; e.currentTarget.style.opacity = "1"; }} onMouseLeave={e => { e.currentTarget.style.color = "#F8FAFC"; e.currentTarget.style.opacity = "0.6"; }}>Sponsors</a>
          </nav>
          <button style={{ padding: "0.8rem 2.5rem", backgroundColor: "#2563EB", color: "#F8FAFC", border: "none", borderRadius: "50px", fontWeight: "bold", fontSize: "1rem", cursor: "pointer", transition: "transform 0.2s, background-color 0.2s" }}
            onMouseEnter={e => { e.currentTarget.style.transform = "scale(1.05)"; e.currentTarget.style.backgroundColor = "#F97316"; }}
            onMouseLeave={e => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.backgroundColor = "#2563EB"; }}>
            Join Us
          </button>
        </header>
      </div>
    </div>
  );
}





function Hero2() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Spring physics variables for fluid blob mask tracking
  const targetX = useRef(0);
  const targetY = useRef(0);
  const currentX = useRef(0);
  const currentY = useRef(0);
  const tail1X = useRef(0);
  const tail1Y = useRef(0);
  const tail2X = useRef(0);
  const tail2Y = useRef(0);
  const tail3X = useRef(0);
  const tail3Y = useRef(0);
  const opacity = useRef(0);
  const isHovering = useRef(false);

  useEffect(() => {
    let animationFrameId: number;

    const animate = () => {
      // Linear Interpolation (LERP) for buttery smooth spring physics
      currentX.current += (targetX.current - currentX.current) * 0.15;
      currentY.current += (targetY.current - currentY.current) * 0.15;
      
      // Cascading LERP for lingering tail effect (lower friction = longer tail)
      tail1X.current += (currentX.current - tail1X.current) * 0.12;
      tail1Y.current += (currentY.current - tail1Y.current) * 0.12;
      
      tail2X.current += (tail1X.current - tail2X.current) * 0.12;
      tail2Y.current += (tail1Y.current - tail2Y.current) * 0.12;

      tail3X.current += (tail2X.current - tail3X.current) * 0.12;
      tail3Y.current += (tail2Y.current - tail3Y.current) * 0.12;
      
      const targetOpacity = isHovering.current ? 1 : 0;
      opacity.current += (targetOpacity - opacity.current) * 0.1;

      const maskEl = document.getElementById("spotlight-mask");
      const ringEl = document.getElementById("spotlight-ring");
      const blobPath = document.getElementById("blob-path");

      // Animate the blob SVG path
      if (blobPath) {
        const time = Date.now() / 200;
        
        const makeBlob = (cx: number, cy: number, rx: number, ry: number, variance: number, tOffset: number) => {
          const t = time + tOffset;
          const p0 = { x: cx, y: cy - ry + Math.sin(t) * variance };
          const p1 = { x: cx + rx + Math.cos(t*1.2) * variance, y: cy };
          const p2 = { x: cx, y: cy + ry + Math.sin(t*0.8) * variance };
          const p3 = { x: cx - rx + Math.cos(t*1.1) * variance, y: cy };
          
          const cpX = rx * 0.55;
          const cpY = ry * 0.55;

          return `M ${p0.x} ${p0.y} C ${p0.x+cpX} ${p0.y}, ${p1.x} ${p1.y-cpY}, ${p1.x} ${p1.y} C ${p1.x} ${p1.y+cpY}, ${p2.x+cpX} ${p2.y}, ${p2.x} ${p2.y} C ${p2.x-cpX} ${p2.y}, ${p3.x} ${p3.y+cpY}, ${p3.x} ${p3.y} C ${p3.x} ${p3.y-cpY}, ${p0.x-cpX} ${p0.y}, ${p0.x} ${p0.y} Z`;
        };

        // Construct 4 overlapping blobs that merge into a highly oblong comet tail shape
        const d0 = makeBlob(currentX.current, currentY.current, 150, 130, 30, 0);
        const d1 = makeBlob(tail1X.current, tail1Y.current, 120, 100, 20, -1);
        const d2 = makeBlob(tail2X.current, tail2Y.current, 80, 65, 15, -2);
        const d3 = makeBlob(tail3X.current, tail3Y.current, 45, 35, 10, -3);
        
        blobPath.setAttribute("d", `${d0} ${d1} ${d2} ${d3}`);
      }

      if (maskEl) {
        maskEl.style.opacity = opacity.current.toString();
        // Use SVG Clip-Path instead of rigid radial-gradient
        maskEl.style.clipPath = "url(#blob-clip)";
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (maskEl.style as any).webkitClipPath = "url(#blob-clip)";
      }
      
      const ringInnerEl = document.getElementById("spotlight-ring-inner");
      if (ringEl) {
        ringEl.style.opacity = (opacity.current * 0.7).toString();
        // Lando Norris style organic trailing scaling and spinning
        const scale = 1 + (Math.sin(Date.now() / 400) * 0.08);
        const rotation = (Date.now() / 20) % 360; // continuous rotation
        ringEl.style.transform = `translate(${currentX.current - 150}px, ${currentY.current - 130}px) scale(${scale}) rotate(${rotation}deg)`;
      }
      if (ringInnerEl) {
        ringInnerEl.style.opacity = (opacity.current * 0.5).toString();
        const scale = 1 + (Math.cos(Date.now() / 300) * 0.05);
        const rotation = -(Date.now() / 15) % 360; // continuous counter-rotation
        // Connect the inner ring to the first tail segment so it visually lags
        ringInnerEl.style.transform = `translate(${tail1X.current - 120}px, ${tail1Y.current - 100}px) scale(${scale}) rotate(${rotation}deg)`;
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    // Initialize centers
    targetX.current = window.innerWidth / 2;
    targetY.current = window.innerHeight / 2;
    currentX.current = targetX.current;
    currentY.current = targetY.current;
    tail1X.current = targetX.current;
    tail1Y.current = targetY.current;
    tail2X.current = targetX.current;
    tail2Y.current = targetY.current;
    tail3X.current = targetX.current;
    tail3Y.current = targetY.current;

    animate();
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    targetX.current = e.clientX - rect.left;
    targetY.current = e.clientY - rect.top;
  };

  return (
    <div 
      ref={containerRef}
      style={{ height: "100vh", position: "relative", overflow: "hidden", backgroundColor: "#0A0E17", cursor: "crosshair" }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => (isHovering.current = true)}
      onMouseLeave={() => (isHovering.current = false)}
    >
      {/* Dynamic SVG Clip Path Definition */}
      <svg width="0" height="0" style={{ position: "absolute" }}>
        <clipPath id="blob-clip" clipPathUnits="userSpaceOnUse">
          <path id="blob-path" d="M 0 0" />
        </clipPath>
      </svg>

      {/* 1. Darkened Base Layer */}
      <img 
        src="/hero/Robotbackground.png" 
        alt="Moon Base" 
        style={{ 
          width: "100%", height: "100%", objectFit: "cover", position: "absolute", top: 0, left: 0,
          filter: "grayscale(100%) brightness(0.2)", zIndex: 1
        }} 
      />

      {/* 2. Base Text (Visible everywhere) */}
      <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", pointerEvents: "none", zIndex: 2 }}>
        <h1 style={{ 
          fontSize: "clamp(6rem, 15vw, 16rem)", 
          fontWeight: 900, 
          textTransform: "uppercase", 
          letterSpacing: "0.15em", 
          color: "rgba(255, 255, 255, 0.4)", 
          mixBlendMode: "overlay",
          margin: 0, 
          fontFamily: "'Trebuchet MS', sans-serif",
          transform: "translateY(-10vh)"
        }}>
          ARTEMIS
        </h1>
      </div>

      {/* 3. Spotlight Mask Container */}
      <div 
        id="spotlight-mask"
        style={{
          position: "absolute", inset: 0, zIndex: 3,
          opacity: 0,
          // CSS radial gradient has been replaced by SVG clip-path in LERP loop
        }}
      >
        {/* Bright Background inside spotlight */}
        <img src="/hero/Robotbackground.png" alt="Moon Robot Bright" style={{ width: "100%", height: "100%", objectFit: "cover", position: "absolute", top: 0, left: 0, zIndex: 1 }} />

        {/* Highlighted Text */}
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", pointerEvents: "none", zIndex: 2 }}>
          <h1 style={{ 
            fontSize: "clamp(6rem, 15vw, 16rem)", 
            fontWeight: 900, 
            textTransform: "uppercase", 
            letterSpacing: "0.15em", 
            color: "rgba(255, 255, 255, 0.4)", 
            mixBlendMode: "overlay",
            margin: 0, 
            fontFamily: "'Trebuchet MS', sans-serif",
            transform: "translateY(-10vh)"
          }}>
            ARTEMIS
          </h1>
        </div>

        {/* The Transparent Robot */}
        <img src="/hero/robot_masked.webp" alt="Artemis Lunar Robot" style={{ width: "100%", height: "100%", objectFit: "cover", position: "absolute", top: 0, left: 0, zIndex: 3 }} />
      </div>

      {/* 4. Glowing Organic Outline */}
      <div 
        id="spotlight-ring"
        style={{
          position: "absolute", top: 0, left: 0, // Pos controlled by transform
          width: "300px", height: "260px", 
          borderRadius: "40% 60% 70% 30% / 40% 50% 60% 50%", // Organic blob shape
          boxShadow: "0 0 20px rgba(255, 255, 255, 0.4), inset 0 0 15px rgba(255, 255, 255, 0.2)",
          border: "2px solid rgba(255, 255, 255, 0.3)", pointerEvents: "none",
          opacity: 0, zIndex: 4,
          willChange: "transform",
        }}
      />
      <div 
        id="spotlight-ring-inner"
        style={{
          position: "absolute", top: 0, left: 0,
          width: "240px", height: "200px", 
          borderRadius: "60% 40% 30% 70% / 50% 60% 50% 40%", // Another organic blob shape
          border: "1px solid rgba(255, 255, 255, 0.5)", pointerEvents: "none",
          opacity: 0, zIndex: 4,
          willChange: "transform"
        }}
      />

      {/* 5. Header Overlay */}
      <header style={{
        position: "absolute", top: 0, left: 0, right: 0, padding: "2rem 4vw",
        display: "flex", justifyContent: "space-between", alignItems: "center",
        zIndex: 50, color: "#F8FAFC", fontFamily: "'Trebuchet MS', sans-serif"
      }}>
        {/* Scraped Logo from Google Slides (No Text Version) */}
        <div style={{ cursor: "pointer", display: "flex", alignItems: "center" }}>
          <img src="/branding/logo_4.jpeg" alt="Artemis Logo" style={{ height: "60px", objectFit: "contain", borderRadius: "8px" }} />
        </div>
        
        <nav style={{ display: "flex", gap: "3rem", fontSize: "1.925rem", fontWeight: "bold", fontFamily: "'Inter', sans-serif", opacity: 0.85 }}>
          <a href="#" style={{ color: "#F8FAFC", textDecoration: "none", opacity: 0.8, transition: "color 0.2s, opacity 0.2s" }} onMouseEnter={e => { e.currentTarget.style.color = "#2563EB"; e.currentTarget.style.opacity = "1"; }} onMouseLeave={e => { e.currentTarget.style.color = "#F8FAFC"; e.currentTarget.style.opacity = "0.8"; }}>About</a>
          <a href="#" style={{ color: "#F8FAFC", textDecoration: "none", opacity: 0.8, transition: "color 0.2s, opacity 0.2s" }} onMouseEnter={e => { e.currentTarget.style.color = "#2563EB"; e.currentTarget.style.opacity = "1"; }} onMouseLeave={e => { e.currentTarget.style.color = "#F8FAFC"; e.currentTarget.style.opacity = "0.8"; }}>Robots</a>
          <a href="#" style={{ color: "#F8FAFC", textDecoration: "none", opacity: 0.8, transition: "color 0.2s, opacity 0.2s" }} onMouseEnter={e => { e.currentTarget.style.color = "#2563EB"; e.currentTarget.style.opacity = "1"; }} onMouseLeave={e => { e.currentTarget.style.color = "#F8FAFC"; e.currentTarget.style.opacity = "0.8"; }}>Sponsors</a>
        </nav>

        <button style={{
          padding: "0.8rem 2.5rem", backgroundColor: "#2563EB", color: "#F8FAFC",
          border: "none", borderRadius: "50px", fontWeight: "bold", fontSize: "1rem",
          cursor: "pointer", transition: "transform 0.2s, background-color 0.2s"
        }}
        onMouseEnter={e => { e.currentTarget.style.transform = "scale(1.05)"; e.currentTarget.style.backgroundColor = "#F97316"; }}
        onMouseLeave={e => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.backgroundColor = "#2563EB"; }}
        >
          Join Us
        </button>
      </header>

      {/* 6. Seamless Fade to Next Section */}
      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0, height: "15vh",
        background: "linear-gradient(to bottom, transparent, #000)",
        zIndex: 51, pointerEvents: "none"
      }} />
    </div>
  );
}


export default function Home() {
  const [heroChoice, setHeroChoice] = useState<'selection' | 'hero1' | 'hero2'>('selection');
  const [starsSmall] = useState<string>(() => generateStars(400));
  const [starsMedium] = useState<string>(() => generateStars(100));

  useEffect(() => {
    // Stars are now initialized via useState initializer to avoid lint errors
  }, []);

  if (heroChoice === 'selection') {
    return (
      <div style={{ height: "100vh", backgroundColor: "#050505", color: "#fff", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", fontFamily: "'Inter', sans-serif" }}>
        <h1 style={{ fontSize: "3rem", marginBottom: "3rem", fontWeight: "bold" }}>Select Hero Test</h1>
        <div style={{ display: "flex", gap: "2rem" }}>
          <button 
            onClick={() => setHeroChoice('hero1')} 
            style={{ padding: "1.5rem 2rem", fontSize: "1.2rem", fontWeight: "bold", backgroundColor: "#fff", color: "#000", border: "none", borderRadius: "8px", cursor: "pointer", transition: "transform 0.2s" }}
            onMouseEnter={e => e.currentTarget.style.transform = "scale(1.05)"}
            onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
          >
            Hero 1 (Sequence)
          </button>
          <button 
            onClick={() => setHeroChoice('hero2')} 
            style={{ padding: "1.5rem 2rem", fontSize: "1.2rem", fontWeight: "bold", backgroundColor: "transparent", color: "#fff", border: "2px solid #fff", borderRadius: "8px", cursor: "pointer", transition: "transform 0.2s" }}
            onMouseEnter={e => e.currentTarget.style.transform = "scale(1.05)"}
            onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
          >
            Hero 2 (Cursor Reveal)
          </button>
        </div>
      </div>
    );
  }

  return (
    <main style={{ backgroundColor: "#000" }}>
      
      {heroChoice === 'hero1' && <Hero1 />}
      {heroChoice === 'hero2' && <Hero2 />}

      {/* ======================================================== */}
      {/* === TEMPORARY OUTLINE SECTION (Easy to delete later) === */}
      {/* ======================================================== */}
      <section 
        id="temp-outline-section"
        style={{ 
          minHeight: "150vh", 
          backgroundColor: "#000", 
          color: "white", 
          position: "relative", 
          zIndex: 10,
          padding: "8rem 2rem",
          overflow: "hidden",
          fontFamily: "'Inter', sans-serif"
        }}
      >
        {/* Realistic Space Background Layer */}
        <div style={{
          position: "absolute",
          top: "-50%", left: "-50%", right: "-50%", bottom: "-50%",
          pointerEvents: "none",
          zIndex: 0
        }}>
           <div style={{ width: "1px", height: "1px", boxShadow: starsSmall, borderRadius: "50%" }} />
           <div style={{ width: "2px", height: "2px", boxShadow: starsMedium, borderRadius: "50%" }} />
        </div>

        {/* Content Layer */}
        <div style={{ maxWidth: "1200px", margin: "0 auto", textAlign: "center", position: "relative", zIndex: 1 }}>
          <h2 style={{ fontSize: "3rem", fontWeight: "bold", marginBottom: "2rem" }}>Temporary Section Outline</h2>
          <p style={{ fontSize: "1.2rem", color: "#ccc", maxWidth: "800px", margin: "0 auto 4rem auto", lineHeight: 1.6 }}>
            This is a placeholder testing area. It features a solid black background with realistic, randomized space stars. You can drop future grid layouts, text blurbs, or features right here.
          </p>
          
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "2rem" }}>
            
            {/* Temporary Image Box 1 */}
            <div style={{ backgroundColor: "rgba(10, 10, 10, 0.8)", backdropFilter: "blur(5px)", padding: "1rem", borderRadius: "12px", border: "1px solid #222" }}>
              <div style={{ width: "100%", height: "250px", backgroundColor: "#1a1a1a", borderRadius: "8px", marginBottom: "1.5rem", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ color: "#666", fontWeight: "bold" }}>[ Image Placeholder ]</span>
              </div>
              <h3 style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>Outline Block 1</h3>
              <p style={{ color: "#888" }}>Functional test block for your future layout needs.</p>
            </div>

            {/* Temporary Image Box 2 */}
            <div style={{ backgroundColor: "rgba(10, 10, 10, 0.8)", backdropFilter: "blur(5px)", padding: "1rem", borderRadius: "12px", border: "1px solid #222" }}>
              <div style={{ width: "100%", height: "250px", backgroundColor: "#1a1a1a", borderRadius: "8px", marginBottom: "1.5rem", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ color: "#666", fontWeight: "bold" }}>[ Image Placeholder ]</span>
              </div>
              <h3 style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>Outline Block 2</h3>
              <p style={{ color: "#888" }}>Easy to delete this entire section when you are done.</p>
            </div>
            
            {/* Temporary Image Box 3 */}
            <div style={{ backgroundColor: "rgba(10, 10, 10, 0.8)", backdropFilter: "blur(5px)", padding: "1rem", borderRadius: "12px", border: "1px solid #222" }}>
              <div style={{ width: "100%", height: "250px", backgroundColor: "#1a1a1a", borderRadius: "8px", marginBottom: "1.5rem", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ color: "#666", fontWeight: "bold" }}>[ Image Placeholder ]</span>
              </div>
              <h3 style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>Outline Block 3</h3>
              <p style={{ color: "#888" }}>All contained within a safely marked component block.</p>
            </div>

          </div>
        </div>
      </section>
      {/* ======================================================== */}
      {/* ================= END TEMPORARY SECTION ================== */}
      {/* ======================================================== */}
    </main>
  );
}
