"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  Heart,
  Calendar,
  Clock,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  Sparkles,
  Flower2,
  Image as ImageIcon,
  Music2,
  Lock,
} from "lucide-react";

/* ---------- Decorative helpers ---------- */

function FloralSprig({ className = "", flip = false }) {
  return (
    <motion.svg
      viewBox="0 0 200 300"
      className={className}
      style={{ transform: flip ? "scaleX(-1)" : "none" }}
      animate={{ rotate: [0, 1.5, 0, -1.5, 0] }}
      transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
      fill="none"
    >
      <path
        d="M100 300 C 90 220, 110 180, 95 120 C 85 80, 100 40, 90 0"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M95 120 C 70 110, 50 90, 40 60"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M95 120 C 120 115, 140 95, 150 70"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M92 200 C 65 195, 45 175, 35 150"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M92 200 C 118 195, 138 175, 148 150"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <circle cx="40" cy="58" r="5" fill="currentColor" opacity="0.85" />
      <circle cx="150" cy="68" r="4" fill="currentColor" opacity="0.6" />
      <circle cx="35" cy="148" r="4" fill="currentColor" opacity="0.6" />
      <circle cx="148" cy="148" r="5" fill="currentColor" opacity="0.85" />
      <circle cx="90" cy="2" r="6" fill="currentColor" opacity="0.9" />
    </motion.svg>
  );
}

function PetalField({ count = 7, tone = "gold" }) {
  const petals = Array.from({ length: count });
  const colorClass = tone === "gold" ? "text-wedding-gold/25" : "text-white/30";
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {petals.map((_, i) => {
        const left = (i * 61 + 8) % 96;
        const delay = (i % 5) * 1.6;
        const duration = 16 + (i % 4) * 4;
        const size = 12 + (i % 3) * 6;
        return (
          <motion.span
            key={i}
            className={`absolute ${colorClass}`}
            style={{ left: `${left}%`, top: "-8%", width: size, height: size }}
            animate={{
              y: ["0vh", "112vh"],
              rotate: [0, i % 2 === 0 ? 180 : -180],
              opacity: [0, 0.7, 0],
            }}
            transition={{ duration, delay, repeat: Infinity, ease: "linear" }}
          >
            <Flower2 className="w-full h-full" strokeWidth={1.2} />
          </motion.span>
        );
      })}
    </div>
  );
}

function SectionDivider({ dark = false }) {
  return (
    <div className="flex items-center justify-center gap-4">
      <span
        className={`h-px w-16 bg-gradient-to-r from-transparent ${dark ? "to-wedding-goldPale/50" : "to-wedding-gold/45"}`}
      />
      <Flower2
        className={`w-5 h-5 ${dark ? "text-wedding-goldPale/70" : "text-wedding-terracotta/60"}`}
        strokeWidth={1.2}
      />
      <span
        className={`h-px w-16 bg-gradient-to-l from-transparent ${dark ? "to-wedding-goldPale/50" : "to-wedding-gold/45"}`}
      />
    </div>
  );
}

function PhotoPlaceholder({
  label = "Photo",
  aspect = "aspect-[4/3]",
  className = "",
  dark = false,
  rounded = "rounded-2xl",
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className={`glass-sheen relative ${aspect} ${rounded} overflow-hidden border flex items-center justify-center group ${
        dark
          ? "border-wedding-glassDarkBorder bg-white/[0.06] backdrop-blur-md"
          : "border-white/70 bg-white/40 backdrop-blur-md shadow-glassSoft"
      } ${className}`}
    >
      <div
        className={`flex flex-col items-center gap-2 transition-colors ${
          dark
            ? "text-wedding-goldPale/50 group-hover:text-wedding-goldPale/75"
            : "text-wedding-terracotta/40 group-hover:text-wedding-terracotta/60"
        }`}
      >
        <ImageIcon className="w-6 h-6" strokeWidth={1.2} />
        <span className="text-[10px] tracking-[0.15em] uppercase">{label}</span>
      </div>
    </motion.div>
  );
}

/**
 * SmartImage
 * Renders a next/image filling its positioned parent, but falls back to
 * a soft placeholder (icon + optional label) when `src` is missing or
 * the image fails to load (bad path, 404, etc).
 */
function SmartImage({
  src,
  alt,
  label,
  className = "",
  priority = false,
  sizes,
}) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <div
        className={`absolute inset-0 flex flex-col items-center justify-center gap-2 bg-wedding-blush/50 text-wedding-terracotta/40 ${className}`}
      >
        <ImageIcon className="w-8 h-8" strokeWidth={1.2} />
        {label && (
          <span className="text-[10px] tracking-[0.15em] uppercase font-display text-wedding-espressoSoft/70 text-center px-2">
            {label}
          </span>
        )}
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={sizes}
      priority={priority}
      className={`object-cover ${className}`}
      onError={() => setFailed(true)}
    />
  );
}

function ScrollCue() {
  return (
    <motion.a
      href="#story"
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, delay: 0.9 }}
      className="relative mt-10 flex items-center justify-center w-20 h-20 mx-auto group"
      aria-label="Scroll to read our story"
    >
      <motion.svg
        viewBox="0 0 100 100"
        className="absolute inset-0 w-full h-full text-wedding-terracotta/60 group-hover:text-wedding-terracotta transition-colors"
        animate={{ rotate: 360 }}
        transition={{ duration: 16, repeat: Infinity, ease: "linear" }}
      >
        <defs>
          <path
            id="scrollCirclePath"
            d="M 50, 50 m -38, 0 a 38,38 0 1,1 76,0 a 38,38 0 1,1 -76,0"
          />
        </defs>
        <text
          fill="currentColor"
          fontSize="8"
          letterSpacing="3"
          className="font-display uppercase"
        >
          <textPath href="#scrollCirclePath" startOffset="0%">
            Our Story &bull; Keep Scrolling &bull;
          </textPath>
        </text>
      </motion.svg>
      <motion.span
        animate={{ y: [0, 5, 0] }}
        transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
        className="text-wedding-terracottaDeep"
      >
        <ChevronDown className="w-5 h-5" />
      </motion.span>
    </motion.a>
  );
}

