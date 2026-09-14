export const COLOR_OPTIONS = [
  { name: "Black", hex: "#000000" },
  { name: "Red", hex: "#c1483f" },
  { name: "Green", hex: "#5b6b45" },
  { name: "Yellow", hex: "#e3c14b" },
  { name: "Dark Blue", hex: "#233752" },
  { name: "Purple", hex: "#7a5a9e" },
  { name: "Pink", hex: "#e2a2b5" },
  { name: "Light Blue", hex: "#8fb4cf" },
  { name: "Orange", hex: "#c97a3d" },
  { name: "White", hex: "#ffffff" },
];

export const colorHex = (name) =>
  COLOR_OPTIONS.find((c) => c.name === name)?.hex || "#ccc";