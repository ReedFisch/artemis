"use client";

import React, { useEffect, useState, useRef, useMemo } from "react";
import { motion, useScroll, useTransform, useMotionValue, useSpring, useMotionValueEvent, useMotionTemplate, AnimatePresence } from "framer-motion";
import Counter from "./components/Counter";

// ─── Types ──────────────────────────
interface SponsorshipInterestPayload {
  companyName: string;
  contactName: string;
  email: string;
  phone?: string;
  interestedTier: "Hermes" | "Apollo" | "ZEUS" | "Other";
  message: string;
}

// ─── NAV LINKS ──────────────────────────────────────────────────
const NAV_LINKS = [
  { href: "#about", label: "About" },
  { href: "#achievements", label: "Achievements" },
  { href: "#outreach", label: "Outreach" },
  { href: "#budget", label: "Budget & Sponsors" },
];

// ─── TIER DATA ──────────────────────────────────────────────────
const TIERS = [
  {
    name: "Hermes" as const,
    label: "Partner Tier",
    price: "$250+",
    color: "amber",
    benefits: [
      "Logo on team website",
      "Name on team pit banner",
      "Name on competition shirt",
      "Personal thank you card",
    ],
  },
  {
    name: "Apollo" as const,
    label: "Champion Tier",
    price: "$500+",
    color: "blue",
    benefits: [
      "Small logo placement on FRC robot",
      "Name on team pit banner",
      "All Hermes perks included",
      "Signed team photo & team shirt",
    ],
  },
  {
    name: "ZEUS" as const,
    label: "Titan Tier",
    price: "$1,000+",
    color: "orange",
    benefits: [
      "Large prominent logo on FRC robot",
      "Logo printed on competition shirts",
      "Social media spotlight shout-outs",
      "All Apollo perks included",
    ],
  },
  {
    name: "Other" as const,
    label: "Direct Donation",
    price: "Custom",
    color: "white",
    benefits: [
      "Support our students directly",
      "Help cover travel and registration",
      "Ensure 0 cost to participate",
      "Tax deductible donation",
    ]
  }
];

// ─── BUDGET DATA ────────────────────────────────────────────────
const BUDGET_ITEMS = [
  { label: "Worlds Travel, Hotels & Registration", amount: 35000, color: "bg-stellar-orange" },
  { label: "Competition Registration & Meals", amount: 20000, color: "bg-artemis-blue" },
  { label: "Competition Parts & Equipment", amount: 9000, color: "bg-white/40" },
  { label: "Off-Season Events", amount: 1000, color: "bg-white/20" },
];

// ─── OUTREACH DATA ──────────────────────────────────────────────
const OUTREACH_CARDS = [
  {
    tag: "Origami for Good",
    title: "1,000 Cranes Initiative",
    desc: "We folded over 1,000 origami cranes to donate to local hospitals and created custom team-colored origami kits for every team at our competitions - forging meaningful connections across the FRC community.",
    image: "/photos/outreach/origami_for_good.jpg",
  },
  {
    tag: "STEAM Advocacy",
    title: "NY State STEAM Day",
    desc: "Advocated for STEAM grants at New York State STEAM Day alongside Assembly Member Didi Barrett. We demonstrated our robot in action and networked with teams statewide to champion the importance of STEAM education.",
    image: "/photos/outreach/steam_day_assembly.png",
  },
  {
    tag: "Safety First",
    title: "Community Safety Kits",
    desc: "At every competition, we distribute free safety kits to every team - a commitment that earned Safety All-Star awards for Josiah Eugenio (2026) and Reed Fisch (2024).",
    image: "/photos/outreach/community_fair_booth.png",
  },
  {
    tag: "Mentorship",
    title: "Team 7504 Cybearbots",
    desc: "Met with Cybearbots to advise on fundraising, lead acquisition, and strategy. Helped increase their funding from $15k to $30k in one year. Shared scouting and strategic data at Tech Valley.",
    image: "/photos/outreach/mentorship_growth.png",
  },
  {
    tag: "Hardware Fixes",
    title: "Battery Clips",
    desc: "At each competition we handed out battery clips to prevent batteries from disconnecting after we experienced that issue at one of our competitions.",
    image: "/photos/outreach/community_fair_booth.png",
  },
  {
    tag: "Community",
    title: "Wellness & Science Fairs",
    desc: "Gave demonstrations to our community and illustrated the importance of robotics at the Chatham Wellness Fair, Science Fair, and Learning Fair.",
    image: "/photos/outreach/steam_day_assembly.png",
  },
  {
    tag: "Pipeline",
    title: "Middle School FTC",
    desc: "Continuous partnership, assistance, and advising with our local middle school FTC team (a younger feeder robotics team) to help them with their robot and prepare them for competition.",
    image: "/photos/outreach/mentorship_growth.png",
  },
  {
    tag: "Networking",
    title: "Ravena STEM Fair",
    desc: "Representation and demonstration at Ravena STEM fair where we network and demonstrate the importance of FRC with other robotics teams from around the state.",
    image: "/photos/outreach/origami_for_good.jpg",
  }
];

// ─── SPONSOR LOGOS ──────────────────────────────────────────────
const SPONSOR_LOGOS = [
  "Hawthorne Valley Farmstore", "Swaying Pine Software", "Bank of Greene County", 
  "SEI Design", "Craftech", "Kneller Insurance", "Samascott", "Gene Haas Foundation", 
  "Chatham Lions Club", "Taconic Engineering", "Stewart's", "Metz Wood Insurance", 
  "Herringtons", "Gould's Martial Arts Center", "Simmons Automotive", "Ghent One Stop Inc.", 
  "The Chatham Pub", "Spencertown Academy of Arts", "Meltz Lumber Co.", 
  "Checkered Flag Fabrications", "Roots Holistic Wellness", "Stonykill Coffee, Inc", 
  "New Concord Bed & Breakfast", "Chatham Bookstore", "Lyomac", "Gail Gere", 
  "Jere Wrightsman", "Wayne Rose", "East Chatham Grange", "Platypal (Albert Flores)", 
  "Richard Katzman", "CCSD", "Fischer Family", "Eaton Corner", "Wayne Gearing", 
  "Sotherden Family", "Wendy Madsen", "Chatham Booster Club", "Clara Gott", 
  "E. Chatham Ladies Aux", "Custom INk", "Wendy Morey", "Ann Tela Young", 
  "Donna Eager", "Hudson River Bank and Trust"
];

// ═══════════════════════════════════════════════════════════════
// LIQUID ANIMATION HELPERS
// ═══════════════════════════════════════════════════════════════

