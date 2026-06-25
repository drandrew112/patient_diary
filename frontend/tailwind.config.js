/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        night: "#08111f",
        panel: "#111827",
        panel2: "#1f2937",
        skysoft: "#7dd3fc",
        orangehot: "#fb923c"
      }
    }
  },
  plugins: [require("@tailwindcss/forms")]
};
