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

const EXPENSES = [
  { label: "Robot & Field", amount: 4050 },
  { label: "Competition Season", amount: 59600 },
  { label: "Off-Season Events", amount: 645 },
  { label: "Merchandise", amount: 1100 },
];

const FUNDING_SOURCES = [
  { label: "District Funding", amount: 10000 },
  { label: "Grants", amount: 3500 },
  { label: "Current Sponsors", amount: 8500 },
  { label: "Fundraising Events", amount: 2000 },
];

// ─── OUTREACH DATA ──────────────────────────────────────────────
const OUTREACH_CARDS = [
  {
    tag: "Origami for Good",
    title: "1,000 Cranes Initiative",
    desc: "We folded over 1,000 origami cranes to donate to local hospitals and created custom team-colored origami kits for every team at our competitions - forging meaningful connections across the FRC community.",
    image: "/photos/outreach/origami_for_good.webp",
  },
  {
    tag: "STEAM Advocacy",
    title: "NY State STEAM Day",
    desc: "Advocated for STEAM grants at New York State STEAM Day alongside Assembly Member Didi Barrett. We demonstrated our robot in action and networked with teams statewide to champion the importance of STEAM education.",
    image: "/photos/outreach/steam_day_assembly.webp",
  },
  {
    tag: "Mentorship",
    title: "Team 7504 Cybearbots",
    desc: "Met with Cybearbots to advise on fundraising, lead acquisition, and strategy. Helped increase their funding from $15k to $30k in one year. Shared scouting and strategic data at Tech Valley.",
    image: "/photos/outreach/mentorship_growth.webp",
  },
  {
    tag: "Safety & Hardware Fixes",
    title: "Battery Clips & Safety Kits",
    desc: "At each competition we handed out 3D printed battery clips to prevent batteries from disconnecting, and distributed free community safety kits to every team, earning us Safety All-Star awards.",
    image: "/photos/outreach/community_fair_booth.webp",
  },
  {
    tag: "Community",
    title: "Wellness & Science Fairs",
    desc: "Gave demonstrations to our community and illustrated the importance of robotics at the Chatham Wellness Fair, Science Fair, and Learning Fair.",
    image: "/photos/outreach/steam_day_assembly.webp",
  }
];

// ─── OUTREACH PARALLAX COMPONENT ────────────────────────────────
const OutreachParallaxCard = ({ 
  card, 
  index, 
  totalCards, 
  scrollYProgress 
}: { 
  card: any, 
  index: number, 
  totalCards: number, 
  scrollYProgress: any 
}) => {
  const itemsPerRow = 3;
  const totalRows = Math.ceil(totalCards / itemsPerRow);
  const rowIndex = Math.floor(index / itemsPerRow);
  const colIndex = index % itemsPerRow;
  
  const L = 1.0 / totalRows;
  const R_start = rowIndex * L;
  
  const startPop = R_start + colIndex * (0.15 * L);
  const endPop = startPop + (0.15 * L);
  
  const startExit = R_start + 0.75 * L;
  const endExit = R_start + 1.0 * L;

  // Ensure strict monotonically increasing inputs for Framer Motion
  const i0 = 0;
  const i1 = Math.max(0.0001, startPop);
  const i2 = Math.max(i1 + 0.0001, endPop);
  const i3 = Math.max(i2 + 0.0001, startExit);
  const i4 = Math.min(0.9998, Math.max(i3 + 0.0001, endExit));
  const i5 = 1;

  const isLastRow = rowIndex === totalRows - 1;

  // Scale: stays mostly flat, tiny shrink on enter/exit
  const scale = useTransform(
    scrollYProgress,
    [i0, i1, i2, i3, i4, i5],
    isLastRow
      ? [0.9, 0.9, 1.0, 1.0, 1.0, 1.0]
      : [0.9, 0.9, 1.0, 1.0, 0.9, 0.9]
  );
  
  // Enter from bottom, hold, then exit through the top (traditional scroll)
  const y = useTransform(
    scrollYProgress,
    [i0, i1, i2, i3, i4, i5],
    isLastRow
      ? ["120%", "120%", "0%", "0%", "0%", "0%"]
      : ["120%", "120%", "0%", "0%", "-120%", "-120%"]
  );
  
  // Opacity: fade in as it rises, hold, then fade out as it rises away
  const opacity = useTransform(
    scrollYProgress,
    [i0, i1, i2, i3, i4, i5],
    isLastRow
      ? [0, 0, 1, 1, 1, 1]
      : [0, 0, 1, 1, 0, 0]
  );

  return (
    <motion.div 
      style={{ scale, opacity, y, transformOrigin: 'center center' }} 
      className="absolute top-1/2 left-0 -translate-y-1/2 w-full h-[450px] flex flex-col justify-end rounded-[2rem] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/10 group"
    >
      <img src={card.image} alt={card.title} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#05070B] via-[#05070B]/50 to-transparent opacity-90" />
      
      <div className="relative z-10 p-6 md:p-8 backdrop-blur-md bg-white/[0.03] border-t border-white/10 mt-auto">
        <span className="inline-block px-4 py-1.5 rounded-full bg-stellar-orange/20 text-stellar-orange text-xs md:text-sm font-bold tracking-widest uppercase mb-4 border border-stellar-orange/30 shadow-[0_0_15px_rgba(251,146,60,0.3)]">{card.tag}</span>
        <h3 className="h3 font-bold mb-3 text-white">{card.title}</h3>
        <p className="text-xs text-white/70 leading-relaxed font-light">{card.desc}</p>
      </div>
    </motion.div>
  );
};

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

