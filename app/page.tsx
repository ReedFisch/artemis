"use client";

import React, { useEffect, useState, useRef } from "react";

// ─── Types (matching gemini.md schema) ──────────────────────────
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
  { href: "#about", label: "About", id: "about" },
  { href: "#outreach", label: "Outreach", id: "outreach" },
  { href: "#competitions", label: "Competitions", id: "competitions" },
  { href: "#budget", label: "Budget", id: "budget" },
  { href: "#tiers", label: "Sponsors", id: "tiers" },
  { href: "#contact", label: "Contact", id: "contact" },
];

// ─── TIER DATA ──────────────────────────────────────────────────
const TIERS = [
  {
    name: "Hermes" as const,
    label: "Partner Tier",
    price: "$250+",
    color: "amber",
    dotColor: "bg-amber-500",
    dotShadow: "shadow-[0_0_10px_rgba(217,119,6,0.6)]",
    accentText: "text-amber-500",
    benefits: [
      "Logo on team website",
      "Name on team pit banner",
      "Name on competition shirt",
      "Personal thank you card",
    ],
    btnClass: "glass-button font-bold uppercase text-[10px] tracking-wider",
    cardHover: "glass-panel-hover",
  },
  {
    name: "Apollo" as const,
    label: "Champion Tier",
    price: "$500+",
    color: "blue",
    dotColor: "bg-artemis-blue",
    dotShadow: "shadow-[0_0_10px_rgba(37,99,235,0.6)]",
    accentText: "text-artemis-blue",
    recommended: true,
    benefits: [
      "Small logo placement on FRC robot",
      "Name on team pit banner",
      "All Hermes perks included",
      "Signed team photo & team shirt",
    ],
    btnClass:
      "bg-artemis-blue hover:bg-artemis-blue/80 text-white font-bold uppercase text-[10px] tracking-wider rounded-xl shadow-[0_4px_20px_rgba(37,99,235,0.25)]",
    cardHover: "glass-panel-hover",
  },
  {
    name: "ZEUS" as const,
    label: "Titan Tier",
    price: "$1,000+",
    color: "orange",
    dotColor: "bg-stellar-orange",
    dotShadow: "shadow-[0_0_10px_rgba(249,115,22,0.6)]",
    accentText: "text-stellar-orange",
    benefits: [
      "Large prominent logo on FRC robot",
      "Logo printed on competition shirts",
      "Social media spotlight shout-outs",
      "All Apollo perks included",
    ],
    btnClass: "glass-button font-bold uppercase text-[10px] tracking-wider hover:bg-stellar-orange hover:text-white hover:border-stellar-orange/30",
    cardHover: "glass-panel-hover-orange",
  },
];

// ─── BUDGET DATA ────────────────────────────────────────────────
const BUDGET_ITEMS = [
  {
    label: "Competition Registration, Meals & Travel",
    amount: "$20,000",
    width: "57%",
    color: "from-artemis-blue to-blue-400",
    shadow: "shadow-[0_0_12px_rgba(37,99,235,0.4)]",
    desc: "Regional & championship entry fees, meals, and transport",
  },
  {
    label: "Worlds Travel, Hotels & Registration",
    amount: "$35,000",
    width: "100%",
    color: "from-stellar-orange to-amber-400",
    shadow: "shadow-[0_0_12px_rgba(249,115,22,0.4)]",
    desc: "FIRST Championship in Houston — lodging, flights, and meals",
  },
  {
    label: "Competition Parts & Equipment",
    amount: "$9,000",
    width: "26%",
    color: "from-white/50 to-white/20",
    shadow: "",
    desc: "Motors, sensors, pneumatics, aluminum, and custom fabrication",
  },
  {
    label: "Off-Season Events",
    amount: "$1,000",
    width: "3%",
    color: "from-artemis-blue to-stellar-orange",
    shadow: "shadow-[0_0_12px_rgba(37,99,235,0.3)]",
    desc: "Robot Rumble and other off-season scrimmages",
  },
];

// ─── OUTREACH DATA ──────────────────────────────────────────────
const OUTREACH_CARDS = [
  {
    tag: "Origami for Good",
    tagColor: "text-artemis-blue",
    title: "1,000 Cranes Initiative",
    desc: "We folded over 1,000 origami cranes to donate to local hospitals and created custom team-colored origami kits for every team at our competitions — forging meaningful connections across the FRC community.",
    footer: "Community Impact",
    image: "/photos/outreach/origami_for_good.jpg",
    hoverRotate: "hover:rotate-y-[-2deg] hover:rotate-x-[1deg]",
  },
  {
    tag: "STEAM Advocacy",
    tagColor: "text-stellar-orange",
    title: "NY State STEAM Day",
    desc: "Advocated for STEAM grants at New York State STEAM Day alongside Assembly Member Didi Barrett. We demonstrated our robot in action and networked with teams statewide to champion the importance of STEAM education.",
    footer: "Legislative Advocacy",
    image: "/photos/outreach/steam_day_assembly.png",
    hoverRotate: "hover:rotate-y-[0deg] hover:rotate-x-[-1.5deg]",
  },
  {
    tag: "Safety & Mentorship",
    tagColor: "text-white/70",
    title: "Community Safety Kits",
    desc: "At every competition, we distribute free safety kits to every team — a commitment that earned Safety All-Star awards for Josiah Eugenio (2026) and Reed Fisch (2024). We also partnered with Team 7504 Cybearbots to mentor on fundraising and strategy.",
    footer: "Gracious Professionalism",
    image: "/photos/outreach/community_fair_booth.png",
    hoverRotate: "hover:rotate-y-[2deg] hover:rotate-x-[1deg]",
  },
];

// ─── SPONSOR LOGOS ──────────────────────────────────────────────
const SPONSOR_LOGOS = [
  "/sponsors/hawthorne_valley.png",
  "/sponsors/swaying_pine.png",
  "/sponsors/bank_greene_county.png",
  "/sponsors/sei_design.png",
  "/sponsors/craftech.png",
  "/sponsors/kneller_insurance.png",
  "/sponsors/samascott.png",
  "/sponsors/gene_haas.png",
  "/sponsors/chatham_lions.png",
  "/sponsors/taconic_engineering.png",
  "/sponsors/stewarts.png",
  "/sponsors/metzwood_insurance.png",
  "/sponsors/herringtons.png",
  "/sponsors/gould_martial_arts.png",
  "/sponsors/simmons_automotive.png",
  "/sponsors/ghent_one_stop.png",
  "/sponsors/chatham_pub.png",
  "/sponsors/spencertown_academy.png",
  "/sponsors/meltz_lumber.png",
  "/sponsors/checkered_flag.png",
  "/sponsors/roots_holistic.png",
  "/sponsors/stonykill_coffee.png",
  "/sponsors/new_concord_bnb.png",
  "/sponsors/chatham_bookstore.png",
];

