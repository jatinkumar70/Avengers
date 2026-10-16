export type StoneId = "space" | "mind" | "reality" | "power" | "time" | "soul";

export const STONES: { id: StoneId; name: string; color: string; glow: string }[] = [
  { id: "space", name: "Space Stone", color: "#2f6bff", glow: "#8fb0ff" },
  { id: "mind", name: "Mind Stone", color: "#f5c518", glow: "#ffe58a" },
  { id: "reality", name: "Reality Stone", color: "#e8202a", glow: "#ff8a8f" },
  { id: "power", name: "Power Stone", color: "#8b3fff", glow: "#c9a6ff" },
  { id: "time", name: "Time Stone", color: "#14b36f", glow: "#7cf0bc" },
  { id: "soul", name: "Soul Stone", color: "#ff7a1a", glow: "#ffc08f" },
];