function FloatingRSVP() {
  const [pastHero, setPastHero] = useState(false);
  const [rsvpInView, setRsvpInView] = useState(false);

  // Force scroll to top on page load / reload
  useEffect(() => {
    if (typeof window !== "undefined") {
      window.scrollTo(0, 0);

      // Also handles browser history scroll restoration if supported
      if ("scrollRestoration" in window.history) {
        window.history.scrollRestoration = "manual";
      }
    }
  }, []);

  useEffect(() => {
    function onScroll() {
      setPastHero(window.scrollY > window.innerHeight * 0.7);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const rsvpSection = document.getElementById("rsvp");
    if (!rsvpSection) return;

    const observer = new IntersectionObserver(
      ([entry]) => setRsvpInView(entry.isIntersecting),
      { threshold: 0.15 },
    );
    observer.observe(rsvpSection);
    return () => observer.disconnect();
  }, []);

  const visible = pastHero && !rsvpInView;

  return (
    <AnimatePresence>
      {visible && (
        <motion.a
          href="#rsvp"
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.9 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.96 }}
          className="fixed bottom-6 left-6 z-50"
        >
          <motion.span
            className="absolute inset-0 rounded-full bg-wedding-terracotta/40 blur-md"
            animate={{ scale: [1, 1.35, 1], opacity: [0.5, 0, 0.5] }}
            transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
          />
          <span className="relative flex items-center gap-2 px-6 py-3.5 rounded-full bg-white/25 backdrop-blur-2xl border border-white/50 shadow-glass overflow-hidden">
            <motion.span
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent"
              animate={{ x: ["-120%", "220%"] }}
              transition={{
                duration: 3.5,
                repeat: Infinity,
                repeatDelay: 2,
                ease: "easeInOut",
              }}
            />
            <Heart className="w-4 h-4 text-wedding-terracottaDeep fill-current relative z-10" />
            <span className="text-sm font-medium text-wedding-espresso relative z-10 font-display tracking-wide">
              RSVP
            </span>
          </span>
        </motion.a>
      )}
    </AnimatePresence>
  );
}

/* ---------- Fully Animated Gallery Carousel ---------- */
function AnimatedGalleryCarousel({ items }) {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const total = items.length;

  const next = () => {
    setDirection(1);
    setIndex((i) => (i + 1) % total);
  };

  const prev = () => {
    setDirection(-1);
    setIndex((i) => (i - 1 + total) % total);
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setDirection(1);
      setIndex((i) => (i + 1) % items.length);
    }, 4500);

    return () => clearInterval(timer);
  }, [items.length]);

  const slideVariants = {
    enter: (dir) => ({
      x: dir > 0 ? 80 : -80,
      opacity: 0,
      scale: 0.95,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      scale: 1,
      transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
    },
    exit: (dir) => ({
      zIndex: 0,
      x: dir < 0 ? 80 : -80,
      opacity: 0,
      scale: 0.95,
      transition: { duration: 0.4, ease: "easeInOut" },
    }),
  };

  return (
    <div className="max-w-md mx-auto relative px-4">
      <div className="text-center mb-3 text-xs tracking-[0.2em] font-display text-wedding-terracottaDeep font-semibold">
        {index + 1} / {total}
      </div>

      <div className="relative bg-white p-3 pb-6 rounded-2xl shadow-glass border border-white/80 overflow-hidden">
        <div className="relative aspect-[4/5] sm:aspect-[3/4] w-full bg-wedding-blush/60 rounded-xl flex items-center justify-center overflow-hidden">
          <AnimatePresence initial={false} custom={direction} mode="popLayout">
            <motion.div
              key={index}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="absolute inset-0"
            >
              <SmartImage
                src={items[index].image}
                alt={items[index].label}
                // label={items[index].label}
                priority={index === 0}
                sizes="(max-width: 640px) 90vw, 400px"
              />
            </motion.div>
          </AnimatePresence>

          <button
            onClick={prev}
            aria-label="Previous photo"
            className="absolute left-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-white/80 backdrop-blur-md border border-white/80 flex items-center justify-center text-wedding-terracottaDeep hover:bg-white transition shadow-glassSoft"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={next}
            aria-label="Next photo"
            className="absolute right-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-white/80 backdrop-blur-md border border-white/80 flex items-center justify-center text-wedding-terracottaDeep hover:bg-white transition shadow-glassSoft"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
        {/* <div className="mt-3 text-center text-xs tracking-wide text-wedding-espressoSoft/80 font-display italic">
          {items[index].label}
        </div> */}
      </div>

      <div className="flex items-center justify-center gap-2 mt-6 overflow-x-auto pb-2 scrollbar-none">
        {items.map((item, idx) => (
          <button
            key={item.image || item.label}
            onClick={() => {
              setDirection(idx > index ? 1 : -1);
              setIndex(idx);
            }}
            className={`relative flex-shrink-0 w-14 h-14 rounded-lg overflow-hidden border-2 transition-all ${
              idx === index
                ? "border-wedding-terracotta scale-105 shadow-glassSoft ring-2 ring-wedding-gold/40"
                : "border-white/50 opacity-60 hover:opacity-100"
            }`}
          >
            <SmartImage src={item.image} alt={item.label} sizes="56px" />
          </button>
        ))}
      </div>
    </div>
  );
}

