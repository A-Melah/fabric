"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  Heart,
  Gift,
  Calendar,
  Clock,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  Image as ImageIcon,
  Music2,
  Lock,
  MapPin,
  Navigation,
  Copy,
  Check,
  Landmark,
} from "lucide-react";
import { RELATIONSHIPS } from "@/lib/rsvp-options";

/* ================= EDIT THESE ================= */
const VENUE_NAME = "Kingdom Hall of Jehovah's Witnesses";
const VENUE_ADDRESS = "Street address, City, State"; // TODO
const MAP_QUERY = "Kingdom Hall of Jehovah's Witnesses, Warri, Nigeria"; // TODO: exact address
const WEDDING_ISO = "2026-12-12T13:00:00+01:00";
// Set to true once real gallery photos are in /public/images/gallery/.
// Cards without an image URL (or whose file is missing) still fall back to a placeholder.
const GALLERY_USE_IMAGES = false;
// Quote section: replace with your own words or a verse you love
const QUOTE_TEXT =
  "Love is not found once and kept; it is chosen again, gently, every single day.";
const QUOTE_NOTE =
  "We hope to keep choosing each other, and to find our way back to the love that brought us here.";
const QUOTE_BY = "Franca & Abanum";
const RSVP_BY = "November 30, 2026"; // TODO

const BANK = {
  NGN: [
    ["Bank Name", "First Bank of Nigeria"],
    ["Account Name", "Abanum Iruoghene Isakpa"],
    ["Account Number", "3088963058"],
  ],
  USD: [
    ["Bank Name", "Access Bank"],
    ["Account Name", "Abanum Iruoghene Isakpa"],
    ["Account Number", "1676754859"],
    ["Account Type", "Domiciliary Savings Account Tier 1"],
    // ["Routing / IBAN", "000000000"],
  ],
};
/* ============================================== */

/* ---------- Flowers ---------- */

const PETALS = ["#b79fd9", "#d9cbee", "#ffffff", "#8a6bb8", "#ead7a0"];

function Blossom({ className = "", color = "#b79fd9", core = "#c9a24b" }) {
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden="true">
      {[0, 72, 144, 216, 288].map((r) => (
        <ellipse
          key={r}
          cx="50"
          cy="27"
          rx="14"
          ry="23"
          style={{ fill: color }}
          stroke="#8a6bb866"
          strokeWidth="1"
          opacity="0.92"
          transform={`rotate(${r} 50 50)`}
        />
      ))}
      <circle cx="50" cy="50" r="8" style={{ fill: core }} />
    </svg>
  );
}

/** Lots of blossoms scattered and gently swaying (CSS animation, deterministic for SSR). */
function BloomScatter({ count = 24, className = "" }) {
  return (
    <div
      className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}
    >
      {Array.from({ length: count }).map((_, i) => {
        const size = 22 + ((i * 7) % 5) * 12;
        return (
          <span
            key={i}
            className="absolute will-change-transform"
            style={{
              left: `${(i * 37 + 5) % 98}%`,
              top: `${(i * 53 + 11) % 94}%`,
              width: size,
              height: size,
              "--r": `${i % 2 ? 25 : -25}deg`,
              animation: `bloom-sway ${7 + (i % 5)}s ease-in-out ${(i % 6) * 0.4}s infinite`,
            }}
          >
            <Blossom
              className="w-full h-full opacity-60"
              color={PETALS[i % PETALS.length]}
            />
          </span>
        );
      })}
    </div>
  );
}

function BloomDrift({ count = 10 }) {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {Array.from({ length: count }).map((_, i) => (
        <span
          key={i}
          className="absolute will-change-transform"
          style={{
            left: `${(i * 61 + 8) % 96}%`,
            top: "-8%",
            width: 14 + (i % 3) * 6,
            height: 14 + (i % 3) * 6,
            "--r": `${i % 2 ? 200 : -200}deg`,
            animation: `bloom-fall ${15 + (i % 4) * 4}s linear ${(i % 5) * 1.8}s infinite`,
          }}
        >
          <Blossom className="w-full h-full" color={PETALS[i % 3]} />
        </span>
      ))}
    </div>
  );
}

function BloomRow({ n = 7, className = "" }) {
  return (
    <div className={`flex items-center justify-center gap-2 ${className}`}>
      {Array.from({ length: n }).map((_, i) => (
        <Blossom
          key={i}
          className={i === Math.floor(n / 2) ? "w-8 h-8" : "w-5 h-5 opacity-80"}
          color={PETALS[i % 4]}
        />
      ))}
    </div>
  );
}

/* ---------- Helpers ---------- */

