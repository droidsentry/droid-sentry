export const usageExperienceAnimations = {
  keyframes: {
    "pointer-move": {
      "0%": {
        opacity: "0",
        transform: "translate(400px, 400px)",
      },
      "70%": {
        opacity: "1",
        transform: "translate(0, 0)",
      },
      "90%, 100%": {
        opacity: "1",
        transform: "translateX(-138px)",
      },
    },
    "qrcode-show": {
      "0%": {
        top: "0",
        left: "0",
        opacity: "0",
        scale: "0",
      },
      "80%": {
        top: "0.5",
        left: "0.5",
        transform: "translate(-50%, -50%)",
        opacity: "1",
        scale: "1",
      },
      "100%": {
        top: "0.5",
        left: "0.5",
        transform: "translate(-50%, -50%)",
        opacity: "0",
        scale: "1",
      },
    },
    "phone-show": {
      "0%": {
        opacity: "0",
        transform: "translate(200px, -50%)",
      },
      "30%": {
        opacity: "1",
        transform: "translate(200px, -50%)",
      },
      "50% , 100%": {
        opacity: "1",
        transform: "translate(-50%, -50%)",
      },
    },
  },
  animation: {
    "pointer-move": "pointer-move 3s",
    "qrcode-show": "qrcode-show 1s forwards ease-out 3s",
    "phone-show": "phone-show 6s ease-out 2s",
  },
} as const;