/* ---------- Enhanced Hero Couple Arches with Soft Glow & Polaroid Style ---------- */
function CoupleArches() {
  return (
    <div className="relative flex items-center justify-center mx-auto mb-10 w-full max-w-lg h-[300px] md:h-[380px]">
      <div className="absolute w-56 h-56 md:w-72 md:h-72 rounded-full bg-wedding-gold/15 blur-3xl pointer-events-none" />

      {/* Bride */}
      <motion.div
        initial={{ opacity: 0, x: -30, rotate: -4 }}
        animate={{ opacity: 1, x: 0, rotate: -3 }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
        whileHover={{ scale: 1.03, rotate: -1, zIndex: 30 }}
        className="relative w-[155px] sm:w-[185px] md:w-[210px] h-[250px] sm:h-[300px] md:h-[340px] rounded-t-full p-2 bg-white/80 backdrop-blur-xl border border-white shadow-glass z-10 -mr-6 md:-mr-10 transition-transform cursor-pointer"
      >
        <div className="relative w-full h-full rounded-t-full overflow-hidden bg-wedding-blush/70">
          <SmartImage
            src="/images/couple/bride.jpeg"
            alt="Joy"
            label="Joy"
            priority
            sizes="(max-width: 768px) 185px, 210px"
          />
        </div>
      </motion.div>

      {/* Center Heart Badge */}
      <motion.div
        initial={{ opacity: 0, scale: 0.2, rotate: 15 }}
        animate={{ opacity: 1, scale: 1, rotate: 0 }}
        transition={{ duration: 0.8, ease: "backOut", delay: 0.8 }}
        className="absolute z-30 w-12 h-12 md:w-14 md:h-14 rounded-full bg-wedding-ivory border-2 border-wedding-gold shadow-glassSoft flex items-center justify-center text-wedding-terracotta"
      >
        <Heart className="w-5 h-5 fill-current animate-pulse" />
      </motion.div>

      {/* Groom */}
      <motion.div
        initial={{ opacity: 0, x: 30, rotate: 4 }}
        animate={{ opacity: 1, x: 0, rotate: 3 }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.45 }}
        whileHover={{ scale: 1.03, rotate: 1, zIndex: 30 }}
        className="relative w-[155px] sm:w-[185px] md:w-[210px] h-[250px] sm:h-[300px] md:h-[340px] rounded-t-full p-2 bg-white/80 backdrop-blur-xl border border-white shadow-glass z-10 -ml-6 md:-ml-10 transition-transform cursor-pointer"
      >
        <div className="relative w-full h-full rounded-t-full overflow-hidden bg-wedding-blush/70">
          <SmartImage
            src="/images/couple/groom.jpeg"
            alt="Joshua"
            label="Joshua"
            priority
            sizes="(max-width: 768px) 185px, 210px"
          />
        </div>
      </motion.div>
    </div>
  );
}

/* ---------- Main Component ---------- */

