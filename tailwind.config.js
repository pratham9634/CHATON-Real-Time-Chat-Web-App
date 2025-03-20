const { default: daisyui } = require('daisyui');

/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: "class", // Enables manual dark mode switching
    theme: {
      extend: {},
    },
    plugins: [daisyui],
    daisyui:["light","black"],
  };
  