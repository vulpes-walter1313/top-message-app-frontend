/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,tsx,tsx}"],
  theme: {
    extend: {
      fontSize: {
        deskh1: ["3.375rem", { lineHeight: "115%", fontWeight: "700" }],
        deskh2: ["2.8125rem", { lineHeight: "115%", fontWeight: "700" }],
        deskh3: ["2.3125rem", { lineHeight: "115%", fontWeight: "700" }],
        deskh4: ["1.9375rem", { lineHeight: "115%", fontWeight: "700" }],
        deskh5: ["1.625rem", { lineHeight: "115%", fontWeight: "700" }],
        deskh6: ["1.375rem", { lineHeight: "115%", fontWeight: "700" }],
        deskp: ["1.125rem", { lineHeight: "145%", fontWeight: "400" }],
        desksmp: ["0.9375rem", { lineHeight: "145%", fontWeight: "400" }],
        deskxsp: ["0.8125rem", { lineHeight: "145%", fontWeight: "400" }],

        mobh1: ["2.5625rem", { lineHeight: "115%", fontWeight: "700" }],
        mobh2: ["2.25rem", { lineHeight: "115%", fontWeight: "700" }],
        mobh3: ["2rem", { lineHeight: "115%", fontWeight: "700" }],
        mobh4: ["1.75rem", { lineHeight: "115%", fontWeight: "700" }],
        mobh5: ["1.5625rem", { lineHeight: "115%", fontWeight: "700" }],
        mobh6: ["1.4375rem", { lineHeight: "115%", fontWeight: "700" }],
        mobp: ["1.25rem", { lineHeight: "145%", fontWeight: "400" }],
        mobsmp: ["1.125rem", { lineHeight: "145%", fontWeight: "400" }],
        mobxsp: ["1rem", { lineHeight: "145%", fontWeight: "400" }],
      },
    },
  },
  plugins: [],
};