const SPONSOR_LOGO_IMAGES = [
  "/sponsors/bank_greene_county.webp", "/sponsors/chatham_bookstore.webp", "/sponsors/chatham_lions.webp",
  "/sponsors/chatham_pub.webp", "/sponsors/checkered_flag.webp", "/sponsors/craftech.webp",
  "/sponsors/gene_haas.webp", "/sponsors/ghent_one_stop.webp", "/sponsors/gould_martial_arts.webp",
  "/sponsors/hawthorne_valley.webp", "/sponsors/herringtons.webp", "/sponsors/kneller_insurance.webp",
  "/sponsors/meltz_lumber.webp", "/sponsors/metzwood_insurance.webp", "/sponsors/new_concord_bnb.webp",
  "/sponsors/roots_holistic.webp", "/sponsors/samascott.webp", "/sponsors/sei_design.webp",
  "/sponsors/simmons_automotive.webp", "/sponsors/spencertown_academy.webp", "/sponsors/stewarts.webp",
  "/sponsors/stonykill_coffee.webp", "/sponsors/swaying_pine.webp", "/sponsors/taconic_engineering.webp"
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
  
  const [isMobile, setIsMobile] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ container: containerRef });

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (isLoading) {
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
      document.body.style.touchAction = 'none';
      
      const preventDefault = (e: Event) => e.preventDefault();
      window.addEventListener('wheel', preventDefault, { passive: false });
      window.addEventListener('touchmove', preventDefault, { passive: false });
      
      return () => { 
        document.body.style.overflow = ''; 
        document.documentElement.style.overflow = '';
        document.body.style.touchAction = '';
        window.removeEventListener('wheel', preventDefault);
        window.removeEventListener('touchmove', preventDefault);
      };
    }
  }, [isLoading]);

  const handleFastScroll = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();
    
    // Correct ID for Sponsor button mismatch
    const actualTargetId = targetId === '#sponsorship' ? '#budget' : targetId;
    
    const container = containerRef.current;
    if (!container) return;
    
    let targetPosition = 0;
    
    // Special handling for the horizontal timeline section
    if (actualTargetId === '#timeline') {
      if (isMobile) {
        const target = document.querySelector('#timeline') as HTMLElement;
        if (!target) return;
        targetPosition = target.offsetTop;
      } else {
        const aboutSection = document.querySelector('#about') as HTMLElement;
        if (!aboutSection) return;
        // Scroll to exactly 36.6% progress (1.1 * viewport height) to align timeline left edge
        targetPosition = aboutSection.offsetTop + 1.1 * window.innerHeight;
      }
    } else if (actualTargetId === '#outreach') {
      if (isMobile) {
        const target = document.querySelector('#outreach') as HTMLElement;
        if (!target) return;
        targetPosition = target.offsetTop;
      } else {
        const target = document.querySelector(actualTargetId) as HTMLElement;
        if (!target) return;
        // Scroll partially into the outreach container so the first cards are visible
        targetPosition = target.offsetTop + 1.6 * window.innerHeight;
      }
    } else {
      const target = document.querySelector(actualTargetId) as HTMLElement;
      if (!target) return;
      targetPosition = target.offsetTop;
    }
    
    const startPosition = container.scrollTop;
    const distance = targetPosition - startPosition;
    const duration = 1200; // Smooth slower scroll (1200ms)
    let start: number | null = null;
    
    const step = (timestamp: number) => {
      if (!start) start = timestamp;
      const progress = timestamp - start;
      const easeInOutCubic = progress < duration / 2 
        ? 4 * Math.pow(progress / duration, 3) 
        : 1 - Math.pow(-2 * (progress / duration) + 2, 3) / 2;
        
      container.scrollTo(0, startPosition + distance * Math.min(easeInOutCubic, 1));
      if (progress < duration) {
        requestAnimationFrame(step);
      }
    };
    requestAnimationFrame(step);
  };

  const cursorX = useMotionValue(-1000);
  const cursorY = useMotionValue(-1000);
  const smoothCursorX = useSpring(cursorX, { stiffness: 150, damping: 12, mass: 1 });
  const smoothCursorY = useSpring(cursorY, { stiffness: 150, damping: 12, mass: 1 });

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    const handleMouseMove = (e: MouseEvent) => {
      setIsMoving(true);
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        setIsMoving(false);
      }, 200);

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
  }, [cursorX, cursorY]);

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
    
    // Add additional critical images to preload
    const additionalImages = [
      '/robot_drawing_new.webp',
      '/timeline/1.webp',
      '/timeline/3.webp',
      '/timeline/2025_1_new.jpg',
      '/timeline/2025_2_new.jpg',
      '/timeline/2026_1.jpg',
      '/branding/logo_4.webp'
    ];
    
    const totalToLoad = frameCount + additionalImages.length;
    let loadedCount = 0;
    
    const currentImages: HTMLImageElement[] = [];
    
    let minimumTimeElapsed = false;
    let allAssetsLoaded = false;

    // Force the beautiful 3D loading screen to be visible for at least 3.5 seconds
    setTimeout(() => {
      minimumTimeElapsed = true;
      if (allAssetsLoaded) setIsLoading(false);
    }, 3500);

    const onAssetLoaded = () => {
      loadedCount++;
      if (loadedCount >= totalToLoad) {
        allAssetsLoaded = true;
        if (minimumTimeElapsed) setIsLoading(false);
      }
    };

    for (let i = 1; i <= frameCount; i++) {
      const img = new Image();
      const paddedIndex = i.toString().padStart(3, '0');
      img.src = i === 1 ? '/hero_starting_frame.webp' : `/hero_frames/${paddedIndex}.webp`;
      
      img.onload = () => {
        onAssetLoaded();
        if (i === 1 && canvasRef.current) {
          const ctx = canvasRef.current.getContext('2d');
          if (ctx) ctx.drawImage(img, 0, 0, 1920, 1080);
        }
      };
      img.onerror = onAssetLoaded;
      currentImages.push(img);
    }

    additionalImages.forEach(src => {
      const img = new Image();
      img.src = src;
      img.onload = onAssetLoaded;
      img.onerror = onAssetLoaded;
    });

    imagesRef.current = currentImages;

    // Fallback timeout to ensure we don't get stuck forever
    const fallbackTimeout = setTimeout(() => {
      setIsLoading(false);
    }, 8000);

    return () => clearTimeout(fallbackTimeout);
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
  
  // Vertical Scroll for Outreach Parallax
  const outreachScrollRef = useRef<HTMLElement>(null);
  const { scrollYProgress: outreachScrollYProgress } = useScroll({
    target: outreachScrollRef,
    container: containerRef,
    offset: ["start start", "end end"]
  });
  const xAboutToTimelineFallback = useMotionValue("0vw");
  const yAboutToTimelineFallback = useMotionValue("0vh");
  
  const xAboutToTimelineVal = useTransform(
    horizontalScrollYProgress, 
    [0, 0.15, 0.75, 1], 
    ["0vw", "-5vw", "-220vw", "-220vw"]
  );
  const yAboutToTimelineVal = useTransform(
    horizontalScrollYProgress,
    [0, 0.75, 1],
    ["0vh", "0vh", "-10vh"]
  );

  const xAboutToTimeline = isMobile ? xAboutToTimelineFallback : xAboutToTimelineVal;
  const yAboutToTimeline = isMobile ? yAboutToTimelineFallback : yAboutToTimelineVal;

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
    <main ref={containerRef} className={`${isLoading ? 'fixed inset-0 overflow-hidden pointer-events-none' : 'snap-container'} text-white font-sans overflow-x-hidden w-full h-screen`}>


            {/* ══════════════════════════════════════════════════════
           1. HERO & ZIP ANIMATION (Combined Sticky Scrolling)
           ══════════════════════════════════════════════════════ */}
            <AnimatePresence>
        {isLoading && (
          <motion.div 
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black text-white pointer-events-auto"
            style={{ touchAction: 'none' }}
            onWheel={(e) => e.stopPropagation()}
            onTouchMove={(e) => e.stopPropagation()}
          >
            {/* Starry Background */}
            <div className="absolute inset-0 z-0 overflow-hidden bg-black">
              <div className="absolute inset-0 opacity-40 starfield" />
            </div>
            
            {/* Artemis Logo Floating Above */}
            <div className="relative z-20 mb-8 w-40 h-40 flex items-center justify-center">
              <img src="/branding/logo_4.webp" alt="Artemis Loading" className="w-full h-full animate-pulse object-contain" />
            </div>

            {/* 3D Solar System Container */}
            <div className="relative z-10 w-full max-w-[800px] h-[500px] flex items-center justify-center perspective-[1200px]">
              
              {/* Deep space glow behind solar system */}
              <div className="absolute w-[400px] h-[400px] rounded-full bg-orange-500/10 blur-[100px]" />

              {/* The Sun */}
              <div className="relative z-20 w-24 h-24 rounded-full animate-pulse flex items-center justify-center" style={{ background: 'radial-gradient(circle at 40% 35%, #ffffff 0%, #fef08a 20%, #eab308 60%, #ea580c 100%)', boxShadow: '0 0 120px 30px rgba(234,88,12,0.6), 0 0 60px 15px rgba(250,204,21,0.3), inset 0 0 20px rgba(255,255,255,0.8)' }}>
                {/* Solar Flares/Corona */}
                <motion.div animate={{ rotate: 360, scale: [1, 1.05, 1] }} transition={{ duration: 10, repeat: Infinity, ease: "linear" }} className="absolute inset-[-20%] rounded-full border-[2px] border-dashed border-yellow-500/30 opacity-50" />
                <motion.div animate={{ rotate: -360, scale: [1, 1.1, 1] }} transition={{ duration: 15, repeat: Infinity, ease: "linear" }} className="absolute inset-[-40%] rounded-full border-[1px] border-dotted border-orange-500/20 opacity-30" />
              </div>

              {/* Orbit 1: Mercury */}
              <div className="absolute w-[180px] h-[180px] transform-style preserve-3d" style={{ transform: 'rotateX(75deg) rotateY(10deg)' }}>
                <motion.div animate={{ rotateZ: 360 }} transition={{ duration: 4, repeat: Infinity, ease: "linear" }} className="w-full h-full border border-white/10 rounded-full transform-style preserve-3d">
                  <motion.div animate={{ rotateZ: -360 }} transition={{ duration: 4, repeat: Infinity, ease: "linear" }} className="absolute top-0 left-1/2 -ml-2 -mt-2 w-4 h-4 transform-style preserve-3d">
                    <div className="w-full h-full rounded-full" style={{ transform: 'rotateX(-75deg)', background: 'radial-gradient(circle at 35% 30%, #e5e7eb 0%, #a1a1aa 40%, #52525b 75%, #18181b 100%)', boxShadow: '0 0 8px 2px rgba(161,161,170,0.4), inset -2px -2px 4px rgba(0,0,0,0.8), inset 1px 1px 3px rgba(255,255,255,0.3)' }} />
                  </motion.div>
                </motion.div>
              </div>

              {/* Orbit 2: Earth with Moon */}
              <div className="absolute w-[320px] h-[320px] transform-style preserve-3d" style={{ transform: 'rotateX(70deg) rotateY(-5deg)' }}>
                <motion.div animate={{ rotateZ: 360 }} transition={{ duration: 10, repeat: Infinity, ease: "linear" }} className="w-full h-full border border-white/15 rounded-full transform-style preserve-3d">
                  <motion.div animate={{ rotateZ: -360 }} transition={{ duration: 10, repeat: Infinity, ease: "linear" }} className="absolute top-0 left-1/2 -ml-3 -mt-3 w-6 h-6 transform-style preserve-3d">
                    {/* Earth */}
                    <div className="w-full h-full rounded-full" style={{ transform: 'rotateX(-70deg)', background: 'radial-gradient(circle at 35% 30%, #93c5fd 0%, #3b82f6 25%, #1d4ed8 55%, #064e3b 80%, #020617 100%)', boxShadow: '0 0 15px 4px rgba(59,130,246,0.5), 0 0 6px 2px rgba(96,165,250,0.3), inset -2px -2px 6px rgba(0,0,0,0.8), inset 1px 1px 4px rgba(147,197,253,0.4)' }}>
                       <motion.div animate={{ rotate: 360 }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }} className="absolute inset-0 rounded-full border-[1px] border-dotted border-white/40" />
                    </div>
                    {/* Moon Orbit */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 transform-style preserve-3d" style={{ transform: 'rotateX(60deg)' }}>
                      <motion.div animate={{ rotateZ: 360 }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }} className="w-full h-full rounded-full border border-white/10 transform-style preserve-3d">
                        <motion.div animate={{ rotateZ: -360 }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }} className="absolute top-0 left-1/2 -ml-1 -mt-1 w-2 h-2 transform-style preserve-3d">
                          <div className="w-full h-full rounded-full" style={{ transform: 'rotateX(-60deg) rotateX(-70deg)', background: 'radial-gradient(circle at 35% 30%, #e5e7eb 0%, #9ca3af 60%, #374151 100%)', boxShadow: '0 0 4px 1px rgba(156,163,175,0.3), inset -1px -1px 2px rgba(0,0,0,0.6)' }} />
                        </motion.div>
                      </motion.div>
                    </div>
                  </motion.div>
                </motion.div>
              </div>

              {/* Orbit 3: Mars */}
              <div className="absolute w-[460px] h-[460px] transform-style preserve-3d" style={{ transform: 'rotateX(72deg) rotateY(15deg)' }}>
                <motion.div animate={{ rotateZ: 360 }} transition={{ duration: 18, repeat: Infinity, ease: "linear" }} className="w-full h-full border border-white/10 rounded-full transform-style preserve-3d">
                  <motion.div animate={{ rotateZ: -360 }} transition={{ duration: 18, repeat: Infinity, ease: "linear" }} className="absolute top-0 left-1/2 -ml-2.5 -mt-2.5 w-5 h-5 transform-style preserve-3d">
                    <div className="w-full h-full rounded-full" style={{ transform: 'rotateX(-72deg)', background: 'radial-gradient(circle at 35% 30%, #fca5a5 0%, #ef4444 30%, #b91c1c 65%, #450a0a 100%)', boxShadow: '0 0 12px 3px rgba(239,68,68,0.4), 0 0 5px 2px rgba(252,165,165,0.2), inset -2px -2px 6px rgba(0,0,0,0.8), inset 1px 1px 3px rgba(252,165,165,0.3)' }} />
                  </motion.div>
                </motion.div>
              </div>

              {/* Asteroid Belt */}
              <div className="absolute w-[580px] h-[580px] transform-style preserve-3d" style={{ transform: 'rotateX(70deg)' }}>
                <motion.div animate={{ rotateZ: -360 }} transition={{ duration: 40, repeat: Infinity, ease: "linear" }} className="w-full h-full rounded-full border-[10px] border-dotted border-gray-500/20 opacity-50" />
                <motion.div animate={{ rotateZ: 360 }} transition={{ duration: 50, repeat: Infinity, ease: "linear" }} className="absolute inset-2 rounded-full border-[6px] border-dashed border-gray-600/30 opacity-40" />
              </div>

              {/* Orbit 4: Saturn with Rings */}
              <div className="absolute w-[750px] h-[750px] transform-style preserve-3d" style={{ transform: 'rotateX(76deg) rotateY(-8deg)' }}>
                <motion.div animate={{ rotateZ: 360 }} transition={{ duration: 35, repeat: Infinity, ease: "linear" }} className="w-full h-full border border-white/5 rounded-full transform-style preserve-3d">
                  <motion.div animate={{ rotateZ: -360 }} transition={{ duration: 35, repeat: Infinity, ease: "linear" }} className="absolute top-0 left-1/2 -ml-6 -mt-6 w-12 h-12 transform-style preserve-3d">
                    <div className="relative w-full h-full flex items-center justify-center transform-style preserve-3d" style={{ transform: 'rotateX(-76deg)' }}>
                      {/* Planet Body */}
                      <div className="absolute w-10 h-10 rounded-full z-10" style={{ background: 'radial-gradient(circle at 35% 30%, #fef08a 0%, #fcd34d 25%, #d97706 55%, #78350f 100%)', boxShadow: '0 0 15px 4px rgba(217,119,6,0.4), 0 0 6px 2px rgba(252,211,77,0.2), inset -3px -3px 8px rgba(0,0,0,0.8), inset 1px 1px 4px rgba(254,240,138,0.4)' }} />
                      {/* Saturn Rings */}
                      <motion.div animate={{ rotateX: [60, 70, 60], rotateY: [10, -10, 10] }} transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }} className="absolute w-20 h-20 rounded-full border-[4px] border-amber-200/40 z-0 transform-style preserve-3d" />
                      <motion.div animate={{ rotateX: [60, 70, 60], rotateY: [10, -10, 10] }} transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }} className="absolute w-24 h-24 rounded-full border-[2px] border-amber-400/20 z-0 transform-style preserve-3d" />
                    </div>
                  </motion.div>
                </motion.div>
              </div>

            </div>

            {/* Loading Text */}
            <div className="absolute bottom-20 z-10 flex flex-col items-center">
              <div className="label font-black tracking-[0.4em] text-white/90 animate-pulse">Initializing System</div>
              <p className="text-white/40 font-mono text-xs mt-4 tracking-widest">ESTABLISHING CONNECTION...</p>
            </div>
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

          {/* Liquid hero layer removed — content relocated */}

          {/* 3. Overlays (Header and Sponsor) */}
          <motion.header 
            className={`absolute top-0 left-0 w-full z-50 flex justify-between items-center ${isMobile ? "px-6 py-6" : "px-12 py-8"} pointer-events-auto`}
          >
          <div className="flex items-center gap-3 md:gap-6 cursor-pointer hover-glitch-text" onClick={(e) => { e.preventDefault(); containerRef.current?.scrollTo({ top: 0, behavior: 'smooth' }); }}>
            <img src="/branding/logo_4.webp" alt="Artemis Logo" className={`${isMobile ? "w-10 h-10" : "w-[72px] h-[72px]"} opacity-80 mix-blend-screen object-contain`} />
            <div className="flex flex-col justify-center">
              <span className={`display ${isMobile ? "text-2xl" : "text-[63px]"} font-black text-white/60 leading-none`}>ARTEMIS</span>
              <span className={`${isMobile ? "text-[8px]" : "text-[10px]"} uppercase tracking-[0.25em] text-white/40 mt-1 font-sans font-semibold`}>Chatham Central Robotics</span>
            </div>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex gap-10 text-base md:text-lg tracking-widest uppercase font-bold text-white/50 font-mono">
            <a href="#about" onClick={(e) => handleFastScroll(e, '#about')} className="hover:text-white transition-all hover:-translate-y-1 active:scale-90 hover-glitch-text">About</a>
            <a href="#timeline" onClick={(e) => handleFastScroll(e, '#timeline')} className="hover:text-white transition-all hover:-translate-y-1 active:scale-90 hover-glitch-text">Timeline</a>
            <a href="#outreach" onClick={(e) => handleFastScroll(e, '#outreach')} className="hover:text-white transition-all hover:-translate-y-1 active:scale-90 hover-glitch-text">Impact</a>
            <a href="#budget" onClick={(e) => handleFastScroll(e, '#budget')} className="hover:text-white transition-all hover:-translate-y-1 active:scale-90 hover-glitch-text">Support</a>
          </nav>

          {/* Mobile Hamburger Button */}
          {isMobile && (
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="z-50 flex items-center justify-center w-12 h-12 rounded-full border border-white/10 bg-white/5 backdrop-blur-md active:scale-95 transition-all shadow-[0_4px_15px_rgba(0,0,0,0.3)]"
              aria-label="Toggle Menu"
            >
              <div className="flex flex-col gap-1.5 w-5 justify-center items-center">
                <motion.span 
                  animate={isMenuOpen ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className="w-full h-0.5 bg-white rounded-full origin-center" 
                />
                <motion.span 
                  animate={isMenuOpen ? { opacity: 0 } : { opacity: 1 }}
                  transition={{ duration: 0.15 }}
                  className="w-full h-0.5 bg-white rounded-full" 
                />
                <motion.span 
                  animate={isMenuOpen ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className="w-full h-0.5 bg-white rounded-full origin-center" 
                />
              </div>
            </button>
          )}
          </motion.header>

          {/* Mobile Navigation Drawer Overlay */}
          <AnimatePresence>
            {isMobile && isMenuOpen && (
              <motion.div 
                initial={{ opacity: 0, x: "100%" }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: "100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="fixed inset-0 z-[45] flex flex-col justify-center items-center bg-[#05070B]/95 backdrop-blur-2xl px-8 pointer-events-auto border-l border-white/5"
              >
                {/* Background glowing rings inside mobile menu */}
                <div className="absolute top-[20%] right-[-10%] w-[300px] h-[300px] rounded-full bg-artemis-blue/10 blur-[100px] pointer-events-none" />
                <div className="absolute bottom-[20%] left-[-10%] w-[300px] h-[300px] rounded-full bg-stellar-orange/10 blur-[100px] pointer-events-none" />
                
                <div className="flex flex-col gap-8 text-center text-xl font-bold uppercase tracking-[0.2em] font-mono text-white/60">
                  {NAV_LINKS.concat({ href: "#budget", label: "Support" }).map((link, idx) => (
                    <motion.a 
                      key={link.label}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 + idx * 0.08 }}
                      href={link.href}
                      onClick={(e) => {
                        setIsMenuOpen(false);
                        handleFastScroll(e, link.href);
                      }}
                      className="hover:text-white hover:shadow-[0_0_15px_rgba(255,255,255,0.2)] active:scale-95 transition-all text-2xl py-2"
                    >
                      {link.label}
                    </motion.a>
                  ))}
                  
                  {/* Floating Contact/Info in drawer */}
                  <div className="h-px w-24 bg-white/10 mx-auto my-4" />
                  <span className="text-[10px] text-white/30 tracking-widest leading-relaxed">
                    TEAM 6621 ARTEMIS Central pad<br/>
                    fischers@chatham.k12.ny.us
                  </span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Sponsor Button */}
          <div className="absolute bottom-12 left-0 w-full flex justify-center z-30 pointer-events-auto" style={{ perspective: '800px' }}>
            <a href="#sponsorship" onClick={(e) => handleFastScroll(e, '#sponsorship')} className="group inline-block px-10 py-5 rounded-full label font-bold text-white shadow-[0_4px_30px_rgba(0,0,0,0.5)] hover:shadow-[0_20px_40px_rgba(37,99,235,0.5)] border border-white/30 hover:border-white/60 hover-playful-3d active:scale-95 preserve-3d transform-gpu origin-bottom transition-all duration-300 backdrop-blur-xl bg-white/10 hover:bg-gradient-to-r hover:from-artemis-blue/40 hover:to-stellar-orange/40">
              Support Now
            </a>
          </div>

        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
           2. ABOUT & TIMELINE (HORIZONTAL SCROLL)
           ══════════════════════════════════════════════════════ */}
      <section ref={horizontalScrollRef} id="about" className="relative w-full z-10" style={{ height: isMobile ? 'auto' : '400vh', scrollSnapAlign: isMobile ? 'none' : 'start' }}>
        

        {/* Sticky/Static container that holds the horizontal sliding content or vertical content */}
        <div className={isMobile ? "relative w-full py-16 flex items-center" : "sticky top-0 h-screen w-full overflow-hidden flex items-center"}>
          
          <motion.div style={{ x: xAboutToTimeline, y: yAboutToTimeline }} className={isMobile ? "w-full block relative z-10" : "flex w-[320vw] h-full relative z-10"}>
            
            {/* Section background gradient & floating shapes (scrolling with the content) */}
            <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden topography-bg opacity-40" aria-hidden="true" style={{ width: isMobile ? '100%' : '320vw' }}>
              {/* Starfield */}
              <div className="absolute inset-0 opacity-50" style={{ backgroundImage: 'radial-gradient(1px 1px at 20px 30px, #ffffff, rgba(0,0,0,0)), radial-gradient(1.5px 1.5px at 80px 140px, #ffffff, rgba(0,0,0,0)), radial-gradient(2px 2px at 150px 70px, #ffffff, rgba(0,0,0,0)), radial-gradient(1px 1px at 250px 200px, #ffffff, rgba(0,0,0,0)), radial-gradient(1px 1px at 300px 50px, #ffffff, rgba(0,0,0,0))', backgroundSize: '350px 350px' }} />
            </div>

            {/* --- ABOUT US PANE --- */}
            <div className={isMobile ? "w-full h-auto flex flex-col pt-8 pb-8 px-6 relative z-10" : "w-[100vw] h-full flex flex-col pt-16 md:pt-20 pb-8 px-6 md:px-12 relative z-10"}>
              
              {/* Scattered 3D Shapes */}
              {!isMobile && (
                <>
                  <motion.div animate={{ rotateX: 360, rotateY: 360 }} transition={{ duration: 40, repeat: Infinity, ease: 'linear' }} className="shape-3d shape-ring absolute top-[20%] left-[10%] w-48 h-48 opacity-30 z-0 pointer-events-none" />
                  <motion.div animate={{ rotateZ: 360 }} transition={{ duration: 30, repeat: Infinity, ease: 'linear' }} className="shape-3d shape-diamond absolute bottom-[15%] right-[15%] w-32 h-32 opacity-40 z-0 pointer-events-none" />
                </>
              )}
              
              <div className={`max-w-7xl mx-auto w-full flex flex-col ${isMobile ? "gap-8" : "lg:flex-row gap-6 lg:gap-10 items-stretch h-auto mt-4"}`}>
                
                {/* Left Side: About Text */}
                <div className={`${isMobile ? "w-full p-6" : "lg:w-5/12 p-8 md:p-10"} flex flex-col space-y-6 rounded-[2rem] transform-style preserve-3d shadow-[0_10px_50px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.1)] justify-between relative overflow-hidden backdrop-blur-3xl border border-white/10`} style={{ background: 'rgba(255,255,255,0.02)' }}>
                  <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
                  
                  <div className="relative z-10">
                    <h2 className="h1 font-black text-white hover-glitch-text transition-all duration-300">
                      About Us
                    </h2>
                    <p className="body text-white/60 leading-relaxed font-light mt-6">
                      Founded in 2016, Team 6621 Artemis Robotics is the only FRC team in Columbia County. We represent Chatham High School not only as the only robotics team but as the sole technology and STEAM-centered club for the entire school. We allow students to learn as they desire, advance their STEAM interests, whether that be art, business, or stem there is a place for anyone and everyone at ARTEMIS.
                    </p>
                  </div>
                  
                  <div className="space-y-8 relative z-10 mt-auto">
                    {/* Sleek white divider */}
                    <div className="h-px w-full" style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2) 30%, rgba(255,255,255,0.1) 70%, transparent)' }} />
                    
                    <div className="p-6 md:p-8 rounded-[1.5rem] relative overflow-hidden group hover:scale-[1.02] transition-transform duration-500 backdrop-blur-2xl border border-white/10" style={{ background: 'linear-gradient(135deg, rgba(37,99,235,0.08) 0%, rgba(249,115,22,0.05) 100%)', boxShadow: '0 10px 40px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.1)' }}>
                      <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      <h3 className="h2 font-bold mb-3 text-white tracking-wide hover-glitch-text">Our Mission</h3>
                      <p className="subhead text-white/70 italic leading-relaxed font-light">
                        &quot;Our mission is to cultivate a welcoming environment centered on STEAM learning and values of gracious professionalism regardless of background.&quot;
                      </p>
                    </div>
                    
                    {/* About FRC Chip & Text */}
                    <div className="flex items-center gap-6 p-5 rounded-[1.5rem] border border-white/10 backdrop-blur-2xl hover:bg-white/[0.08] transition-colors duration-300 shadow-[0_8px_32px_rgba(0,0,0,0.3)]" style={{ background: 'linear-gradient(90deg, rgba(37,99,235,0.05) 0%, rgba(255,255,255,0.02) 100%)' }}>
                      <a href="https://www.firstinspires.org/robotics/frc" target="_blank" rel="noopener noreferrer" className="shrink-0 px-8 py-3.5 rounded-full text-xs font-bold uppercase tracking-widest transition-all duration-400 hover:scale-105 text-white" style={{ background: 'linear-gradient(90deg, rgba(37,99,235,0.3) 0%, rgba(249,115,22,0.2) 100%)', border: '1px solid rgba(255,255,255,0.2)', boxShadow: '0 8px 24px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.2)' }}>About FRC →</a>
                      <p className="text-xs text-white/50 font-light leading-snug">We compete in FIRST Robotics Competition, the world's largest high school robotics program.</p>
                    </div>
                  </div>
                </div>

                {/* Right Side: Photo and Stats */}
                <div className={`w-full flex flex-col gap-6 ${isMobile ? "" : "lg:w-7/12 h-full"}`}>
                  {/* Team Photo */}
                  <div className={`relative rounded-[2rem] overflow-hidden border border-white/10 group ${isMobile ? "h-[250px]" : "flex-grow"}`} style={{ boxShadow: '0 10px 40px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.1)' }}>
                    <img src="/photos/hero/team_with_robot.webp" alt="Team 6621 Artemis with their robot" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                    <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, transparent 50%)' }} />
                    <div className="absolute bottom-0 left-0 right-0 p-8 flex justify-between items-end">
                      <div>
                        <p className="text-[10px] uppercase tracking-widest text-white/50 mb-1">Team 6621</p>
                        <p className="h2 font-bold text-white hover-glitch-text">Artemis Robotics</p>
                      </div>
                      <span className="text-[10px] uppercase tracking-widest text-white/40">Chatham, NY</span>
                    </div>
                  </div>
                  {/* Compact stat row */}
                  <div className="grid grid-cols-3 gap-3 md:gap-5 shrink-0" style={{ perspective: '800px' }}>
                    <div className="relative p-4 md:p-6 text-center rounded-[1.5rem] overflow-hidden transition-all duration-500 hover:-translate-y-2 group cursor-default" style={{ background: 'rgba(255,255,255,0.03)', backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 10px 30px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.1)' }}>
                      <div className="absolute top-0 left-[10%] right-[10%] h-[40%] rounded-b-full opacity-60" style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.1) 0%, transparent 100%)' }} />
                      <h4 className="text-xl md:h1 font-black text-white relative z-10 hover-glitch-text"><Counter to={2016} duration={1.5} /></h4>
                      <p className="text-[9px] md:label text-white/50 mt-2 relative z-10">Founded</p>
                    </div>
                    <div className="relative p-4 md:p-6 text-center rounded-[1.5rem] overflow-hidden transition-all duration-500 hover:-translate-y-2 group cursor-default" style={{ background: 'rgba(255,255,255,0.03)', backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 10px 30px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.1)' }}>
                      <div className="absolute top-0 left-[10%] right-[10%] h-[40%] rounded-b-full opacity-60" style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.1) 0%, transparent 100%)' }} />
                      <h4 className="text-xl md:h1 font-black text-white relative z-10 hover-glitch-text"><Counter to={60} duration={2} format={(v) => `${v}%`} /></h4>
                      <p className="text-[9px] md:label text-white/50 mt-2 relative z-10">New Members</p>
                    </div>
                    <div className="relative p-4 md:p-6 text-center rounded-[1.5rem] overflow-hidden transition-all duration-500 hover:-translate-y-2 group cursor-default" style={{ background: 'rgba(255,255,255,0.03)', backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 10px 30px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.1)' }}>
                      <div className="absolute top-0 left-[10%] right-[10%] h-[40%] rounded-b-full opacity-60" style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.1) 0%, transparent 100%)' }} />
                      <h4 className="text-xl md:h1 font-black text-white relative z-10 hover-glitch-text"><Counter to={5000} duration={2.5} format={(v) => `${v.toLocaleString()}+`} /></h4>
                      <p className="text-[9px] md:label text-white/50 mt-2 relative z-10">Hours</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* --- TIMELINE PANE --- */}
            <div id="timeline" className={isMobile ? "w-full px-6 py-12 relative z-10" : "w-[220vw] h-full relative z-10 overflow-hidden"}>
              
              {isMobile ? (
                <div className="flex flex-col gap-12 relative pl-8 border-l border-white/10 max-w-xl mx-auto">
                  {/* Glowing vertical connector line */}
                  <div className="absolute top-0 bottom-0 left-0 w-px bg-gradient-to-b from-artemis-blue via-stellar-orange to-artemis-blue shadow-[0_0_8px_rgba(37,99,235,0.5)]" />
                  
                  {/* 2024 */}
                  <div className="relative">
                    {/* Glowing indicator dot */}
                    <div className="absolute -left-[37px] top-1.5 w-4 h-4 rounded-full bg-artemis-blue border-4 border-[#05070B] shadow-[0_0_10px_#2563eb]" />
                    <div className="bg-white/[0.02] border border-white/10 p-6 rounded-2xl backdrop-blur-xl shadow-[0_4px_30px_rgba(0,0,0,0.3)]">
                      <h4 className="text-artemis-blue text-lg font-bold mb-3 tracking-widest uppercase" style={{ textShadow: '0 0 10px rgba(37,99,235,0.4)' }}>2024 Season</h4>
                      <ul className="text-white/80 font-mono text-xs leading-relaxed space-y-3 list-none">
                        <li className="flex items-start gap-2"><span className="text-artemis-blue mt-1">▹</span> <div>Creativity Award</div></li>
                        <li className="flex items-start gap-2"><span className="text-artemis-blue mt-1">▹</span> <div>First Leadership Award Finalist <br/><span className="text-[10px] text-white/40">(Eion Henchey)</span></div></li>
                        <li className="flex items-start gap-2"><span className="text-artemis-blue mt-1">▹</span> <div>Safety All-Star <br/><span className="text-[10px] text-white/40">(Reed Fisch)</span></div></li>
                      </ul>
                    </div>
                    <div className="grid grid-cols-2 gap-3 mt-4">
                      <img src="/timeline/1.webp" alt="2024 Event" className="w-full h-28 rounded-xl object-cover border border-white/5 shadow-md" />
                      <img src="/timeline/3.webp" alt="2024 Mentors" className="w-full h-28 rounded-xl object-cover border border-white/5 shadow-md" />
                    </div>
                  </div>

                  {/* 2025 */}
                  <div className="relative">
                    {/* Glowing indicator dot */}
                    <div className="absolute -left-[37px] top-1.5 w-4 h-4 rounded-full bg-stellar-orange border-4 border-[#05070B] shadow-[0_0_10px_#f97316]" />
                    <div className="bg-white/[0.02] border border-white/10 p-6 rounded-2xl backdrop-blur-xl shadow-[0_4px_30px_rgba(0,0,0,0.3)]">
                      <h4 className="text-stellar-orange text-lg font-bold mb-3 tracking-widest uppercase" style={{ textShadow: '0 0 10px rgba(249,115,22,0.4)' }}>2025 Season</h4>
                      <ul className="text-white/80 font-mono text-xs leading-relaxed space-y-3 list-none">
                        <li className="flex items-start gap-2"><span className="text-stellar-orange mt-1">▹</span> <div>Ranked #3 in New York State</div></li>
                        <li className="flex items-start gap-2"><span className="text-stellar-orange mt-1">▹</span> <div>New York Tech Valley Regional Winner</div></li>
                        <li className="flex items-start gap-2"><span className="text-stellar-orange mt-1">▹</span> <div>Worlds Alliance Captain <br/><span className="text-[10px] text-white/40">(Hopper Division)</span></div></li>
                        <li className="flex items-start gap-2"><span className="text-stellar-orange mt-1">▹</span> <div>Ballston Spa Off-Season Finalist</div></li>
                      </ul>
                    </div>
                    <div className="grid grid-cols-2 gap-3 mt-4">
                      <img src="/timeline/2025_1_new.jpg" alt="2025 Winner" className="w-full h-28 rounded-xl object-cover border border-white/5 shadow-md" />
                      <img src="/timeline/2025_2_new.jpg" alt="2025 Celebration" className="w-full h-28 rounded-xl object-cover border border-white/5 shadow-md" />
                    </div>
                  </div>

                  {/* 2026 */}
                  <div className="relative">
                    {/* Glowing indicator dot */}
                    <div className="absolute -left-[37px] top-1.5 w-4 h-4 rounded-full bg-artemis-blue border-4 border-[#05070B] shadow-[0_0_10px_#2563eb]" />
                    <div className="bg-white/[0.02] border border-white/10 p-6 rounded-2xl backdrop-blur-xl shadow-[0_4px_30px_rgba(0,0,0,0.3)]">
                      <h4 className="text-artemis-blue text-lg font-bold mb-3 tracking-widest uppercase" style={{ textShadow: '0 0 10px rgba(37,99,235,0.4)' }}>2026 Season</h4>
                      <ul className="text-white/80 font-mono text-xs leading-relaxed space-y-3 list-none">
                        <li className="flex items-start gap-2"><span className="text-artemis-blue mt-1">▹</span> <div>Hudson Valley Regional <br/><span className="text-[10px] text-white/40">Alliance 3</span></div></li>
                        <li className="flex items-start gap-2"><span className="text-artemis-blue mt-1">▹</span> <div>Tech Valley Regional <br/><span className="text-[10px] text-white/40">Alliance 5</span></div></li>
                        <li className="flex items-start gap-2"><span className="text-artemis-blue mt-1">▹</span> <div>Safety All-Star <br/><span className="text-[10px] text-white/40">(Josiah Eugenio)</span></div></li>
                      </ul>
                    </div>
                    <div className="grid grid-cols-2 gap-3 mt-4">
                      <img src="/timeline/2026_1.jpg" alt="2026 Event" className="w-full h-28 rounded-xl object-cover border border-white/5 shadow-md" />
                      <img src="/timeline/2026_2.jpg" alt="2026 Team" className="w-full h-28 rounded-xl object-cover border border-white/5 shadow-md" />
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  {/* 2024 SECTION (0vw to 70vw) */}
                  <div className="absolute top-[35%] left-[5vw] w-[28vw] max-w-[400px] bg-black/40 backdrop-blur-xl border border-white/20 p-6 rounded-2xl shadow-[0_0_45px_rgba(37,99,235,0.15)] z-30 transform -rotate-1">
                    <h4 className="text-artemis-blue h2 font-bold mb-4 tracking-widest uppercase hover-glitch-text" style={{ textShadow: '0 0 10px rgba(37,99,235,0.8)' }}>2024 Season</h4>
                    <ul className="text-white/80 font-mono text-xs leading-relaxed space-y-3 list-none">
                      <li className="flex items-start gap-2"><span className="text-artemis-blue mt-1">▹</span> <div>Creativity Award</div></li>
                      <li className="flex items-start gap-2"><span className="text-artemis-blue mt-1">▹</span> <div>First Leadership Award Finalist <br/><span className="text-[10px] text-white/40">(Eion Henchey)</span></div></li>
                      <li className="flex items-start gap-2"><span className="text-artemis-blue mt-1">▹</span> <div>Safety All-Star <br/><span className="text-[10px] text-white/40">(Reed Fisch)</span></div></li>
                    </ul>
                  </div>
                  <img src="/timeline/1.webp" alt="2024 Event" className="absolute top-[5%] left-[28vw] w-[35vw] max-w-[400px] rounded-[3rem] shadow-[0_0_40px_rgba(37,99,235,0.15)] object-cover z-20 hover:scale-[1.05] hover:z-40 transition-all duration-500 transform rotate-2" />
                  <img src="/timeline/3.webp" alt="2024 Mentors" className="absolute bottom-[15%] left-[15vw] w-[40vw] max-w-[450px] rounded-[3rem] shadow-[0_0_40px_rgba(37,99,235,0.15)] object-cover z-20 hover:scale-[1.05] hover:z-40 transition-all duration-500 transform -rotate-2" />

                  {/* 2025 SECTION (60vw to 120vw) */}
                  <div className="absolute top-[25%] left-[60vw] w-[28vw] max-w-[400px] bg-black/40 backdrop-blur-xl border border-white/20 p-6 rounded-2xl shadow-[0_0_45px_rgba(249,115,22,0.15)] z-30 transform rotate-1">
                    <h4 className="text-stellar-orange h2 font-bold mb-4 tracking-widest uppercase hover-glitch-text" style={{ textShadow: '0 0 10px rgba(249,115,22,0.8)' }}>2025 Season</h4>
                    <ul className="text-white/80 font-mono text-xs leading-relaxed space-y-3 list-none">
                      <li className="flex items-start gap-2"><span className="text-stellar-orange mt-1">▹</span> <div>Ranked #3 in New York State</div></li>
                      <li className="flex items-start gap-2"><span className="text-stellar-orange mt-1">▹</span> <div>New York Tech Valley Regional Winner</div></li>
                      <li className="flex items-start gap-2"><span className="text-stellar-orange mt-1">▹</span> <div>Worlds Alliance Captain <br/><span className="text-[10px] text-white/40">(Hopper Division)</span></div></li>
                      <li className="flex items-start gap-2"><span className="text-stellar-orange mt-1">▹</span> <div>Ballston Spa Off-Season Competition Finalist</div></li>
                    </ul>
                  </div>
                  <img src="/timeline/2025_1_new.jpg" alt="2025 Winner" className="absolute bottom-[15%] left-[70vw] w-[45vw] max-w-[600px] rounded-[3rem] shadow-[0_0_40px_rgba(249,115,22,0.15)] object-cover z-20 hover:scale-[1.05] hover:z-40 transition-all duration-500 transform rotate-1" />
                  <img src="/timeline/2025_2_new.jpg" alt="2025 Celebration" className="absolute top-[10%] left-[95vw] w-[35vw] max-w-[500px] rounded-[3rem] shadow-[0_0_40px_rgba(249,115,22,0.15)] object-cover z-20 hover:scale-[1.05] hover:z-40 transition-all duration-500 transform -rotate-2" />

                  {/* 2026 SECTION (130vw to 220vw) */}
                  <div className="absolute top-[45%] left-[130vw] w-[28vw] max-w-[400px] bg-black/40 backdrop-blur-xl border border-white/20 p-6 rounded-2xl shadow-[0_0_45px_rgba(37,99,235,0.15)] z-30 transform -rotate-1">
                    <h4 className="text-artemis-blue h2 font-bold mb-4 tracking-widest uppercase hover-glitch-text" style={{ textShadow: '0 0 10px rgba(37,99,235,0.8)' }}>2026 Season</h4>
                    <ul className="text-white/80 font-mono text-xs leading-relaxed space-y-3 list-none">
                      <li className="flex items-start gap-2"><span className="text-artemis-blue mt-1">▹</span> <div>Hudson Valley Regional <br/><span className="text-[10px] text-white/40">Alliance 3</span></div></li>
                      <li className="flex items-start gap-2"><span className="text-artemis-blue mt-1">▹</span> <div>Tech Valley Regional <br/><span className="text-[10px] text-white/40">Alliance 5</span></div></li>
                      <li className="flex items-start gap-2"><span className="text-artemis-blue mt-1">▹</span> <div>Safety All-Star <br/><span className="text-[10px] text-white/40">(Josiah Eugenio)</span></div></li>
                    </ul>
                  </div>
                  <img src="/timeline/2026_1.jpg" alt="2026 Event" className="absolute bottom-[15%] left-[155vw] w-[35vw] max-w-[450px] rounded-[3rem] shadow-[0_0_40px_rgba(37,99,235,0.15)] object-cover z-20 hover:scale-[1.05] hover:z-40 transition-all duration-500 transform rotate-3" />
                  <img src="/timeline/2026_2.jpg" alt="2026 Team" className="absolute top-[15%] right-[5vw] w-[40vw] max-w-[500px] rounded-[3rem] shadow-[0_0_40px_rgba(37,99,235,0.15)] object-cover z-20 hover:scale-[1.05] hover:z-40 transition-all duration-500 transform -rotate-2" />
                </>
              )}

            </div>
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
           5. OUTREACH PARALLAX (FLY OUT EFFECT)
           ══════════════════════════════════════════════════════ */}
      <section id="outreach" ref={outreachScrollRef} className="relative z-10 bg-gradient-to-b from-[#05070B] to-[#05070B]" style={{ height: isMobile ? 'auto' : '350vh' }}>
        <div className={isMobile ? "relative w-full flex flex-col items-center py-16 px-6" : "sticky top-0 h-screen w-full flex flex-col items-center overflow-hidden pt-24 pb-12"}>
          
          {/* Background Elements */}
          <div className="absolute inset-0 z-0 opacity-20 starfield" />
          
          {/* Top and Bottom fades for seamless blending */}
          <div className="absolute top-0 left-0 w-full h-[20vh] bg-gradient-to-b from-[#05070B] via-[#05070B]/80 to-transparent pointer-events-none z-[1]" />
          <div className="absolute bottom-0 left-0 w-full h-[25vh] bg-gradient-to-t from-[#05070B] via-[#05070B]/80 to-transparent pointer-events-none z-[1]" />
          
          {/* Subtle organic gradient blobs */}
          <motion.div animate={{ x: ['-5vw', '8vw', '-3vw', '-5vw'], y: ['-3vh', '5vh', '-8vh', '-3vh'], scale: [1, 1.08, 0.95, 1] }} transition={{ duration: 30, repeat: Infinity, ease: 'easeInOut' }} className="absolute top-[30%] left-[20%] w-[50vw] h-[50vw] rounded-full bg-gradient-to-br from-artemis-blue/10 via-purple-500/5 to-transparent blur-[150px] pointer-events-none z-0" />
          <motion.div animate={{ x: ['5vw', '-6vw', '3vw', '5vw'], y: ['4vh', '-6vh', '7vh', '4vh'], scale: [0.95, 1.05, 1, 0.95] }} transition={{ duration: 35, repeat: Infinity, ease: 'easeInOut' }} className="absolute bottom-[20%] right-[15%] w-[45vw] h-[45vw] rounded-full bg-gradient-to-tl from-stellar-orange/8 via-rose-500/5 to-transparent blur-[140px] pointer-events-none z-0" />
          
          {/* Slow orbital rings */}
          {!isMobile && (
            <>
              <motion.div animate={{ rotateZ: 360 }} transition={{ duration: 200, repeat: Infinity, ease: 'linear' }} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120vw] h-[120vw] rounded-full border border-white/[0.03] pointer-events-none" />
              <motion.div animate={{ rotateZ: -360 }} transition={{ duration: 150, repeat: Infinity, ease: 'linear' }} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] rounded-full border border-white/[0.05] pointer-events-none" />
              <motion.div animate={{ x: [0, 20, -15, 0], y: [0, 15, -10, 0], rotateX: 360 }} transition={{ duration: 35, repeat: Infinity, ease: 'linear' }} className="shape-3d shape-sphere absolute top-[10%] left-[5%] w-32 h-32 opacity-30 z-0 pointer-events-none" />
              <motion.div animate={{ x: [0, 25, -15, 0], y: [0, -20, 15, 0], rotateY: 360 }} transition={{ duration: 30, repeat: Infinity, ease: 'linear' }} className="shape-3d shape-ring absolute bottom-[20%] right-[10%] w-40 h-40 opacity-25 z-0 pointer-events-none" />
            </>
          )}
          
          <div className="max-w-7xl mx-auto px-6 w-full text-center mb-8 relative z-10 shrink-0">
            <h2 className="display font-black text-white/60 tracking-wide hover-glitch-text">
              Impact
            </h2>
          </div>
          
          {/* Parallax Grid Container or Mobile Stack */}
          {isMobile ? (
            <div className="flex flex-col gap-8 w-full max-w-md relative z-10">
              {OUTREACH_CARDS.map((card, idx) => (
                <div 
                  key={idx}
                  className="relative w-full h-[400px] flex flex-col justify-end rounded-[2rem] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/10 group"
                >
                  <img src={card.image} alt={card.title} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#05070B] via-[#05070B]/50 to-transparent opacity-90" />
                  
                  <div className="relative z-10 p-6 backdrop-blur-md bg-white/[0.03] border-t border-white/10 mt-auto">
                    <span className="inline-block px-4 py-1.5 rounded-full bg-stellar-orange/20 text-stellar-orange text-xs font-bold tracking-widest uppercase mb-4 border border-stellar-orange/30 shadow-[0_0_15px_rgba(251,146,60,0.3)]">{card.tag}</span>
                    <h3 className="h3 font-bold mb-3 text-white">{card.title}</h3>
                    <p className="text-xs text-white/70 leading-relaxed font-light">{card.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="max-w-7xl mx-auto px-6 w-full h-[65vh] md:h-[70vh] relative z-10 mb-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-10 w-full h-full relative">
                {[0, 1, 2].map(colIndex => (
                  <div key={colIndex} className="relative w-full h-full" style={{ perspective: '1000px' }}>
                    {OUTREACH_CARDS.map((card, idx) => {
                      if (idx % 3 !== colIndex) return null;
                      return (
                        <OutreachParallaxCard 
                          key={idx}
                          card={card} 
                          index={idx} 
                          totalCards={OUTREACH_CARDS.length} 
                          scrollYProgress={outreachScrollYProgress} 
                        />
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
           6. BUDGET & SPONSORS
           ══════════════════════════════════════════════════════ */}
      <section id="budget" className="snap-section relative z-10 overflow-hidden min-h-screen flex items-center bg-gradient-to-b from-[#05070B]/0 via-black/40 to-black/80 py-16">
        {/* Scattered 3D Shapes */}
        <motion.div animate={{ x: [0, 25, -15, 0], y: [0, -25, 15, 0] }} transition={{ duration: 15, repeat: Infinity, ease: 'linear' }} style={{ animationDelay: '3s', animationDuration: '14s' }} className="shape-3d shape-cube absolute top-[40%] left-[8%] w-24 h-24 opacity-50 z-0 pointer-events-none" />
        
        <div className="max-w-4xl mx-auto px-6 w-full flex flex-col items-center justify-center relative z-10 text-center">
          
          <h2 className="display font-black mb-4">
            Budget
          </h2>
          <p className="text-sm text-white/50 font-light max-w-2xl mb-12">
            42% of students in our high school are on free or reduced lunch. We refuse to charge our students a single cent to participate. We believe that talent is universal but opportunity is not.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full relative z-10 text-left">
            {/* Expenses */}
            <div className="glass-panel-deep p-8 md:p-10 rounded-2xl relative overflow-hidden transition-all duration-300 hover:bg-white/[0.03]">
              <h3 className="h2 font-black mb-6 text-white tracking-wide">Expenses</h3>
              <div className="space-y-6 mb-8">
                {EXPENSES.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center text-sm md:text-base border-b border-white/5 pb-2">
                    <span className="text-white/70 font-mono">{item.label}</span>
                    <span className="text-stellar-orange font-black">$<Counter to={item.amount} duration={2} format={(v) => v.toLocaleString()} /></span>
                  </div>
                ))}
              </div>
              <div className="flex justify-between items-center text-lg md:text-xl border-t border-white/20 pt-4 mt-auto">
                <span className="text-white font-bold font-mono">Total Needed</span>
                <span className="text-stellar-orange font-black">$<Counter to={65395} duration={2} format={(v) => v.toLocaleString()} /></span>
              </div>
            </div>

            {/* Funding Sources */}
            <div className="glass-panel-deep p-8 md:p-10 rounded-2xl relative overflow-hidden transition-all duration-300 hover:bg-white/[0.03]">
              <h3 className="h2 font-black mb-6 text-white tracking-wide">Funding Sources</h3>
              <div className="space-y-6 mb-8">
                {FUNDING_SOURCES.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center text-sm md:text-base border-b border-white/5 pb-2">
                    <span className="text-white/70 font-mono">{item.label}</span>
                    <span className="text-artemis-blue font-black">$<Counter to={item.amount} duration={2} format={(v) => v.toLocaleString()} /></span>
                  </div>
                ))}
              </div>
              <div className="flex justify-between items-center text-lg md:text-xl border-t border-white/20 pt-4 mt-auto">
                <span className="text-white font-bold font-mono">Total Secured</span>
                <span className="text-artemis-blue font-black">$<Counter to={24000} duration={2} format={(v) => v.toLocaleString()} /></span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
           7. SPONSORSHIP TIERS
           ══════════════════════════════════════════════════════ */}
      <section id="sponsorship" className="relative z-10 bg-[#05070B] py-28 border-t border-white/[0.03] overflow-hidden">
        
        {/* Dynamic Organic Background Nebulas & Glows */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden opacity-40">
          <motion.div 
            animate={{ 
              x: ['-20%', '20%', '-20%'], 
              y: ['-15%', '15%', '-15%'],
              scale: [1, 1.15, 1] 
            }} 
            transition={{ duration: 25, repeat: Infinity, ease: 'easeInOut' }} 
            className="absolute top-[10%] left-[10%] w-[600px] h-[600px] rounded-full bg-artemis-blue/15 blur-[150px]"
          />
          <motion.div 
            animate={{ 
              x: ['20%', '-20%', '20%'], 
              y: ['15%', '-15%', '15%'],
              scale: [1.1, 0.95, 1.1] 
            }} 
            transition={{ duration: 30, repeat: Infinity, ease: 'easeInOut' }} 
            className="absolute bottom-[10%] right-[10%] w-[650px] h-[650px] rounded-full bg-stellar-orange/10 blur-[180px]"
          />
        </div>
        
        <div className="max-w-7xl mx-auto px-6 w-full flex flex-col relative z-10">
          
          {/* Section Header */}
          <div className="text-center mb-20">
            <span className="label text-[10px] uppercase tracking-[0.25em] text-white/40 mb-3 block font-mono">Partnership Opportunities</span>
            <h2 className="display font-black text-white hover-glitch-text mb-4 text-4xl md:text-5xl tracking-tight">
              Support Us
            </h2>
            <p className="text-sm text-white/50 font-light max-w-2xl mx-auto leading-relaxed">
              42% of our students are on free or reduced lunch. We refuse to charge a single cent to participate. Your sponsorship makes that possible.
            </p>
          </div>

          {/* 3-Column Tier Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full mb-16 items-stretch">
            {TIERS.filter(t => t.name !== 'Other').map((tier) => {
              const isApollo = tier.name === 'Apollo';
              
              // Premium Theme Variables
              let accentColorClass = "";
              let borderClass = "";
              let badgeClass = "";
              let btnClass = "";
              
              if (tier.name === 'Hermes') {
                accentColorClass = "text-white/40";
                borderClass = "border-white/10 hover:border-white/20 hover:shadow-[0_20px_50px_rgba(0,0,0,0.5),0_0_30px_rgba(255,255,255,0.02)]";
                btnClass = "bg-white/[0.03] border border-white/10 text-white/90 hover:bg-white/10 hover:border-white/30 hover:shadow-[0_0_20px_rgba(255,255,255,0.1)]";
              } else if (tier.name === 'Apollo') {
                accentColorClass = "text-artemis-blue/60";
                borderClass = "border-artemis-blue/20 bg-white/[0.02] shadow-[0_20px_50px_rgba(0,0,0,0.6),0_0_40px_rgba(37,99,235,0.08)] scale-[1.03] hover:border-artemis-blue/40";
                badgeClass = "bg-artemis-blue/10 border border-artemis-blue/30 text-artemis-blue font-mono shadow-[0_0_15px_rgba(37,99,235,0.15)]";
                btnClass = "bg-artemis-blue/20 border border-artemis-blue/40 text-white hover:bg-artemis-blue/30 hover:border-artemis-blue/60 hover:shadow-[0_0_25px_rgba(37,99,235,0.3)]";
              } else if (tier.name === 'ZEUS') {
                accentColorClass = "text-stellar-orange/60";
                borderClass = "border-white/10 hover:border-white/20 hover:shadow-[0_20px_50px_rgba(0,0,0,0.5),0_0_30px_rgba(255,255,255,0.02)]";
                btnClass = "bg-white/[0.03] border border-white/10 text-white/90 hover:bg-white/10 hover:border-white/30 hover:shadow-[0_0_20px_rgba(255,255,255,0.1)]";
              }

              return (
                <div 
                  key={tier.name}
                  onClick={() => setSelectedTier(tier.name)}
                  className={`relative p-8 rounded-3xl border backdrop-blur-3xl transition-all duration-500 flex flex-col group cursor-pointer ${borderClass}`}
                  style={{ background: isApollo ? undefined : 'rgba(255,255,255,0.015)' }}
                >
                  {isApollo && (
                    <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-[8px] uppercase tracking-widest font-black font-mono text-white bg-gradient-to-r from-artemis-blue to-indigo-600 shadow-[0_0_15px_rgba(37,99,235,0.4)] z-20">
                      Most Popular
                    </span>
                  )}
                  
                  <div className="relative z-10 flex flex-col h-full">
                    <p className="label text-[9px] tracking-widest uppercase mb-2 text-white/40 font-mono">{tier.label}</p>
                    <h3 className="text-2xl font-bold text-white mb-2 tracking-tight">{tier.name}</h3>
                    <p className="text-4xl font-extrabold text-white mb-6 tracking-tight">
                      {tier.price}
                    </p>
                    
                    <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent mb-6" />
                    
                    <ul className="space-y-4 text-xs text-white/70 mb-8 flex-grow">
                      {tier.benefits.map((benefit, i) => (
                        <li key={i} className="flex items-start gap-3">
                          <span className={`text-base leading-none ${accentColorClass}`}>▹</span>
                          <span className="font-light">{benefit}</span>
                        </li>
                      ))}
                    </ul>
                    
                    <a 
                      href="#sponsorship-form" 
                      onClick={(e) => { 
                        e.stopPropagation(); 
                        setSelectedTier(tier.name); 
                        handleFastScroll(e, '#sponsorship-form'); 
                      }} 
                      className={`w-full py-4 rounded-xl text-center label text-[9px] font-bold tracking-widest uppercase transition-all duration-300 ${btnClass}`}
                    >
                      Select {tier.name}
                    </a>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Donation shown smaller below */}
          <div 
            id="donation-card"
            onClick={() => setSelectedTier('Other')}
            className={`w-full max-w-4xl mx-auto p-6 rounded-2xl border transition-all duration-300 flex flex-col md:flex-row justify-between items-center gap-6 cursor-pointer mb-24 ${
              selectedTier === 'Other' ? 'border-white/30 bg-white/[0.04] shadow-[0_15px_30px_rgba(0,0,0,0.3)]' : 'border-white/5 hover:border-white/15'
            }`}
            style={{ background: selectedTier === 'Other' ? undefined : 'rgba(255,255,255,0.01)', backdropFilter: 'blur(30px)' }}
          >
            <div className="flex flex-col gap-1 text-center md:text-left">
              <span className="label text-[9px] uppercase tracking-widest text-white/40 font-mono">Direct Support</span>
              <h4 className="text-base font-bold text-white tracking-tight">Custom Amount / Direct Donation</h4>
              <p className="text-xs text-white/60 font-light">Every contribution helps fund student meals, travel expenses, and raw materials directly.</p>
            </div>
            <a 
              href="#sponsorship-form"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedTier('Other');
                handleFastScroll(e, '#sponsorship-form');
              }}
              className="px-8 py-3.5 rounded-xl text-center label text-[9px] font-bold tracking-widest uppercase border border-white/10 text-white/90 bg-white/5 hover:bg-white/10 hover:border-white/30 transition-all duration-300 shrink-0"
            >
              Custom Donation
            </a>
          </div>

          {/* Form & Info Section */}
          <div id="sponsorship-form" className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch max-w-6xl mx-auto w-full">
            
            {/* Contact Details (5 cols) */}
            <div className="lg:col-span-5 flex flex-col gap-6 w-full justify-between">
              <div>
                <span className="label text-[10px] uppercase tracking-[0.2em] text-white/40 mb-2 block font-sans font-semibold">Get in Touch</span>
                <h3 className="text-3xl font-bold text-white mb-3 tracking-tight">Partnership Info</h3>
                <p className="text-sm text-white/50 leading-relaxed font-light mb-8">
                  Have questions about our sponsorship packages or custom branding options? Reach out to us directly or view our competition progress.
                </p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-5 rounded-2xl border border-white/5 bg-white/[0.02] backdrop-blur-3xl hover:border-white/12 hover:bg-white/[0.04] transition-all duration-300">
                    <h4 className="text-white/40 font-bold font-sans mb-2 text-[10px] uppercase tracking-wider">Location</h4>
                    <p className="text-xs text-white/80 font-sans leading-relaxed font-light">
                      Chatham High School<br />
                      50 Woodbridge Ave<br />
                      Chatham, NY 12037
                    </p>
                  </div>
                  <div className="p-5 rounded-2xl border border-white/5 bg-white/[0.02] backdrop-blur-3xl hover:border-white/12 hover:bg-white/[0.04] transition-all duration-300">
                    <h4 className="text-white/40 font-bold font-sans mb-2 text-[10px] uppercase tracking-wider">Email Contacts</h4>
                    <p className="text-xs text-white/80 font-sans leading-relaxed font-light">
                      Coach: <a href="mailto:fischers@chatham.k12.ny.us" className="text-white hover:text-stellar-orange transition-colors">fischers@chatham.k12.ny.us</a><br />
                      Captain: <a href="mailto:Reed.L.Fisch@gmail.com" className="text-white hover:text-stellar-orange transition-colors">Reed.L.Fisch@gmail.com</a>
                    </p>
                  </div>
                  <div className="p-5 rounded-2xl border border-white/5 bg-white/[0.02] backdrop-blur-3xl hover:border-white/12 hover:bg-white/[0.04] transition-all duration-300">
                    <h4 className="text-white/40 font-bold font-sans mb-2 text-[10px] uppercase tracking-wider">Phone</h4>
                    <p className="text-xs text-white/80 font-sans leading-relaxed font-light">
                      (518) 392-2400 ×1038
                    </p>
                  </div>
                  <div className="p-5 rounded-2xl border border-white/5 bg-white/[0.02] backdrop-blur-3xl hover:border-white/12 hover:bg-white/[0.04] transition-all duration-300">
                    <h4 className="text-white/40 font-bold font-sans mb-2 text-[10px] uppercase tracking-wider">Mail Checks To</h4>
                    <p className="text-xs text-white/80 font-sans leading-relaxed font-light">
                      CHS-Robotics<br />Attn: Sandra Fischer<br />
                      50 Woodbridge Ave<br />Chatham, NY 12037
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-6 rounded-2xl border border-white/5 bg-white/[0.02] backdrop-blur-3xl hover:border-white/12 hover:bg-white/[0.04] transition-all duration-300 mt-4">
                <h4 className="text-white/40 font-bold font-sans mb-2 text-[10px] uppercase tracking-wider">Logo Submission</h4>
                <p className="text-xs text-white/50 leading-relaxed font-sans font-light">
                  Make checks payable to CHS-Robotics. Please send high-resolution branding assets (.PNG or .SVG preferred) to Coach Sandra Fischer.
                </p>
              </div>
            </div>

            {/* Interest Form (7 cols) */}
            <div className="lg:col-span-7 w-full flex flex-col justify-center">
              <div className="p-8 rounded-3xl border border-white/10 bg-white/[0.01] backdrop-blur-3xl relative overflow-hidden h-full flex flex-col justify-center">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl pointer-events-none" />
                {!contactSuccess ? (
                  <form onSubmit={handleContactSubmit} className="flex flex-col gap-5 relative z-10">
                    <div>
                      <h3 className="text-2xl font-bold text-white tracking-tight">Express Interest</h3>
                      <p className="text-xs text-white/50 mt-1 font-light">Fill out the form and we&apos;ll reach out to discuss partnership opportunities.</p>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <input required type="text" placeholder="Company / Name *" className="bg-white/[0.02] border border-white/10 rounded-xl px-5 py-3.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-stellar-orange/50 focus:bg-white/[0.04] focus:ring-1 focus:ring-stellar-orange/20 transition-all font-sans" />
                      <input required type="email" placeholder="Email Address *" className="bg-white/[0.02] border border-white/10 rounded-xl px-5 py-3.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-stellar-orange/50 focus:bg-white/[0.04] focus:ring-1 focus:ring-stellar-orange/20 transition-all font-sans" />
                    </div>
                    
                    <input type="text" placeholder="Phone (Optional)" className="bg-white/[0.02] border border-white/10 rounded-xl px-5 py-3.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-stellar-orange/50 focus:bg-white/[0.04] focus:ring-1 focus:ring-stellar-orange/20 transition-all font-sans w-full" />
                    
                    <div className="relative">
                      <select 
                        required 
                        value={selectedTier}
                        onChange={(e) => setSelectedTier(e.target.value as any)}
                        className="appearance-none bg-white/[0.02] border border-white/10 rounded-xl px-5 py-3.5 text-sm text-white/80 focus:outline-none focus:border-stellar-orange/50 focus:bg-white/[0.04] focus:ring-1 focus:ring-stellar-orange/20 transition-all font-sans w-full cursor-pointer"
                      >
                        <option value="" disabled className="bg-[#05070B] text-white">Sponsorship Tier: Select a tier</option>
                        {TIERS.filter(t => t.name !== 'Other').map(t => (
                          <option key={t.name} value={t.name} className="bg-[#05070B] text-white">
                            {t.name} - {t.price}
                          </option>
                        ))}
                        <option value="Other" className="bg-[#05070B] text-white">Other / Custom Amount</option>
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-5 text-white/40">
                        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                      </div>
                    </div>

                    <textarea placeholder="Message / Questions..." rows={4} className="bg-[#05070B]/50 border border-white/10 rounded-xl px-5 py-3.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-stellar-orange/50 focus:bg-white/[0.04] focus:ring-1 focus:ring-stellar-orange/20 transition-all font-sans resize-none"></textarea>
                    
                    <button type="submit" disabled={isSubmittingContact} className="w-full py-4 mt-2 rounded-xl bg-gradient-to-r from-stellar-orange to-orange-600 font-semibold uppercase text-xs tracking-wider hover:shadow-[0_0_30px_rgba(249,115,22,0.35)] transition-all duration-300 transform hover:scale-[1.01] active:scale-[0.99] cursor-pointer">
                      {isSubmittingContact ? "Processing..." : "Submit Interest"}
                    </button>
                  </form>
                ) : (
                  <div className="text-center py-8 relative z-10">
                    <div className="text-3xl mb-4">🚀</div>
                    <h3 className="text-xl font-bold mb-2">Transmission Sent</h3>
                    <p className="text-xs text-white/50">We&apos;ll be in contact shortly with invoicing details.</p>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
           7.5. SPONSOR MARQUEE
           ══════════════════════════════════════════════════════ */}
      <section className="w-full py-16 relative z-10 overflow-hidden bg-[#05070B] flex flex-col gap-12">
        
        {/* Logos Marquee */}
        <div className="marquee-container w-full">
          <div className="marquee-content flex items-center" style={{ animationDuration: `${SPONSOR_LOGO_IMAGES.length * 2.5}s` }}>
            {/* Double the array for seamless infinite scroll */}
            {[...SPONSOR_LOGO_IMAGES, ...SPONSOR_LOGO_IMAGES].map((src, i) => (
              <span key={`logo-${i}`} className="mx-8 flex items-center justify-center shrink-0">
                <img src={src} alt="Sponsor Logo" className="h-16 w-auto object-contain opacity-40 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-300" />
              </span>
            ))}
          </div>
        </div>

        {/* Names Marquee */}
        <div className="marquee-container w-full">
          <div className="marquee-content flex items-center" style={{ animationDuration: `${SPONSOR_LOGOS.length * 2}s` }}>
            {/* Double the array for seamless infinite scroll */}
            {[...SPONSOR_LOGOS, ...SPONSOR_LOGOS].map((name, i) => (
              <span key={`name-${i}`} className="mx-6 label tracking-widest text-white/30 whitespace-nowrap flex items-center shrink-0">
                {name} <span className="text-artemis-blue/50 ml-12">▹</span>
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
           8. 3D FOOTER
           ══════════════════════════════════════════════════════ */}
      <section id="contact" className="relative z-10 overflow-hidden bg-[#05070B] border-t border-white/10">
        {/* Ambient Cosmic Gas Glows */}
        <div className="absolute -bottom-20 left-[5%] w-[400px] h-[400px] rounded-full bg-artemis-blue/10 blur-[130px] pointer-events-none z-0" />
        <div className="absolute top-[10%] right-[10%] w-[350px] h-[350px] rounded-full bg-stellar-orange/10 blur-[110px] pointer-events-none z-0" />
        
        {/* Starfield overlay inside the footer */}
        <div className="absolute inset-0 opacity-40 starfield z-0 pointer-events-none" />

        <footer className="w-full mt-auto relative z-10 bg-black/45 backdrop-blur-3xl">
          <div className="max-w-7xl mx-auto px-6 py-20 grid grid-cols-1 md:grid-cols-3 gap-16 relative z-10">
            
            {/* Column 1: Brand & Flight Crew */}
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-4">
                <motion.img 
                  src="/branding/logo_4.webp" 
                  alt="Logo" 
                  className="w-12 h-12 object-contain mix-blend-screen"
                  animate={{ y: [0, -6, 0], rotate: [0, 3, -3, 0] }}
                  transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
                />
                <div>
                  <h3 className="h2 font-black tracking-widest hover-glitch-text text-xl">ARTEMIS.6621</h3>
                  <p className="text-[9px] uppercase tracking-widest text-white/40 font-mono">Chatham Central School District</p>
                </div>
              </div>
              
              <div className="flex flex-col gap-1 text-xs text-white/60 font-sans font-light mt-4">
                <span className="text-white/40 uppercase tracking-wider text-[9px] font-semibold mb-1">Launch Coordinator Pad</span>
                <p className="leading-relaxed">50 Woodbridge Ave, Chatham, NY 12037</p>
                <div className="mt-4 flex flex-col gap-2 border-l-2 border-stellar-orange/30 pl-3">
                  <div>
                    <span className="text-[10px] font-mono font-bold text-stellar-orange uppercase block tracking-wider">Lead Flight Director</span>
                    <span className="text-white/85">Mrs. Sandra Fischer (Mentor)</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-mono font-bold text-artemis-blue uppercase block tracking-wider">Systems & Code Director</span>
                    <span className="text-white/85">Mr. Fischer (Mentor)</span>
                  </div>
                </div>
              </div>

              {/* Pulsing Mission Badge */}
              <div className="flex items-center gap-2 mt-4 bg-emerald-500/10 border border-emerald-500/30 px-3.5 py-1.5 rounded-full w-fit">
                <div className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </div>
                <span className="text-[9px] font-mono tracking-widest uppercase text-emerald-400 font-bold">Mission Status: Orbit Stable</span>
              </div>
            </div>

            {/* Column 2: Navigation Map */}
            <div className="flex flex-col gap-4 md:items-center">
              <h4 className="text-[10px] uppercase tracking-widest text-white/40 font-mono font-black mb-2 border-b border-white/10 pb-1 w-fit">
                Star Map Coordinates
              </h4>
              <div className="flex flex-col gap-3 font-sans text-sm md:items-center">
                {NAV_LINKS.map(link => (
                  <a 
                    key={link.label} 
                    href={link.href} 
                    className="text-xs text-white/60 hover:text-stellar-orange transition-colors duration-300 transform hover:translate-x-1 md:hover:translate-x-0 md:hover:-translate-y-0.5 py-2 px-4 block"
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            </div>

            {/* Column 3: Comms Link */}
            <div className="flex flex-col gap-4 md:items-end">
              <h4 className="text-[10px] uppercase tracking-widest text-white/40 font-mono font-black mb-2 border-b border-white/10 pb-1 w-fit">
                Subspace Frequency
              </h4>
              <a 
                href="mailto:fischers@chatham.k12.ny.us" 
                className="text-sm font-bold text-artemis-blue hover:text-stellar-orange transition-colors duration-300 tracking-wider font-mono hover:shadow-[0_0_15px_rgba(37,99,235,0.2)] py-2 px-4 block"
              >
                fischers@chatham.k12.ny.us
              </a>
              
              <div className="flex gap-4 mt-8">
                <a 
                  href="https://www.instagram.com/artemis_6621/" 
                  target="_blank" 
                  className="w-11 h-11 rounded-xl bg-white/[0.02] border border-white/10 backdrop-blur-md flex items-center justify-center transition-all duration-300 hover:border-stellar-orange/50 hover:bg-stellar-orange/5 hover:shadow-[0_0_20px_rgba(249,115,22,0.3)] hover:-translate-y-1"
                >
                  <svg className="w-5 h-5 text-white/80 hover:text-white transition-colors" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                  </svg>
                </a>
                <a 
                  href="https://www.youtube.com/@ArtemisFrc6621" 
                  target="_blank" 
                  className="w-11 h-11 rounded-xl bg-white/[0.02] border border-white/10 backdrop-blur-md flex items-center justify-center transition-all duration-300 hover:border-stellar-orange/50 hover:bg-stellar-orange/5 hover:shadow-[0_0_20px_rgba(249,115,22,0.3)] hover:-translate-y-1"
                >
                  <svg className="w-5 h-5 text-white/80 hover:text-white transition-colors" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                </a>
                <a 
                  href="https://www.thebluealliance.com/team/6621" 
                  target="_blank" 
                  className="w-11 h-11 rounded-xl bg-white/[0.02] border border-white/10 backdrop-blur-md flex items-center justify-center transition-all duration-300 hover:border-stellar-orange/50 hover:bg-stellar-orange/5 hover:shadow-[0_0_20px_rgba(249,115,22,0.3)] hover:-translate-y-1 font-bold text-[9px] uppercase tracking-widest text-white/80 hover:text-white font-mono"
                >
                  TBA
                </a>
              </div>
            </div>

          </div>

          {/* Bottom Copyright and Fine Print */}
          <div className="w-full border-t border-white/5 py-8 text-center flex flex-col gap-3 relative z-10 bg-black/20">
            <p className="text-[10px] text-white/30 max-w-4xl mx-auto leading-relaxed px-6 font-sans font-light">
              Artemis Central Robotics Team 6621 is a student-led organization affiliated with the Chatham Central School District. <br className="hidden md:block"/>
              FIRST® and FIRST® Robotics Competition are registered trademarks of FIRST® (For Inspiration and Recognition of Science and Technology). This website is not officially endorsed by FIRST®.
            </p>
            <p className="text-[9px] uppercase tracking-widest text-white/20 font-mono">&copy; {new Date().getFullYear()} Team 6621 Artemis. All rights reserved.</p>
          </div>
        </footer>
      </section>
      
    </main>
  );
}
