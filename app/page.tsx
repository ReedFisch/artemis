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
    image: "/photos/outreach/origami_for_good.webp",
  },
  {
    tag: "STEAM Advocacy",
    title: "NY State STEAM Day",
    desc: "Advocated for STEAM grants at New York State STEAM Day alongside Assembly Member Didi Barrett. We demonstrated our robot in action and networked with teams statewide to champion the importance of STEAM education.",
    image: "/photos/outreach/steam_day_assembly.webp",
  },
  {
    tag: "Safety First",
    title: "Community Safety Kits",
    desc: "At every competition, we distribute free safety kits to every team - a commitment that earned Safety All-Star awards for Josiah Eugenio (2026) and Reed Fisch (2024).",
    image: "/photos/outreach/community_fair_booth.webp",
  },
  {
    tag: "Mentorship",
    title: "Team 7504 Cybearbots",
    desc: "Met with Cybearbots to advise on fundraising, lead acquisition, and strategy. Helped increase their funding from $15k to $30k in one year. Shared scouting and strategic data at Tech Valley.",
    image: "/photos/outreach/mentorship_growth.webp",
  },
  {
    tag: "Hardware Fixes",
    title: "Battery Clips",
    desc: "At each competition we handed out battery clips to prevent batteries from disconnecting after we experienced that issue at one of our competitions.",
    image: "/photos/outreach/community_fair_booth.webp",
  },
  {
    tag: "Community",
    title: "Wellness & Science Fairs",
    desc: "Gave demonstrations to our community and illustrated the importance of robotics at the Chatham Wellness Fair, Science Fair, and Learning Fair.",
    image: "/photos/outreach/steam_day_assembly.webp",
  },
  {
    tag: "Pipeline",
    title: "Middle School FTC",
    desc: "Continuous partnership, assistance, and advising with our local middle school FTC team (a younger feeder robotics team) to help them with their robot and prepare them for competition.",
    image: "/photos/outreach/mentorship_growth.webp",
  },
  {
    tag: "Networking",
    title: "Ravena STEM Fair",
    desc: "Representation and demonstration at Ravena STEM fair where we network and demonstrate the importance of FRC with other robotics teams from around the state.",
    image: "/photos/outreach/origami_for_good.webp",
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

  const y = useTransform(
    scrollYProgress,
    [i0, i1, i2, i3, i4, i5],
    ["120%", "120%", "0%", "0%", "-120%", "-120%"]
  );
  
  const opacity = useTransform(
    scrollYProgress,
    [i0, i1, i2, i3, i4, i5],
    [0, 0, 1, 1, 0, 0]
  );

  return (
    <motion.div 
      style={{ y, opacity }} 
      className="absolute inset-0 w-full h-full flex flex-col justify-end rounded-[2rem] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/10 group"
    >
      <img src={card.image} alt={card.title} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#05070B] via-[#05070B]/50 to-transparent opacity-90" />
      
      <div className="relative z-10 p-8 backdrop-blur-md bg-white/[0.03] border-t border-white/10">
        <span className="text-[10px] font-bold tracking-widest uppercase text-stellar-orange mb-3 block">{card.tag}</span>
        <h3 className="text-2xl md:text-3xl font-header font-bold mb-4 text-white">{card.title}</h3>
        <p className="text-xs md:text-sm text-white/70 leading-relaxed font-light">{card.desc}</p>
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
    
    let targetPosition = 0;
    
    // Special handling for the horizontal timeline section
    if (actualTargetId === '#timeline') {
      const aboutSection = document.querySelector('#about') as HTMLElement;
      if (!aboutSection) return;
      // Scroll to 41% progress of the 400vh section to align timeline to the left edge
      targetPosition = aboutSection.getBoundingClientRect().top + window.scrollY + 0.41 * (3 * window.innerHeight);
    } else {
      const target = document.querySelector(actualTargetId);
      if (!target) return;
      targetPosition = target.getBoundingClientRect().top + window.scrollY;
    }
    
    const startPosition = window.scrollY;
    const distance = targetPosition - startPosition;
    const duration = 600; // Smooth but fast scroll (600ms)
    let start: number | null = null;
    
    const step = (timestamp: number) => {
      if (!start) start = timestamp;
      const progress = timestamp - start;
      const easeInOutCubic = progress < duration / 2 
        ? 4 * Math.pow(progress / duration, 3) 
        : 1 - Math.pow(-2 * (progress / duration) + 2, 3) / 2;
        
      window.scrollTo(0, startPosition + distance * Math.min(easeInOutCubic, 1));
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
    
    const onAssetLoaded = () => {
      loadedCount++;
      if (loadedCount >= totalToLoad) {
        setIsLoading(false);
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
    offset: ["start start", "end end"]
  });
  const xAboutToTimeline = useTransform(
    horizontalScrollYProgress, 
    [0, 0.15, 0.85, 1], 
    ["0vw", "-5vw", "-270vw", "-270vw"]
  );
  const yAboutToTimeline = useTransform(
    horizontalScrollYProgress,
    [0, 0.85, 1],
    ["0vh", "0vh", "-10vh"]
  );

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

      {/* Faint Star Background */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
        <div className="absolute inset-0 opacity-30" style={{ backgroundImage: 'radial-gradient(1px 1px at 20px 30px, #ffffff, rgba(0,0,0,0)), radial-gradient(1px 1px at 40px 70px, #ffffff, rgba(0,0,0,0)), radial-gradient(1.5px 1.5px at 90px 40px, #ffffff, rgba(0,0,0,0)), radial-gradient(2px 2px at 160px 120px, #ffffff, rgba(0,0,0,0)), radial-gradient(1px 1px at 200px 50px, #ffffff, rgba(0,0,0,0))', backgroundSize: '300px 300px' }} />
      </div>

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
            {/* Plain Starry Background */}
            <div className="absolute inset-0 z-0 opacity-40 starfield" />
            
            {/* Artemis Logo Floating Above */}
            <div className="relative z-20 mb-8 w-40 h-40 flex items-center justify-center">
              <img src="/branding/logo_4.webp" alt="Artemis Loading" className="w-full h-full animate-pulse object-contain" />
            </div>

            {/* 3D Solar System Container */}
            <div className="relative z-10 w-full max-w-[600px] h-[300px] flex items-center justify-center perspective-[1000px]">
              
              {/* The Sun */}
              <div className="relative z-20 w-16 h-16 rounded-full animate-pulse" style={{ background: 'radial-gradient(circle at 50% 50%, #ffffff 0%, #fef08a 40%, #eab308 100%)', boxShadow: '0 0 80px 20px rgba(250,204,21,0.4)' }} />

              {/* Orbit 1: Inner Planet */}
              <div className="absolute w-[250px] h-[250px] transform-style preserve-3d" style={{ transform: 'rotateX(70deg)' }}>
                <motion.div 
                  animate={{ rotateZ: 360 }} 
                  transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                  className="w-full h-full border border-white/20 rounded-full transform-style preserve-3d"
                >
                  <motion.div 
                    animate={{ rotateZ: -360 }}
                    transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                    className="absolute top-0 left-1/2 -ml-3 -mt-3 w-6 h-6 transform-style preserve-3d" 
                  >
                    <div className="w-full h-full rounded-full shadow-[0_0_15px_rgba(37,99,235,0.8),inset_-2px_-2px_6px_rgba(0,0,0,0.6)] transform-style preserve-3d" style={{ transform: 'rotateX(-70deg)', background: 'radial-gradient(circle at 30% 30%, #60a5fa 0%, #1d4ed8 70%, #020617 100%)' }}>
                      <motion.div animate={{ rotateY: 360 }} transition={{ duration: 3, repeat: Infinity, ease: "linear" }} className="absolute inset-0 rounded-full border border-white/30" />
                      <motion.div animate={{ rotateX: 360 }} transition={{ duration: 4, repeat: Infinity, ease: "linear" }} className="absolute inset-0 rounded-full border border-white/30" />
                    </div>
                  </motion.div>
                </motion.div>
              </div>

              {/* Orbit 2: Middle Planet */}
              <div className="absolute w-[400px] h-[400px] transform-style preserve-3d" style={{ transform: 'rotateX(70deg)' }}>
                <motion.div 
                  animate={{ rotateZ: -360 }} 
                  transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
                  className="w-full h-full border border-white/10 rounded-full transform-style preserve-3d"
                >
                  <motion.div 
                    animate={{ rotateZ: 360 }}
                    transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
                    className="absolute top-0 left-1/2 -ml-4 -mt-4 w-8 h-8 transform-style preserve-3d" 
                  >
                    <div className="w-full h-full rounded-full shadow-[0_0_15px_rgba(168,85,247,0.8),inset_-2px_-2px_6px_rgba(0,0,0,0.6)] transform-style preserve-3d" style={{ transform: 'rotateX(-70deg)', background: 'radial-gradient(circle at 30% 30%, #c084fc 0%, #7e22ce 70%, #020617 100%)' }}>
                      <motion.div animate={{ rotateY: -360 }} transition={{ duration: 3, repeat: Infinity, ease: "linear" }} className="absolute inset-0 rounded-full border border-white/30" />
                      <motion.div animate={{ rotateX: -360 }} transition={{ duration: 4, repeat: Infinity, ease: "linear" }} className="absolute inset-0 rounded-full border border-white/30" />
                    </div>
                  </motion.div>
                </motion.div>
              </div>

              {/* Orbit 3: Outer Planet */}
              <div className="absolute w-[550px] h-[550px] transform-style preserve-3d" style={{ transform: 'rotateX(70deg)' }}>
                <motion.div 
                  animate={{ rotateZ: 360 }} 
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  className="w-full h-full border border-white/5 rounded-full transform-style preserve-3d"
                >
                  <motion.div 
                    animate={{ rotateZ: -360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="absolute top-0 left-1/2 -ml-5 -mt-5 w-10 h-10 transform-style preserve-3d" 
                  >
                    <div className="w-full h-full rounded-full shadow-[0_0_20px_rgba(249,115,22,0.8),inset_-3px_-3px_8px_rgba(0,0,0,0.6)] transform-style preserve-3d" style={{ transform: 'rotateX(-70deg)', background: 'radial-gradient(circle at 30% 30%, #fb923c 0%, #c2410c 70%, #020617 100%)' }}>
                      <motion.div animate={{ rotateY: 360 }} transition={{ duration: 3, repeat: Infinity, ease: "linear" }} className="absolute inset-0 rounded-full border border-white/30" />
                      <motion.div animate={{ rotateX: 360 }} transition={{ duration: 4, repeat: Infinity, ease: "linear" }} className="absolute inset-0 rounded-full border border-white/30" />
                    </div>
                  </motion.div>
                </motion.div>
              </div>

            </div>

            {/* Loading Text */}
            <div className="absolute bottom-20 z-10 flex flex-col items-center">
              <div className="font-header font-black tracking-[0.4em] text-lg lg:text-xl uppercase text-white/90 animate-pulse">Initializing System</div>
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

          <motion.div className="absolute inset-0 z-10" style={{ opacity: fadeOutHeroLiquid }}>
            {/* HEADER */}
        



          </motion.div>

          {/* 3. Overlays (Header and Sponsor) */}
          <motion.header 
            className="absolute top-0 left-0 w-full z-50 flex justify-between items-center px-12 py-8 pointer-events-auto"
          >
          <div className="flex items-center gap-4">
            <img src="/branding/logo_4.webp" alt="Artemis Logo" className="w-12 h-12 opacity-80 mix-blend-screen object-contain" />
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
      <section ref={horizontalScrollRef} id="about" className="relative w-full z-10" style={{ height: '400vh', scrollSnapAlign: 'start' }}>
        
        {/* Seamless Fade FROM Hero Section */}
        <div className="absolute top-0 left-0 w-full h-[100vh] bg-gradient-to-b from-black via-black/50 to-transparent pointer-events-none z-30" />
        
        {/* Sticky container that holds the horizontal sliding content */}
        <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center">
          
          <motion.div style={{ x: xAboutToTimeline, y: yAboutToTimeline }} className="flex w-[370vw] h-full relative z-10">
            
            {/* Section background gradient & floating shapes (scrolling with the content) */}
            <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden topography-bg opacity-40" aria-hidden="true" style={{ width: '370vw' }}>
              {/* Starfield */}
              <div className="absolute inset-0 opacity-50" style={{ backgroundImage: 'radial-gradient(1px 1px at 20px 30px, #ffffff, rgba(0,0,0,0)), radial-gradient(1.5px 1.5px at 80px 140px, #ffffff, rgba(0,0,0,0)), radial-gradient(2px 2px at 150px 70px, #ffffff, rgba(0,0,0,0)), radial-gradient(1px 1px at 250px 200px, #ffffff, rgba(0,0,0,0)), radial-gradient(1px 1px at 300px 50px, #ffffff, rgba(0,0,0,0))', backgroundSize: '350px 350px' }} />
            </div>

            {/* --- ABOUT US PANE (100vw) --- */}
            <div className="w-[100vw] h-full flex flex-col pt-16 md:pt-20 pb-[10vh] px-6 md:px-12 relative z-10">
              
              {/* Scattered 3D Shapes */}
              <motion.div animate={{ rotateX: 360, rotateY: 360 }} transition={{ duration: 40, repeat: Infinity, ease: 'linear' }} className="shape-3d shape-ring absolute top-[20%] left-[10%] w-48 h-48 opacity-30 z-0 pointer-events-none" />
              <motion.div animate={{ rotateZ: 360 }} transition={{ duration: 30, repeat: Infinity, ease: 'linear' }} className="shape-3d shape-diamond absolute bottom-[15%] right-[15%] w-32 h-32 opacity-40 z-0 pointer-events-none" />
              
              {/* Offset removed to center it normally now that x-axis isn't shifting early */}
              <div className="max-w-7xl mx-auto w-full flex flex-col lg:flex-row gap-6 lg:gap-10 items-stretch h-auto mt-4">
                
                {/* Left Side: About Text */}
                <div className="lg:w-1/2 flex flex-col space-y-6 p-8 md:p-10 rounded-[2rem] transform-style preserve-3d shadow-[0_10px_50px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.1)] justify-between h-full relative overflow-hidden backdrop-blur-3xl border border-white/10" style={{ background: 'rgba(255,255,255,0.02)' }}>
                  <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
                  
                  <div className="relative z-10">
                    <h2 className="text-4xl md:text-5xl font-header font-black text-white">
                      About Us
                    </h2>
                    <p className="text-base text-white/60 leading-relaxed font-light mt-6">
                      Founded in 2016, Team 6621 Artemis Robotics is the only FRC team in Columbia County. We represent Chatham High School not only as the only robotics team but as the sole technology and STEAM-centered club for the entire school. We allow students to learn as they desire, advance their STEAM interests, whether that be art, business, or stem there is a place for anyone and everyone at ARTEMIS.
                    </p>
                  </div>
                  
                  <div className="space-y-8 relative z-10 mt-auto">
                    {/* Sleek white divider */}
                    <div className="h-px w-full" style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2) 30%, rgba(255,255,255,0.1) 70%, transparent)' }} />
                    
                    {/* Mission Box (Glassy, No colors) */}
                    <div className="p-6 md:p-8 rounded-[1.5rem] relative overflow-hidden group hover:scale-[1.02] transition-transform duration-500 backdrop-blur-2xl border border-white/10" style={{ background: 'linear-gradient(135deg, rgba(37,99,235,0.08) 0%, rgba(249,115,22,0.05) 100%)', boxShadow: '0 10px 40px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.1)' }}>
                      <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      <h3 className="text-2xl font-header font-bold mb-3 text-white tracking-wide">Our Mission</h3>
                      <p className="text-base text-white/70 italic leading-relaxed font-light">
                        &quot;Our mission is to cultivate a welcoming environment centered on STEAM learning and values of gracious professionalism regardless of background.&quot;
                      </p>
                    </div>
                    
                    {/* About FRC Chip & Text */}
                    <div className="flex items-center gap-6 p-5 rounded-[1.5rem] border border-white/10 backdrop-blur-2xl hover:bg-white/[0.08] transition-colors duration-300 shadow-[0_8px_32px_rgba(0,0,0,0.3)]" style={{ background: 'linear-gradient(90deg, rgba(37,99,235,0.05) 0%, rgba(255,255,255,0.02) 100%)' }}>
                      <a href="https://www.firstinspires.org/robotics/frc" target="_blank" rel="noopener noreferrer" className="shrink-0 px-8 py-3 rounded-full text-xs font-bold uppercase tracking-widest transition-all duration-400 hover:scale-105 text-white" style={{ background: 'linear-gradient(90deg, rgba(37,99,235,0.3) 0%, rgba(249,115,22,0.2) 100%)', border: '1px solid rgba(255,255,255,0.2)', boxShadow: '0 8px 24px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.2)' }}>About FRC →</a>
                      <p className="text-xs text-white/50 font-light leading-snug">We compete in FIRST Robotics Competition, the world's largest high school robotics program.</p>
                    </div>
                  </div>
                </div>

                {/* Right Side: Photo and Stats */}
                <div className="lg:w-1/2 w-full flex flex-col gap-6 h-full">
                  {/* Team Photo */}
                  <div className="relative rounded-[2rem] overflow-hidden border border-white/10 group flex-grow" style={{ boxShadow: '0 10px 40px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.1)' }}>
                    <img src="/photos/hero/team_with_robot.webp" alt="Team 6621 Artemis with their robot" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                    <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, transparent 50%)' }} />
                    <div className="absolute bottom-0 left-0 right-0 p-8 flex justify-between items-end">
                      <div>
                        <p className="text-[10px] uppercase tracking-widest text-white/50 mb-1">Team 6621</p>
                        <p className="text-2xl font-header font-bold text-white">Artemis Robotics</p>
                      </div>
                      <span className="text-[10px] uppercase tracking-widest text-white/40">Chatham, NY</span>
                    </div>
                  </div>
                  {/* Compact stat row */}
                  <div className="grid grid-cols-3 gap-5 shrink-0" style={{ perspective: '800px' }}>
                    <div className="relative p-6 text-center rounded-[1.5rem] overflow-hidden transition-all duration-500 hover:-translate-y-2 group cursor-default" style={{ background: 'rgba(255,255,255,0.03)', backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 10px 30px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.1)' }}>
                      <div className="absolute top-0 left-[10%] right-[10%] h-[40%] rounded-b-full opacity-60" style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.1) 0%, transparent 100%)' }} />
                      <h4 className="text-3xl font-header font-black text-white relative z-10"><Counter to={2016} duration={1.5} /></h4>
                      <p className="text-[9px] uppercase tracking-widest text-white/50 mt-2 relative z-10">Founded</p>
                    </div>
                    <div className="relative p-6 text-center rounded-[1.5rem] overflow-hidden transition-all duration-500 hover:-translate-y-2 group cursor-default" style={{ background: 'rgba(255,255,255,0.03)', backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 10px 30px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.1)' }}>
                      <div className="absolute top-0 left-[10%] right-[10%] h-[40%] rounded-b-full opacity-60" style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.1) 0%, transparent 100%)' }} />
                      <h4 className="text-3xl font-header font-black text-white relative z-10"><Counter to={60} duration={2} format={(v) => `${v}%`} /></h4>
                      <p className="text-[9px] uppercase tracking-widest text-white/50 mt-2 relative z-10">New Members</p>
                    </div>
                    <div className="relative p-6 text-center rounded-[1.5rem] overflow-hidden transition-all duration-500 hover:-translate-y-2 group cursor-default" style={{ background: 'rgba(255,255,255,0.03)', backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 10px 30px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.1)' }}>
                      <div className="absolute top-0 left-[10%] right-[10%] h-[40%] rounded-b-full opacity-60" style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.1) 0%, transparent 100%)' }} />
                      <h4 className="text-3xl font-header font-black text-white relative z-10"><Counter to={5000} duration={2.5} format={(v) => `${v.toLocaleString()}+`} /></h4>
                      <p className="text-[9px] uppercase tracking-widest text-white/50 mt-2 relative z-10">Hours This Season</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* --- TIMELINE PANE (270vw) --- */}
            <div id="timeline" className="w-[270vw] h-full relative z-10 overflow-hidden">
              
              {/* 2024 SECTION (0vw to 70vw) */}
              <div className="absolute top-[35%] left-[5vw] w-[28vw] max-w-[400px] bg-black/40 backdrop-blur-xl border border-white/20 p-6 rounded-2xl shadow-[0_0_50px_rgba(37,99,235,0.2)] z-30 transform -rotate-1">
                <h4 className="text-artemis-blue font-header font-bold text-2xl mb-4 tracking-widest uppercase" style={{ textShadow: '0 0 10px rgba(37,99,235,0.8)' }}>2024 Season</h4>
                <ul className="text-white/80 font-mono text-xs leading-relaxed space-y-3 list-none">
                  <li className="flex items-start gap-2"><span className="text-artemis-blue mt-1">▹</span> <div>Creativity Award</div></li>
                  <li className="flex items-start gap-2"><span className="text-artemis-blue mt-1">▹</span> <div>First Leadership Award Finalist <br/><span className="text-[10px] text-white/40">(Eion Henchey)</span></div></li>
                  <li className="flex items-start gap-2"><span className="text-artemis-blue mt-1">▹</span> <div>Safety All-Star <br/><span className="text-[10px] text-white/40">(Reed Fisch)</span></div></li>
                </ul>
              </div>
              <img src="/timeline/1.webp" alt="2024 Event" className="absolute top-[5%] left-[28vw] w-[35vw] max-w-[400px] rounded-[3rem] shadow-[0_0_40px_rgba(255,255,255,0.1)] object-cover z-20 hover:scale-[1.05] hover:z-40 transition-all duration-500 transform rotate-2" />
              <img src="/timeline/3.webp" alt="2024 Mentors" className="absolute bottom-[15%] left-[15vw] w-[40vw] max-w-[450px] rounded-[3rem] shadow-[0_0_40px_rgba(37,99,235,0.2)] object-cover z-20 hover:scale-[1.05] hover:z-40 transition-all duration-500 transform -rotate-2" />

              {/* 2025 SECTION (80vw to 150vw) */}
              <div className="absolute top-[25%] left-[80vw] w-[28vw] max-w-[400px] bg-black/40 backdrop-blur-xl border border-white/20 p-6 rounded-2xl shadow-[0_0_50px_rgba(249,115,22,0.2)] z-30 transform rotate-1">
                <h4 className="text-stellar-orange font-header font-bold text-2xl mb-4 tracking-widest uppercase" style={{ textShadow: '0 0 10px rgba(249,115,22,0.8)' }}>2025 Season</h4>
                <ul className="text-white/80 font-mono text-xs leading-relaxed space-y-3 list-none">
                  <li className="flex items-start gap-2"><span className="text-stellar-orange mt-1">▹</span> <div>Ranked #3 in New York State</div></li>
                  <li className="flex items-start gap-2"><span className="text-stellar-orange mt-1">▹</span> <div>New York Tech Valley Regional Winner</div></li>
                  <li className="flex items-start gap-2"><span className="text-stellar-orange mt-1">▹</span> <div>Worlds Alliance Captain <br/><span className="text-[10px] text-white/40">(Hopper Division)</span></div></li>
                  <li className="flex items-start gap-2"><span className="text-stellar-orange mt-1">▹</span> <div>Ballston Spa Off-Season Competition Finalist</div></li>
                </ul>
              </div>
              <img src="/timeline/2025_1_new.jpg" alt="2025 Winner" className="absolute bottom-[15%] left-[90vw] w-[45vw] max-w-[600px] rounded-[3rem] shadow-[0_0_60px_rgba(249,115,22,0.3)] object-cover z-20 hover:scale-[1.05] hover:z-40 transition-all duration-500 transform rotate-1" />
              <img src="/timeline/2025_2_new.jpg" alt="2025 Celebration" className="absolute top-[10%] left-[115vw] w-[35vw] max-w-[500px] rounded-[3rem] shadow-[0_0_40px_rgba(255,255,255,0.1)] object-cover z-20 hover:scale-[1.05] hover:z-40 transition-all duration-500 transform -rotate-2" />

              {/* 2026 SECTION (160vw to 270vw) */}
              <div className="absolute top-[45%] left-[150vw] w-[28vw] max-w-[400px] bg-black/40 backdrop-blur-xl border border-white/20 p-6 rounded-2xl shadow-[0_0_50px_rgba(37,99,235,0.2)] z-30 transform -rotate-1">
                <h4 className="text-artemis-blue font-header font-bold text-2xl mb-4 tracking-widest uppercase" style={{ textShadow: '0 0 10px rgba(37,99,235,0.8)' }}>2026 Season</h4>
                <ul className="text-white/80 font-mono text-xs leading-relaxed space-y-3 list-none">
                  <li className="flex items-start gap-2"><span className="text-artemis-blue mt-1">▹</span> <div>Hudson Valley Regional <br/><span className="text-[10px] text-white/40">Alliance 3</span></div></li>
                  <li className="flex items-start gap-2"><span className="text-artemis-blue mt-1">▹</span> <div>Tech Valley Regional <br/><span className="text-[10px] text-white/40">Alliance 5</span></div></li>
                  <li className="flex items-start gap-2"><span className="text-artemis-blue mt-1">▹</span> <div>Safety All-Star <br/><span className="text-[10px] text-white/40">(Josiah Eugenio)</span></div></li>
                </ul>
              </div>
              <img src="/timeline/2026_1.jpg" alt="2026 Event" className="absolute bottom-[15%] left-[180vw] w-[35vw] max-w-[450px] rounded-[3rem] shadow-[0_0_40px_rgba(255,255,255,0.1)] object-cover z-20 hover:scale-[1.05] hover:z-40 transition-all duration-500 transform rotate-3" />
              <img src="/timeline/2026_2.jpg" alt="2026 Team" className="absolute top-[15%] left-[215vw] w-[40vw] max-w-[500px] rounded-[3rem] shadow-[0_0_50px_rgba(37,99,235,0.2)] object-cover z-20 hover:scale-[1.05] hover:z-40 transition-all duration-500 transform -rotate-2" />

            </div>
            </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
           5. OUTREACH CAROUSEL
           ══════════════════════════════════════════════════════ */}
      <section id="outreach" ref={outreachScrollRef} className="relative z-10" style={{ height: '700vh' }}>
        <div className="sticky top-0 h-screen w-full flex flex-col items-center overflow-hidden pt-24 pb-12">
          {/* Background Elements */}
          <motion.div animate={{ x: [0, 30, -30, 0], y: [0, 20, -20, 0], rotateX: 360 }} transition={{ duration: 25, repeat: Infinity, ease: 'linear' }} whileHover={{ scale: 1.2, cursor: 'pointer' }} className="shape-3d shape-sphere absolute top-[10%] left-[5%] w-32 h-32 opacity-50 z-0 pointer-events-auto" />
          <motion.div animate={{ x: [0, 40, -20, 0], y: [0, -30, 20, 0], rotateY: 360 }} transition={{ duration: 20, repeat: Infinity, ease: 'linear' }} whileHover={{ scale: 1.2, cursor: 'pointer' }} className="shape-3d shape-ring absolute bottom-[20%] right-[10%] w-40 h-40 opacity-40 z-0 pointer-events-auto" />
          
          <div className="max-w-7xl mx-auto px-6 w-full text-center mb-8 relative z-10 shrink-0">
            <h2 className="text-4xl md:text-6xl font-header font-black text-white/60 tracking-wide">
              Outreach Programs
            </h2>
          </div>
          
          {/* Parallax Grid Container */}
          <div className="max-w-7xl mx-auto px-6 w-full flex-grow relative z-10 mb-8">
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
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
           6. BUDGET & SPONSORS
           ══════════════════════════════════════════════════════ */}
      <section id="budget" className="snap-section relative z-10 overflow-hidden">
        {/* Scattered 3D Shapes Interacting with Cursor and scrolling vertically */}
        <motion.div animate={{ x: [0, 25, -15, 0], y: [0, -25, 15, 0] }} transition={{ duration: 15, repeat: Infinity, ease: 'linear' }} style={{ animationDelay: '3s', animationDuration: '14s' }} whileHover={{ scale: 1.2, rotateX: 180, rotateY: 180, cursor: 'pointer' }} whileTap={{ scale: 0.8, rotateZ: 360, borderRadius: '100%' }} className="shape-3d shape-cube absolute top-[40%] left-[8%] w-24 h-24 opacity-50 z-0 pointer-events-auto" />
        <motion.div animate={{ x: [0, -30, 30, 0], y: [0, 40, -20, 0] }} transition={{ duration: 22, repeat: Infinity, ease: 'linear' }} style={{ animationDelay: '0s', animationDuration: '12s' }} whileHover={{ scale: 1.2, rotateX: 180, rotateY: 180, cursor: 'pointer' }} whileTap={{ scale: 0.8, rotateZ: 360, borderRadius: '100%' }} className="shape-3d shape-sphere absolute bottom-[15%] left-[85%] w-36 h-36 opacity-60 z-0 pointer-events-auto" />
        
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
                <img src="/branding/logo_4.webp" alt="Logo" className="w-10 h-10 object-contain mix-blend-screen" />
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
