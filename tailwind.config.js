/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        wedding: {
          // Light, warm base — replaces the old near-black palette
          ivory: "#fbf6ec", // primary background
          ivoryDeep: "#f5ecd9", // slightly deeper variant for section rhythm
          blush: "#f3e6d8", // secondary section background
          parchment: "#efe1c9",

          // One deeper section for contrast beats — warm espresso, never near-black
          espresso: "#3e2b1c", // primary text on light sections
          espressoSoft: "#5c4530",
          dusk: "#4b3421", // deeper section background
          duskAlt: "#573d24",

          terracotta: "#c1703f",
          terracottaDeep: "#93502c",
          gold: "#c79a56",
          goldPale: "#e4c888",
          goldLine: "#c79a5666",
          sage: "#6e8062",
          sageDeep: "#4f5c46",

          // Glass surfaces (used with backdrop-blur)
          glass: "rgba(255,255,255,0.5)",
          glassBorder: "rgba(255,255,255,0.65)",
          glassDark: "rgba(255,255,255,0.08)",
          glassDarkBorder: "rgba(255,255,255,0.16)",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "serif"],
        body: ["var(--font-body)", "sans-serif"],
      },
      boxShadow: {
        glass: "0 8px 32px rgba(147, 80, 44, 0.14)",
        glassSoft: "0 4px 20px rgba(147, 80, 44, 0.08)",
        glassDark: "0 8px 32px rgba(0, 0, 0, 0.35)",
      },
      backgroundImage: {
        "gold-sheen":
          "linear-gradient(115deg, transparent 20%, rgba(255,255,255,0.55) 40%, rgba(255,255,255,0.1) 60%, transparent 80%)",
      },
    },
  },
  plugins: [],
};