// ═══════════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════════

export default function Home() {
  // ─── State ──────────────────────────────────────────────────
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTier, setSelectedTier] = useState<
    "Hermes" | "Apollo" | "ZEUS" | "Other"
  >("Apollo");

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
  const [sponsorReceipt, setSponsorReceipt] = useState<SponsorshipInterestPayload | null>(null);

  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmittingContact, setIsSubmittingContact] = useState(false);
  const [contactSuccess, setContactSuccess] = useState(false);

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");

  const heroRef = useRef<HTMLDivElement>(null);
  const [starsSmall, setStarsSmall] = useState("");
  const [starsMedium, setStarsMedium] = useState("");

  const [competitions, setCompetitions] = useState<any[]>([]);
  const [isTBALoading, setIsTBALoading] = useState(true);

  // ─── Effects ────────────────────────────────────────────────

  // Fetch Blue Alliance competition records on load
  useEffect(() => {
    fetch("/api/tba")
      .then((res) => res.json())
      .then((data) => {
        setCompetitions(data);
        setIsTBALoading(false);
      })
      .catch((err) => {
        console.error("Failed to load competitions:", err);
        setIsTBALoading(false);
      });
  }, []);

  // Stars
  useEffect(() => {
    const gen = (n: number) => {
      const s: string[] = [];
      for (let i = 0; i < n; i++) {
        const x = Math.floor(Math.random() * 2400);
        const y = Math.floor(Math.random() * 2400);
        const o = (Math.random() * 0.4 + 0.2).toFixed(2);
        s.push(`${x}px ${y}px 0 0px rgba(255,255,255,${o})`);
      }
      return s.join(", ");
    };
    setStarsSmall(gen(180));
    setStarsMedium(gen(40));
  }, []);

  // Loading
  useEffect(() => {
    const t = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(t);
  }, []);

  // Scroll — CSS variable approach (no React re-renders)
  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          if (heroRef.current) {
            const { top, height } = heroRef.current.getBoundingClientRect();
            const max = height - window.innerHeight;
            const p = Math.max(0, Math.min(1, -top / max));
            document.documentElement.style.setProperty(
              "--scroll-progress",
              p.toString()
            );
          }
          const scrollY = window.scrollY + 200;
          for (const { id } of NAV_LINKS) {
            const el = document.getElementById(id);
            if (el && scrollY >= el.offsetTop && scrollY < el.offsetTop + el.offsetHeight) {
              setActiveSection(id);
              break;
            }
          }
          // Also check hero
          const heroEl = document.getElementById("hero");
          if (heroEl && scrollY < heroEl.offsetTop + heroEl.offsetHeight) {
            setActiveSection("hero");
          }
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // ─── Handlers ───────────────────────────────────────────────

  const handleSelectTier = (tier: "Hermes" | "Apollo" | "ZEUS" | "Other") => {
    setSelectedTier(tier);
    setSponsorForm((p) => ({ ...p, interestedTier: tier }));
    document.getElementById("pay")?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSponsorSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingSponsor(true);
    try {
      const res = await fetch("/api/sponsorship", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(sponsorForm),
      });
      const data = await res.json();
      if (data.success) {
        setSponsorSuccess(true);
        setSponsorReceipt(data.receipt);
      } else {
        alert(data.errors?.join("\n") || "Failed to submit interest.");
      }
    } catch (err) {
      console.error(err);
      alert("An error occurred during submission. Please try again.");
    } finally {
      setIsSubmittingSponsor(false);
    }
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingContact(true);
    setTimeout(() => {
      setIsSubmittingContact(false);
      setContactSuccess(true);
      console.log("Contact inquiry:", contactForm);
    }, 1200);
  };

  // ═══════════════════════════════════════════════════════════
  // RENDER
  // ═══════════════════════════════════════════════════════════

  return (
    <div className="relative min-h-screen bg-[#05070B] text-white overflow-x-hidden font-sans">

      {/* ══════ SVG FILTER DEFS ══════ */}
      <svg width="0" height="0" className="absolute" aria-hidden="true">
        <defs>
          <filter id="glass-warp">
            <feTurbulence type="fractalNoise" baseFrequency="0.012" numOctaves="3" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="6" />
          </filter>
        </defs>
      </svg>

      {/* ══════ STAR BACKDROP (fixed) ══════ */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute w-px h-px rounded-full opacity-50" style={{ boxShadow: starsSmall }} />
        <div className="absolute w-0.5 h-0.5 rounded-full opacity-70" style={{ boxShadow: starsMedium }} />
      </div>

      {/* ══════ AMBIENT GLASS BLOBS (fixed) ══════ */}
      <div className="fixed inset-0 pointer-events-none z-[1] overflow-hidden">
        <div
          className="absolute w-[500px] h-[500px] opacity-[0.035]"
          style={{
            top: "8%", left: "-8%",
            background: "radial-gradient(circle, rgba(37,99,235,0.5) 0%, transparent 70%)",
            animation: "blob 28s ease-in-out infinite, drift 35s ease-in-out infinite",
            filter: "blur(90px)",
          }}
        />
        <div
          className="absolute w-[400px] h-[400px] opacity-[0.025]"
          style={{
            bottom: "15%", right: "-6%",
            background: "radial-gradient(circle, rgba(249,115,22,0.5) 0%, transparent 70%)",
            animation: "blob 22s ease-in-out infinite reverse, drift 30s ease-in-out infinite reverse",
            filter: "blur(90px)",
          }}
        />
        <div
          className="absolute w-[600px] h-[600px] opacity-[0.018]"
          style={{
            top: "45%", left: "25%",
            background: "radial-gradient(circle, rgba(37,99,235,0.3) 0%, rgba(249,115,22,0.2) 50%, transparent 70%)",
            animation: "blob 32s ease-in-out infinite, drift 45s ease-in-out infinite",
            filter: "blur(110px)",
          }}
        />
      </div>

      {/* ══════════════════════════════════════════════════════
           LOADING SCREEN
           ══════════════════════════════════════════════════════ */}
      <div
        className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#05070B] transition-all duration-1000 ease-in-out ${
          isLoading ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"
        }`}
      >
        <div className="relative w-48 h-48 flex items-center justify-center">
          {/* Glow backdrop */}
          <div
            className="absolute w-28 h-28 rounded-full bg-gradient-to-br from-artemis-blue/20 to-stellar-orange/20 blur-3xl"
            style={{ animation: "pulse-glow 3s ease-in-out infinite" }}
          />
          {/* Glass circle with logo */}
          <div
            className="relative w-24 h-24 glass-panel-deep rounded-full flex items-center justify-center overflow-hidden"
            style={{ animation: "breathe 3s ease-in-out infinite" }}
          >
            <img
              src="/branding/logo_4.jpeg"
              alt="Artemis 6621"
              className="w-14 h-16 object-contain"
              style={{ mixBlendMode: "screen" }}
            />
          </div>
          {/* Orbital rings */}
          <div
            className="absolute inset-0 rounded-full border border-dashed border-white/[0.05]"
            style={{ animation: "rotate-slow 18s linear infinite" }}
          />
          <div
            className="absolute inset-5 rounded-full border border-white/[0.03]"
            style={{ animation: "rotate-reverse 12s linear infinite" }}
          />
          {/* Orbiting dots */}
          <div
            className="absolute w-2.5 h-2.5 rounded-full bg-stellar-orange shadow-[0_0_12px_rgba(249,115,22,0.7)]"
            style={{ animation: "orbit 3s linear infinite" }}
          />
          <div
            className="absolute w-1.5 h-1.5 rounded-full bg-artemis-blue shadow-[0_0_8px_rgba(37,99,235,0.7)]"
            style={{ animation: "orbit 2.2s linear infinite reverse", animationDelay: "-0.8s" }}
          />
        </div>
        <div className="mt-8 flex flex-col items-center space-y-3">
          <p className="text-[10px] font-semibold tracking-[0.35em] uppercase text-white/25 font-header">
            Initializing Systems
          </p>
          <div className="w-44 h-px bg-white/5 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-artemis-blue to-stellar-orange"
              style={{ backgroundSize: "200% 100%", animation: "shimmer-glass 1.5s infinite" }}
            />
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════
           HEADER / NAV
           ══════════════════════════════════════════════════════ */}
      <header className="fixed top-0 left-0 right-0 z-50">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-3 md:py-4">
          <div className="glass-nav px-5 py-2.5 flex items-center justify-between shadow-2xl">
            {/* Logo */}
            <a href="#hero" className="flex items-center space-x-2.5 group">
              <div className="w-7 h-9 overflow-hidden flex items-center justify-center">
                <img
                  src="/branding/logo_4.jpeg"
                  alt="Artemis"
                  className="w-full h-full object-contain"
                  style={{ mixBlendMode: "screen" }}
                />
              </div>
              <span className="font-header font-bold tracking-[0.15em] text-sm group-hover:text-artemis-blue transition-colors duration-300">
                ARTEMIS<span className="text-stellar-orange">.6621</span>
              </span>
            </a>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center space-x-7 text-[10px] font-semibold uppercase tracking-[0.15em] text-white/45">
              {NAV_LINKS.map((l) => (
                <a
                  key={l.id}
                  href={l.href}
                  className={`hover:text-white transition-colors duration-300 ${
                    activeSection === l.id ? "text-artemis-blue" : ""
                  }`}
                >
                  {l.label}
                </a>
              ))}
            </nav>

            {/* Desktop CTAs */}
            <div className="hidden md:flex items-center space-x-3">
              <a
                href="#pay"
                className="glass-button px-4 py-2 text-[9px] font-bold uppercase tracking-[0.15em]"
              >
                Terminal
              </a>
              <a
                href="#tiers"
                className="px-4 py-2 text-[9px] font-bold uppercase tracking-[0.15em] bg-white text-black rounded-full hover:bg-stellar-orange hover:text-white transition-all duration-300 shadow-[0_0_16px_rgba(255,255,255,0.06)]"
              >
                Sponsor Us
              </a>
            </div>

            {/* Mobile Hamburger */}
            <button
              className="md:hidden flex flex-col space-y-1.5 p-2"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Menu"
            >
              <div className={`w-5 h-0.5 bg-white transition-all duration-300 ${isMobileMenuOpen ? "rotate-45 translate-y-2" : ""}`} />
              <div className={`w-5 h-0.5 bg-white transition-all duration-300 ${isMobileMenuOpen ? "opacity-0" : ""}`} />
              <div className={`w-5 h-0.5 bg-white transition-all duration-300 ${isMobileMenuOpen ? "-rotate-45 -translate-y-2" : ""}`} />
            </button>
          </div>
        </div>

        {/* Mobile Dropdown */}
        <div
          className={`fixed inset-0 top-[72px] z-40 bg-[#05070B]/[0.98] backdrop-blur-2xl transition-all duration-500 ease-in-out ${
            isMobileMenuOpen
              ? "opacity-100 translate-y-0"
              : "opacity-0 -translate-y-6 pointer-events-none"
          }`}
        >
          <div className="flex flex-col items-center justify-center h-[calc(100vh-90px)] space-y-6">
            {NAV_LINKS.map((l) => (
              <a
                key={l.id}
                href={l.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-base font-header font-bold uppercase tracking-[0.2em] hover:text-artemis-blue transition-colors"
              >
                {l.label}
              </a>
            ))}
            <div className="flex flex-col space-y-3 pt-6 w-52">
              <a
                href="#pay"
                onClick={() => setIsMobileMenuOpen(false)}
                className="glass-button w-full text-center py-3 text-[10px] font-bold uppercase tracking-wider"
              >
                Terminal
              </a>
              <a
                href="#tiers"
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full text-center py-3 bg-artemis-blue text-white rounded-full text-[10px] font-bold uppercase tracking-wider hover:bg-stellar-orange transition-colors"
              >
                Sponsor Us
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* ══════════════════════════════════════════════════════
           HERO
           ══════════════════════════════════════════════════════ */}
      <section id="hero" ref={heroRef} className="relative h-[150vh]">
        <div className="sticky top-0 h-screen w-full overflow-hidden flex flex-col items-center justify-center">

          {/* BG Layer: Robot image, mega-blurred */}
          <div className="absolute inset-0 z-0">
            <div
              className="absolute inset-0 opacity-[0.06]"
              style={{
                backgroundImage: "url(/hero/Robotbackground_final_v2.jpeg)",
                backgroundSize: "cover",
                backgroundPosition: "center",
                filter: "blur(40px) saturate(0.4)",
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-[#05070B] via-transparent to-[#05070B]" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#05070B]/70 via-transparent to-[#05070B]/70" />
          </div>

          {/* Floating orb 1 — golden/warm */}
          <div
            className="absolute z-[2] w-14 h-14 md:w-20 md:h-20 rounded-full"
            style={{
              top: "14%", right: "18%",
              background: "radial-gradient(circle at 30% 30%, rgba(251,191,36,0.7), rgba(249,115,22,0.3) 60%, transparent)",
              boxShadow: "0 0 50px rgba(251,191,36,0.25), 0 0 100px rgba(249,115,22,0.1)",
              animation: "float 9s ease-in-out infinite",
            }}
          />

          {/* Floating orb 2 — blue */}
          <div
            className="absolute z-[2] w-8 h-8 md:w-12 md:h-12 rounded-full"
            style={{
              bottom: "22%", left: "12%",
              background: "radial-gradient(circle at 30% 30%, rgba(96,165,250,0.7), rgba(37,99,235,0.3) 60%, transparent)",
              boxShadow: "0 0 30px rgba(37,99,235,0.25)",
              animation: "float 7s ease-in-out infinite reverse",
              animationDelay: "-3s",
            }}
          />

          {/* Floating orb 3 — tiny accent */}
          <div
            className="absolute z-[2] w-4 h-4 md:w-6 md:h-6 rounded-full opacity-50"
            style={{
              top: "55%", right: "8%",
              background: "radial-gradient(circle, rgba(249,115,22,0.6), transparent 70%)",
              animation: "float 5s ease-in-out infinite",
              animationDelay: "-1.5s",
            }}
          />

          {/* Orbital rings */}
          <div
            className="absolute z-[1] w-[min(520px,85vw)] h-[min(520px,85vw)] rounded-full border border-white/[0.03] flex items-center justify-center"
            style={{ animation: "rotate-slow 70s linear infinite" }}
          >
            <div className="absolute top-0 left-1/2 w-2 h-2 rounded-full bg-artemis-blue/20 blur-sm" />
          </div>
          <div
            className="absolute z-[1] w-[min(360px,60vw)] h-[min(360px,60vw)] rounded-full border border-white/[0.025]"
            style={{ animation: "rotate-reverse 50s linear infinite" }}
          >
            <div className="absolute bottom-0 right-1/4 w-1.5 h-1.5 rounded-full bg-stellar-orange/20 blur-sm" />
          </div>

          {/* ─── Hero Content ─── */}
          <div
            className="relative z-10 flex flex-col items-center text-center px-4 max-w-5xl"
            style={{
              opacity: "calc(1 - var(--scroll-progress, 0) * 3.5)",
              transform: "translateY(calc(var(--scroll-progress, 0) * -70px)) scale(calc(1 + var(--scroll-progress, 0) * 0.04))",
              willChange: "transform, opacity",
            }}
          >
            {/* Deer Logo in Glass Orb */}
            <div className="relative mb-6">
              <div
                className="absolute inset-[-16px] rounded-full bg-gradient-to-br from-artemis-blue/10 to-stellar-orange/10 blur-2xl"
                style={{ animation: "pulse-glow 5s ease-in-out infinite" }}
              />
              <div
                className="relative w-24 h-24 md:w-32 md:h-32 glass-panel-deep rounded-full flex items-center justify-center overflow-hidden"
                style={{ animation: "breathe 5s ease-in-out infinite" }}
              >
                <img
                  src="/branding/logo_4.jpeg"
                  alt="Artemis 6621"
                  className="w-14 h-16 md:w-18 md:h-20 object-contain"
                  style={{ mixBlendMode: "screen" }}
                />
              </div>
            </div>

            {/* ARTEMIS — transparent outline with gradient sweep */}
            <h1
              className="font-header font-black tracking-[0.1em] text-[clamp(3rem,14vw,10rem)] leading-[0.85] select-none"
              style={{
                WebkitTextStroke: "1.5px rgba(255, 255, 255, 0.1)",
                WebkitTextFillColor: "transparent",
                background:
                  "linear-gradient(90deg, rgba(255,255,255,0.02) 0%, rgba(255,255,255,0.12) 50%, rgba(255,255,255,0.02) 100%)",
                backgroundSize: "200% 100%",
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                animation: "gradient-sweep 5s ease-in-out infinite",
              }}
            >
              ARTEMIS
            </h1>

            {/* 6621 in gradient text */}
            <div className="mt-3 flex items-center space-x-4">
              <div className="w-10 h-px bg-gradient-to-r from-transparent to-artemis-blue/30" />
              <span className="text-gradient-blue text-lg md:text-xl font-header font-black tracking-[0.35em]">
                TEAM 6621
              </span>
              <div className="w-10 h-px bg-gradient-to-l from-transparent to-stellar-orange/30" />
            </div>

            {/* Subtitle tag */}
            <div className="mt-3 flex items-center space-x-2 text-[9px] uppercase font-semibold tracking-[0.3em] text-white/25">
              <span className="w-1 h-1 rounded-full bg-stellar-orange/60" />
              <span>FRC Robotics</span>
              <span className="text-white/10">|</span>
              <span>Chatham NY</span>
              <span className="w-1 h-1 rounded-full bg-artemis-blue/60" />
            </div>

            {/* Tagline in glass panel */}
            <div className="mt-8 glass-panel px-6 py-4 max-w-lg">
              <p className="text-sm md:text-base text-white/45 font-light leading-relaxed">
                Chatham High School&apos;s competitive engineering squad. Building machines,
                writing code, and inspiring the next generation of innovators.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="mt-8 flex flex-col sm:flex-row items-center gap-3">
              <a
                href="#about"
                className="px-7 py-3 bg-white text-black font-bold uppercase text-[10px] tracking-[0.15em] rounded-full hover:bg-stellar-orange hover:text-white transition-all duration-300 shadow-[0_4px_30px_rgba(255,255,255,0.05)] w-full sm:w-auto text-center"
              >
                Explore Mission
              </a>
              <a
                href="#tiers"
                className="glass-button px-7 py-3 font-bold uppercase text-[10px] tracking-[0.15em] w-full sm:w-auto text-center"
              >
                Become a Sponsor
              </a>
            </div>
          </div>

          {/* Scroll indicator */}
          <div
            className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center space-y-2 text-white/20"
            style={{ opacity: "calc(1 - var(--scroll-progress, 0) * 8)" }}
          >
            <span className="text-[7px] uppercase font-semibold tracking-[0.35em]">
              Scroll
            </span>
            <div className="w-4 h-7 rounded-full border border-white/10 flex justify-center p-1.5">
              <div
                className="w-0.5 h-0.5 rounded-full bg-stellar-orange"
                style={{ animation: "float 2s ease-in-out infinite" }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
           ABOUT
           ══════════════════════════════════════════════════════ */}
      <section id="about" className="relative z-10 py-24 md:py-32 px-4 md:px-6 border-t border-white/[0.04]">
        {/* Giant watermark number */}
        <div
          className="absolute top-4 left-2 md:left-6 text-[18vw] font-header font-black leading-none pointer-events-none select-none"
          style={{
            WebkitTextStroke: "1px rgba(255,255,255,0.015)",
            WebkitTextFillColor: "transparent",
          }}
        >
          01
        </div>

        <div className="max-w-7xl mx-auto relative">
          {/* Section header */}
          <div className="flex flex-col items-start mb-14 space-y-2">
            <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-artemis-blue">
              01 / Foundation
            </span>
            <h2 className="text-3xl md:text-5xl font-header font-black tracking-tight">
              About Artemis{" "}
              <span className="text-white/25">&amp; Our Mission</span>
            </h2>
            <div className="w-14 h-0.5 bg-gradient-to-r from-artemis-blue to-transparent mt-1" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left — text */}
            <div className="lg:col-span-7 flex flex-col space-y-6">
              <p className="text-base md:text-lg text-white/55 font-light leading-relaxed">
                Founded in 2016, Team 6621 Artemis Robotics is the only FRC team in
                Columbia County. We represent Chatham High School not only as the only
                robotics team but as the only competitive engineering program — fully
                student-operated, where members design hardware, write software, manage
                real budgets, and deploy STEM outreach across our community.
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="glass-panel glass-panel-hover p-5 group">
                  <h4 className="text-2xl md:text-3xl font-header font-black text-gradient-orange">
                    2016
                  </h4>
                  <p className="text-[9px] text-white/30 uppercase tracking-[0.2em] mt-1 font-semibold">
                    Year Founded
                  </p>
                </div>
                <div className="glass-panel glass-panel-hover p-5 group">
                  <h4 className="text-2xl md:text-3xl font-header font-black text-gradient-blue">
                    20
                  </h4>
                  <p className="text-[9px] text-white/30 uppercase tracking-[0.2em] mt-1 font-semibold">
                    Active Members
                  </p>
                </div>
                <div className="glass-panel glass-panel-hover p-5 group">
                  <h4 className="text-2xl md:text-3xl font-header font-black text-gradient-orange">
                    5,000+
                  </h4>
                  <p className="text-[9px] text-white/30 uppercase tracking-[0.2em] mt-1 font-semibold">
                    Hours This Season
                  </p>
                </div>
                <div className="glass-panel glass-panel-hover p-5 group">
                  <h4 className="text-2xl md:text-3xl font-header font-black text-gradient-blue">
                    600%
                  </h4>
                  <p className="text-[9px] text-white/30 uppercase tracking-[0.2em] mt-1 font-semibold">
                    Growth in Girls
                  </p>
                </div>
              </div>
            </div>

            {/* Right — team photo + mission card */}
            <div className="lg:col-span-5 space-y-6">
              {/* Team photo */}
              <div className="glass-panel overflow-hidden rounded-2xl">
                <img
                  src="/photos/hero/team_with_robot.jpg"
                  alt="Team 6621 Artemis with robot at competition"
                  className="w-full h-56 object-cover hover:scale-105 transition-transform duration-700"
                />
              </div>
              <div className="glass-panel-deep glass-panel-hover p-7 h-full flex flex-col justify-between relative overflow-hidden group">
                <div className="absolute -right-20 -bottom-20 w-36 h-36 rounded-full bg-artemis-blue/[0.06] blur-[50px] group-hover:bg-artemis-blue/[0.1] transition-all duration-700" />

                <div className="relative space-y-5">
                  <div className="w-10 h-10 rounded-xl glass-panel flex items-center justify-center overflow-hidden">
                    <img
                      src="/branding/logo_4.jpeg"
                      alt=""
                      className="w-6 h-7 object-contain"
                      style={{ mixBlendMode: "screen" }}
                    />
                  </div>
                  <h3 className="text-xl font-header font-black">Our North Star</h3>
                  <p className="text-white/45 text-sm leading-relaxed font-light">
                    To cultivate a welcoming environment centered on STEAM learning and
                    values of gracious professionalism regardless of background. We believe
                    that talent is universal but opportunity is not.
                  </p>
                </div>

                <div className="border-t border-white/[0.04] pt-5 mt-6 flex items-center justify-between text-[8px] text-white/25 font-bold uppercase tracking-[0.2em]">
                  <span>STEM Leadership</span>
                  <span>Chatham, NY</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
           OUTREACH
           ══════════════════════════════════════════════════════ */}
      <section id="outreach" className="relative z-10 py-24 md:py-32 px-4 md:px-6 border-t border-white/[0.04]">
        {/* Watermark */}
        <div
          className="absolute top-4 right-2 md:right-6 text-[18vw] font-header font-black leading-none pointer-events-none select-none"
          style={{
            WebkitTextStroke: "1px rgba(255,255,255,0.015)",
            WebkitTextFillColor: "transparent",
          }}
        >
          02
        </div>

        <div className="max-w-7xl mx-auto relative">
          <div className="flex flex-col items-start mb-14 space-y-2">
            <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-stellar-orange">
              02 / Ecosystem
            </span>
            <h2 className="text-3xl md:text-5xl font-header font-black tracking-tight">
              FRC Education{" "}
              <span className="text-white/25">&amp; Outreach</span>
            </h2>
            <div className="w-14 h-0.5 bg-gradient-to-r from-stellar-orange to-transparent mt-1" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {OUTREACH_CARDS.map((card, idx) => (
              <div
                key={idx}
                className="glass-panel glass-panel-hover flex flex-col justify-between min-h-[380px] group overflow-hidden"
                style={{
                  transition: "all 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
                }}
              >
                {/* Card image */}
                {card.image && (
                  <div className="w-full h-44 overflow-hidden relative">
                    <img
                      src={card.image}
                      alt={card.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-space-darker/80 to-transparent" />
                  </div>
                )}
                <div className="p-7 flex flex-col flex-1 justify-between">
                  <div className="space-y-4">
                    <span className={`text-[9px] font-bold tracking-[0.2em] uppercase ${card.tagColor}`}>
                      {card.tag}
                    </span>
                    <h3 className="text-lg font-header font-black">{card.title}</h3>
                    <p className="text-sm text-white/40 font-light leading-relaxed">
                      {card.desc}
                    </p>
                  </div>
                  <div className="text-[8px] font-bold uppercase text-white/20 tracking-[0.2em] pt-5 border-t border-white/[0.04]">
                    {card.footer}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
           BUDGET
           ══════════════════════════════════════════════════════ */}
      <section id="budget" className="relative z-10 py-24 md:py-32 px-4 md:px-6 border-t border-white/[0.04]">
        <div
          className="absolute top-4 left-2 md:left-6 text-[18vw] font-header font-black leading-none pointer-events-none select-none"
          style={{
            WebkitTextStroke: "1px rgba(255,255,255,0.015)",
            WebkitTextFillColor: "transparent",
          }}
        >
          03
        </div>

        <div className="max-w-7xl mx-auto relative">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">

            {/* Left — description */}
            <div className="lg:col-span-5 space-y-5">
              <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-artemis-blue">
                03 / Operations
              </span>
              <h2 className="text-3xl md:text-5xl font-header font-black tracking-tight">
                Operating{" "}
                <span className="text-white/25">Budget</span>
              </h2>
              <div className="w-14 h-0.5 bg-gradient-to-r from-artemis-blue to-transparent" />
              <p className="text-sm text-white/50 leading-relaxed font-light pt-1">
                Running a competitive robotics team requires serious capital. Our target
                budget of <strong className="text-white font-medium">$65,000</strong> covers
                everything from competition parts to worlds travel. 42% of students in our
                school are on free or reduced lunch — we refuse to charge a single cent to participate.
              </p>

              <div className="glass-panel p-5 flex items-center justify-between">
                <div>
                  <span className="text-[8px] uppercase font-bold tracking-[0.2em] text-white/30">
                    Season Goal
                  </span>
                  <div className="text-xl md:text-2xl font-header font-black text-gradient-orange mt-0.5">
                    $65,000
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[8px] uppercase font-bold tracking-[0.2em] text-white/30">
                    Team Size
                  </span>
                  <div className="text-base font-bold text-white mt-0.5">20 Students</div>
                </div>
              </div>
            </div>

            {/* Right — progress bars in glass panel */}
            <div className="lg:col-span-7">
              <div className="glass-panel-deep p-7 md:p-8 space-y-7 relative">
                {BUDGET_ITEMS.map((item, idx) => (
                  <div key={idx} className="space-y-2">
                    <div className="flex justify-between items-center text-[11px]">
                      <span className="font-semibold tracking-wide text-white/70">
                        {item.label}
                      </span>
                      <span className="font-bold text-gradient-blue">{item.amount}</span>
                    </div>
                    <div className="w-full h-2 bg-white/[0.04] rounded-full overflow-hidden">
                      <div
                        className={`h-full bg-gradient-to-r ${item.color} rounded-full ${item.shadow}`}
                        style={{ width: item.width }}
                      />
                    </div>
                    <p className="text-[9px] text-white/25">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
           MARQUEE
           ══════════════════════════════════════════════════════ */}
      <section className="relative z-10 py-10 border-t border-b border-white/[0.04]">
        <div className="marquee-container py-3">
          <div className="marquee-content text-sm font-header font-black tracking-[0.2em] text-white/15 uppercase">
            <span>
              ◆ Hermes Partners ◆ Apollo Champions ◆ ZEUS Titans ◆ Become a Sponsor
              ◆ FRC Team 6621 ◆ Chatham NY ◆ Deep Space Deep Time
            </span>
            <span>
              ◆ Hermes Partners ◆ Apollo Champions ◆ ZEUS Titans ◆ Become a Sponsor
              ◆ FRC Team 6621 ◆ Chatham NY ◆ Deep Space Deep Time
            </span>
            <span>
              ◆ Hermes Partners ◆ Apollo Champions ◆ ZEUS Titans ◆ Become a Sponsor
              ◆ FRC Team 6621 ◆ Chatham NY ◆ Deep Space Deep Time
            </span>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
           SPONSORS MARQUEE
           ══════════════════════════════════════════════════════ */}
      <section className="relative z-10 py-16 bg-[#030508]/80 backdrop-blur-md border-b border-white/[0.04]">
        <div className="text-center mb-8">
          <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-white/30">
            Powered By Our Sponsors
          </span>
        </div>
        <div className="marquee-container py-3">
          <div className="marquee-content" style={{ animationDuration: "60s" }}>
            {[1, 2, 3].map((set) => (
              <div key={set} className="flex items-center gap-12 px-6 flex-shrink-0">
                {SPONSOR_LOGOS.map((logo, idx) => (
                  <img
                    key={idx}
                    src={logo}
                    alt="Sponsor Logo"
                    className="h-12 md:h-16 w-auto object-contain opacity-50 hover:opacity-100 transition-opacity duration-300 filter grayscale hover:grayscale-0"
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
           SPONSORSHIP TIERS
           ══════════════════════════════════════════════════════ */}
      <section id="tiers" className="relative z-10 py-24 md:py-32 px-4 md:px-6">
        <div
          className="absolute top-4 right-2 md:right-6 text-[18vw] font-header font-black leading-none pointer-events-none select-none"
          style={{
            WebkitTextStroke: "1px rgba(255,255,255,0.015)",
            WebkitTextFillColor: "transparent",
          }}
        >
          04
        </div>

        <div className="max-w-7xl mx-auto relative">
          <div className="flex flex-col items-center text-center mb-16 space-y-2">
            <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-stellar-orange">
              04 / Alliance
            </span>
            <h2 className="text-3xl md:text-5xl font-header font-black tracking-tight">
              Sponsorship Tiers
            </h2>
            <div className="w-14 h-0.5 bg-gradient-to-r from-stellar-orange via-artemis-blue to-transparent mt-1 mx-auto" />
            <p className="text-sm text-white/40 max-w-lg mx-auto pt-3 leading-relaxed font-light">
              Power our engineering research. Select a tier to place your brand on our
              robot, team banner, and competition shirts.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
            {TIERS.map((tier, idx) => (
              <div
                key={tier.name}
                className={`glass-panel-deep ${tier.cardHover} p-7 flex flex-col justify-between relative group overflow-hidden ${
                  tier.recommended ? "lg:scale-[1.03] z-10" : ""
                }`}
                style={{
                  transition: "all 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
                }}
              >
                {/* Recommended badge */}
                {tier.recommended && (
                  <div className="absolute top-0 right-0 bg-artemis-blue px-3 py-1 rounded-bl-xl text-[8px] font-bold uppercase tracking-[0.15em]">
                    Recommended
                  </div>
                )}

                {/* Inner glow */}
                <div
                  className={`absolute -right-16 -bottom-16 w-32 h-32 rounded-full blur-[40px] transition-all duration-700 ${
                    tier.color === "orange"
                      ? "bg-stellar-orange/[0.04] group-hover:bg-stellar-orange/[0.08]"
                      : tier.color === "blue"
                      ? "bg-artemis-blue/[0.04] group-hover:bg-artemis-blue/[0.08]"
                      : "bg-amber-500/[0.04] group-hover:bg-amber-500/[0.08]"
                  }`}
                />

                <div className="relative space-y-5">
                  <div className="flex justify-between items-center">
                    <span className={`text-[9px] font-bold tracking-[0.2em] uppercase ${tier.accentText}`}>
                      {tier.label}
                    </span>
                    <div className={`w-2 h-2 rounded-full ${tier.dotColor} ${tier.dotShadow}`} />
                  </div>

                  <div>
                    <h3 className="text-xl font-header font-black">{tier.name}</h3>
                    <div className="text-2xl md:text-3xl font-header font-black text-white/85 mt-1">
                      {tier.price}
                    </div>
                  </div>

                  <div className="w-full h-px bg-white/[0.04]" />

                  <ul className="space-y-3 text-[11px] text-white/50 font-light">
                    {tier.benefits.map((b, i) => (
                      <li key={i} className="flex items-start space-x-2.5">
                        <span className={`${tier.accentText} text-xs mt-0.5`}>✦</span>
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  onClick={() => handleSelectTier(tier.name)}
                  className={`mt-7 w-full py-3 rounded-xl transition-all duration-300 ${tier.btnClass}`}
                >
                  Select {tier.name}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
           CHECKOUT TERMINAL
           ══════════════════════════════════════════════════════ */}
      <section id="pay" className="relative z-10 py-24 md:py-32 px-4 md:px-6 border-t border-white/[0.04]">
        <div className="max-w-3xl mx-auto">
          <div className="flex flex-col items-center text-center mb-10 space-y-2">
            <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-artemis-blue">
              05 / Transaction
            </span>
            <h2 className="text-2xl md:text-4xl font-header font-black tracking-tight">
              Sponsor Checkout Terminal
            </h2>
            <p className="text-[11px] text-white/30 pt-1">
              Submit your sponsorship interest. Our team will follow up with invoicing details.
            </p>
          </div>

          <div className="glass-panel-deep p-7 md:p-10 relative overflow-hidden">
            {/* Grid pattern overlay */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.008)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.008)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none" />

            {!sponsorSuccess ? (
              <form onSubmit={handleSponsorSubmit} className="relative z-10 space-y-5">

                {/* Tier selector */}
                <div className="space-y-2">
                  <label className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/30">
                    Selected Tier
                  </label>
                  <div className="grid grid-cols-4 gap-1.5 bg-black/30 p-1 rounded-xl border border-white/[0.04]">
                    {(["Hermes", "Apollo", "ZEUS", "Other"] as const).map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => {
                          setSelectedTier(t);
                          setSponsorForm((p) => ({ ...p, interestedTier: t }));
                        }}
                        className={`py-2 text-center text-[10px] font-bold uppercase rounded-lg tracking-wider transition-all duration-300 ${
                          selectedTier === t
                            ? "bg-white text-black shadow-lg"
                            : "text-white/50 hover:text-white hover:bg-white/[0.04]"
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/30">
                      Company Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={sponsorForm.companyName}
                      onChange={(e) => setSponsorForm({ ...sponsorForm, companyName: e.target.value })}
                      placeholder="e.g. Acme Engineering"
                      className="w-full glass-input"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/30">
                      Contact Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={sponsorForm.contactName}
                      onChange={(e) => setSponsorForm({ ...sponsorForm, contactName: e.target.value })}
                      placeholder="e.g. Jane Smith"
                      className="w-full glass-input"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/30">
                      Email *
                    </label>
                    <input
                      type="email"
                      required
                      value={sponsorForm.email}
                      onChange={(e) => setSponsorForm({ ...sponsorForm, email: e.target.value })}
                      placeholder="e.g. sponsor@company.com"
                      className="w-full glass-input"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/30">
                      Phone (Optional)
                    </label>
                    <input
                      type="tel"
                      value={sponsorForm.phone}
                      onChange={(e) => setSponsorForm({ ...sponsorForm, phone: e.target.value })}
                      placeholder="e.g. (555) 662-1000"
                      className="w-full glass-input"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/30">
                    Message *
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={sponsorForm.message}
                    onChange={(e) => setSponsorForm({ ...sponsorForm, message: e.target.value })}
                    placeholder="Tell us about your sponsorship goals..."
                    className="w-full glass-input resize-none"
                  />
                </div>

                {/* Billing info card */}
                <div className="p-4 rounded-xl bg-black/30 border border-white/[0.04] space-y-3">
                  <div className="flex justify-between items-center text-[10px] font-semibold">
                    <span className="text-white/25 uppercase tracking-wider text-[8px]">
                      Allocation Summary
                    </span>
                    <span className="text-gradient-orange font-bold uppercase">
                      {selectedTier === "Hermes" && "$500+ Tier"}
                      {selectedTier === "Apollo" && "$1,500+ Tier"}
                      {selectedTier === "ZEUS" && "$5,000+ Tier"}
                      {selectedTier === "Other" && "Custom Amount"}
                    </span>
                  </div>
                  <p className="text-[10px] text-white/20 leading-relaxed font-light">
                    Your interest will be reviewed by our team. An executive will follow up
                    with invoicing details. No payment is processed on this form.
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={isSubmittingSponsor}
                  className="w-full py-3.5 bg-gradient-to-r from-artemis-blue to-stellar-orange text-white font-bold uppercase text-[10px] tracking-[0.15em] rounded-xl hover:shadow-[0_0_30px_rgba(249,115,22,0.3)] disabled:opacity-50 transition-all duration-500"
                >
                  {isSubmittingSponsor ? "Sending..." : "Submit Sponsorship Interest"}
                </button>
              </form>
            ) : (
              <div className="relative z-10 text-center py-6 space-y-5">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-artemis-blue/20 to-stellar-orange/20 border border-stellar-orange/30 mx-auto flex items-center justify-center text-xl">
                  ✦
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-header font-black">Interest Submitted</h3>
                  <p className="text-[11px] text-white/40 max-w-sm mx-auto leading-relaxed">
                    Thank you! An Artemis team member will review your inquiry and follow up.
                  </p>
                </div>

                <div className="max-w-sm mx-auto p-5 rounded-xl bg-black/40 border border-white/[0.04] text-left font-mono text-[10px] space-y-2">
                  <div className="text-center font-header font-bold tracking-[0.2em] uppercase text-white/25 pb-2 border-b border-white/[0.04] mb-2 text-[9px]">
                    Receipt
                  </div>
                  <div><span className="text-stellar-orange">COMPANY:</span> {sponsorReceipt?.companyName}</div>
                  <div><span className="text-stellar-orange">CONTACT:</span> {sponsorReceipt?.contactName}</div>
                  <div><span className="text-stellar-orange">EMAIL:</span> {sponsorReceipt?.email}</div>
                  {sponsorReceipt?.phone && <div><span className="text-stellar-orange">PHONE:</span> {sponsorReceipt?.phone}</div>}
                  <div><span className="text-stellar-orange">TIER:</span> {sponsorReceipt?.interestedTier}</div>
                </div>

                <button
                  onClick={() => setSponsorSuccess(false)}
                  className="glass-button px-5 py-2 text-[10px] font-bold uppercase tracking-wider"
                >
                  Submit Another
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
           CONTACT
           ══════════════════════════════════════════════════════ */}
      <section id="contact" className="relative z-10 py-24 md:py-32 px-4 md:px-6 border-t border-white/[0.04]">
        <div className="max-w-3xl mx-auto">
          <div className="flex flex-col items-center text-center mb-12 space-y-2">
            <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-stellar-orange">
              06 / Connect
            </span>
            <h2 className="text-2xl md:text-4xl font-header font-black tracking-tight">
              Get In Touch
            </h2>
            <p className="text-[11px] text-white/35 max-w-sm mx-auto pt-1 font-light">
              Questions about mentoring, collaboration, or visiting the lab? Reach out below.
            </p>
          </div>

          <div className="glass-panel p-7 md:p-10">
            {!contactSuccess ? (
              <form onSubmit={handleContactSubmit} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/30">
                      Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={contactForm.name}
                      onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                      placeholder="Your name"
                      className="w-full glass-input"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/30">
                      Email *
                    </label>
                    <input
                      type="email"
                      required
                      value={contactForm.email}
                      onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                      placeholder="you@email.com"
                      className="w-full glass-input"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/30">
                    Subject *
                  </label>
                  <input
                    type="text"
                    required
                    value={contactForm.subject}
                    onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                    placeholder="What is this about?"
                    className="w-full glass-input"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/30">
                    Message *
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={contactForm.message}
                    onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                    placeholder="Write your message here..."
                    className="w-full glass-input resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmittingContact}
                  className="w-full py-3.5 bg-white hover:bg-stellar-orange text-black hover:text-white font-bold uppercase text-[10px] tracking-[0.15em] rounded-xl transition-all duration-300"
                >
                  {isSubmittingContact ? "Sending..." : "Send Message"}
                </button>
              </form>
            ) : (
              <div className="text-center py-6 space-y-4">
                <div className="w-12 h-12 rounded-full bg-green-500/10 border border-green-500/30 mx-auto flex items-center justify-center text-lg text-green-400">
                  ✓
                </div>
                <h3 className="text-lg font-header font-black">Message Sent</h3>
                <p className="text-[11px] text-white/40 max-w-xs mx-auto leading-relaxed">
                  Thanks for reaching out. A team member will get back to you soon.
                </p>
                <button
                  onClick={() => setContactSuccess(false)}
                  className="glass-button px-5 py-2 text-[10px] font-bold uppercase tracking-wider mt-2"
                >
                  Send Another
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
           FOOTER
           ══════════════════════════════════════════════════════ */}
      <footer className="relative z-10 border-t border-white/[0.04] py-10 px-4 md:px-6 bg-[#030508]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-white/30 text-[11px]">
          {/* Logo + tagline */}
          <div className="flex items-center space-x-3">
            <div className="w-6 h-7 overflow-hidden">
              <img
                src="/branding/logo_4.jpeg"
                alt="Artemis"
                className="w-full h-full object-contain"
                style={{ mixBlendMode: "screen" }}
              />
            </div>
            <div className="flex flex-col">
              <span className="font-header font-bold tracking-[0.15em] text-sm text-white/80">
                ARTEMIS<span className="text-stellar-orange">.6621</span>
              </span>
              <span className="text-[9px] text-white/20 tracking-wider">
                50 Woodbridge Ave, Chatham, NY 12037
              </span>
            </div>
          </div>

          {/* Nav links */}
          <div className="flex items-center space-x-5">
            {NAV_LINKS.map((l) => (
              <a
                key={l.id}
                href={l.href}
                className="hover:text-white transition-colors duration-300 text-[10px] uppercase tracking-wider"
              >
                {l.label}
              </a>
            ))}
          </div>

          {/* Social links */}
          <div className="flex items-center space-x-4">
            <a href="https://www.instagram.com/artemis_6621/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors duration-300 text-white/30">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
            </a>
            <a href="https://www.youtube.com/@ArtemisFrc6621" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors duration-300 text-white/30">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
            </a>
            <a href="https://www.thebluealliance.com/team/6621" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors duration-300 text-white/30 text-[9px] font-bold tracking-wider">
              TBA
            </a>
          </div>

          {/* Copyright */}
          <div className="text-[10px] text-white/20">
            &copy; {new Date().getFullYear()} Team 6621 &middot; Chatham NY
          </div>
        </div>
      </footer>
    </div>
  );
}
