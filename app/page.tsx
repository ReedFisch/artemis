"use client";

import React, { useEffect, useState, useRef } from "react";

// Types corresponding to rule-defined schemas
interface SponsorshipInterestPayload {
  companyName: string;
  contactName: string;
  email: string;
  phone?: string;
  interestedTier: "Hermes" | "Apollo" | "ZEUS" | "Other";
  message: string;
}

// Letter Explosion Physics (Calculated dynamically)
const HERO_TITLE = "ARTEMIS";
const TITLE_LETTERS = HERO_TITLE.split("");
const LETTER_PHYSICS = TITLE_LETTERS.map((_, i) => {
  const angleDeg = 150 - (i / (TITLE_LETTERS.length - 1)) * 120; // Fan from 150° (upper-left) to 30° (upper-right)
  const angleRad = (angleDeg * Math.PI) / 180;
  const speed = 20 + Math.random() * 15;
  const rotateSpeed = (Math.random() - 0.5) * 240;
  return { angleRad, speed, rotateSpeed };
});

export default function Home() {
  // Mounting & Loading state
  const [isLoading, setIsLoading] = useState(true);

  // Form states
  const [selectedTier, setSelectedTier] = useState<"Hermes" | "Apollo" | "ZEUS" | "Other">("Apollo");
  
  // Sponsorship Form Payload
  const [sponsorForm, setSponsorForm] = useState<SponsorshipInterestPayload>({
    companyName: "",
    contactName: "",
    email: "",
    phone: "",
    interestedTier: "Apollo",
    message: "",
  });
  
  const [isSubmittingSponsor, setIsSubmittingSponsor] = useState(false);
  const [sponsorSuccess, setSponsorSuccess] = useState(false);
  const [sponsorReceipt, setSponsorReceipt] = useState<any>(null);

  // General Contact Form Payload
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmittingContact, setIsSubmittingContact] = useState(false);
  const [contactSuccess, setContactSuccess] = useState(false);

  // Navigation states
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");

  // Canvas Sequence simulation
  const heroContainerRef = useRef<HTMLDivElement>(null);

  // Star backdrop layers
  const [starsSmall, setStarsSmall] = useState("");
  const [starsMedium, setStarsMedium] = useState("");

  // Populate stars on client mount
  useEffect(() => {
    const generateStars = (count: number) => {
      const shadows = [];
      for (let i = 0; i < count; i++) {
        const x = Math.floor(Math.random() * 2000);
        const y = Math.floor(Math.random() * 2000);
        const opacity = (Math.random() * 0.5 + 0.3).toFixed(2);
        shadows.push(`${x}px ${y}px 0 0px rgba(255, 255, 255, ${opacity})`);
      }
      return shadows.join(", ");
    };
    setStarsSmall(generateStars(200));
    setStarsMedium(generateStars(50));
  }, []);

  // End loading after timeout simulating asset preheating
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1300);
    return () => clearTimeout(timer);
  }, []);

  // Listen to scroll to update fanning calculations and navigation triggers
  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          if (heroContainerRef.current) {
            const { top, height } = heroContainerRef.current.getBoundingClientRect();
            const maxScroll = height - window.innerHeight;
            const progress = Math.max(0, Math.min(1, -top / maxScroll));
            document.documentElement.style.setProperty('--scroll-progress', progress.toString());
          }

          // Check current section active status
          const sections = ["hero", "about", "outreach", "budget", "tiers", "pay", "contact"];
          const scrollPosition = window.scrollY + 200;

          for (const section of sections) {
            const el = document.getElementById(section);
            if (el) {
              const top = el.offsetTop;
              const height = el.offsetHeight;
              if (scrollPosition >= top && scrollPosition < top + height) {
                setActiveSection(section);
                break;
              }
            }
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Handle tier selection and scroll to simulated Pay Form
  const handleSelectTier = (tier: "Hermes" | "Apollo" | "ZEUS" | "Other") => {
    setSelectedTier(tier);
    setSponsorForm((prev) => ({ ...prev, interestedTier: tier }));
    const paySection = document.getElementById("pay");
    if (paySection) {
      paySection.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Submit sponsorship pay/form
  const handleSponsorSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingSponsor(true);

    // Mock API dispatch
    setTimeout(() => {
      setIsSubmittingSponsor(false);
      setSponsorSuccess(true);
      
      // Complete payload format validation logged to console matching gemini.md
      const payload: SponsorshipInterestPayload = {
        companyName: sponsorForm.companyName || "Acme Space Corp",
        contactName: sponsorForm.contactName || "John Doe",
        email: sponsorForm.email || "sponsor@acme.org",
        phone: sponsorForm.phone || undefined,
        interestedTier: sponsorForm.interestedTier,
        message: sponsorForm.message || "Excited to support Team 6621!",
      };
      
      console.log("🚀 sponsorship interest payload valid:", payload);
      setSponsorReceipt(payload);
    }, 1500);
  };

  // Submit contact form
  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingContact(true);
    setTimeout(() => {
      setIsSubmittingContact(false);
      setContactSuccess(true);
      console.log("📩 contact inquiry sent:", contactForm);
    }, 1200);
  };

  // Letter styling helper
  const getLetterStyle = (i: number): React.CSSProperties => {
    const p = LETTER_PHYSICS[i];
    const dx = Math.cos(p.angleRad) * p.speed;
    const dy = -Math.sin(p.angleRad) * p.speed;
    const rotation = p.rotateSpeed;

    return {
      display: "inline-block",
      transform: `translate(calc(var(--scroll-progress, 0) * ${dx}vw), calc(var(--scroll-progress, 0) * ${dy}vh)) rotate(calc(var(--scroll-progress, 0) * ${rotation}deg))`,
      opacity: `calc(1 - var(--scroll-progress, 0) * 4.5)`,
      willChange: "transform, opacity",
    };
  };

  return (
    <div className="relative min-h-screen bg-[#05070B] text-white selection:bg-artemis-blue/30 overflow-hidden font-sans">
      
      {/* Dynamic Star Backdrop (Depth Layer) */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div 
          className="absolute w-px h-px rounded-full opacity-60" 
          style={{ boxShadow: starsSmall }} 
        />
        <div 
          className="absolute w-0.5 h-0.5 rounded-full opacity-80" 
          style={{ boxShadow: starsMedium }} 
        />
      </div>

      {/* 🟢 ORBITAL LOADING SKELETON SCREEN */}
      <div 
        className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#05070B] transition-all duration-1000 ease-in-out ${
          isLoading ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"
        }`}
      >
        <div className="relative w-44 h-44 flex items-center justify-center">
          {/* Inner Glowing Core */}
          <div className="absolute w-12 h-12 rounded-full bg-[#05070B] border border-artemis-blue/30 shadow-[0_0_30px_rgba(37,99,235,0.4)] flex items-center justify-center animate-pulse">
            <span className="text-xs font-bold text-artemis-blue/80 tracking-widest font-header">6621</span>
          </div>
          {/* Orbital Ring 1 */}
          <div className="absolute inset-0 rounded-full border border-dashed border-white/5 animate-[spin_10s_linear_infinite]" />
          {/* Orbital Ring 2 */}
          <div className="absolute inset-4 rounded-full border border-white/10 animate-[spin-slow_6s_linear_infinite]" />
          {/* Orbiting Planet Dot */}
          <div className="absolute w-3.5 h-3.5 rounded-full bg-stellar-orange shadow-[0_0_15px_rgba(249,115,22,0.8)] animate-[orbit_3s_linear_infinite]" />
          <div className="absolute w-2 h-2 rounded-full bg-artemis-blue shadow-[0_0_10px_rgba(37,99,235,0.8)] animate-[orbit_2s_linear_infinite_reverse]" style={{ animationDelay: "-1s" }} />
        </div>
        <div className="mt-8 flex flex-col items-center space-y-2">
          <p className="text-sm font-semibold tracking-[0.3em] text-white/50 uppercase font-header animate-pulse">
            Preheating Star Systems
          </p>
          <div className="w-48 h-0.5 bg-white/5 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-artemis-blue to-stellar-orange animate-[shimmer_2s_infinite]" style={{ backgroundSize: "200% 100%" }} />
          </div>
        </div>
      </div>

      {/* 🪐 STICKY GLASS HEADER */}
      <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="glass-frosted rounded-2xl px-6 py-3 flex items-center justify-between border border-white/5 shadow-2xl">
            {/* Logo area */}
            <a href="#hero" className="flex items-center space-x-3 group">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-artemis-blue/40 to-stellar-orange/40 flex items-center justify-center border border-white/10 group-hover:border-stellar-orange/30 transition-colors">
                <span className="font-header font-black text-white text-base tracking-wider">A</span>
              </div>
              <span className="font-header font-black tracking-widest text-lg group-hover:text-artemis-blue transition-colors">
                ARTEMIS<span className="text-stellar-orange">.6621</span>
              </span>
            </a>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center space-x-8 text-xs font-semibold uppercase tracking-wider text-white/60">
              <a 
                href="#about" 
                className={`hover:text-white transition-colors ${activeSection === "about" ? "text-artemis-blue" : ""}`}
              >
                About
              </a>
              <a 
                href="#outreach" 
                className={`hover:text-white transition-colors ${activeSection === "outreach" ? "text-artemis-blue" : ""}`}
              >
                Outreach
              </a>
              <a 
                href="#budget" 
                className={`hover:text-white transition-colors ${activeSection === "budget" ? "text-artemis-blue" : ""}`}
              >
                Budget
              </a>
              <a 
                href="#tiers" 
                className={`hover:text-white transition-colors ${activeSection === "tiers" ? "text-artemis-blue" : ""}`}
              >
                Tiers
              </a>
              <a 
                href="#contact" 
                className={`hover:text-white transition-colors ${activeSection === "contact" ? "text-artemis-blue" : ""}`}
              >
                Contact
              </a>
            </nav>

            {/* CTA action buttons */}
            <div className="hidden md:flex items-center space-x-4">
              <a 
                href="#pay"
                className="px-5 py-2 text-xs font-bold uppercase tracking-wider text-white bg-transparent border border-white/10 rounded-full hover:bg-white/5 transition-all duration-300"
              >
                Checkout Terminal
              </a>
              <a 
                href="#tiers"
                className="px-5 py-2 text-xs font-bold uppercase tracking-wider text-black bg-white rounded-full hover:bg-stellar-orange hover:text-white shadow-[0_0_15px_rgba(255,255,255,0.1)] hover:shadow-[0_0_20px_rgba(249,115,22,0.4)] transition-all duration-300"
              >
                Sponsor Us
              </a>
            </div>

            {/* Hamburger Button */}
            <button 
              className="md:hidden flex flex-col space-y-1.5 p-2"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <div className={`w-6 h-0.5 bg-white transition-transform ${isMobileMenuOpen ? "transform rotate-45 translate-y-2" : ""}`} />
              <div className={`w-6 h-0.5 bg-white transition-opacity ${isMobileMenuOpen ? "opacity-0" : ""}`} />
              <div className={`w-6 h-0.5 bg-white transition-transform ${isMobileMenuOpen ? "transform -rotate-45 -translate-y-2" : ""}`} />
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Nav */}
        <div 
          className={`fixed inset-0 top-[88px] z-40 bg-[#05070B]/98 backdrop-blur-xl border-b border-white/5 transition-all duration-500 ease-in-out ${
            isMobileMenuOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-10 pointer-events-none"
          }`}
        >
          <div className="flex flex-col items-center justify-center h-[calc(100vh-120px)] space-y-8 text-lg font-bold uppercase tracking-widest font-header">
            <a href="#about" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-artemis-blue transition-colors">About</a>
            <a href="#outreach" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-artemis-blue transition-colors">Outreach</a>
            <a href="#budget" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-artemis-blue transition-colors">Budget</a>
            <a href="#tiers" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-artemis-blue transition-colors">Tiers</a>
            <a href="#contact" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-artemis-blue transition-colors">Contact</a>
            
            <div className="flex flex-col space-y-4 pt-8 w-64">
              <a 
                href="#pay"
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full text-center py-3 bg-white/5 border border-white/10 rounded-xl text-sm font-bold tracking-wider"
              >
                Checkout Terminal
              </a>
              <a 
                href="#tiers"
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full text-center py-3 bg-artemis-blue hover:bg-stellar-orange text-white rounded-xl text-sm font-bold tracking-wider"
              >
                Sponsor Us
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* 🚀 HERO SECTION (Continuous Scroll Canvas Placeholder) */}
      <section 
        id="hero"
        ref={heroContainerRef}
        className="relative h-[150vh] flex flex-col justify-start"
      >
        <div className="sticky top-0 h-screen w-full overflow-hidden flex flex-col items-center justify-center">
          
          {/* Artistic Space Sequence Mock Graphic Grid (Layer 1 Background) */}
          <div className="absolute inset-0 w-full h-full z-0 flex items-center justify-center">
            {/* Glass Solar System Graphic Circle Grid */}
            <div className="absolute w-[600px] h-[600px] rounded-full border border-white/5 flex items-center justify-center animate-[spin_60s_linear_infinite]">
              <div className="absolute top-0 left-1/2 w-4 h-4 rounded-full bg-artemis-blue/30 blur-xs" />
              <div className="absolute w-[400px] h-[400px] rounded-full border border-white/5 flex items-center justify-center animate-[spin_40s_linear_infinite_reverse]">
                <div className="absolute bottom-0 right-1/4 w-3 h-3 rounded-full bg-stellar-orange/30 blur-xs" />
              </div>
            </div>
            {/* Cinematic Vignette Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#05070B] via-transparent to-[#05070B] z-10" />
            <div className="absolute inset-0 bg-radial-gradient(circle, transparent 30%, rgba(5,7,11,0.9) 100%) z-10" />
          </div>

          {/* Fanning Exploding Heading (Layer 2 Text) */}
          <div className="relative z-20 flex flex-col items-center text-center px-4 max-w-5xl">
            {/* Mini tag */}
            <div className="glass-frosted px-4 py-1.5 rounded-full border border-white/10 mb-8 inline-flex items-center space-x-2 animate-bounce">
              <span className="w-1.5 h-1.5 rounded-full bg-stellar-orange" />
              <span className="text-[10px] uppercase font-bold tracking-[0.25em] text-white/80">
                FRC TEAM 6621 • CHATHAM NJ
              </span>
            </div>

            <h1 className="font-header font-black tracking-widest text-[clamp(2.8rem,11vw,8rem)] text-white select-none leading-none flex items-center justify-center">
              {TITLE_LETTERS.map((letter, idx) => (
                <span key={idx} style={getLetterStyle(idx)} className="will-change-transform">
                  {letter}
                </span>
              ))}
            </h1>

            {/* Sub-hero outline cards (visible when scrollProgress < 0.15) */}
            <div 
              className="mt-12 max-w-xl transition-all duration-500 ease-out"
              style={{
                opacity: `calc(1 - var(--scroll-progress, 0) * 4)`,
                transform: `translateY(calc(var(--scroll-progress, 0) * 25px))`
              }}
            >
              <p className="text-base md:text-lg text-white/50 font-medium leading-relaxed font-sans">
                Chatham High School's premier competitive engineering squad. Sandwiched behind heavy glassmorphism, we build cutting-edge machines and local innovators.
              </p>
              
              <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
                <a 
                  href="#about"
                  className="px-8 py-3.5 bg-white text-black font-extrabold uppercase text-xs tracking-widest rounded-full hover:bg-stellar-orange hover:text-white transition-all duration-300 w-full sm:w-auto shadow-[0_4px_20px_rgba(255,255,255,0.08)]"
                >
                  Explore Mission
                </a>
                <a 
                  href="#contact"
                  className="px-8 py-3.5 glass-frosted border border-white/10 text-white font-extrabold uppercase text-xs tracking-widest rounded-full hover:bg-white/5 transition-all duration-300 w-full sm:w-auto"
                >
                  Book a Consultation
                </a>
              </div>
            </div>
          </div>

          {/* Scrolling prompt element */}
          <div 
            className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-20 flex flex-col items-center space-y-2 text-white/30 transition-opacity duration-300"
            style={{ opacity: `calc(1 - var(--scroll-progress, 0) * 6)` }}
          >
            <span className="text-[9px] uppercase font-bold tracking-[0.3em]">Scrub Scroll</span>
            <div className="w-5 h-8 rounded-full border-2 border-white/20 flex justify-center p-1">
              <div className="w-1.5 h-1.5 rounded-full bg-stellar-orange animate-bounce" />
            </div>
          </div>

        </div>
      </section>

      {/* 🌑 ABOUT US & MISSION SECTION */}
      <section id="about" className="relative z-10 py-32 px-6 border-t border-white/5 bg-[#05070B]">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col items-start mb-16 space-y-2">
            <span className="text-xs font-bold tracking-[0.3em] uppercase text-artemis-blue">01 / Foundation</span>
            <h2 className="text-4xl md:text-5xl font-header font-black tracking-tight">
              About Artemis <span className="text-white/40">& Our Mission</span>
            </h2>
            <div className="w-20 h-1 bg-gradient-to-r from-artemis-blue to-transparent mt-2" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            {/* Large text block */}
            <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
              <p className="text-lg md:text-xl text-white/70 font-light leading-relaxed">
                Founded as Team 6621 under FIRST Robotics Competition, Artemis represents Chatham High School's flagship technology incubator. We are not just a sports team for the mind; we are a fully functional corporate simulation where student executives engineer competitive robotics hardware, write code, formulate budgets, and deploy regional STEM programs.
              </p>
              
              <div className="grid grid-cols-2 gap-6 pt-4">
                <div className="glass-frosted p-6 rounded-2xl border border-white/5">
                  <h4 className="text-3xl font-header font-black text-stellar-orange">100%</h4>
                  <p className="text-xs text-white/40 uppercase tracking-widest mt-1">Student Operated</p>
                </div>
                <div className="glass-frosted p-6 rounded-2xl border border-white/5">
                  <h4 className="text-3xl font-header font-black text-artemis-blue">6621</h4>
                  <p className="text-xs text-white/40 uppercase tracking-widest mt-1">FRC Team Designation</p>
                </div>
              </div>
            </div>

            {/* Artistic glassmorphic mission card */}
            <div className="lg:col-span-5">
              <div className="glass-frosted p-8 rounded-3xl border border-white/10 h-full flex flex-col justify-between shadow-2xl relative overflow-hidden group">
                {/* Subtle blue accent glow inside glass */}
                <div className="absolute -right-24 -bottom-24 w-48 h-48 rounded-full bg-artemis-blue/10 blur-[60px] group-hover:bg-artemis-blue/15 transition-all duration-700" />
                
                <div className="space-y-6">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-white/10 to-white/0 border border-white/10 flex items-center justify-center text-stellar-orange font-bold text-xl">
                    🎯
                  </div>
                  <h3 className="text-2xl font-header font-black">Our North Star</h3>
                  <p className="text-white/60 text-sm leading-relaxed font-light">
                    To cultivate a high-velocity environment where students master professional toolkits—spanning mechanical CAD modelling, machine learning, web-stack infrastructure, and operations management—while fostering Chatham's spirit of scientific inquiry.
                  </p>
                </div>
                <div className="border-t border-white/5 pt-6 mt-8 flex items-center justify-between text-xs text-white/40 font-bold uppercase tracking-wider">
                  <span>STEM Leadership</span>
                  <span>Chatham High School</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 📡 COMMUNITY OUTREACH & FRC VALUES */}
      <section id="outreach" className="relative z-10 py-32 px-6 border-t border-white/5 bg-[#05070B]">
        <div className="max-w-7xl mx-auto">
          {/* Title block */}
          <div className="flex flex-col items-start mb-16 space-y-2">
            <span className="text-xs font-bold tracking-[0.3em] uppercase text-stellar-orange">02 / Ecosystem</span>
            <h2 className="text-4xl md:text-5xl font-header font-black tracking-tight">
              FRC Education <span className="text-white/40">& Local Outreach</span>
            </h2>
            <div className="w-20 h-1 bg-gradient-to-r from-stellar-orange to-transparent mt-2" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Outreach card 1 */}
            <div className="glass-frosted p-8 rounded-3xl border border-white/5 shadow-xl glass-card-hover flex flex-col justify-between min-h-[300px]">
              <div className="space-y-4">
                <span className="text-xs font-bold tracking-widest text-artemis-blue uppercase">Program 01</span>
                <h3 className="text-xl font-header font-black">Junior Library Workshops</h3>
                <p className="text-sm text-white/50 font-light leading-relaxed">
                  We host monthly, hands-on mechanical building blocks and coding logic workshops at the Chatham Joint Library, igniting STEM excitement in elementary kids.
                </p>
              </div>
              <div className="text-[10px] font-extrabold uppercase text-white/30 tracking-widest pt-6 border-t border-white/5">
                Chatham Public Schools
              </div>
            </div>

            {/* Outreach card 2 */}
            <div className="glass-frosted p-8 rounded-3xl border border-white/5 shadow-xl glass-card-hover flex flex-col justify-between min-h-[300px]">
              <div className="space-y-4">
                <span className="text-xs font-bold tracking-widest text-stellar-orange uppercase">Program 02</span>
                <h3 className="text-xl font-header font-black">Middle School FLL Mentorship</h3>
                <p className="text-sm text-white/50 font-light leading-relaxed">
                  Artemis team executives directly mentor local FIRST LEGO League (FLL) squads, guiding junior engineering candidates through game strategy and CAD math.
                </p>
              </div>
              <div className="text-[10px] font-extrabold uppercase text-white/30 tracking-widest pt-6 border-t border-white/5">
                FIRST LEGO League
              </div>
            </div>

            {/* Outreach card 3 */}
            <div className="glass-frosted p-8 rounded-3xl border border-white/5 shadow-xl glass-card-hover flex flex-col justify-between min-h-[300px]">
              <div className="space-y-4">
                <span className="text-xs font-bold tracking-widest text-white uppercase">Values</span>
                <h3 className="text-xl font-header font-black">Gracious Professionalism</h3>
                <p className="text-sm text-white/50 font-light leading-relaxed">
                  We adhere strictly to FRC core principles: fierce engineering competition blended with mutual respect, supporting competitor teams in pits when disaster strikes.
                </p>
              </div>
              <div className="text-[10px] font-extrabold uppercase text-white/30 tracking-widest pt-6 border-t border-white/5">
                FRC Ethos
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 📊 FINANCIALS & BUDGET METERS */}
      <section id="budget" className="relative z-10 py-32 px-6 border-t border-white/5 bg-[#05070B]">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left description */}
            <div className="lg:col-span-5 space-y-6">
              <span className="text-xs font-bold tracking-[0.3em] uppercase text-artemis-blue">03 / Operations</span>
              <h2 className="text-4xl md:text-5xl font-header font-black tracking-tight">
                Our Operating <span className="text-white/40">Budget Target</span>
              </h2>
              <div className="w-20 h-1 bg-gradient-to-r from-artemis-blue to-transparent" />
              <p className="text-sm text-white/60 leading-relaxed font-light pt-2">
                Running a world-class robotics squad requires extensive capital. Our target budget of <strong className="text-white">$65,395</strong> covers everything from raw aluminum extrusions to global event registrations. Sponsoring Chatham Artemis directly finances these categories.
              </p>
              
              <div className="glass-frosted p-6 rounded-2xl border border-white/5 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-widest text-white/40">Consolidated Goal</span>
                  <div className="text-2xl font-header font-black text-stellar-orange mt-1">$65,395.00</div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-white/40">Team Count</span>
                  <div className="text-lg font-bold text-white mt-1">45+ Students</div>
                </div>
              </div>
            </div>

            {/* Right progress sliders (frosted glass) */}
            <div className="lg:col-span-7">
              <div className="glass-frosted p-8 rounded-3xl border border-white/10 shadow-2xl space-y-8 relative">
                
                {/* Budget Item 1 */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold tracking-wider text-white/80">Robot Parts, Pneumatics, & Electronics</span>
                    <span className="font-bold text-artemis-blue">$15,000</span>
                  </div>
                  <div className="w-full h-2.5 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-artemis-blue w-[85%] rounded-full shadow-[0_0_10px_rgba(37,99,235,0.5)]" />
                  </div>
                  <p className="text-[10px] text-white/40">Brushless motors, titanium alloys, custom PCB prints</p>
                </div>

                {/* Budget Item 2 */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold tracking-wider text-white/80">FRC District & Regional Entry Fees</span>
                    <span className="font-bold text-stellar-orange">$12,000</span>
                  </div>
                  <div className="w-full h-2.5 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-stellar-orange w-[70%] rounded-full shadow-[0_0_10px_rgba(249,115,22,0.5)]" />
                  </div>
                  <p className="text-[10px] text-white/40">Official FIRST team registrations & arena fees</p>
                </div>

                {/* Budget Item 3 */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold tracking-wider text-white/80">Travel, Logistics, & Machine Shipping</span>
                    <span className="font-bold text-white">$25,395</span>
                  </div>
                  <div className="w-full h-2.5 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-white/40 w-[60%] rounded-full" />
                  </div>
                  <p className="text-[10px] text-white/40">Transporting 120-pound machines and student pit crew crew</p>
                </div>

                {/* Budget Item 4 */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold tracking-wider text-white/80">STEM Community Outreach & Materials</span>
                    <span className="font-bold text-artemis-blue">$13,000</span>
                  </div>
                  <div className="w-full h-2.5 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-artemis-blue w-[90%] rounded-full shadow-[0_0_10px_rgba(37,99,235,0.5)]" />
                  </div>
                  <p className="text-[10px] text-white/40">Financing regional workshops & public school showcases</p>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 🌀 WRAPPING TEXT - SPONSORS ONLY MARQUEE */}
      <section className="relative z-10 py-12 border-t border-b border-white/5 bg-[#05070B]">
        <div className="marquee-container py-4">
          <div className="marquee-content text-sm font-header font-black tracking-[0.25em] text-white/30 uppercase">
            <span>• Hermes Partners • Apollo Champions • ZEUS Titans • Become a Sponsor • FRC Team 6621 • Chatham NJ</span>
            <span>• Hermes Partners • Apollo Champions • ZEUS Titans • Become a Sponsor • FRC Team 6621 • Chatham NJ</span>
            <span>• Hermes Partners • Apollo Champions • ZEUS Titans • Become a Sponsor • FRC Team 6621 • Chatham NJ</span>
            <span>• Hermes Partners • Apollo Champions • ZEUS Titans • Become a Sponsor • FRC Team 6621 • Chatham NJ</span>
          </div>
        </div>
      </section>

      {/* 💎 SPONSORSHIP TIER SYSTEM */}
      <section id="tiers" className="relative z-10 py-32 px-6 bg-[#05070B]">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col items-center text-center mb-20 space-y-2">
            <span className="text-xs font-bold tracking-[0.3em] uppercase text-stellar-orange">04 / Alliance</span>
            <h2 className="text-4xl md:text-5xl font-header font-black tracking-tight">
              Sponsorship Tier Structure
            </h2>
            <div className="w-20 h-1 bg-gradient-to-r from-stellar-orange via-artemis-blue to-transparent mt-2 mx-auto" />
            <p className="text-sm text-white/50 max-w-xl mx-auto pt-4 leading-relaxed font-light">
              Accelerate our engineering research. Select an alignment tier to activate custom benefits, display corporate banners, and place your logo on our competitive robot.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
            
            {/* Hermes Tier */}
            <div className="glass-frosted p-8 rounded-3xl border border-white/5 shadow-xl glass-card-hover flex flex-col justify-between relative group overflow-hidden">
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold tracking-widest text-white/40 uppercase">Bronze Tier</span>
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-600 shadow-[0_0_8px_rgba(217,119,6,0.6)]" />
                </div>
                <div>
                  <h3 className="text-2xl font-header font-black">Hermes</h3>
                  <div className="text-3xl font-header font-black text-white/80 mt-2">$500+</div>
                </div>
                <div className="w-full h-px bg-white/5" />
                <ul className="space-y-3 text-xs text-white/60 font-light">
                  <li className="flex items-center space-x-2">
                    <span className="text-stellar-orange text-sm">✓</span>
                    <span>Corporate Logo on Website Sponsors page</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <span className="text-stellar-orange text-sm">✓</span>
                    <span>Invitation to team presentations</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <span className="text-stellar-orange text-sm">✓</span>
                    <span>Bi-annual progress newsletter updates</span>
                  </li>
                </ul>
              </div>
              <button 
                onClick={() => handleSelectTier("Hermes")}
                className="mt-8 w-full py-3 bg-white/5 border border-white/10 hover:bg-white/10 text-xs font-bold uppercase tracking-wider rounded-xl transition-all duration-300"
              >
                Select Hermes
              </button>
            </div>

            {/* Apollo Tier */}
            <div className="glass-frosted p-8 rounded-3xl border border-white/10 shadow-2xl glass-card-hover flex flex-col justify-between relative group overflow-hidden scale-100 lg:scale-105">
              {/* Highlight ribbon indicator */}
              <div className="absolute top-0 right-0 bg-artemis-blue px-3 py-1 rounded-bl-xl text-[9px] font-extrabold uppercase tracking-widest">
                Recommended
              </div>
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold tracking-widest text-artemis-blue uppercase">Silver Tier</span>
                  <div className="w-2.5 h-2.5 rounded-full bg-artemis-blue shadow-[0_0_8px_rgba(37,99,235,0.6)]" />
                </div>
                <div>
                  <h3 className="text-2xl font-header font-black">Apollo</h3>
                  <div className="text-3xl font-header font-black text-white mt-2">$1,500+</div>
                </div>
                <div className="w-full h-px bg-white/5" />
                <ul className="space-y-3 text-xs text-white/80 font-light">
                  <li className="flex items-center space-x-2">
                    <span className="text-artemis-blue text-sm">✓</span>
                    <span>Small Logo placement on competitive FRC robot</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <span className="text-artemis-blue text-sm">✓</span>
                    <span>Company Name on team banner in event pit</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <span className="text-artemis-blue text-sm">✓</span>
                    <span>All Hermes level website perks included</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <span className="text-artemis-blue text-sm">✓</span>
                    <span>Signed team photo frame for display</span>
                  </li>
                </ul>
              </div>
              <button 
                onClick={() => handleSelectTier("Apollo")}
                className="mt-8 w-full py-3 bg-artemis-blue hover:bg-artemis-blue/90 text-xs font-bold uppercase tracking-wider rounded-xl transition-all duration-300 shadow-[0_4px_15px_rgba(37,99,235,0.3)]"
              >
                Select Apollo
              </button>
            </div>

            {/* ZEUS Tier */}
            <div className="glass-frosted p-8 rounded-3xl border border-white/5 shadow-xl glass-card-hover-orange flex flex-col justify-between relative group overflow-hidden">
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold tracking-widest text-stellar-orange uppercase">Gold Tier</span>
                  <div className="w-2.5 h-2.5 rounded-full bg-stellar-orange shadow-[0_0_8px_rgba(249,115,22,0.6)]" />
                </div>
                <div>
                  <h3 className="text-2xl font-header font-black">ZEUS</h3>
                  <div className="text-3xl font-header font-black text-white mt-2">$5,000+</div>
                </div>
                <div className="w-full h-px bg-white/5" />
                <ul className="space-y-3 text-xs text-white/60 font-light">
                  <li className="flex items-center space-x-2">
                    <span className="text-stellar-orange text-sm">✓</span>
                    <span>Prominent large logo placement on FRC robot</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <span className="text-stellar-orange text-sm">✓</span>
                    <span>Logo printed on official competition shirts</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <span className="text-stellar-orange text-sm">✓</span>
                    <span>VIP invitation to annual robot rollout party</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <span className="text-stellar-orange text-sm">✓</span>
                    <span>Dedicated social media spotlight broadcasts</span>
                  </li>
                </ul>
              </div>
              <button 
                onClick={() => handleSelectTier("ZEUS")}
                className="mt-8 w-full py-3 bg-white/5 border border-white/10 hover:bg-stellar-orange hover:text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all duration-300 group-hover:border-stellar-orange/30"
              >
                Select ZEUS
              </button>
            </div>

          </div>
        </div>
      </section>

      {/* 🧾 INTERACTIVE CHECKOUT TERMINAL / PAY FORM */}
      <section id="pay" className="relative z-10 py-32 px-6 border-t border-white/5 bg-[#05070B]">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col items-center text-center mb-12 space-y-2">
            <span className="text-xs font-bold tracking-[0.3em] uppercase text-artemis-blue">05 / Transaction</span>
            <h2 className="text-3xl md:text-4xl font-header font-black tracking-tight">
              Sponsor Checkout Terminal
            </h2>
            <p className="text-xs text-white/40 pt-2">
              Frosted checkout terminal mockup. Enter credentials to trigger validated sponsorship interest.
            </p>
          </div>

          <div className="glass-frosted-heavy p-8 md:p-12 rounded-3xl border border-white/10 shadow-2xl relative overflow-hidden">
            {/* Decorative Grid Line backdrop */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

            {!sponsorSuccess ? (
              <form onSubmit={handleSponsorSubmit} className="relative z-10 space-y-6">
                
                {/* Visual Tier Selector Switch */}
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-white/40">Selected Support Alignment</label>
                  <div className="grid grid-cols-4 gap-2 bg-black/40 p-1.5 rounded-xl border border-white/5">
                    {(["Hermes", "Apollo", "ZEUS", "Other"] as const).map((tier) => (
                      <button
                        key={tier}
                        type="button"
                        onClick={() => {
                          setSelectedTier(tier);
                          setSponsorForm((prev) => ({ ...prev, interestedTier: tier }));
                        }}
                        className={`py-2 text-center text-xs font-bold uppercase rounded-lg tracking-wider transition-all ${
                          selectedTier === tier
                            ? "bg-white text-black shadow-lg"
                            : "text-white/60 hover:text-white hover:bg-white/5"
                        }`}
                      >
                        {tier}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Company Name */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-white/40">Company Name *</label>
                    <input 
                      type="text" 
                      required
                      value={sponsorForm.companyName}
                      onChange={(e) => setSponsorForm({...sponsorForm, companyName: e.target.value})}
                      placeholder="e.g. Apollo Forge Inc."
                      className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-artemis-blue/50 focus:bg-black/50 transition-colors"
                    />
                  </div>

                  {/* Representative Name */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-white/40">Contact Name *</label>
                    <input 
                      type="text" 
                      required
                      value={sponsorForm.contactName}
                      onChange={(e) => setSponsorForm({...sponsorForm, contactName: e.target.value})}
                      placeholder="e.g. Captain Diana"
                      className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-artemis-blue/50 focus:bg-black/50 transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Email */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-white/40">Corporate Email Address *</label>
                    <input 
                      type="email" 
                      required
                      value={sponsorForm.email}
                      onChange={(e) => setSponsorForm({...sponsorForm, email: e.target.value})}
                      placeholder="e.g. align@apolloforge.com"
                      className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-artemis-blue/50 focus:bg-black/50 transition-colors"
                    />
                  </div>

                  {/* Phone (Optional) */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-white/40">Corporate Phone (Optional)</label>
                    <input 
                      type="tel" 
                      value={sponsorForm.phone}
                      onChange={(e) => setSponsorForm({...sponsorForm, phone: e.target.value})}
                      placeholder="e.g. +1 (555) 662-1000"
                      className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-artemis-blue/50 focus:bg-black/50 transition-colors"
                    />
                  </div>
                </div>

                {/* Messages */}
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-white/40">Sponsorship Message / Alignment Goals *</label>
                  <textarea 
                    rows={4}
                    required
                    value={sponsorForm.message}
                    onChange={(e) => setSponsorForm({...sponsorForm, message: e.target.value})}
                    placeholder="Briefly state your company goals or potential collaborative ideas..."
                    className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-artemis-blue/50 focus:bg-black/50 transition-colors resize-none"
                  />
                </div>

                {/* Simulated Payment Credentials Card Block */}
                <div className="p-5 rounded-2xl bg-black/50 border border-white/5 space-y-4">
                  <div className="flex justify-between items-center text-xs font-semibold">
                    <span className="text-white/40 uppercase tracking-wider text-[9px]">Simulated Billing Allocation</span>
                    <span className="text-stellar-orange font-bold uppercase">
                      {selectedTier === "Hermes" && "$500+ Allocation"}
                      {selectedTier === "Apollo" && "$1,500+ Allocation"}
                      {selectedTier === "ZEUS" && "$5,000+ Allocation"}
                      {selectedTier === "Other" && "Variable Allocation"}
                    </span>
                  </div>
                  <p className="text-[11px] text-white/30 leading-relaxed font-light">
                    Your interest payload validates the requested tier and flags our finance crew. An executive representative will follow up with manual wire setup / billing invoices. No card processing is conducted in this front-end demo.
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={isSubmittingSponsor}
                  className="w-full py-4 bg-gradient-to-r from-artemis-blue to-stellar-orange text-white font-extrabold uppercase text-xs tracking-widest rounded-xl hover:shadow-[0_0_30px_rgba(249,115,22,0.4)] disabled:opacity-50 transition-all duration-500"
                >
                  {isSubmittingSponsor ? "Dispatching Core Payload..." : "Submit Sponsorship Interest"}
                </button>

              </form>
            ) : (
              <div className="relative z-10 text-center py-8 space-y-6 animate-fade-in">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-artemis-blue/30 to-stellar-orange/30 border border-stellar-orange/50 mx-auto flex items-center justify-center text-2xl animate-bounce">
                  ✨
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-header font-black">Interest Dispatch Completed</h3>
                  <p className="text-xs text-white/50 max-w-md mx-auto leading-relaxed">
                    Sponsorship payload validated to correct schema formatting. An Artemis executive will review the wire request.
                  </p>
                </div>

                {/* Displaying payload receipt detail */}
                <div className="max-w-md mx-auto p-6 rounded-2xl bg-black/60 border border-white/5 text-left font-mono text-[11px] space-y-2.5">
                  <div className="text-center font-header font-black tracking-widest uppercase text-white/40 pb-2 border-b border-white/5 mb-3 text-xs">
                    OFFICIAL RECEIPTS
                  </div>
                  <div><span className="text-stellar-orange">COMPANY:</span> {sponsorReceipt?.companyName}</div>
                  <div><span className="text-stellar-orange">REP NAME:</span> {sponsorReceipt?.contactName}</div>
                  <div><span className="text-stellar-orange">EMAIL:</span> {sponsorReceipt?.email}</div>
                  {sponsorReceipt?.phone && <div><span className="text-stellar-orange">PHONE:</span> {sponsorReceipt?.phone}</div>}
                  <div><span className="text-stellar-orange">REQUESTED TIER:</span> {sponsorReceipt?.interestedTier}</div>
                  <div className="pt-2 border-t border-white/5 mt-2"><span className="text-white/40">MESSAGE HASH:</span> &quot;{sponsorReceipt?.message}&quot;</div>
                </div>

                <button
                  onClick={() => setSponsorSuccess(false)}
                  className="px-6 py-2 border border-white/10 rounded-full text-xs font-bold uppercase tracking-wider text-white/60 hover:text-white"
                >
                  Verify New Entry
                </button>
              </div>
            )}

          </div>
        </div>
      </section>

      {/* 📧 CONTACT US FORM */}
      <section id="contact" className="relative z-10 py-32 px-6 border-t border-white/5 bg-[#05070B]">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col items-center text-center mb-16 space-y-2">
            <span className="text-xs font-bold tracking-[0.3em] uppercase text-stellar-orange">06 / Message</span>
            <h2 className="text-3xl md:text-4xl font-header font-black tracking-tight">
              Connect With The Crew
            </h2>
            <p className="text-sm text-white/50 max-w-md mx-auto pt-2 font-light">
              Submit community inquiries, FLL mentoring requests, or schedule laboratory site consultations directly.
            </p>
          </div>

          <div className="glass-frosted p-8 md:p-12 rounded-3xl border border-white/5 shadow-xl">
            {!contactSuccess ? (
              <form onSubmit={handleContactSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Name */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-white/40">Full Name *</label>
                    <input 
                      type="text" 
                      required
                      value={contactForm.name}
                      onChange={(e) => setContactForm({...contactForm, name: e.target.value})}
                      placeholder="e.g. Captain Reed"
                      className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-stellar-orange/50 focus:bg-black/50 transition-colors"
                    />
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-white/40">Email Address *</label>
                    <input 
                      type="email" 
                      required
                      value={contactForm.email}
                      onChange={(e) => setContactForm({...contactForm, email: e.target.value})}
                      placeholder="e.g. reed@domain.com"
                      className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-stellar-orange/50 focus:bg-black/50 transition-colors"
                    />
                  </div>
                </div>

                {/* Subject */}
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-white/40">Subject *</label>
                  <input 
                    type="text" 
                    required
                    value={contactForm.subject}
                    onChange={(e) => setContactForm({...contactForm, subject: e.target.value})}
                    placeholder="e.g. Mentoring Collaboration Request"
                    className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-stellar-orange/50 focus:bg-black/50 transition-colors"
                  />
                </div>

                {/* Message */}
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-white/40">Inquiry Message *</label>
                  <textarea 
                    rows={4}
                    required
                    value={contactForm.message}
                    onChange={(e) => setContactForm({...contactForm, message: e.target.value})}
                    placeholder="Write detailed request metrics here..."
                    className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-stellar-orange/50 focus:bg-black/50 transition-colors resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmittingContact}
                  className="w-full py-4 bg-white hover:bg-stellar-orange text-black hover:text-white font-extrabold uppercase text-xs tracking-widest rounded-xl transition-all duration-300"
                >
                  {isSubmittingContact ? "Sending..." : "Send Consultation Inquiry"}
                </button>
              </form>
            ) : (
              <div className="text-center py-8 space-y-4">
                <div className="w-12 h-12 rounded-full bg-green-500/20 border border-green-500/50 mx-auto flex items-center justify-center text-xl">
                  ✓
                </div>
                <h3 className="text-xl font-header font-black">Message Sent Successfully</h3>
                <p className="text-xs text-white/50 max-w-sm mx-auto leading-relaxed">
                  Thank you for reaching out. An executive from Artemis FRC 6621 will follow up on your subject inquiry.
                </p>
                <button
                  onClick={() => setContactSuccess(false)}
                  className="mt-4 px-6 py-2 border border-white/10 rounded-full text-xs font-bold uppercase tracking-wider text-white/60 hover:text-white"
                >
                  Send Another Message
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 🪐 FOOTER */}
      <footer className="relative z-10 border-t border-white/5 py-12 px-6 bg-[#030508] text-white/40 text-xs">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col items-center md:items-start gap-2">
            <span className="font-header font-black tracking-widest text-sm text-white">
              ARTEMIS<span className="text-stellar-orange">.6621</span>
            </span>
            <span>Chatham High School Competitive Engineering</span>
          </div>

          <div className="flex items-center space-x-6">
            <a href="#about" className="hover:text-white transition-colors">About</a>
            <a href="#outreach" className="hover:text-white transition-colors">Outreach</a>
            <a href="#budget" className="hover:text-white transition-colors">Budget</a>
            <a href="#tiers" className="hover:text-white transition-colors">Tiers</a>
            <a href="#contact" className="hover:text-white transition-colors">Contact</a>
          </div>

          <div>
            &copy; {new Date().getFullYear()} Team 6621. Chatham NJ. All Rights Reserved.
          </div>
        </div>
      </footer>

    </div>
  );
}