export default function WeddingInvite() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasEntered, setHasEntered] = useState(false);
  const audioRef = useRef(null);

  const toggleAudio = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current
        .play()
        .catch((e) => console.log("Audio play blocked:", e));
    }
    setIsPlaying(!isPlaying);
  };

  const enter = () => {
    audioRef.current
      ?.play()
      .catch((e) => console.log("Audio play blocked:", e));
    setIsPlaying(true);
    setHasEntered(true);
  };

  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const weddingDate = new Date("2026-11-28T10:00:00").getTime();

  useEffect(() => {
    document.body.style.overflow = hasEntered ? "" : "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [hasEntered]);

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const difference = weddingDate - now;
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [weddingDate]);

  // RSVP state — single URL, phone-only lookup, no token
  const [guestRecord, setGuestRecord] = useState(null);
  const [step, setStep] = useState("verify_phone"); // "verify_email" | "form" | "success_sent" | "already_submitted"
  const [inputPhone, setInputPhone] = useState("");
  const [formData, setFormData] = useState({
    attendance: "Attending",
    additionalGuests: [],
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleVerifyPhone = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMessage("");

    try {
      const res = await fetch(`/api/rsvp/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: inputPhone }),
      });
      const data = await res.json();

      if (data.success) {
        setGuestRecord(data.guest);
        if (data.guest.hasResponded) {
          setStep("already_submitted");
        } else {
          setStep("form");
        }
      } else {
        setErrorMessage(data.message || "Phone number not recognized.");
      }
    } catch (err) {
      setErrorMessage("Network error verifying guest details.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleAttendanceChange = (val) => {
    const maxAllowed = guestRecord?.maxFamilySize
      ? guestRecord.maxFamilySize - 1
      : 0;
    let newAdditional = formData.additionalGuests;
    if (val === "Attending" && newAdditional.length === 0 && maxAllowed > 0) {
      newAdditional = Array(Math.min(1, maxAllowed)).fill("");
    }
    setFormData({
      ...formData,
      attendance: val,
      additionalGuests: newAdditional,
    });
  };

  const handleAdditionalGuestCountChange = (count) => {
    const maxAllowed = guestRecord?.maxFamilySize
      ? guestRecord.maxFamilySize - 1
      : 0;
    const clampedCount = Math.max(0, Math.min(count, maxAllowed));
    const updated = Array(clampedCount)
      .fill("")
      .map((_, i) => formData.additionalGuests[i] || "");
    setFormData({ ...formData, additionalGuests: updated });
  };

  const handleAdditionalNameChange = (index, value) => {
    const updated = [...formData.additionalGuests];
    updated[index] = value;
    setFormData({ ...formData, additionalGuests: updated });
  };

  const handleFinalRsvpSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMessage("");

    try {
      const res = await fetch(`/api/rsvp/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          guestId: guestRecord.id,
          phone: inputPhone,
          attendance: formData.attendance,
          additionalGuests: formData.additionalGuests,
          message: formData.message,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setStep("success_sent");
      } else {
        setErrorMessage(data.message || "Failed to submit RSVP.");
      }
    } catch (err) {
      setErrorMessage("Network error submitting RSVP.");
    } finally {
      setSubmitting(false);
    }
  };

  const [openFaq, setOpenFaq] = useState(null);
  const toggleFaq = (index) => setOpenFaq(openFaq === index ? null : index);

  const chapters = [
    {
      title: "One Simple Reply",
      body: `From a simple WhatsApp status reply, to unending conversations and then calls that somehow became longer and more frequent. Somewhere between the laughter, the late-night conversations, and the endless "just one more call," came the realization…`,
      quote: "We are in love ❤️",
      label: "First Photo",
      image: "/images/story/chapter1.jpeg",
      sizes: "(max-width: 768px) 100vw, 450px",
    },
    {
      title: "Falling, Slowly",
      body: "Along the way, friendship became companionship, and distance became something we learned to navigate together. Love happened quietly, naturally — and between all the talking and laughing, we're choosing forever to build a life.",
      label: "Together",
      image: "/images/story/chapter2.jpeg",
      sizes: "(max-width: 768px) 100vw, 450px",
    },
    {
      title: "The Question",
      body: "It was a beautiful day with no idea that the day was about to become one we would remember forever. In the quiet of that moment, the simplest question was asked… And with full hearts and a very happy yes, our forever officially began.💍❤️",
      label: "The Proposal",
      image: "/images/story/chapter3.jpeg",
      sizes: "(max-width: 768px) 100vw, 450px",
    },
  ];

  const memories = [
    { label: "First Hello", image: "/images/gallery/memory1.jpeg" },
    { label: "Sunday Lunches", image: "/images/gallery/memory2.jpeg" },
    { label: "Road Trips", image: "/images/gallery/memory3.jpeg" },
    { label: "Family & Friends", image: "/images/gallery/memory4.jpeg" },
    { label: "The Proposal", image: "/images/gallery/memory5.jpeg" },
    // { label: "Just Us", image: "/images/gallery/memory6.jpeg" },
  ];

  const faqs = [
    {
      q: "Can I bring a plus one?",
      a: "We greatly love to have YOU at our celebration. However we are keeping our celebration intimate so we kindly ask that you do not bring an additional guest who has not been formally invited. Thank you for understanding and helping us make the evening special for everyone. ❤️",
    },
    {
      q: "Are children allowed?",
      a: "As much as we adore your little ones, our celebration will be an adults-only affair. We hope this gives everyone the chance to relax, enjoy the evening, and celebrate with us to the fullest. Thank you so much for understanding. ❤️",
    },
    {
      q: "What is the dress code?",
      a: "Come dressed to celebrate! Our dress code is formal with guests encouraged to dress in our chosen colour palette of emerald green and white. We can't wait to see you bring the colours to life!",
    },
    {
      q: "Is parking available at the venue?",
      a: "Yes! Ample secure parking is available right on-site with attendants to guide you.",
    },
  ];

  return (
    <div className="min-h-screen bg-wedding-ivory text-wedding-espresso overflow-x-hidden relative font-body">
      <audio ref={audioRef} loop src="/audio/count-on-you.mp3" />

      <AnimatePresence>
        {!hasEntered && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="fixed inset-0 z-[70] bg-wedding-ivory flex flex-col items-center justify-center text-center px-6"
          >
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.7,
                delay: 0.2,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="flex flex-col items-center"
            >
              <Flower2
                className="w-8 h-8 text-wedding-terracotta mb-6"
                strokeWidth={1.2}
              />
              <span className="text-xs tracking-[0.3em] uppercase text-wedding-terracottaDeep mb-3 font-display">
                You're Invited
              </span>
              <h1 className="text-4xl md:text-6xl font-display mb-2">
                Joy &amp; Joshua
              </h1>
              <p className="text-sm text-wedding-terracotta font-light mb-10">
                November 28, 2026
              </p>
              <button
                onClick={enter}
                className="bg-wedding-terracotta hover:bg-wedding-terracottaDeep text-white px-8 py-3.5 rounded-full font-medium transition shadow-glass flex items-center gap-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-wedding-gold focus-visible:outline-offset-2"
              >
                <Music2 className="w-4 h-4" /> Begin the celebration
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="fixed bottom-6 right-6 z-50">
        <motion.button
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          onClick={toggleAudio}
          className="bg-white/60 backdrop-blur-xl border border-white/70 text-wedding-terracottaDeep p-4 rounded-full shadow-glass flex items-center gap-2 hover:bg-white/80 transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-wedding-gold focus-visible:outline-offset-2"
          title="Toggle our song"
        >
          {isPlaying ? (
            <span className="flex items-end gap-0.5 h-4 w-4">
              {[0, 1, 2].map((i) => (
                <motion.span
                  key={i}
                  className="w-1 bg-wedding-terracottaDeep rounded-full"
                  animate={{ height: ["30%", "100%", "45%", "80%", "30%"] }}
                  transition={{
                    duration: 1.1,
                    repeat: Infinity,
                    delay: i * 0.15,
                    ease: "easeInOut",
                  }}
                />
              ))}
            </span>
          ) : (
            <Music2 className="w-4 h-4" />
          )}
        </motion.button>
      </div>

      <FloatingRSVP />

      {/* HERO */}
      <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-4 pt-28 pb-12 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_#f5ecd9_0%,_#fbf6ec_55%)]" />
        <PetalField />
        <FloralSprig className="hidden md:block absolute -left-4 top-8 w-36 h-56 text-wedding-gold/30" />
        <FloralSprig
          className="hidden md:block absolute -right-4 bottom-8 w-36 h-56 text-wedding-gold/30"
          flip
        />

        <motion.div
          variants={{
            hidden: {},
            show: { transition: { staggerChildren: 0.15, delayChildren: 0.2 } },
          }}
          initial="hidden"
          animate="show"
          className="z-20 max-w-3xl mx-auto"
        >
          <motion.span
            variants={{
              hidden: { opacity: 0, y: 24 },
              show: {
                opacity: 1,
                y: 0,
                transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
              },
            }}
            className="text-wedding-terracottaDeep text-sm md:text-base font-medium mb-4 block tracking-widest uppercase font-display"
          >
            The Wedding Celebration of
          </motion.span>

          <motion.div
            variants={{
              hidden: { opacity: 0, y: 24 },
              show: {
                opacity: 1,
                y: 0,
                transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
              },
            }}
          >
            <CoupleArches />
          </motion.div>

          <motion.h1
            variants={{
              hidden: { opacity: 0, y: 24 },
              show: {
                opacity: 1,
                y: 0,
                transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
              },
            }}
            className="text-5xl md:text-7xl text-wedding-espresso mb-3 tracking-wide font-display"
          >
            Joy &amp; Joshua
          </motion.h1>
          <motion.p
            variants={{
              hidden: { opacity: 0, y: 24 },
              show: {
                opacity: 1,
                y: 0,
                transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
              },
            }}
            className="text-lg md:text-xl text-wedding-terracotta font-light mb-10"
          >
            November 28, 2026 &bull; Warri, Nigeria
          </motion.p>

          <motion.div
            variants={{
              hidden: { opacity: 0, y: 24 },
              show: {
                opacity: 1,
                y: 0,
                transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
              },
            }}
            className="grid grid-cols-4 gap-3 md:gap-6 max-w-md mx-auto mb-10"
          >
            {Object.entries(timeLeft).map(([label, value]) => (
              <div
                key={label}
                className="bg-white/50 backdrop-blur-xl border border-white/70 p-3 rounded-xl shadow-glassSoft"
              >
                <span className="text-2xl md:text-4xl font-semibold text-wedding-terracottaDeep block font-display">
                  {value}
                </span>
                <span className="text-[10px] md:text-xs tracking-wider text-wedding-espressoSoft/80 uppercase">
                  {label}
                </span>
              </div>
            ))}
          </motion.div>

          <div className="flex flex-col items-center">
            <a
              href="#rsvp"
              className="bg-wedding-terracotta hover:bg-wedding-terracottaDeep text-white px-10 py-3.5 rounded-full font-medium transition shadow-glass flex items-center gap-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-wedding-gold focus-visible:outline-offset-2"
            >
              <Heart className="w-4 h-4 fill-current" /> RSVP Now
            </a>
            <ScrollCue />
          </div>
        </motion.div>
      </section>

      {/* OUR STORY */}
      <section id="story" className="py-24 px-6 bg-wedding-blush">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="text-center mb-16"
          >
            <Sparkles className="w-7 h-7 text-wedding-terracotta mx-auto mb-3" />
            <h2 className="text-4xl md:text-5xl mb-4 font-display">
              Where It All Began
            </h2>
            <p className="text-wedding-espressoSoft max-w-xl mx-auto text-sm md:text-base">
              Every love story is beautiful, but ours is our absolute favorite.
              Here's how our paths crossed.
            </p>
          </motion.div>

          <div className="relative">
            <span className="hidden md:block absolute left-1/2 top-2 bottom-2 w-px bg-gradient-to-b from-transparent via-wedding-gold/50 to-transparent -translate-x-1/2" />

            <div className="space-y-16 md:space-y-20">
              {chapters.map((chapter, idx) => {
                const reverse = idx % 2 === 1;
                return (
                  <div
                    key={chapter.title}
                    className={`grid md:grid-cols-2 gap-8 md:gap-14 items-center relative`}
                  >
                    <span className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-wedding-ivory border-2 border-wedding-gold items-center justify-center text-xs font-display text-wedding-terracottaDeep z-10">
                      {idx + 1}
                    </span>

                    <motion.div
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.7 }}
                      className={reverse ? "md:order-2 space-y-4" : "space-y-4"}
                    >
                      <span className="md:hidden text-xs font-display text-wedding-terracottaDeep">
                        Chapter {idx + 1}
                      </span>
                      <h3 className="text-2xl md:text-3xl font-display">
                        {chapter.title}
                      </h3>
                      <p className="text-wedding-espressoSoft leading-relaxed text-sm md:text-base">
                        {chapter.body}
                      </p>
                      {chapter.quote && (
                        <p className="font-display italic text-xl md:text-2xl text-wedding-terracottaDeep pt-1">
                          {chapter.quote}
                        </p>
                      )}
                    </motion.div>

                    <div className={reverse ? "md:order-1" : ""}>
                      <div className="relative w-full rounded-2xl overflow-hidden shadow-glass border border-wedding-gold/20 bg-white/40 p-2">
                        <div className="relative w-full aspect-[4/5] rounded-xl overflow-hidden">
                          {/* Elegant portrait aspect ratio, with placeholder fallback */}
                          <SmartImage
                            src={chapter.image}
                            sizes="(max-width: 768px) 100vw, 450px"
                            alt={chapter.label || "Wedding Story"}
                            label={chapter.label}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="text-center font-display italic text-2xl md:text-3xl text-wedding-terracottaDeep mt-16 md:mt-20 max-w-2xl mx-auto"
          >
            And just like that, we knew — this was the beginning of forever.
          </motion.p>

          <div className="mt-16">
            <SectionDivider />
          </div>
        </div>
      </section>

      {/* OUR BLESSING */}
      <section className="relative py-24 px-6 bg-wedding-dusk overflow-hidden flex items-center justify-center">
        {/* Soft background petal floating effect */}
        <PetalField count={6} tone="pale" />

        {/* Ambient gold glow behind the card */}
        <div className="absolute w-72 h-72 md:w-96 md:h-96 rounded-full bg-wedding-gold/10 blur-3xl pointer-events-none" />

        {/* Faint corner florals for warmth */}
        <FloralSprig className="hidden md:block absolute -left-6 top-1/2 -translate-y-1/2 w-28 h-48 text-wedding-goldPale/15" />
        <FloralSprig
          className="hidden md:block absolute -right-6 top-1/2 -translate-y-1/2 w-28 h-48 text-wedding-goldPale/15"
          flip
        />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="relative z-10 max-w-xl mx-auto w-full"
        >
          {/* Gradient border wrapper */}
          <div className="rounded-[2rem] p-[1px] bg-gradient-to-br from-wedding-gold/50 via-wedding-goldPale/10 to-wedding-gold/30 shadow-glassDark">
            <div className="glass-sheen relative bg-wedding-sageDeep/50 backdrop-blur-xl rounded-[calc(2rem-1px)] px-8 py-12 md:px-14 md:py-16 text-center overflow-hidden">
              {/* Oversized decorative quote mark */}
              <span
                aria-hidden="true"
                className="pointer-events-none select-none absolute -top-4 left-1/2 -translate-x-1/2 text-[7rem] md:text-[9rem] leading-none font-display text-wedding-gold/10"
              >
                &ldquo;
              </span>

              {/* Pulsing heart badge */}
              <div className="relative w-12 h-12 mx-auto mb-6 flex items-center justify-center">
                <motion.span
                  className="absolute inset-0 rounded-full bg-wedding-gold/25 blur-md"
                  animate={{ scale: [1, 1.4, 1], opacity: [0.5, 0, 0.5] }}
                  transition={{
                    duration: 3.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
                <div className="relative z-10 w-9 h-9 rounded-full bg-wedding-ivory/10 border border-wedding-gold/40 flex items-center justify-center">
                  <Heart className="w-4 h-4 text-wedding-goldPale fill-current" />
                </div>
              </div>

              <blockquote className="relative">
                <p className="font-display italic text-xl md:text-2xl leading-relaxed text-wedding-ivory mb-6">
                  "Life is unpredictable, but our love is sure! We will be
                  choosing ourselves daily irrespective of whatever obstacles
                  might surmount."
                </p>
                <p className="text-wedding-ivory/75 text-sm md:text-base leading-relaxed max-w-md mx-auto font-light">
                  We hope that our love continues to grow and that we never stop
                  choosing each other, to keep finding joy in the little things,
                  strength in each other, and always find our way back to the
                  love that brought us here. We want a love that blossoms
                  beautifully, growing from two hearts into something rare,
                  tender, and enduring.
                </p>
              </blockquote>

              <div className="flex items-center justify-center gap-3 mt-8">
                <span className="h-px w-10 bg-gradient-to-r from-transparent to-wedding-gold/50" />
                <Flower2
                  className="w-4 h-4 text-wedding-goldPale/70"
                  strokeWidth={1.2}
                />
                <span className="h-px w-10 bg-gradient-to-l from-transparent to-wedding-gold/50" />
              </div>

              <span className="block mt-4 text-xs tracking-[0.3em] uppercase text-wedding-goldPale font-display">
                — Chinovelle
              </span>
            </div>
          </div>
        </motion.div>
      </section>

      {/* GALLERY */}
      <section className="py-24 px-6 bg-wedding-ivory">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.2 }}
            className="text-center mb-14"
          >
            <h2 className="text-4xl md:text-5xl mb-4 font-display">
              Photo Gallery
            </h2>
            <p className="text-wedding-espressoSoft max-w-xl mx-auto text-sm md:text-base">
              A few of our favorite memories together, on the way to this one.
            </p>
          </motion.div>

          <AnimatedGalleryCarousel items={memories} />
        </div>
      </section>

      {/* THE BIG DAY */}
      <section className="py-24 px-6 bg-wedding-dusk relative overflow-hidden">
        <PetalField count={4} tone="pale" />
        <FloralSprig className="hidden md:block absolute -left-8 top-1/2 -translate-y-1/2 w-32 h-52 text-wedding-goldPale/20" />
        <FloralSprig
          className="hidden md:block absolute -right-8 top-1/2 -translate-y-1/2 w-32 h-52 text-wedding-goldPale/20"
          flip
        />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="relative z-10 max-w-lg mx-auto text-center mb-10"
        >
          <h2 className="text-4xl md:text-5xl text-wedding-ivory mb-4 font-display">
            When &amp; Where
          </h2>
          <p className="text-wedding-goldPale/90 text-sm md:text-base leading-relaxed">
            Join us for an evening of love, laughter, and celebration with
            family and close friends as we begin forever together.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="glass-sheen relative z-10 max-w-lg mx-auto bg-white/[0.07] backdrop-blur-xl p-10 md:p-14 rounded-3xl border border-wedding-glassDarkBorder shadow-glassDark text-center"
        >
          <Calendar className="w-8 h-8 text-wedding-goldPale mx-auto mb-5" />
          <span className="text-xs uppercase tracking-[0.3em] text-wedding-goldPale font-display">
            Save the Date
          </span>
          <h2 className="text-5xl md:text-6xl text-wedding-ivory my-4 font-display">
            28 &middot; 11 &middot; 2026
          </h2>
          <p className="text-wedding-goldPale text-sm mb-8">
            Saturday &bull; 1:00 PM WAT &bull; Warri, Nigeria
          </p>

          <div className="bg-white/10 rounded-2xl p-5 border border-wedding-gold/20 mb-8 text-wedding-ivory shadow-inner">
            <div className="text-center font-display text-lg mb-3 tracking-wider text-wedding-goldPale">
              November 2026
            </div>
            <div className="grid grid-cols-7 gap-1 text-center text-xs mb-2 text-wedding-goldPale/70 font-semibold">
              <span>Su</span>
              <span>Mo</span>
              <span>Tu</span>
              <span>We</span>
              <span>Th</span>
              <span>Fr</span>
              <span>Sa</span>
            </div>
            <div className="grid grid-cols-7 gap-1 text-center text-xs items-center">
              {Array.from({ length: 30 }, (_, i) => i + 1).map((day) => {
                const isWeddingDay = day === 28;
                return (
                  <span
                    key={day}
                    className={`py-2 rounded-lg flex items-center justify-center transition ${
                      isWeddingDay
                        ? "bg-wedding-terracotta text-white font-bold shadow-glassSoft relative ring-2 ring-wedding-gold"
                        : "hover:bg-white/10 text-wedding-ivory/90"
                    }`}
                  >
                    {isWeddingDay ? (
                      <span className="relative flex items-center justify-center w-full h-full">
                        <Heart className="w-4 h-4 text-white fill-current absolute" />
                        <span className="opacity-0">{day}</span>
                      </span>
                    ) : (
                      day
                    )}
                  </span>
                );
              })}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <a
              href="https://calendar.google.com/calendar/render?action=TEMPLATE&text=Joy+%26+Joshua+Wedding&dates=20261128T090000Z/20261128T180000Z&details=Join+us+for+our+wedding+celebration!&location=Warri,+Nigeria"
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 inline-flex items-center justify-center gap-2 bg-wedding-sage hover:bg-wedding-sageDeep text-white px-5 py-3.5 rounded-xl text-sm font-medium transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-wedding-gold focus-visible:outline-offset-2 shadow-glassSoft"
            >
              <Clock className="w-4 h-4" /> Google Calendar
            </a>
          </div>
        </motion.div>
      </section>

      {/* DRESS CODE */}
      <section className="py-24 px-6 bg-wedding-ivory text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="max-w-4xl mx-auto"
        >
          <h2 className="text-4xl md:text-5xl mb-4 font-display">
            Dress Code &amp; Colors
          </h2>
          <p className="text-wedding-espressoSoft mb-12">
            We would love to see our guests dressed in our wedding palette. Feel
            free to explore our inspired tones.
          </p>

          <div className="flex flex-wrap justify-center gap-4 md:gap-6">
            {[
              { name: "Deep Emerald", hex: "#0b4f3d" },
              { name: "Emerald Green", hex: "#0f6e4f" },
              { name: "Ivory White", hex: "#f8f6f0" },
              { name: "Pure White", hex: "#ffffff" },
            ].map((color) => (
              <motion.div
                key={color.hex}
                whileHover={{ scale: 1.08 }}
                className="flex flex-col items-center"
              >
                <div
                  className="w-16 h-16 md:w-20 md:h-20 rounded-full shadow-glassSoft border-2 border-white/70 mb-2"
                  style={{ backgroundColor: color.hex }}
                />
                <span className="text-xs text-wedding-espressoSoft font-medium">
                  {color.name}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* FAQ */}
      <section className="py-24 px-6 bg-wedding-blush">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl mb-4 font-display">
              Frequently Asked Questions
            </h2>
            <p className="text-wedding-espressoSoft">
              Got questions? We have answers.
            </p>
          </motion.div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08, duration: 0.7 }}
                className="bg-white/50 backdrop-blur-xl border border-white/70 rounded-2xl overflow-hidden shadow-glassSoft"
              >
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full text-left px-6 py-4 font-medium text-wedding-espresso flex justify-between items-center hover:bg-white/40 transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-wedding-gold focus-visible:outline-offset-2 font-display"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-wedding-terracotta transition-transform ${openFaq === index ? "rotate-180" : ""}`}
                  />
                </button>
                <AnimatePresence>
                  {openFaq === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="px-6 pb-4 text-sm text-wedding-espressoSoft"
                    >
                      {faq.a}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* RSVP SECTION */}
      <section
        id="rsvp"
        className="relative py-24 bg-wedding-dusk px-6 overflow-hidden"
      >
        <PetalField count={5} tone="pale" />
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="glass-sheen relative z-10 max-w-xl mx-auto bg-white/95 p-8 md:p-12 rounded-3xl border border-white shadow-glass"
        >
          <div className="text-center mb-8">
            <Heart className="w-7 h-7 text-wedding-terracotta mx-auto mb-2 fill-current" />
            <h2 className="text-3xl md:text-4xl text-wedding-espresso mb-2 font-display">
              Be Our Guest
            </h2>
            {/* Hide deadline subtitle once RSVP is successfully sent or already submitted */}
            {step !== "success_sent" && step !== "already_submitted" && (
              <p className="text-sm text-wedding-terracottaDeep">
                Please RSVP by October 15, 2026
              </p>
            )}
          </div>

          {step === "verify_phone" && (
            <form onSubmit={handleVerifyPhone} className="space-y-5">
              <div className="bg-wedding-ivory/80 border border-wedding-gold/20 p-4 rounded-2xl text-center mb-4">
                <Lock className="w-5 h-5 text-wedding-terracotta mx-auto mb-2" />
                <p className="text-xs text-wedding-espressoSoft">
                  Please enter your phone number to access your RSVP invitation.
                </p>
              </div>

              <div>
                <label className="block text-xs text-wedding-espressoSoft mb-2 font-medium">
                  Your Phone Number
                </label>
                <input
                  type="tel"
                  required
                  value={inputPhone}
                  onChange={(e) => setInputPhone(e.target.value)}
                  className="w-full bg-wedding-ivory border border-wedding-gold/30 rounded-xl px-4 py-3 text-wedding-espresso focus:outline-none focus:border-wedding-terracotta transition text-sm"
                  placeholder="e.g. 08012345678"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-wedding-terracotta hover:bg-wedding-terracottaDeep text-white py-3.5 rounded-xl font-medium transition flex items-center justify-center gap-2 shadow-glass disabled:opacity-50"
              >
                {submitting ? "Verifying..." : "Access Invitation"}
              </button>

              {errorMessage && (
                <div className="flex items-center gap-2 text-rose-600 bg-rose-500/10 p-3 rounded-xl text-sm justify-center">
                  <AlertCircle className="w-5 h-5" /> {errorMessage}
                </div>
              )}
            </form>
          )}

          {step === "form" && guestRecord && (
            <form onSubmit={handleFinalRsvpSubmit} className="space-y-5">
              <div className="bg-wedding-ivory p-4 rounded-2xl border border-wedding-gold/20 text-center mb-2">
                <span className="text-xs uppercase tracking-widest text-wedding-terracotta block font-display mb-1">
                  Welcome,
                </span>
                <h3 className="font-display text-xl text-wedding-espresso">
                  {guestRecord.name}
                </h3>
                <p className="text-xs text-wedding-espressoSoft mt-1">
                  Family Allocation: Up to {guestRecord.maxFamilySize} guest(s)
                  total
                </p>
              </div>

              <div>
                <label className="block text-xs text-wedding-espressoSoft mb-2 font-medium">
                  Will you attend?
                </label>
                <select
                  value={formData.attendance}
                  onChange={(e) => handleAttendanceChange(e.target.value)}
                  className="w-full bg-wedding-ivory border border-wedding-gold/30 rounded-xl px-4 py-3 text-wedding-espresso focus:outline-none focus:border-wedding-terracotta transition text-sm"
                >
                  <option value="Attending">Joyfully accept</option>
                  <option value="Declined">Regretfully decline</option>
                </select>
              </div>

              {formData.attendance === "Attending" &&
                guestRecord.maxFamilySize > 1 && (
                  <div className="space-y-4 pt-2 border-t border-wedding-gold/20">
                    <div>
                      <label className="block text-xs text-wedding-espressoSoft mb-2 font-medium">
                        Number of Additional Guests (Max allowed:{" "}
                        {guestRecord.maxFamilySize - 1})
                      </label>
                      <select
                        value={formData.additionalGuests.length}
                        onChange={(e) =>
                          handleAdditionalGuestCountChange(
                            parseInt(e.target.value),
                          )
                        }
                        className="w-full bg-wedding-ivory border border-wedding-gold/30 rounded-xl px-4 py-3 text-wedding-espresso focus:outline-none focus:border-wedding-terracotta transition text-sm"
                      >
                        {Array.from(
                          { length: guestRecord.maxFamilySize },
                          (_, i) => i,
                        ).map((num) => (
                          <option key={num} value={num}>
                            {num === 0
                              ? "Just myself"
                              : `${num} additional guest(s)`}
                          </option>
                        ))}
                      </select>
                    </div>

                    {formData.additionalGuests.length > 0 && (
                      <div className="space-y-3">
                        <label className="block text-xs text-wedding-espressoSoft font-medium">
                          Additional Guest Name(s)
                        </label>
                        {formData.additionalGuests.map((guestName, idx) => (
                          <input
                            key={idx}
                            type="text"
                            required
                            value={guestName}
                            onChange={(e) =>
                              handleAdditionalNameChange(idx, e.target.value)
                            }
                            className="w-full bg-wedding-ivory border border-wedding-gold/30 rounded-xl px-4 py-3 text-wedding-espresso focus:outline-none focus:border-wedding-terracotta transition text-sm"
                            placeholder={`Full name of guest ${idx + 1}`}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                )}

              <div>
                <label className="block text-xs text-wedding-espressoSoft mb-2 font-medium">
                  Wishes for the couple
                </label>
                <textarea
                  rows="3"
                  value={formData.message}
                  onChange={(e) =>
                    setFormData({ ...formData, message: e.target.value })
                  }
                  className="w-full bg-wedding-ivory border border-wedding-gold/30 rounded-xl px-4 py-3 text-wedding-espresso focus:outline-none focus:border-wedding-terracotta transition text-sm resize-none"
                  placeholder="Leave a sweet note..."
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-wedding-terracotta hover:bg-wedding-terracottaDeep text-white py-3.5 rounded-xl font-medium transition flex items-center justify-center gap-2 shadow-glass disabled:opacity-50"
              >
                {submitting ? "Sending..." : "Send RSVP"}
              </button>

              {errorMessage && (
                <div className="flex items-center gap-2 text-rose-600 bg-rose-500/10 p-3 rounded-xl text-sm justify-center">
                  <AlertCircle className="w-5 h-5" /> {errorMessage}
                </div>
              )}
            </form>
          )}

          {/* Shown immediately in the current session after submitting */}
          {step === "success_sent" && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="text-center py-8 space-y-5"
            >
              <div className="relative w-16 h-16 mx-auto flex items-center justify-center">
                <motion.div
                  className="absolute inset-0 rounded-full bg-wedding-gold/20 blur-xl"
                  animate={{ scale: [1, 1.3, 1], opacity: [0.6, 0.2, 0.6] }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
                <div className="relative z-10 w-14 h-14 rounded-full bg-wedding-ivory border-2 border-wedding-gold flex items-center justify-center text-wedding-terracotta shadow-glassSoft">
                  <Flower2 className="w-6 h-6" strokeWidth={1.2} />
                </div>
              </div>

              <div className="space-y-2">
                <span className="text-xs uppercase tracking-[0.25em] text-wedding-terracottaDeep font-display block">
                  Response Recorded
                </span>
                <h3 className="font-display text-2xl md:text-3xl text-wedding-espresso">
                  With Gratitude
                </h3>
              </div>

              <p className="text-sm text-wedding-espressoSoft leading-relaxed max-w-sm mx-auto font-light">
                Your RSVP has been securely received. We look forward to sharing
                our special day with you on November 28, 2026.
              </p>

              <div className="pt-2">
                <span className="inline-block h-px w-12 bg-wedding-gold/40" />
              </div>
            </motion.div>
          )}

          {/* Shown ONLY if they revisit the page later after already submitting */}
          {step === "already_submitted" && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="text-center py-8 space-y-5"
            >
              <div className="relative w-16 h-16 mx-auto flex items-center justify-center">
                <div className="w-14 h-14 rounded-full bg-wedding-ivory border-2 border-wedding-gold/60 flex items-center justify-center text-wedding-terracotta/70 shadow-glassSoft">
                  <Heart className="w-5 h-5 fill-current" />
                </div>
              </div>

              <div className="space-y-2">
                <span className="text-xs uppercase tracking-[0.25em] text-wedding-terracottaDeep font-display block">
                  Already Confirmed
                </span>
                <h3 className="font-display text-2xl md:text-3xl text-wedding-espresso">
                  See You Soon
                </h3>
              </div>

              <p className="text-sm text-wedding-espressoSoft leading-relaxed max-w-sm mx-auto font-light">
                We have already received your RSVP response for this invitation.
                Warmest regards from Joy &amp; Joshua!
              </p>

              <div className="pt-2">
                <span className="inline-block h-px w-12 bg-wedding-gold/40" />
              </div>
            </motion.div>
          )}
        </motion.div>
      </section>

      {/* FOOTER */}
      <footer className="py-12 text-center text-xs text-wedding-espressoSoft/70 border-t border-wedding-gold/20 bg-wedding-ivory">
        <Flower2
          className="w-5 h-5 text-wedding-terracotta/50 mx-auto mb-3"
          strokeWidth={1.2}
        />
        <p className="text-base text-wedding-espresso mb-2 font-display">
          Joy &amp; Joshua
        </p>
      </footer>
    </div>
  );
}