const AutonomousBlob = ({ radius, duration, delay = 0 }: any) => {
  // Generate random corner-to-corner path points to shoot across randomly
  const pathX = useMemo(() => Array.from({ length: 12 }, () => `${Math.random() * 160 - 30}%`), []);
  const pathY = useMemo(() => Array.from({ length: 12 }, () => `${Math.random() * 160 - 30}%`), []);

  return (
    <motion.g
      animate={{ x: pathX, y: pathY }}
      transition={{ repeat: Infinity, duration, ease: "linear", delay }}
    >
      <motion.g animate={{ rotate: [0, 360] }} transition={{ repeat: Infinity, duration: 10 + delay, ease: "linear" }}>
        <motion.ellipse cx="0" cy="0" rx={radius * 1.6} ry={radius * 0.4} fill="white" animate={{ rotate: [0, -360] }} transition={{ repeat: Infinity, duration: 6, ease: "linear" }} />
        <motion.ellipse cx="0" cy="0" rx={radius * 0.5} ry={radius * 1.3} fill="white" animate={{ rotate: [0, 360] }} transition={{ repeat: Infinity, duration: 7.5, ease: "linear" }} />
      </motion.g>
    </motion.g>
  );
};

// ═══════════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════════

export default function Home() {
  const [selectedTier, setSelectedTier] = useState<"Hermes" | "Apollo" | "ZEUS" | "Other">("Apollo");
  const [contactSuccess, setContactSuccess] = useState(false);
  const [isSubmittingContact, setIsSubmittingContact] = useState(false);
  const [isMoving, setIsMoving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isAtTop, setIsAtTop] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ container: containerRef });

  const handleFastScroll = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();
    const target = document.querySelector(targetId);
    if (!target) return;
    
    const targetPosition = target.getBoundingClientRect().top + window.scrollY;
    const startPosition = window.scrollY;
    const distance = targetPosition - startPosition;
    const duration = 250; // Very fast 250ms scroll
    let start: number | null = null;
    
    const step = (timestamp: number) => {
      if (!start) start = timestamp;
      const progress = timestamp - start;
      const easeOutCubic = 1 - Math.pow(1 - progress / duration, 3);
        
      window.scrollTo(0, startPosition + distance * Math.min(easeOutCubic, 1));
      if (progress < duration) {
        requestAnimationFrame(step);
      }
    };
    requestAnimationFrame(step);
  };

  // Organic Liquid Mouse Tracking
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const cursorX = useMotionValue(-1000);
  const cursorY = useMotionValue(-1000);
  // Underdamped springs to overshoot like liquid sliding past cursor
  const smoothCursorX = useSpring(cursorX, { stiffness: 150, damping: 12, mass: 1 });
  const smoothCursorY = useSpring(cursorY, { stiffness: 150, damping: 12, mass: 1 });
  const smoothCursorX2 = useSpring(cursorX, { stiffness: 100, damping: 10, mass: 1 }); // Trail 1
  const smoothCursorY2 = useSpring(cursorY, { stiffness: 100, damping: 10, mass: 1 });
  const smoothCursorX3 = useSpring(cursorX, { stiffness: 60, damping: 8, mass: 1 }); // Trail 2
  const smoothCursorY3 = useSpring(cursorY, { stiffness: 60, damping: 8, mass: 1 });
  const smoothCursorX4 = useSpring(cursorX, { stiffness: 35, damping: 6, mass: 1 }); // Trail 3
  const smoothCursorY4 = useSpring(cursorY, { stiffness: 35, damping: 6, mass: 1 });

  const springConfig = { damping: 25, stiffness: 80, mass: 0.5 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);
  const smoothXSlow = useSpring(useTransform(mouseX, v => v * 0.5), springConfig);
  const smoothYSlow = useSpring(useTransform(mouseY, v => v * 0.5), springConfig);
  const smoothXFast = useSpring(useTransform(mouseX, v => v * 1.5), springConfig);
  const smoothYFast = useSpring(useTransform(mouseY, v => v * 1.5), springConfig);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    const handleMouseMove = (e: MouseEvent) => {
      setIsMoving(true);
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        setIsMoving(false);
      }, 200);

      // Calculate normalized mouse position (-1 to 1)
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = (e.clientY / window.innerHeight) * 2 - 1;
      // Convert to pixel offsets (e.g. max 100px movement)
      mouseX.set(x * 100);
      mouseY.set(y * 100);
      
      const hero = document.getElementById('hero');
      if (hero) {
        const rect = hero.getBoundingClientRect();
        cursorX.set(e.clientX - rect.left);
        cursorY.set(e.clientY - rect.top);
      } else {
        cursorX.set(e.clientX);
        cursorY.set(e.clientY);
      }
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      clearTimeout(timeout);
    };
  }, [mouseX, mouseY, cursorX, cursorY]);

  // Hero Scroll Scrubbing (Zip Animation)
  const heroScrollRef = useRef<HTMLElement>(null);
  const { scrollYProgress: heroScrollYProgress } = useScroll({
    target: heroScrollRef,
    container: containerRef,
    offset: ["start start", "end end"]
  });
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  
  // Preload images on mount
  useEffect(() => {
    const frameCount = 290;
    const currentImages: HTMLImageElement[] = [];

    let loadedCount = 0;
    for (let i = 1; i <= frameCount; i++) {
      const img = new Image();
      const paddedIndex = i.toString().padStart(3, '0');
      img.src = i === 1 ? '/hero_starting_frame.jpeg' : `/hero_frames/${paddedIndex}.jpg`;
      
      img.onload = () => {
        loadedCount++;
        if (i === 1 && canvasRef.current) {
          const ctx = canvasRef.current.getContext('2d');
          if (ctx) ctx.drawImage(img, 0, 0, 1920, 1080);
        }
        if (loadedCount === frameCount) {
          setIsLoading(false);
        }
      };
      
      currentImages.push(img);
    }
    imagesRef.current = currentImages;
  }, []);

  const rafRef = useRef<number | null>(null);
  
  // Apply a stiff spring to completely eliminate any scroll jitter/jumping back and forth
  const smoothFrameProgress = useSpring(heroScrollYProgress, { stiffness: 400, damping: 90, mass: 0.1 });

  useMotionValueEvent(smoothFrameProgress, "change", (latest) => {
    const frameIndex = Math.min(289, Math.floor(latest * 290));
    if (canvasRef.current && imagesRef.current[frameIndex]) {
      const ctx = canvasRef.current.getContext('2d');
      const img = imagesRef.current[frameIndex];
      if (img.complete && img.naturalHeight !== 0) {
        if (rafRef.current) cancelAnimationFrame(rafRef.current);
        rafRef.current = requestAnimationFrame(() => {
          if (ctx) ctx.drawImage(img, 0, 0, 1920, 1080);
        });
      }
    }
  });

  // Parallax Values for Hero
  const opacityShapes = useTransform(scrollYProgress, [0.05, 0.1], [0, 1]);
  const yShapesFast = useTransform(scrollYProgress, [0, 1], ["0vh", "-150vh"]);
  const yShapesSlow = useTransform(scrollYProgress, [0, 1], ["0vh", "-80vh"]);

  const fadeOutHeroLiquid = useTransform(heroScrollYProgress, [0, 0.0001], [1, 0]);

  const bgParallaxY = useTransform(scrollYProgress, [0, 1], ["0%", "-30%"]);

  useMotionValueEvent(heroScrollYProgress, "change", (latest) => {
    setIsAtTop(latest < 0.001);
  });

  // Horizontal Scroll for About Us -> Timeline
  const horizontalScrollRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: horizontalScrollYProgress } = useScroll({
    target: horizontalScrollRef,
    container: containerRef,
    offset: ["start start", "end end"]
  });
  const xAboutToTimeline = useTransform(horizontalScrollYProgress, [0, 1], ["0%", "-50%"]);

  // Form submission mock
  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingContact(true);
    setTimeout(() => {
      setIsSubmittingContact(false);
      setContactSuccess(true);
    }, 1500);
  };

  return (
    <main ref={containerRef} className="snap-container text-white font-sans overflow-x-hidden">

      {/* ══════════════════════════════════════════════════════
           AMBIENT BACKGROUND GRADIENTS (Continous across entire site)
           ══════════════════════════════════════════════════════ */}
      <motion.div className="fixed inset-0 z-0 pointer-events-none overflow-hidden h-screen w-full" aria-hidden="true">
        {/* Faint Star Background */}
        <div className="absolute inset-0 opacity-30" style={{ backgroundImage: 'radial-gradient(1px 1px at 20px 30px, #ffffff, rgba(0,0,0,0)), radial-gradient(1px 1px at 40px 70px, #ffffff, rgba(0,0,0,0)), radial-gradient(1.5px 1.5px at 90px 40px, #ffffff, rgba(0,0,0,0)), radial-gradient(2px 2px at 160px 120px, #ffffff, rgba(0,0,0,0)), radial-gradient(1px 1px at 200px 50px, #ffffff, rgba(0,0,0,0))', backgroundSize: '300px 300px' }} />
        
        {/* Deep Organic Liquid Gradients Interacting with Cursor */}
        <motion.div style={{ x: smoothXSlow, y: smoothYSlow, background: 'radial-gradient(circle, rgba(37,99,235,0.8) 0%, rgba(37,99,235,0.2) 40%, transparent 70%)' }} className="absolute w-[800px] h-[800px] -top-[200px] -left-[200px] rounded-full opacity-[0.25]" />
        <motion.div style={{ x: smoothXFast, y: smoothYSlow, background: 'radial-gradient(circle, rgba(249,115,22,0.7) 0%, rgba(249,115,22,0.15) 45%, transparent 70%)' }} className="absolute w-[600px] h-[600px] -top-[100px] -right-[150px] rounded-full opacity-[0.2]" />
        <motion.div style={{ x: smoothX, y: smoothYFast, background: 'radial-gradient(circle, rgba(249,115,22,0.6) 0%, rgba(249,115,22,0.1) 50%, transparent 75%)' }} className="absolute w-[700px] h-[700px] top-[25%] -left-[300px] rounded-full opacity-[0.2]" />
        <motion.div style={{ x: smoothXFast, y: smoothYFast, background: 'radial-gradient(circle, rgba(37,99,235,0.7) 0%, rgba(37,99,235,0.15) 40%, transparent 70%)' }} className="absolute w-[900px] h-[900px] top-[35%] -right-[350px] rounded-full opacity-[0.25]" />
        <motion.div style={{ x: smoothX, y: smoothY, background: 'radial-gradient(circle, rgba(37,99,235,0.5) 0%, rgba(249,115,22,0.3) 50%, transparent 75%)' }} className="absolute w-[500px] h-[500px] top-[50%] left-[30%] rounded-full opacity-[0.15]" />
        <motion.div style={{ x: smoothXSlow, y: smoothYFast, background: 'radial-gradient(circle, rgba(37,99,235,0.6) 0%, rgba(37,99,235,0.1) 45%, transparent 70%)' }} className="absolute w-[800px] h-[800px] top-[65%] -left-[250px] rounded-full opacity-[0.2]" />
        <motion.div style={{ x: smoothXFast, y: smoothYFast, background: 'radial-gradient(circle, rgba(249,115,22,0.7) 0%, rgba(249,115,22,0.15) 40%, transparent 70%)' }} className="absolute w-[650px] h-[650px] top-[70%] -right-[200px] rounded-full opacity-[0.2]" />
        
        {/* Bottom sweep — wide blue-to-orange */}
        <motion.div style={{ x: smoothXSlow, y: smoothYSlow, background: 'linear-gradient(135deg, rgba(37,99,235,0.5) 0%, transparent 40%, transparent 60%, rgba(249,115,22,0.4) 100%)' }} className="absolute w-full h-[400px] bottom-0 left-0 opacity-[0.15]" />
        
        {/* Deep center glow */}
        <motion.div style={{ x: smoothXFast, y: smoothY, background: 'radial-gradient(ellipse, rgba(37,99,235,0.4) 0%, rgba(249,115,22,0.2) 35%, transparent 65%)' }} className="absolute w-[1200px] h-[1200px] top-[15%] left-[50%] -translate-x-1/2 rounded-full opacity-[0.15]" />
        
        {/* Scatter orbs */}
        <motion.div style={{ x: smoothX, y: smoothYSlow, background: 'radial-gradient(circle, rgba(249,115,22,0.5) 0%, transparent 70%)' }} className="absolute w-[300px] h-[300px] top-[45%] left-[15%] rounded-full opacity-[0.2]" />
        <motion.div style={{ x: smoothXFast, y: smoothYFast, background: 'radial-gradient(circle, rgba(37,99,235,0.5) 0%, transparent 70%)' }} className="absolute w-[350px] h-[350px] top-[80%] left-[55%] rounded-full opacity-[0.2]" />
        
        {/* Liquid Organic Cursor Trails */}
        <motion.div 
          className="absolute top-0 left-0 w-[500px] h-[500px] rounded-full pointer-events-none mix-blend-screen opacity-50 z-0"
          style={{ 
            x: smoothCursorX, 
            y: smoothCursorY,
            translateX: "-50%",
            translateY: "-50%",
            background: "radial-gradient(circle, rgba(37,99,235,0.6) 0%, rgba(249,115,22,0.3) 40%, transparent 70%)",
            filter: "blur(40px)"
          }}
        />
        <motion.div 
          className="absolute top-0 left-0 w-[800px] h-[800px] rounded-full pointer-events-none mix-blend-screen opacity-30 z-0"
          style={{ 
            x: smoothCursorX3, 
            y: smoothCursorY3,
            translateX: "-50%",
            translateY: "-50%",
            background: "radial-gradient(circle, rgba(37,99,235,0.5) 0%, transparent 60%)",
            filter: "blur(60px)"
          }}
        />
      </motion.div>

            {/* ══════════════════════════════════════════════════════
           1. HERO & ZIP ANIMATION (Combined Sticky Scrolling)
           ══════════════════════════════════════════════════════ */}
            <AnimatePresence>
        {isLoading && (
          <motion.div 
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#05070B] text-white"
          >
            <img src="/branding/logo_4.jpeg" alt="Artemis Loading" className="w-24 h-24 mb-8 animate-pulse mix-blend-screen object-contain" />
            <div className="font-header font-black tracking-[0.3em] text-sm uppercase text-white/50">Loading Assets...</div>
          </motion.div>
        )}
      </AnimatePresence>
      <section id="hero" ref={heroScrollRef} className="relative w-full z-10" style={{ height: '300vh' }}>
        <div className="sticky top-0 h-[100svh] w-full overflow-hidden flex items-center justify-center bg-[#05070B]">
          
          {/* 1. Canvas Zip Animation Layer (Bottom) */}
          <div className="absolute inset-0 z-0 bg-black">
            <canvas ref={canvasRef} width={1920} height={1080} className="w-full h-full object-cover opacity-[0.75]" />
          </div>

          {/* 2. Liquid Hero Mask Layer (Fades out immediately when scrolling starts) */}

          <motion.div className="absolute inset-0 z-10" style={{ opacity: fadeOutHeroLiquid }}>
            {/* HEADER */}
        

        {/* Liquid Reveal Mask Definition */}
        <svg className="absolute w-0 h-0 pointer-events-none">
          <defs>
            <filter id="goo">
              <feGaussianBlur in="SourceGraphic" stdDeviation="25" result="blur" />
              <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 25 -10" result="goo" />
              <feBlend in="SourceGraphic" in2="goo" />
            </filter>
            <mask id="liquidMask">
              <g filter="url(#goo)">
                <motion.g 
                  animate={{ opacity: isMoving ? 1 : 0, scale: isMoving ? 1 : 0.5 }} 
                  transition={{ duration: 0.8, ease: "easeOut" }}
                >
                  {/* Main Cursor Blob */}
                  <motion.g style={{ x: smoothCursorX, y: smoothCursorY }}>
                    <motion.g animate={{ rotate: [0, 360] }} transition={{ repeat: Infinity, duration: 12, ease: "linear" }}>
                      <motion.ellipse cx="0" cy="0" rx={200} ry={130} fill="white" animate={{ rotate: [0, -360] }} transition={{ repeat: Infinity, duration: 6, ease: "linear" }} />
                      <motion.ellipse cx="0" cy="0" rx={150} ry={180} fill="white" animate={{ rotate: [0, 360] }} transition={{ repeat: Infinity, duration: 7, ease: "linear" }} />
                    </motion.g>
                  </motion.g>

                  {/* Trailing Blob 1 */}
                  <motion.g style={{ x: smoothCursorX2, y: smoothCursorY2 }} animate={{ rotate: [0, 360] }} transition={{ repeat: Infinity, duration: 9, ease: "linear" }}>
                    <motion.ellipse cx="0" cy="0" rx={160} ry={100} fill="white" />
                  </motion.g>
                  
                  {/* Trailing Blob 2 */}
                  <motion.g style={{ x: smoothCursorX3, y: smoothCursorY3 }} animate={{ rotate: [0, -360] }} transition={{ repeat: Infinity, duration: 10, ease: "linear" }}>
                    <motion.ellipse cx="0" cy="0" rx={130} ry={80} fill="white" />
                  </motion.g>

                  {/* Trailing Blob 3 */}
                  <motion.g style={{ x: smoothCursorX4, y: smoothCursorY4 }} animate={{ rotate: [0, 360] }} transition={{ repeat: Infinity, duration: 11, ease: "linear" }}>
                    <motion.ellipse cx="0" cy="0" rx={90} ry={60} fill="white" />
                  </motion.g>
                </motion.g>

                {/* Autonomous Liquid Blobs revealing CAD */}
                {isAtTop && (
                  <>
                    <AutonomousBlob radius={80} duration={15} />
                    <AutonomousBlob radius={60} duration={20} delay={2} />
                    <AutonomousBlob radius={90} duration={25} delay={5} />
                    <AutonomousBlob radius={70} duration={18} delay={1} />
                    <AutonomousBlob radius={110} duration={22} delay={3} />
                    <AutonomousBlob radius={100} duration={28} delay={4} />
                    <AutonomousBlob radius={75} duration={19} delay={6} />
                    <AutonomousBlob radius={85} duration={24} delay={7} />
                  </>
                )}
              </g>
            </mask>
          </defs>
        </svg>

        {/* Base Layer was removed to match exact canvas dimness */}

        {/* Main Hover Reveal Layer using Liquid Mask */}
        <motion.div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none" 
          style={{ 
            mask: 'url(#liquidMask)', 
            WebkitMask: 'url(#liquidMask)',
            filter: 'drop-shadow(0px 0px 2px rgba(255,255,255,0.8)) drop-shadow(0px 0px 8px rgba(37,99,235,0.5))'
          }}
        >
           <img src="/robot_drawing_new.jpg" alt="Robot Drawing" className="w-full h-full object-cover drop-shadow-[0_0_30px_rgba(37,99,235,0.6)]" />
        </motion.div>
          </motion.div>


          {/* 3. Overlays (Header and Sponsor) */}
          <motion.header 
            className="absolute top-0 left-0 w-full z-50 flex justify-between items-center px-12 py-8 pointer-events-auto"
          >
          <div className="flex items-center gap-4">
            <img src="/branding/logo_4.jpeg" alt="Artemis Logo" className="w-12 h-12 opacity-80 mix-blend-screen object-contain" />
            <span className="font-header font-black text-white/60 tracking-widest text-3xl md:text-5xl">ARTEMIS</span>
          </div>
          <nav className="flex gap-8 text-xs uppercase tracking-[0.2em] text-white/50 font-bold">
            <a href="#about" onClick={(e) => handleFastScroll(e, '#about')} className="hover:text-white transition-colors">About</a>
            <a href="#timeline" onClick={(e) => handleFastScroll(e, '#timeline')} className="hover:text-white transition-colors">Timeline</a>
            <a href="#outreach" onClick={(e) => handleFastScroll(e, '#outreach')} className="hover:text-white transition-colors">Impact</a>
            <a href="#budget" onClick={(e) => handleFastScroll(e, '#budget')} className="hover:text-white transition-colors">Sponsor</a>
          </nav>
          </motion.header>
          {/* Sponsor Button */}
        <div className="absolute bottom-12 left-0 w-full flex justify-center z-30 pointer-events-auto">
          <a href="#sponsorship" onClick={(e) => handleFastScroll(e, '#sponsorship')} className="px-8 py-4 rounded-full text-xs font-bold uppercase tracking-widest transition-all duration-400 hover:scale-105 backdrop-blur-xl bg-white/10 hover:bg-white/20 text-white" style={{ border: '1px solid rgba(255,255,255,0.3)', boxShadow: '0 4px 30px rgba(0,0,0,0.5)' }}>
            Sponsor Now
          </a>
        </div>

        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
           2. ABOUT & TIMELINE (HORIZONTAL SCROLL)
           ══════════════════════════════════════════════════════ */}
      <section ref={horizontalScrollRef} id="about" className="relative w-full z-10" style={{ height: '450vh', scrollSnapAlign: 'start' }}>
        
        {/* Seamless Fade FROM Hero Section */}
        <div className="absolute top-0 left-0 w-full h-[40vh] bg-gradient-to-b from-[#05070B] to-transparent pointer-events-none z-30" />
        
        {/* Sticky container that holds the horizontal sliding content */}
        <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center">
          
          <motion.div style={{ x: xAboutToTimeline }} className="flex w-[200vw] h-full relative z-10">
            
            {/* Section background gradient & floating shapes (scrolling with the content) */}
            <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden" aria-hidden="true" style={{ width: '200vw' }}>
              {/* Starfield */}
              <div className="absolute inset-0 opacity-40" style={{ backgroundImage: 'radial-gradient(1px 1px at 20px 30px, #ffffff, rgba(0,0,0,0)), radial-gradient(1.5px 1.5px at 80px 140px, #ffffff, rgba(0,0,0,0)), radial-gradient(2px 2px at 150px 70px, #ffffff, rgba(0,0,0,0)), radial-gradient(1px 1px at 250px 200px, #ffffff, rgba(0,0,0,0)), radial-gradient(1px 1px at 300px 50px, #ffffff, rgba(0,0,0,0))', backgroundSize: '350px 350px' }} />
            </div>

            {/* --- ABOUT US PANE (100vw) --- */}
            <div className="w-[100vw] h-full flex flex-col justify-center px-6 py-12 md:py-24 relative z-10">
              
              {/* Scattered 3D Shapes */}
              <motion.div style={{ x: smoothXSlow, y: smoothYSlow }} animate={{ rotateX: 360, rotateY: 360 }} transition={{ duration: 40, repeat: Infinity, ease: 'linear' }} className="shape-3d shape-ring absolute top-[20%] left-[10%] w-48 h-48 opacity-30 z-0 pointer-events-none" />
              <motion.div style={{ x: smoothXFast, y: smoothYFast }} animate={{ rotateZ: 360 }} transition={{ duration: 30, repeat: Infinity, ease: 'linear' }} className="shape-3d shape-diamond absolute bottom-[15%] right-[15%] w-32 h-32 opacity-40 z-0 pointer-events-none" />
              
              <div className="max-w-7xl mx-auto w-full flex flex-col lg:flex-row gap-12 items-stretch h-[80vh]">
                
                {/* Left Side: About Text */}
                <div className="lg:w-1/2 flex flex-col space-y-6 glass-panel-deep p-10 transform-style preserve-3d shadow-2xl justify-between h-full relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-artemis-blue/10 rounded-full blur-3xl" />
                  
                  <div className="relative z-10">
                    <h2 className="text-4xl md:text-5xl font-header font-black text-white">
                      About Us
                    </h2>
                    <p className="text-base text-white/60 leading-relaxed font-light mt-6">
                      Founded in 2016, Team 6621 Artemis Robotics is the only FRC team in Columbia County. We represent Chatham High School not only as the only robotics team but as the sole technology and STEAM-centered club for the entire school. We allow students to learn as they desire, advance their STEAM interests, whether that be art, business, or stem there is a place for anyone and everyone at ARTEMIS.
                    </p>
                  </div>
                  
                  <div className="space-y-6 relative z-10 mt-auto">
                    {/* Gradient divider between About and Mission */}
                    <div className="h-px w-full" style={{ background: 'linear-gradient(90deg, transparent, rgba(37,99,235,0.4) 30%, rgba(249,115,22,0.4) 70%, transparent)' }} />
                    
                    {/* Mission Box (Bigger) */}
                    <div className="p-8 rounded-2xl relative overflow-hidden group hover:scale-[1.02] transition-transform duration-500" style={{ background: 'linear-gradient(135deg, rgba(249,115,22,0.1) 0%, rgba(37,99,235,0.08) 50%, rgba(249,115,22,0.05) 100%)', border: '1px solid rgba(255,255,255,0.08)', boxShadow: '0 8px 32px rgba(0,0,0,0.2)' }}>
                      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      <h3 className="text-2xl font-header font-bold mb-3 text-white">Our Mission</h3>
                      <p className="text-base text-white/70 italic leading-relaxed">
                        &quot;Our mission is to cultivate a welcoming environment centered on STEAM learning and values of gracious professionalism regardless of background.&quot;
                      </p>
                    </div>
                    
                    {/* About FRC Chip & Text */}
                    <div className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/10 backdrop-blur-md hover:bg-white/10 transition-colors duration-300">
                      <a href="https://www.firstinspires.org/robotics/frc" target="_blank" rel="noopener noreferrer" className="shrink-0 px-6 py-3 rounded-full text-xs font-bold uppercase tracking-widest transition-all duration-400 hover:scale-105" style={{ background: 'linear-gradient(135deg, rgba(37,99,235,0.25) 0%, rgba(249,115,22,0.2) 100%)', border: '1px solid rgba(255,255,255,0.2)', boxShadow: '0 4px 16px rgba(0,0,0,0.3)' }}>About FRC →</a>
                      <p className="text-[11px] text-white/50 font-light leading-snug">We compete in FIRST Robotics Competition, the world's largest high school robotics program.</p>
                    </div>
                  </div>
                </div>

                {/* Right Side: Photo and Stats */}
                <div className="lg:w-1/2 w-full flex flex-col gap-6 h-full">
                  {/* Team Photo */}
                  <div className="relative rounded-2xl overflow-hidden border border-white/[0.08] group flex-grow" style={{ boxShadow: '0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.06)' }}>
                    <img src="/photos/hero/team_with_robot.jpg" alt="Team 6621 Artemis with their robot" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#05070B] via-[#05070B]/40 to-transparent" />
                    <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(37,99,235,0.12) 0%, transparent 40%, transparent 60%, rgba(249,115,22,0.1) 100%)' }} />
                    <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at 30% 80%, rgba(37,99,235,0.15) 0%, transparent 50%)' }} />
                    <div className="absolute bottom-0 left-0 right-0 p-6 flex justify-between items-end">
                      <div>
                        <p className="text-[9px] uppercase tracking-widest text-white/40">Team 6621</p>
                        <p className="text-lg font-header font-bold">Artemis Robotics</p>
                      </div>
                      <span className="text-[9px] uppercase tracking-widest text-white/30">Chatham, NY</span>
                    </div>
                  </div>
                  {/* Compact stat row */}
                  <div className="grid grid-cols-3 gap-3 shrink-0" style={{ perspective: '800px' }}>
                    <div className="relative p-4 text-center rounded-xl overflow-hidden transition-all duration-500 hover:-translate-y-2 group cursor-default" style={{ background: 'linear-gradient(145deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 50%, rgba(255,255,255,0.04) 100%)', backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)', border: '1px solid rgba(255,255,255,0.12)', boxShadow: '0 8px 32px rgba(0,0,0,0.4), 0 2px 4px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.15), inset 0 -1px 0 rgba(255,255,255,0.03), inset 2px 0 8px rgba(255,255,255,0.02), inset -2px 0 8px rgba(255,255,255,0.02)' }}>
                      <div className="absolute top-0 left-[10%] right-[10%] h-[40%] rounded-b-full opacity-60" style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.12) 0%, transparent 100%)' }} />
                      <h4 className="text-2xl font-header font-black text-white relative z-10"><Counter to={2016} duration={1.5} /></h4>
                      <p className="text-[8px] uppercase tracking-widest text-white/40 mt-1 relative z-10">Founded</p>
                    </div>
                    <div className="relative p-4 text-center rounded-xl overflow-hidden transition-all duration-500 hover:-translate-y-2 group cursor-default" style={{ background: 'linear-gradient(145deg, rgba(37,99,235,0.12) 0%, rgba(37,99,235,0.03) 50%, rgba(37,99,235,0.06) 100%)', backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)', border: '1px solid rgba(37,99,235,0.18)', boxShadow: '0 8px 32px rgba(0,0,0,0.4), 0 2px 4px rgba(0,0,0,0.2), inset 0 1px 0 rgba(37,99,235,0.2), inset 0 -1px 0 rgba(37,99,235,0.04), inset 2px 0 8px rgba(37,99,235,0.03), inset -2px 0 8px rgba(37,99,235,0.03)' }}>
                      <div className="absolute top-0 left-[10%] right-[10%] h-[40%] rounded-b-full opacity-60" style={{ background: 'linear-gradient(180deg, rgba(37,99,235,0.15) 0%, transparent 100%)' }} />
                      <h4 className="text-2xl font-header font-black text-artemis-blue relative z-10"><Counter to={60} duration={2} format={(v) => `${v}%`} /></h4>
                      <p className="text-[8px] uppercase tracking-widest text-white/40 mt-1 relative z-10">New Members</p>
                    </div>
                    <div className="relative p-4 text-center rounded-xl overflow-hidden transition-all duration-500 hover:-translate-y-2 group cursor-default" style={{ background: 'linear-gradient(145deg, rgba(249,115,22,0.12) 0%, rgba(249,115,22,0.03) 50%, rgba(249,115,22,0.06) 100%)', backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)', border: '1px solid rgba(249,115,22,0.18)', boxShadow: '0 8px 32px rgba(0,0,0,0.4), 0 2px 4px rgba(0,0,0,0.2), inset 0 1px 0 rgba(249,115,22,0.2), inset 0 -1px 0 rgba(249,115,22,0.04), inset 2px 0 8px rgba(249,115,22,0.03), inset -2px 0 8px rgba(249,115,22,0.03)' }}>
                      <div className="absolute top-0 left-[10%] right-[10%] h-[40%] rounded-b-full opacity-60" style={{ background: 'linear-gradient(180deg, rgba(249,115,22,0.15) 0%, transparent 100%)' }} />
                      <h4 className="text-2xl font-header font-black text-stellar-orange relative z-10"><Counter to={5000} duration={2.5} format={(v) => `${v.toLocaleString()}+`} /></h4>
                      <p className="text-[8px] uppercase tracking-widest text-white/40 mt-1 relative z-10">Hours This Season</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* --- TIMELINE PANE (100vw) --- */}
            <div id="timeline" className="w-[100vw] h-full flex flex-col justify-center px-6 py-12 md:py-24 relative z-10" style={{ backgroundImage: 'radial-gradient(circle at center, rgba(255,255,255,0.03) 1px, transparent 1px)', backgroundSize: '24px 24px' }}>
              
              {/* Scattered 3D Shapes */}
              <motion.div style={{ x: smoothXFast, y: smoothYSlow }} animate={{ rotateX: 360, rotateY: -360 }} transition={{ duration: 35, repeat: Infinity, ease: 'linear' }} className="shape-3d shape-cube absolute top-[30%] right-[10%] w-40 h-40 opacity-30 z-0 pointer-events-none" />
              <motion.div style={{ x: smoothXSlow, y: smoothYFast }} animate={{ rotateZ: -360 }} transition={{ duration: 25, repeat: Infinity, ease: 'linear' }} className="shape-3d shape-pill absolute bottom-[20%] left-[10%] w-24 h-64 opacity-20 z-0 pointer-events-none" />
              
              <div className="text-center mb-16">
                <h2 className="text-4xl md:text-6xl font-header font-black text-white">
                  Our Timeline
                </h2>
              </div>

              {/* Centered Timeline layout */}
              <div className="relative w-full max-w-6xl mx-auto flex justify-between items-start mt-10">
                
                {/* Continuous timeline line behind nodes */}
                <div className="absolute left-0 right-0 top-[100px] h-px z-0" style={{ background: 'linear-gradient(90deg, transparent 5%, rgba(255,255,255,0.06) 15%, rgba(37,99,235,0.15) 50%, rgba(249,115,22,0.15) 80%, transparent 95%)' }} />

                {/* 2016 — Founded */}
                <div className="flex flex-col items-center w-[25%] px-4 z-10 relative">
                  <div className="relative p-6 rounded-xl mb-6 text-center w-full" style={{ background: 'linear-gradient(145deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%)', border: '1px solid rgba(255,255,255,0.08)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', boxShadow: '0 8px 32px rgba(0,0,0,0.3)' }}>
                    <h3 className="text-3xl font-header font-black text-white/30 mb-2">2016</h3>
                    <div className="w-8 h-px mx-auto mb-3" style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)' }} />
                    <p className="text-sm text-white/50 font-light">Team 6621 Founded</p>
                    <p className="text-xs text-white/30 mt-1">Chatham High School</p>
                  </div>
                  {/* Node */}
                  <div className="w-4 h-4 rounded-full border-2 border-white/20 bg-[#05070B]" />
                </div>

                {/* 2024 */}
                <div className="flex flex-col items-center w-[25%] px-4 z-10 relative">
                  <div className="relative p-6 rounded-xl mb-6 text-center w-full" style={{ background: 'linear-gradient(145deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%)', border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', boxShadow: '0 8px 32px rgba(0,0,0,0.3)' }}>
                    <h3 className="text-3xl font-header font-black text-white/40 mb-2">2024</h3>
                    <div className="w-8 h-px mx-auto mb-3" style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)' }} />
                    <ul className="text-sm text-white/60 space-y-2 font-light">
                      <li>Creativity Award</li>
                      <li>First Leadership Award Finalist <br/><span className="text-[10px] text-white/40">(Eion Henchey)</span></li>
                      <li>Safety All-Star <br/><span className="text-[10px] text-white/40">(Reed Fisch)</span></li>
                    </ul>
                  </div>
                  <div className="w-4 h-4 rounded-full border-2 border-white/30 bg-[#05070B]" />
                </div>

                {/* 2025 — Breakout year */}
                <div className="flex flex-col items-center w-[25%] px-4 z-10 relative">
                  <div className="relative p-6 rounded-xl mb-6 text-center w-full" style={{ background: 'linear-gradient(145deg, rgba(37,99,235,0.1) 0%, rgba(37,99,235,0.03) 100%)', border: '1px solid rgba(37,99,235,0.2)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', boxShadow: '0 8px 32px rgba(0,0,0,0.3), 0 0 40px rgba(37,99,235,0.06)' }}>
                    <h3 className="text-3xl font-header font-black text-artemis-blue mb-2">2025</h3>
                    <div className="w-8 h-px mx-auto mb-3" style={{ background: 'linear-gradient(90deg, transparent, rgba(37,99,235,0.5), transparent)' }} />
                    <ul className="text-sm text-white/70 space-y-2 font-light">
                      <li>Ranked #3 in New York State</li>
                      <li>New York Tech Valley Regional Winner</li>
                      <li>Worlds Alliance Captain <br/><span className="text-[10px] text-white/40">(Hopper Division)</span></li>
                      <li>Ballston Spa Off-Season Competition Finalist</li>
                    </ul>
                  </div>
                  <div className="w-5 h-5 rounded-full border-2 border-artemis-blue bg-[#05070B]" style={{ boxShadow: '0 0 12px rgba(37,99,235,0.4)' }} />
                </div>

                {/* 2026 — Current */}
                <div className="flex flex-col items-center w-[25%] px-4 z-10 relative">
                  <div className="relative p-6 rounded-xl mb-6 text-center w-full" style={{ background: 'linear-gradient(145deg, rgba(249,115,22,0.1) 0%, rgba(249,115,22,0.03) 100%)', border: '1px solid rgba(249,115,22,0.2)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', boxShadow: '0 8px 32px rgba(0,0,0,0.3), 0 0 40px rgba(249,115,22,0.06)' }}>
                    <h3 className="text-3xl font-header font-black text-stellar-orange mb-2">2026</h3>
                    <div className="w-8 h-px mx-auto mb-3" style={{ background: 'linear-gradient(90deg, transparent, rgba(249,115,22,0.5), transparent)' }} />
                    <ul className="text-sm text-white/70 space-y-2 font-light">
                      <li>Hudson Valley Regional <br/><span className="text-[10px] text-white/40">Alliance 3</span></li>
                      <li>Tech Valley Regional <br/><span className="text-[10px] text-white/40">Alliance 5</span></li>
                      <li>Safety All-Star <br/><span className="text-[10px] text-white/40">(Josiah Eugenio)</span></li>
                    </ul>
                  </div>
                  <div className="w-5 h-5 rounded-full border-2 border-stellar-orange bg-[#05070B]" style={{ boxShadow: '0 0 12px rgba(249,115,22,0.4)' }} />
                </div>

              </div>
            </div>
            
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
           5. OUTREACH CAROUSEL
           ══════════════════════════════════════════════════════ */}
      <section id="outreach" className="snap-section relative z-10 overflow-hidden">
        {/* Scattered 3D Shapes Interacting with Cursor and scrolling vertically */}
        <motion.div animate={{ x: [0, 30, -30, 0], y: [0, 20, -20, 0], rotateX: 360 }} transition={{ duration: 25, repeat: Infinity, ease: 'linear' }} style={{ x: smoothXSlow, y: smoothYSlow }} whileHover={{ scale: 1.2, cursor: 'pointer' }} className="shape-3d shape-sphere absolute top-[10%] left-[5%] w-32 h-32 opacity-50 z-0 pointer-events-auto" />
        <motion.div animate={{ x: [0, 40, -20, 0], y: [0, -30, 20, 0], rotateY: 360 }} transition={{ duration: 20, repeat: Infinity, ease: 'linear' }} style={{ x: smoothXFast, y: smoothYFast }} whileHover={{ scale: 1.2, cursor: 'pointer' }} className="shape-3d shape-ring absolute bottom-[20%] right-[10%] w-40 h-40 opacity-40 z-0 pointer-events-auto" />
        <motion.div animate={{ rotateZ: 360 }} transition={{ duration: 40, repeat: Infinity, ease: 'linear' }} style={{ x: smoothX, y: smoothY }} className="shape-3d shape-pill absolute top-[50%] right-[5%] w-20 h-56 opacity-30 z-0 pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-6 w-full text-center mb-12 relative z-10">
          <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-artemis-blue mb-2 block">
            04 / Community
          </span>
          <h2 className="text-4xl md:text-6xl font-header font-black text-3d-glow">
            Outreach Programs
          </h2>
        </div>
        
        {/* Infinite CSS horizontal scroller */}
        <div className="relative w-full flex items-center h-[50vh] overflow-x-auto snap-x snap-mandatory hide-scrollbars py-8 px-4" style={{ perspective: '1000px' }}>
          <div className="flex gap-8 px-[10vw]">
            {OUTREACH_CARDS.map((card, idx) => (
              <div key={idx} className="snap-center shrink-0 w-[80vw] md:w-[400px] h-full glass-panel-deep group relative overflow-hidden transform-style preserve-3d hover:translate-z-[50px] transition-transform duration-700 flex flex-col">
                <div className="h-48 w-full overflow-hidden shrink-0">
                  <img src={card.image} alt={card.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                </div>
                <div className="p-8 flex flex-col flex-grow">
                  <span className="text-[9px] font-bold tracking-widest uppercase text-stellar-orange mb-3">{card.tag}</span>
                  <h3 className="text-2xl font-header font-bold mb-4">{card.title}</h3>
                  <p className="text-xs text-white/50 leading-relaxed font-light flex-grow">{card.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <p className="text-center text-[10px] text-white/30 uppercase tracking-widest mt-4">Scroll Horizontally to explore</p>
      </section>

      {/* ══════════════════════════════════════════════════════
           6. BUDGET & SPONSORS
           ══════════════════════════════════════════════════════ */}
      <section id="budget" className="snap-section relative z-10 overflow-hidden">
        {/* Scattered 3D Shapes Interacting with Cursor and scrolling vertically */}
        <motion.div animate={{ x: [0, 25, -15, 0], y: [0, -25, 15, 0] }} transition={{ duration: 15, repeat: Infinity, ease: 'linear' }} style={{ x: smoothX, y: smoothY, animationDelay: '3s', animationDuration: '14s' }} whileHover={{ scale: 1.2, rotateX: 180, rotateY: 180, cursor: 'pointer' }} whileTap={{ scale: 0.8, rotateZ: 360, borderRadius: '100%' }} className="shape-3d shape-cube absolute top-[40%] left-[8%] w-24 h-24 opacity-50 z-0 pointer-events-auto" />
        <motion.div animate={{ x: [0, -30, 30, 0], y: [0, 40, -20, 0] }} transition={{ duration: 22, repeat: Infinity, ease: 'linear' }} style={{ x: smoothXSlow, y: smoothYFast, animationDelay: '0s', animationDuration: '12s' }} whileHover={{ scale: 1.2, rotateX: 180, rotateY: 180, cursor: 'pointer' }} whileTap={{ scale: 0.8, rotateZ: 360, borderRadius: '100%' }} className="shape-3d shape-sphere absolute bottom-[15%] left-[85%] w-36 h-36 opacity-60 z-0 pointer-events-auto" />
        
        <div className="max-w-7xl mx-auto px-6 w-full h-full flex flex-col lg:flex-row gap-12 items-center justify-center relative z-10">
          
          {/* Budget Breakdown 3D Visual */}
          <div className="lg:w-1/2 w-full space-y-8">
            <div>
              <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-stellar-orange mb-2 block">
                05 / Alliance
              </span>
              <h2 className="text-4xl md:text-5xl font-header font-black text-3d-glow mb-4">
                Budget Breakdown
              </h2>
              <p className="text-sm text-white/50 font-light max-w-lg mb-8">
                42% of students in our high school are on free or reduced lunch. We refuse to charge our students a single cent to participate. We believe that talent is universal but opportunity is not.
              </p>
            </div>

            <div className="glass-panel-deep p-8 relative overflow-hidden">
              <div className="absolute -right-20 -top-20 w-64 h-64 bg-artemis-blue/10 rounded-full blur-3xl" />
              <div className="flex justify-between items-end mb-8 border-b border-white/10 pb-4">
                <span className="text-xs text-white/40 uppercase tracking-widest">Target Goal</span>
                <span className="text-5xl font-header font-black text-white text-3d-glow">
                  $<Counter to={65000} duration={2} format={(v) => v.toLocaleString()} />
                </span>
              </div>
              <div className="space-y-6">
                {BUDGET_ITEMS.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between group">
                    <div className="flex items-center gap-4">
                      <div className={`w-3 h-3 rounded-full ${item.color} shadow-[0_0_10px_currentColor] group-hover:scale-150 transition-transform`} />
                      <span className="text-xs text-white/70">{item.label}</span>
                    </div>
                    <span className="text-sm font-bold text-white/90">
                      $<Counter to={item.amount} duration={2} format={(v) => v.toLocaleString()} />
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Tiers & Interest Form */}
          <div className="lg:w-1/2 w-full flex flex-col gap-6">
            <div className="grid grid-cols-2 gap-4">
              {TIERS.slice(0,2).map(tier => (
                <div key={tier.name} 
                  className={`glass-panel p-6 cursor-pointer border transition-all duration-300 ${
                    selectedTier === tier.name ? 'border-artemis-blue bg-artemis-blue/10 shadow-[0_0_30px_rgba(37,99,235,0.2)] scale-105' : 'border-white/5 hover:border-white/20'
                  } ${tier.name === 'Apollo' ? 'relative overflow-hidden' : ''}`}
                  onClick={() => setSelectedTier(tier.name)}
                >
                  {tier.name === 'Apollo' && (
                    <div className="absolute inset-0 bg-gradient-to-br from-artemis-blue/20 to-transparent animate-pulse" />
                  )}
                  <h3 className="text-xl font-header font-bold mb-1 relative z-10">{tier.name}</h3>
                  <p className="text-2xl font-black text-white/80 relative z-10">{tier.price}</p>
                </div>
              ))}
              {TIERS.slice(2,4).map(tier => (
                <div key={tier.name} 
                  className={`glass-panel p-6 cursor-pointer border transition-all duration-300 ${
                    selectedTier === tier.name ? 'border-stellar-orange bg-stellar-orange/10 shadow-[0_0_30px_rgba(249,115,22,0.2)] scale-105' : 'border-white/5 hover:border-white/20'
                  }`}
                  onClick={() => setSelectedTier(tier.name)}
                >
                  <h3 className="text-xl font-header font-bold mb-1">{tier.name}</h3>
                  <p className="text-2xl font-black text-white/80">{tier.price}</p>
                </div>
              ))}
            </div>

            <div className="glass-panel p-8">
              {!contactSuccess ? (
                <form onSubmit={handleContactSubmit} className="flex flex-col gap-4">
                  <h3 className="text-lg font-header font-bold mb-2">Sponsor the {selectedTier} Tier</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <input required type="text" placeholder="Company / Name" className="bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-xs text-white focus:outline-none focus:border-artemis-blue transition-colors" />
                    <input required type="email" placeholder="Email Address" className="bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-xs text-white focus:outline-none focus:border-artemis-blue transition-colors" />
                  </div>
                  <button type="submit" disabled={isSubmittingContact} className="w-full py-4 rounded-lg bg-gradient-to-r from-artemis-blue to-blue-600 font-bold uppercase text-[10px] tracking-widest hover:shadow-[0_0_20px_rgba(37,99,235,0.4)] transition-shadow">
                    {isSubmittingContact ? "Processing..." : "Submit Interest to fischers@chatham.k12.ny.us"}
                  </button>
                </form>
              ) : (
                <div className="text-center py-8">
                  <div className="text-3xl mb-4">🚀</div>
                  <h3 className="text-xl font-bold mb-2">Transmission Sent</h3>
                  <p className="text-xs text-white/50">We'll be in contact shortly with invoicing details.</p>
                </div>
              )}
            </div>
            
            {/* Simple Sponsor Text List */}
            <div className="pt-6 border-t border-white/10">
              <p className="text-[9px] uppercase tracking-widest text-white/30 mb-3 text-center">Current Active Sponsors</p>
              <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 max-h-32 overflow-y-auto hide-scrollbars">
                {SPONSOR_LOGOS.map((sponsor, i) => (
                  <span key={i} className="text-[10px] text-white/40">{sponsor}</span>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
           7. 3D FOOTER
           ══════════════════════════════════════════════════════ */}
      <section id="contact" className="snap-section relative z-10 !min-h-[50vh]">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-artemis-blue/5 z-0" />
        <footer className="w-full mt-auto relative z-10 bg-black/80 backdrop-blur-xl border-t border-white/10">
          <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-3 gap-12">
            
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-4">
                <img src="/branding/logo_4.jpeg" alt="Logo" className="w-10 h-10 object-contain mix-blend-screen" />
                <div>
                  <h3 className="font-header font-black text-xl tracking-widest text-3d">ARTEMIS.6621</h3>
                  <p className="text-[9px] uppercase tracking-widest text-white/40">Chatham High School Robotics</p>
                </div>
              </div>
              <p className="text-xs text-white/50 font-light max-w-xs mt-4">
                50 Woodbridge Ave, Chatham, NY 12037<br/><br/>
                Mrs. Fischer - Lead Mentor<br/>
                Mr. Fischer - Tech & Code Mentor
              </p>
            </div>

            <div className="flex flex-col gap-4 md:items-center">
              <h4 className="text-[10px] uppercase tracking-widest text-white/40 font-bold mb-2">Navigation</h4>
              <div className="flex flex-col gap-3">
                {NAV_LINKS.map(link => (
                  <a key={link.label} href={link.href} className="text-xs text-white/60 hover:text-white transition-colors">{link.label}</a>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-4 md:items-end">
              <h4 className="text-[10px] uppercase tracking-widest text-white/40 font-bold mb-2">Comm Link</h4>
              <a href="mailto:fischers@chatham.k12.ny.us" className="text-sm font-bold text-artemis-blue hover:text-white transition-colors">fischers@chatham.k12.ny.us</a>
              <div className="flex gap-4 mt-6">
                <a href="https://www.instagram.com/artemis_6621/" target="_blank" className="w-10 h-10 rounded-full glass-panel flex items-center justify-center hover:bg-white/10 transition-colors">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
                </a>
                <a href="https://www.youtube.com/@ArtemisFrc6621" target="_blank" className="w-10 h-10 rounded-full glass-panel flex items-center justify-center hover:bg-white/10 transition-colors">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                </a>
                <a href="https://www.thebluealliance.com/team/6621" target="_blank" className="w-10 h-10 rounded-full glass-panel flex items-center justify-center hover:bg-white/10 transition-colors font-bold text-[9px] uppercase">
                  TBA
                </a>
              </div>
            </div>
          </div>
          <div className="w-full border-t border-white/5 py-6 text-center">
            <p className="text-[9px] uppercase tracking-widest text-white/20">&copy; {new Date().getFullYear()} Team 6621. All systems nominal.</p>
          </div>
        </footer>
      </section>
      
      {/* Hide scrollbars class utility injected inline or global */}
      <style dangerouslySetInnerHTML={{__html: `
        .hide-scrollbars::-webkit-scrollbar { display: none; }
        .hide-scrollbars { -ms-overflow-style: none; scrollbar-width: none; }
      `}} />
    </main>
  );
}
