// tailwind.config.ts
export default {
  // Restrict content paths strictly inside project to avoid scanning outside (Windows EPERM issues)
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./app/**/**/*.{js,ts,jsx,tsx}",
    "./lib/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        arkhip: ["arkhip-font"],
      },
      animation: {
        aurora: "aurora 60s linear infinite",
      },
      keyframes: {
        aurora: {
          from: { "background-position": "50% 50%" },
          to: { "background-position": "150% 50%" },
        },
      },
    },
  },
  plugins: [],
};
