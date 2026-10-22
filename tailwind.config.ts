import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#222222",
        muted: "#575760",
        paper: "#f6f7f8",
        line: "#e6e6ea",
        brand: {
          yellow: "#F5ED3C",
          blue: "#1E73BE",
          blueDeep: "#155a96",
          navy: "#0D0059",
          black: "#111111",
        },
      },
      fontFamily: {
        sans: ["var(--font-montserrat)", "Montserrat", "sans-serif"],
        display: ["var(--font-barlow)", "Barlow Condensed", "sans-serif"],
      },
      boxShadow: {
        card: "0 18px 50px rgba(13, 0, 89, 0.08)",
        lift: "0 24px 60px rgba(13, 0, 89, 0.16)",
      },
      maxWidth: {
        page: "1120px",
      },
      keyframes: {
        rise: {
          "0%": { opacity: "0", transform: "translateY(18px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        drift: {
          "0%": { transform: "scale(1.08) translate3d(0, 0, 0)" },
          "100%": { transform: "scale(1.16) translate3d(-2%, -1%, 0)" },
        },
      },
      animation: {
        rise: "rise 0.7s ease both",
        drift: "drift 18s ease-in-out alternate infinite",
      },
    },
  },
  plugins: [],
};

export default config;
