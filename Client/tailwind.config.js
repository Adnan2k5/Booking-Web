// tailwind.config.js

module.exports = {
    theme: {
      extend: {
        animation: {
          "move-circle-1": "moveCircle1 10s infinite ease-in-out",
          "move-circle-2": "moveCircle2 10s infinite ease-in-out",
        },
        keyframes: {
          moveCircle1: {
            "0%, 100%": { transform: "translate(0, 0) scale(1)" },
            "50%": { transform: "translate(-20%, -20%) scale(1.2)" },
          },
          moveCircle2: {
            "0%, 100%": { transform: "translate(0, 0) scale(1)" },
            "50%": { transform: "translate(20%, 20%) scale(1.2)" },
          },
        },
      },
    },
    plugins: [],
  };