function SmartImage({
  src,
  alt,
  label,
  className = "",
  priority = false,
  sizes,
}) {
  const [failed, setFailed] = useState(false);
  const imgRef = useRef(null);

  // Reset when the source changes
  useEffect(() => {
    setFailed(false);
  }, [src]);

  // onError can fire before React hydrates and get missed, so also check
  // after mount whether the browser already gave up on this image.
  useEffect(() => {
    const el = imgRef.current;
    if (el && el.complete && el.naturalWidth === 0) setFailed(true);
  }, [src]);

  if (!src || failed) {
    return (
      <div
        className={`absolute inset-0 flex flex-col items-center justify-center gap-2 bg-wedding-mist text-wedding-lilacDeep/50 ${className}`}
      >
        <ImageIcon className="w-8 h-8" strokeWidth={1.2} />
        {label && (
          <span className="text-xs font-display text-wedding-inkSoft/70 text-center px-2">
            {label}
          </span>
        )}
      </div>
    );
  }
  return (
    <Image
      ref={imgRef}
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

function FloatingRSVP() {
  const [pastHero, setPastHero] = useState(false);
  const [rsvpInView, setRsvpInView] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    if ("scrollRestoration" in window.history)
      window.history.scrollRestoration = "manual";
  }, []);

  useEffect(() => {
    const onScroll = () =>
      setPastHero(window.scrollY > window.innerHeight * 0.7);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const el = document.getElementById("rsvp");
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => setRsvpInView(e.isIntersecting),
      { threshold: 0.15 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <AnimatePresence>
      {pastHero && !rsvpInView && (
        <motion.a
          href="#rsvp"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          whileTap={{ scale: 0.96 }}
          className="fixed bottom-6 left-6 z-50 flex items-center gap-2 px-6 py-3.5 rounded-full bg-wedding-lilacDeep text-white border border-wedding-gold/60 shadow-glass"
        >
          <Heart className="w-4 h-4 fill-current" />
          <span className="text-sm font-display tracking-wide">RSVP</span>
        </motion.a>
      )}
    </AnimatePresence>
  );
}

function FloatingGift() {
  const [pastHero, setPastHero] = useState(false);
  const [giftInView, setGiftInView] = useState(false);

  useEffect(() => {
    const onScroll = () =>
      setPastHero(window.scrollY > window.innerHeight * 0.7);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const el = document.getElementById("gift");
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => setGiftInView(e.isIntersecting),
      { threshold: 0.15 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <AnimatePresence>
      {pastHero && !giftInView && (
        <motion.button
          type="button"
          onClick={() =>
            document
              .getElementById("gift")
              ?.scrollIntoView({ behavior: "smooth", block: "start" })
          }
          aria-label="Gift details"
          title="Gift details"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          whileTap={{ scale: 0.94 }}
          className="fixed bottom-22 right-6 z-50 p-4 rounded-full bg-white/90 border border-wedding-gold/60 text-wedding-lilacDeep shadow-glass hover:bg-white transition"
        >
          <Gift className="w-4 h-4" />
        </motion.button>
      )}
    </AnimatePresence>
  );
}

/* ---------- Modern coverflow gallery ---------- */

function PlaceholderCard({ label }) {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-linear-to-br from-wedding-mist via-white to-wedding-mist">
      <div className="relative w-24 h-24">
        <Blossom className="absolute inset-0 w-full h-full" color="#a98bdb" />
        <Blossom
          className="absolute -left-6 top-10 w-10 h-10 opacity-80"
          color="#d9cbee"
        />
        <Blossom
          className="absolute -right-5 -top-3 w-9 h-9 opacity-80"
          color="#f6e3a1"
        />
      </div>
      <span className="font-display italic text-xl text-wedding-lilacDeep text-center px-4">
        {label}
      </span>
      <span className="text-xs text-wedding-inkSoft">Photo coming soon</span>
    </div>
  );
}

function ModernGallery({ items }) {
  const [i, setI] = useState(0);
  const n = items.length;
  // Autoplay freezes only while a finger / mouse button is held down, and resumes on release
  const [holding, setHolding] = useState(false);
  const go = (d) => setI((v) => (v + d + n) % n);

  useEffect(() => {
    if (holding) return;
    const t = setTimeout(() => setI((v) => (v + 1) % n), 3500);
    return () => clearTimeout(t);
  }, [i, n, holding]);

  return (
    <div className="max-w-3xl mx-auto">
      <div
        className="relative h-107.5 md:h-125 overflow-hidden perspective-distant touch-pan-y select-none"
        onPointerDown={() => setHolding(true)}
        onPointerUp={() => setHolding(false)}
        onPointerCancel={() => setHolding(false)}
        onPointerLeave={() => setHolding(false)}
      >
        {items.map((it, idx) => {
          let o = idx - i;
          if (o > n / 2) o -= n;
          if (o < -n / 2) o += n;
          const a = Math.abs(o);
          // Real photo only when GALLERY_USE_IMAGES is on AND this item has an image URL
          const showPhoto = GALLERY_USE_IMAGES && it.image;
          return (
            <motion.button
              key={idx}
              type="button"
              onClick={() => setI(idx)}
              aria-label={`Show ${it.label}`}
              initial={false}
              animate={{
                x: `${o * 62}%`,
                scale: 1 - a * 0.14,
                rotateY: -o * 16,
                opacity: a > 2 ? 0 : 1 - a * 0.2,
                filter: `blur(${a * 3}px)`,
              }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              style={{ zIndex: 10 - a }}
              className="absolute top-4 bottom-4 left-1/2 -ml-31.25 md:-ml-40 w-62.5 md:w-[320px] rounded-4xl overflow-hidden border-4 border-white ring-1 ring-wedding-gold shadow-glass bg-wedding-mist"
            >
              {/* Active card breathes (zooms in and out); the others sit blurred to the sides */}
              <motion.div
                className="absolute inset-0 will-change-transform"
                animate={
                  o === 0 && !holding ? { scale: [1, 1.08, 1] } : { scale: 1 }
                }
                transition={
                  o === 0 && !holding
                    ? { duration: 3.5, repeat: Infinity, ease: "easeInOut" }
                    : { duration: 0.5 }
                }
              >
                {showPhoto ? (
                  <>
                    <SmartImage
                      src={it.image}
                      alt={it.label}
                      label={it.label}
                      sizes="320px"
                      priority={idx === 0}
                    />
                    <span className="absolute inset-x-0 bottom-0 p-4 bg-linear-to-t from-wedding-lilacDeep/80 to-transparent text-white font-display italic text-lg text-left">
                      {it.label}
                    </span>
                  </>
                ) : (
                  <PlaceholderCard label={it.label} />
                )}
              </motion.div>
            </motion.button>
          );
        })}
      </div>

      <div className="flex items-center justify-center gap-5 mt-6">
        <button
          onClick={() => go(-1)}
          aria-label="Previous photo"
          className="w-10 h-10 rounded-full border border-wedding-lilac text-wedding-lilacDeep flex items-center justify-center hover:bg-wedding-lilac hover:text-white transition"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div className="flex gap-1.5">
          {items.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setI(idx)}
              aria-label={`Photo ${idx + 1}`}
              className={`h-1.5 rounded-full transition-all ${idx === i ? "w-8 bg-wedding-lilacDeep" : "w-3 bg-wedding-lilac/50"}`}
            />
          ))}
        </div>
        <button
          onClick={() => go(1)}
          aria-label="Next photo"
          className="w-10 h-10 rounded-full border border-wedding-lilac text-wedding-lilacDeep flex items-center justify-center hover:bg-wedding-lilac hover:text-white transition"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}

/* ---------- Hero portrait: oval photo wreathed in blossoms ---------- */

function HeroPortrait() {
  const N = 16;
  return (
    <div className="relative mx-auto mb-8 w-67.5 h-87.5 md:w-82.5 md:h-107.5">
      <div className="absolute inset-0 rounded-full bg-wedding-lilac/25 blur-3xl" />
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
        className="absolute inset-6 rounded-[50%] p-1.5 gold-fill shadow-glass"
      >
        <div className="relative w-full h-full rounded-[50%] overflow-hidden bg-wedding-mist border-4 border-white">
          <SmartImage
            src="/images/couple/hero.jpeg"
            alt="Franca and Abanum"
            label="Franca & Abanum"
            priority
            sizes="330px"
          />
        </div>
      </motion.div>

      {Array.from({ length: N }).map((_, i) => {
        const ang = (i / N) * Math.PI * 2;
        const size = i % 3 === 0 ? 38 : 26;
        return (
          <motion.span
            key={i}
            className="absolute"
            style={{
              left: `${50 + 49 * Math.cos(ang)}%`,
              top: `${50 + 49 * Math.sin(ang)}%`,
              width: size,
              height: size,
              marginLeft: -size / 2,
              marginTop: -size / 2,
            }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              opacity: { delay: 0.6 + i * 0.05 },
              scale: { delay: 0.6 + i * 0.05, type: "spring" },
            }}
          >
            <span
              className="block w-full h-full"
              style={{
                animation: `bloom-spin ${8 + (i % 4)}s ease-in-out infinite`,
              }}
            >
              <Blossom
                className="w-full h-full"
                color={PETALS[i % PETALS.length]}
              />
            </span>
          </motion.span>
        );
      })}
    </div>
  );
}

function Countdown({ target }) {
  const [t, setT] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  useEffect(() => {
    const tick = () => {
      const d = target - Date.now();
      if (d > 0)
        setT({
          days: Math.floor(d / 86400000),
          hours: Math.floor((d / 3600000) % 24),
          minutes: Math.floor((d / 60000) % 60),
          seconds: Math.floor((d / 1000) % 60),
        });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [target]);
  return (
    <div className="grid grid-cols-4 gap-2 md:gap-6 max-w-md mx-auto mb-10">
      {Object.entries(t).map(([label, value]) => (
        <div
          key={label}
          className="bg-white/90 gold-border relative p-2 md:p-3 rounded-xl shadow-glassSoft"
        >
          <span className="text-xl sm:text-2xl md:text-4xl font-semibold text-wedding-lilacDeep block font-display tabular-nums">
            {value}
          </span>
          <span className="text-xs text-wedding-inkSoft">{label}</span>
        </div>
      ))}
    </div>
  );
}

/* ---------- Page ---------- */

export default function WeddingInvite() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasEntered, setHasEntered] = useState(false);
  const audioRef = useRef(null);

  const toggleAudio = () => {
    if (isPlaying) audioRef.current.pause();
    else
      audioRef.current
        .play()
        .catch((e) => console.log("Audio play blocked:", e));
    setIsPlaying(!isPlaying);
  };
  const enter = () => {
    audioRef.current
      ?.play()
      .catch((e) => console.log("Audio play blocked:", e));
    setIsPlaying(true);
    setHasEntered(true);
  };

  const weddingDate = new Date(WEDDING_ISO).getTime();

  useEffect(() => {
    document.body.style.overflow = hasEntered ? "" : "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [hasEntered]);

  /* RSVP */
  const [guestRecord, setGuestRecord] = useState(null);
  const [step, setStep] = useState("verify_phone");
  const [inputPhone, setInputPhone] = useState("");
  const [formData, setFormData] = useState({
    attendance: "Attending",
    relationship: "",
    relationshipOther: "",
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
        setStep(data.guest.hasResponded ? "already_submitted" : "form");
      } else setErrorMessage(data.message || "Phone number not recognized.");
    } catch {
      setErrorMessage("Network error verifying guest details.");
    } finally {
      setSubmitting(false);
    }
  };

  const maxAllowed = guestRecord?.maxFamilySize
    ? guestRecord.maxFamilySize - 1
    : 0;

  const handleAttendanceChange = (val) => {
    let add = formData.additionalGuests;
    if (val === "Attending" && add.length === 0 && maxAllowed > 0) add = [""];
    setFormData({ ...formData, attendance: val, additionalGuests: add });
  };
  const handleAdditionalGuestCountChange = (count) => {
    const c = Math.max(0, Math.min(count, maxAllowed));
    setFormData({
      ...formData,
      additionalGuests: Array(c)
        .fill("")
        .map((_, i) => formData.additionalGuests[i] || ""),
    });
  };
  const handleAdditionalNameChange = (i, v) => {
    const u = [...formData.additionalGuests];
    u[i] = v;
    setFormData({ ...formData, additionalGuests: u });
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
          relationship: formData.relationship,
          relationshipOther: formData.relationshipOther,
          additionalGuests: formData.additionalGuests,
          message: formData.message,
        }),
      });
      const data = await res.json();
      if (data.success) setStep("success_sent");
      else setErrorMessage(data.message || "Failed to submit RSVP.");
    } catch {
      setErrorMessage("Network error submitting RSVP.");
    } finally {
      setSubmitting(false);
    }
  };

  const [openFaq, setOpenFaq] = useState(null);

  /* Bank */
  const [currency, setCurrency] = useState("NGN");
  const [copied, setCopied] = useState("");
  const copy = (text, key) => {
    navigator.clipboard?.writeText(text).then(() => {
      setCopied(key);
      setTimeout(() => setCopied(""), 1800);
    });
  };

  const chapters = [
    {
      title: "How We Met",
      body: "Replace this with the story of how your paths crossed.",
      label: "First Photo",
      // image: "/images/story/chapter1.jpeg",
    },
    {
      title: "Growing Together",
      body: "Replace this with how friendship became love.",
      label: "Together",
      // image: "/images/story/chapter2.jpeg",
    },
    {
      title: "The Question",
      body: "Replace this with the proposal story.",
      label: "The Proposal",
      // image: "/images/story/chapter3.jpeg",
    },
  ];

  const memories = [
    { label: "First Hello", image: "/images/gallery/memory1.jpeg" },
    { label: "Sunday Lunches", image: "/images/gallery/memory2.jpeg" },
    { label: "Road Trips", image: "/images/gallery/memory3.jpeg" },
    { label: "Family & Friends", image: "/images/gallery/memory4.jpeg" },
    { label: "The Proposal", image: "/images/gallery/memory5.jpeg" },
  ];

  const faqs = [
    {
      q: "Can I bring a plus one?",
      a: "We would love to have YOU at our celebration. We are keeping it intimate, so we kindly ask that you do not bring a guest who has not been formally invited. Thank you for understanding. ❤️",
    },
    {
      q: "Are children allowed?",
      a: "As much as we adore your little ones, our celebration will be an adults-only affair. Thank you so much for understanding. ❤️",
    },
    {
      q: "What is the dress code?",
      a: "Come dressed to celebrate! Our colours are gold, olive green, lilac and white. We can't wait to see you bring them to life.",
    },
    {
      q: "Is parking available at the venue?",
      a: "Please check with the venue notes shared on your invitation. We encourage carpooling where you can.",
    },
  ];

  const colors = [
    { name: "Gold", hex: "#c9a24b" },
    { name: "Olive Green", hex: "#6f7d3a" },
    { name: "Lilac", hex: "#b79fd9" },
    { name: "White", hex: "#ffffff" },
  ];

  const quoteWords = QUOTE_TEXT.split(" ");

  const inputCls =
    "w-full bg-wedding-ivory border border-wedding-gold/40 rounded-xl px-4 py-3 text-wedding-ink focus:outline-none focus:border-wedding-lilacDeep transition text-sm";
  const btnCls =
    "w-full bg-wedding-lilacDeep hover:bg-wedding-lilac text-white py-3.5 rounded-xl font-medium transition flex items-center justify-center gap-2 shadow-glass disabled:opacity-50";
  const fade = {
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.7 },
  };

  return (
    <div className="min-h-screen bg-wedding-ivory text-wedding-ink overflow-x-hidden relative font-body">
      <audio ref={audioRef} loop src="/audio/count-on-you.mp3" />

      {/* ENTRY SCREEN */}
      <AnimatePresence>
        {!hasEntered && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="fixed inset-0 z-70 bg-wedding-ivory flex flex-col items-center justify-center text-center px-6 overflow-hidden"
          >
            <BloomScatter count={10} className="opacity-50" />
            <div className="relative flex flex-col items-center bg-wedding-ivory/85 rounded-4xl px-6 py-8 mx-2">
              <Blossom className="w-12 h-12 mb-5" />
              <span className="text-sm text-wedding-lilacDeep mb-3 font-display italic">
                You're invited to the wedding of
              </span>
              <h1 className="text-4xl sm:text-5xl md:text-7xl font-display mb-2 text-wedding-lilacDeep">
                Franca <span className="gold-text italic">&amp;</span> Abanum
              </h1>
              <p className="text-sm text-wedding-inkSoft mb-10">
                December 12, 2026
              </p>
              <button
                onClick={enter}
                className="bg-wedding-lilacDeep hover:bg-wedding-lilac text-white px-8 py-3.5 rounded-full font-medium transition shadow-glass flex items-center gap-2 border border-wedding-gold/60"
              >
                <Music2 className="w-4 h-4" /> Open invitation
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MUSIC TOGGLE */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={toggleAudio}
          title="Toggle our song"
          aria-label="Toggle music"
          className="bg-white/80 border border-wedding-gold/60 text-wedding-lilacDeep p-4 rounded-full shadow-glass hover:bg-white transition"
        >
          {isPlaying ? (
            <span className="flex items-end gap-0.5 h-4 w-4">
              {[0, 1, 2].map((i) => (
                <motion.span
                  key={i}
                  className="w-1 bg-wedding-lilacDeep rounded-full"
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
        </button>
      </div>

      <FloatingRSVP />
      <FloatingGift />

      {/* HERO */}
      <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-4 pt-20 pb-12 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,#f1ebf8_0%,#fdfaf4_60%)]" />
        <BloomScatter count={16} className="opacity-50" />
        <BloomDrift count={4} />

        <div className="relative z-20 max-w-3xl mx-auto">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="font-display italic text-wedding-lilacDeep text-lg mb-5"
          >
            Together with their families
          </motion.p>

          <HeroPortrait />

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="text-4xl sm:text-5xl md:text-7xl text-wedding-lilacDeep mb-2"
          >
            Franca <span className="gold-text italic">&amp;</span> Abanum
          </motion.h1>
          <p className="text-lg md:text-xl text-wedding-inkSoft font-light mb-8">
            Saturday, December 12, 2026
          </p>

          <Countdown target={weddingDate} />

          <a
            href="#rsvp"
            className="inline-flex items-center gap-2 bg-wedding-lilacDeep hover:bg-wedding-lilac text-white px-10 py-3.5 rounded-full font-medium transition shadow-glass border border-wedding-gold/60"
          >
            <Heart className="w-4 h-4 fill-current" /> RSVP now
          </a>
          <a
            href="#story"
            className="mt-8 flex flex-col items-center text-wedding-lilacDeep text-sm"
            aria-label="Read our story"
          >
            <span className="font-display italic">Our story</span>
            <motion.span
              animate={{ y: [0, 6, 0] }}
              transition={{ duration: 1.6, repeat: Infinity }}
            >
              <ChevronDown className="w-5 h-5" />
            </motion.span>
          </a>
        </div>
      </section>

      {/* STORY */}
      <section
        id="story"
        className="relative py-24 px-6 bg-wedding-mist overflow-hidden"
      >
        <BloomScatter count={8} className="opacity-60" />
        <div className="relative max-w-4xl mx-auto">
          <motion.div {...fade} className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl mb-4 text-wedding-lilacDeep">
              Where it all began
            </h2>
            <p className="text-wedding-inkSoft max-w-xl mx-auto text-sm md:text-base">
              Every love story is beautiful, but ours is our favourite.
            </p>
          </motion.div>

          <div className="space-y-16 md:space-y-20">
            {chapters.map((c, idx) => {
              const reverse = idx % 2 === 1;
              return (
                <div
                  key={c.title}
                  className="grid md:grid-cols-2 gap-8 md:gap-14 items-center"
                >
                  <motion.div
                    {...fade}
                    className={`space-y-4 ${reverse ? "md:order-2" : ""}`}
                  >
                    <h3 className="text-2xl md:text-3xl text-wedding-lilacDeep">
                      {c.title}
                    </h3>
                    <p className="text-wedding-inkSoft leading-relaxed text-sm md:text-base">
                      {c.body}
                    </p>
                  </motion.div>
                  <div className={reverse ? "md:order-1" : ""}>
                    <div className="rounded-4xl p-2 bg-white gold-border relative shadow-glass">
                      <div className="relative w-full aspect-4/5 rounded-3xl overflow-hidden">
                        <SmartImage
                          src={c.image}
                          alt={c.label}
                          label={c.label}
                          sizes="(max-width: 768px) 100vw, 450px"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="mt-16">
            <BloomRow />
          </div>
        </div>
      </section>

      {/* QUOTE */}
      <section
        className="relative py-28 md:py-40 px-6 overflow-hidden"
        style={{
          background:
            "radial-gradient(ellipse at 15% 10%, #b79fe8 0%, transparent 50%), radial-gradient(ellipse at 90% 100%, rgba(212,169,55,0.38) 0%, transparent 45%), linear-gradient(to bottom, #6a45a6, #3e2570)",
        }}
      >
        {/* giant slow-turning blossoms for depth */}
        <div
          className="absolute -top-24 -left-24 w-72 h-72 md:w-104 md:h-104 opacity-25 pointer-events-none"
          style={{ animation: "bloom-turn 90s linear infinite" }}
        >
          <Blossom className="w-full h-full" color="#d9cbee" />
        </div>
        <div
          className="absolute -bottom-28 -right-24 w-72 h-72 md:w-104 md:h-104 opacity-25 pointer-events-none"
          style={{ animation: "bloom-turn 110s linear infinite reverse" }}
        >
          <Blossom className="w-full h-full" color="#f6e3a1" />
        </div>

        {/* glowing concentric rings behind the quote */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
          <div className="absolute -translate-x-1/2 -translate-y-1/2 w-72 h-72 md:w-120 md:h-120 rounded-full bg-wedding-gold/20 blur-3xl" />
          <div
            className="absolute -translate-x-1/2 -translate-y-1/2 w-76 h-76 md:w-136 md:h-136 rounded-full gold-border opacity-40"
            style={{ animation: "ring-breathe 7s ease-in-out infinite" }}
          />
          <div
            className="absolute -translate-x-1/2 -translate-y-1/2 w-100 h-100 md:w-176 md:h-176 rounded-full gold-border opacity-20"
            style={{ animation: "ring-breathe 9s ease-in-out 1s infinite" }}
          />
        </div>

        {/* twinkling sparkles */}
        {Array.from({ length: 14 }).map((_, i) => (
          <span
            key={i}
            aria-hidden="true"
            className="absolute w-3 h-3 gold-fill pointer-events-none [clip-path:polygon(50%_0,60%_40%,100%_50%,60%_60%,50%_100%,40%_60%,0_50%,40%_40%)]"
            style={{
              left: `${(i * 29 + 7) % 94}%`,
              top: `${(i * 43 + 9) % 88}%`,
              animation: `twinkle ${3 + (i % 4)}s ease-in-out ${(i % 5) * 0.6}s infinite`,
            }}
          />
        ))}

        {/* organic wave edges blend into the neighbouring sections; drawn above the flowers so they never spill past the curve */}
        <svg
          viewBox="0 0 1440 90"
          preserveAspectRatio="none"
          className="absolute top-0 left-0 w-full h-10 md:h-16 z-20 pointer-events-none"
          aria-hidden="true"
        >
          <path
            d="M0 0H1440V40C1200 90 960 90 720 50C480 10 240 10 0 50Z"
            fill="#f3edfc"
          />
        </svg>
        <svg
          viewBox="0 0 1440 90"
          preserveAspectRatio="none"
          className="absolute bottom-0 left-0 w-full h-10 md:h-16 rotate-180 z-20 pointer-events-none"
          aria-hidden="true"
        >
          <path
            d="M0 0H1440V40C1200 90 960 90 720 50C480 10 240 10 0 50Z"
            fill="#fffdf8"
          />
        </svg>

        <figure className="relative z-10 max-w-2xl mx-auto text-center">
          <motion.span
            initial={{ opacity: 0, scale: 0.6 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            aria-hidden="true"
            className="gold-text block font-display text-8xl md:text-9xl leading-none h-12 md:h-16 select-none"
          >
            &ldquo;
          </motion.span>

          <blockquote className="mt-6">
            <motion.p
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-80px" }}
              variants={{
                hidden: {},
                show: { transition: { staggerChildren: 0.09 } },
              }}
              className="font-display italic text-2xl sm:text-3xl md:text-5xl leading-snug md:leading-tight text-white"
            >
              {quoteWords.map((w, i) => (
                <motion.span
                  key={i}
                  className="inline-block mr-[0.28em]"
                  variants={{
                    hidden: { opacity: 0, y: 14 },
                    show: { opacity: 1, y: 0, transition: { duration: 0.6 } },
                  }}
                >
                  {w}
                </motion.span>
              ))}
            </motion.p>
            {QUOTE_NOTE && (
              <motion.p
                {...fade}
                className="mt-8 text-sm md:text-base leading-relaxed text-white/85 max-w-md mx-auto"
              >
                {QUOTE_NOTE}
              </motion.p>
            )}
          </blockquote>

          <motion.div
            {...fade}
            className="flex items-center justify-center gap-4 mt-10"
          >
            <span className="h-px w-14 gold-fill" />
            <BloomRow n={3} />
            <span className="h-px w-14 gold-fill" />
          </motion.div>
          <figcaption className="mt-4 font-display italic text-xl gold-text">
            {QUOTE_BY}
          </figcaption>
        </figure>
      </section>

      {/* GALLERY */}
      <section className="py-24 px-6 bg-wedding-ivory overflow-hidden">
        <motion.div {...fade} className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl mb-4 text-wedding-lilacDeep">
            Photo gallery
          </h2>
          <p className="text-wedding-inkSoft max-w-xl mx-auto text-sm md:text-base">
            A few of our favourite memories on the way to this one.
          </p>
        </motion.div>
        <ModernGallery items={memories} />
      </section>

      {/* WHEN & WHERE */}
      <section className="relative py-24 px-6 bg-wedding-mist overflow-hidden">
        <BloomDrift count={4} />
        <motion.div
          {...fade}
          className="relative z-10 max-w-lg mx-auto text-center mb-10"
        >
          <h2 className="text-4xl md:text-5xl text-wedding-lilacDeep mb-4">
            When &amp; where
          </h2>
          <p className="text-wedding-inkSoft text-sm md:text-base leading-relaxed">
            Join us for an afternoon of love, laughter, and celebration with
            family and close friends as we begin forever together.
          </p>
        </motion.div>

        <motion.div
          {...fade}
          className="glass-sheen relative z-10 max-w-lg mx-auto bg-white/80 p-8 md:p-12 rounded-3xl gold-border shadow-glass text-center"
        >
          <Calendar className="w-8 h-8 text-wedding-lilacDeep mx-auto mb-4" />
          <span className="text-sm text-wedding-lilacDeep font-display italic">
            Save the date
          </span>
          <h2 className="text-5xl md:text-6xl gold-text my-3">
            12 · 12 · 2026
          </h2>
          <p className="text-wedding-inkSoft text-sm mb-8">
            Saturday, 1:00 PM WAT
          </p>

          <div className="bg-wedding-ivory rounded-2xl p-5 mb-8 text-wedding-ink">
            <div className="font-display text-lg mb-3 text-wedding-lilacDeep">
              December 2026
            </div>
            <div className="grid grid-cols-7 gap-1 text-center text-xs mb-2 text-wedding-lilacDeep/70 font-semibold">
              {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => (
                <span key={d}>{d}</span>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-1 text-center text-xs items-center">
              {/* Dec 1, 2026 is a Tuesday → 2 leading blanks */}
              {[null, null, ...Array.from({ length: 31 }, (_, i) => i + 1)].map(
                (day, i) =>
                  day === null ? (
                    <span key={`b${i}`} />
                  ) : (
                    <span
                      key={day}
                      className={`py-2 rounded-lg flex items-center justify-center ${
                        day === 12
                          ? "bg-wedding-lilac text-white font-bold ring-2 ring-wedding-gold"
                          : "text-wedding-ink/80"
                      }`}
                    >
                      {day === 12 ? (
                        <Heart
                          className="w-4 h-4 fill-current"
                          aria-label="12"
                        />
                      ) : (
                        day
                      )}
                    </span>
                  ),
              )}
            </div>
          </div>

          <div className="text-left bg-wedding-ivory rounded-2xl p-5 mb-4">
            <div className="flex items-start gap-3 mb-4">
              <MapPin className="w-5 h-5 text-wedding-lilacDeep mt-0.5 shrink-0" />
              <div>
                <h3 className="text-lg text-wedding-ink">{VENUE_NAME}</h3>
                <p className="text-sm text-wedding-inkSoft">{VENUE_ADDRESS}</p>
              </div>
            </div>
            <div className="rounded-xl overflow-hidden aspect-4/3 bg-wedding-mist">
              <iframe
                title="Venue map"
                src={`https://www.google.com/maps?q=${encodeURIComponent(MAP_QUERY)}&output=embed`}
                className="w-full h-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(MAP_QUERY)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 inline-flex items-center justify-center gap-2 bg-wedding-lilacDeep hover:bg-wedding-lilac text-white px-5 py-3.5 rounded-xl text-sm font-medium transition"
            >
              <Navigation className="w-4 h-4" /> Get directions
            </a>
            <a
              href="https://calendar.google.com/calendar/render?action=TEMPLATE&text=Franca+%26+Abanum+Wedding&dates=20261212T120000Z/20261212T170000Z&details=Join+us+for+our+wedding+celebration!&location=Kingdom+Hall+of+Jehovah%27s+Witnesses"
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 inline-flex items-center justify-center gap-2 gold-fill hover:brightness-110 text-wedding-ink px-5 py-3.5 rounded-xl text-sm font-medium transition"
            >
              <Clock className="w-4 h-4" /> Add to calendar
            </a>
          </div>
        </motion.div>
      </section>

      {/* GIFT / BANK DETAILS */}
      <section
        id="gift"
        className="relative py-24 px-6 bg-wedding-ivory overflow-hidden"
      >
        <BloomScatter count={7} className="opacity-50" />
        <motion.div
          {...fade}
          className="relative z-10 max-w-md mx-auto text-center"
        >
          <Landmark className="w-8 h-8 text-wedding-gold mx-auto mb-3" />
          <h2 className="text-3xl md:text-4xl mb-3 text-wedding-lilacDeep">
            With love, a gift
          </h2>
          <p className="text-sm text-wedding-inkSoft mb-8">
            Your presence is the greatest gift. If you would like to bless us
            further, choose a currency to see our account details.
          </p>

          <div
            className="inline-flex p-1 rounded-full bg-wedding-mist border border-wedding-lilac/50 mb-6"
            role="tablist"
          >
            {["NGN", "USD"].map((c) => (
              <button
                key={c}
                role="tab"
                aria-selected={currency === c}
                onClick={() => setCurrency(c)}
                className={`px-7 py-2 rounded-full text-sm font-medium transition ${
                  currency === c
                    ? "bg-wedding-lilacDeep text-white shadow-glassSoft"
                    : "text-wedding-inkSoft hover:text-wedding-ink"
                }`}
              >
                {c === "NGN" ? "₦ NGN" : "$ USD"}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={currency}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-3xl gold-border relative shadow-glass divide-y divide-wedding-gold/20 text-left"
            >
              {BANK[currency].map(([label, value]) => (
                <div
                  key={label}
                  className="flex items-center justify-between gap-4 px-6 py-4"
                >
                  <div>
                    <span className="block text-xs text-wedding-inkSoft/80">
                      {label}
                    </span>
                    <span className="font-display text-wedding-ink">
                      {value}
                    </span>
                  </div>
                  <button
                    onClick={() => copy(value, `${currency}-${label}`)}
                    aria-label={`Copy ${label}`}
                    className="p-2 rounded-full text-wedding-lilacDeep hover:bg-wedding-mist transition"
                  >
                    {copied === `${currency}-${label}` ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>
              ))}
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </section>

      {/* DRESS CODE */}
      <section className="py-24 px-6 bg-wedding-mist text-center">
        <motion.div {...fade} className="max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-5xl mb-4 text-wedding-lilacDeep">
            Dress code &amp; colours
          </h2>
          <p className="text-wedding-inkSoft mb-12">
            We would love to see our guests dressed in our wedding palette.
          </p>
          <div className="flex flex-wrap justify-center gap-5 md:gap-8">
            {colors.map((c) => (
              <motion.div
                key={c.hex}
                whileHover={{ scale: 1.08 }}
                className="flex flex-col items-center"
              >
                <div
                  className="w-16 h-16 md:w-20 md:h-20 rounded-full shadow-glassSoft gold-border relative mb-2"
                  style={{ backgroundColor: c.hex }}
                />
                <span className="text-xs text-wedding-inkSoft font-medium">
                  {c.name}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* FAQ */}
      <section className="py-24 px-6 bg-wedding-ivory">
        <div className="max-w-3xl mx-auto">
          <motion.div {...fade} className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl mb-3 text-wedding-lilacDeep">
              Frequently asked questions
            </h2>
            <p className="text-wedding-inkSoft">
              Got questions? We have answers.
            </p>
          </motion.div>
          <div className="space-y-4">
            {faqs.map((f, i) => (
              <div
                key={i}
                className="bg-white/80 gold-border relative rounded-2xl overflow-hidden shadow-glassSoft"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full text-left px-6 py-4 font-medium text-wedding-ink flex justify-between items-center hover:bg-white transition font-display"
                >
                  <span>{f.q}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-wedding-lilacDeep transition-transform ${openFaq === i ? "rotate-180" : ""}`}
                  />
                </button>
                <AnimatePresence>
                  {openFaq === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="px-6 text-sm text-wedding-inkSoft overflow-hidden"
                    >
                      <p className="pb-4">{f.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* RSVP */}
      <section
        id="rsvp"
        className="relative py-24 bg-wedding-lilac/30 px-6 overflow-hidden"
      >
        <BloomDrift count={4} />
        <motion.div
          {...fade}
          className="glass-sheen relative z-10 max-w-xl mx-auto bg-white/95 p-8 md:p-12 rounded-3xl gold-border shadow-glass"
        >
          <div className="text-center mb-8">
            <Blossom className="w-10 h-10 mx-auto mb-2" />
            <h2 className="text-3xl md:text-4xl text-wedding-ink mb-2">
              Be our guest
            </h2>
            {step !== "success_sent" && step !== "already_submitted" && (
              <p className="text-sm text-wedding-lilacDeep">
                Please RSVP by {RSVP_BY}
              </p>
            )}
          </div>

          {step === "verify_phone" && (
            <form onSubmit={handleVerifyPhone} className="space-y-5">
              <div className="bg-wedding-mist border border-wedding-lilac/40 p-4 rounded-2xl text-center">
                <Lock className="w-5 h-5 text-wedding-lilacDeep mx-auto mb-2" />
                <p className="text-xs text-wedding-inkSoft">
                  Enter your phone number to open your RSVP.
                </p>
              </div>
              <div>
                <label className="block text-xs text-wedding-inkSoft mb-2 font-medium">
                  Your phone number
                </label>
                <input
                  type="tel"
                  required
                  value={inputPhone}
                  onChange={(e) => setInputPhone(e.target.value)}
                  className={inputCls}
                  placeholder="e.g. 08012345678"
                />
              </div>
              <button type="submit" disabled={submitting} className={btnCls}>
                {submitting ? "Verifying..." : "Access invitation"}
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
              <div className="bg-wedding-mist p-4 rounded-2xl border border-wedding-lilac/40 text-center">
                <span className="text-sm text-wedding-lilacDeep block font-display italic mb-1">
                  Welcome,
                </span>
                <h3 className="font-display text-xl text-wedding-ink">
                  {guestRecord.name}
                </h3>
                <p className="text-xs text-wedding-inkSoft mt-1">
                  Your invitation covers up to {guestRecord.maxFamilySize}{" "}
                  guest(s) in total
                </p>
              </div>

              <div>
                <label className="block text-xs text-wedding-inkSoft mb-2 font-medium">
                  Will you attend?
                </label>
                <select
                  value={formData.attendance}
                  onChange={(e) => handleAttendanceChange(e.target.value)}
                  className={inputCls}
                >
                  <option value="Attending">Joyfully accept</option>
                  <option value="Declined">Regretfully decline</option>
                </select>
              </div>

              {/* Relationship: attending guests only */}
              {formData.attendance === "Attending" && (
                <div>
                  <label className="block text-xs text-wedding-inkSoft mb-2 font-medium">
                    How do you know the couple?
                  </label>
                  <select
                    required
                    value={formData.relationship}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        relationship: e.target.value,
                      })
                    }
                    className={inputCls}
                  >
                    <option value="" disabled>
                      Select one
                    </option>
                    {RELATIONSHIPS.map((r) => (
                      <option key={r.value} value={r.value}>
                        {r.label}
                      </option>
                    ))}
                  </select>
                  {formData.relationship === "Other" && (
                    <input
                      type="text"
                      maxLength={60}
                      value={formData.relationshipOther}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          relationshipOther: e.target.value,
                        })
                      }
                      className={`${inputCls} mt-3`}
                      placeholder="Tell us how you know us"
                    />
                  )}
                </div>
              )}

              {formData.attendance === "Attending" &&
                guestRecord.maxFamilySize > 1 && (
                  <div className="space-y-4 pt-2 border-t border-wedding-gold/30">
                    <div>
                      <label className="block text-xs text-wedding-inkSoft mb-2 font-medium">
                        Additional guests (max {maxAllowed})
                      </label>
                      <select
                        value={formData.additionalGuests.length}
                        onChange={(e) =>
                          handleAdditionalGuestCountChange(
                            parseInt(e.target.value),
                          )
                        }
                        className={inputCls}
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
                        <label className="block text-xs text-wedding-inkSoft font-medium">
                          Additional guest name(s)
                        </label>
                        {formData.additionalGuests.map((g, idx) => (
                          <input
                            key={idx}
                            type="text"
                            required
                            value={g}
                            onChange={(e) =>
                              handleAdditionalNameChange(idx, e.target.value)
                            }
                            className={inputCls}
                            placeholder={`Full name of guest ${idx + 1}`}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                )}

              <div>
                <label className="block text-xs text-wedding-inkSoft mb-2 font-medium">
                  Wishes for the couple
                </label>
                <textarea
                  rows="3"
                  value={formData.message}
                  onChange={(e) =>
                    setFormData({ ...formData, message: e.target.value })
                  }
                  className={`${inputCls} resize-none`}
                  placeholder="Leave a sweet note..."
                />
              </div>

              <button type="submit" disabled={submitting} className={btnCls}>
                {submitting ? "Sending..." : "Send RSVP"}
              </button>
              {errorMessage && (
                <div className="flex items-center gap-2 text-rose-600 bg-rose-500/10 p-3 rounded-xl text-sm justify-center">
                  <AlertCircle className="w-5 h-5" /> {errorMessage}
                </div>
              )}
            </form>
          )}

          {(step === "success_sent" || step === "already_submitted") && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="text-center py-8 space-y-4"
            >
              <Blossom className="w-14 h-14 mx-auto" />
              <h3 className="font-display text-2xl md:text-3xl text-wedding-ink">
                {step === "success_sent" ? "With gratitude" : "See you soon"}
              </h3>
              <p className="text-sm text-wedding-inkSoft leading-relaxed max-w-sm mx-auto">
                {step === "success_sent"
                  ? "Your RSVP has been received. We look forward to sharing our special day with you on December 12, 2026."
                  : "We have already received your RSVP for this invitation. Warmest regards from Franca & Abanum!"}
              </p>
            </motion.div>
          )}
        </motion.div>
      </section>

      {/* FOOTER */}
      <footer className="py-12 text-center text-xs text-wedding-inkSoft/70 border-t border-wedding-gold/30 bg-wedding-ivory">
        <BloomRow n={5} className="mb-3" />
        <p className="text-base text-wedding-ink font-display">
          Franca &amp; Abanum
        </p>
      </footer>
    </div>
  );
}
