"use client";

import { useEffect } from "react";

const names = ["Roobert TRIAL", "Roobert-TRIAL"];

// checks if Roobert is installed by measuring some text with and without it
function hasRoobert() {
  const ctx = document.createElement("canvas").getContext("2d");
  if (!ctx) return false;
  const text = "Sophisticated skincare";
  ctx.font = "72px monospace";
  const fallback = ctx.measureText(text).width;
  return names.some((name) => {
    ctx.font = `72px "${name}", monospace`;
    return ctx.measureText(text).width !== fallback;
  });
}

// Roobert needs slightly tighter letter spacing than Geist to match the design,
// so the html tag gets a class that globals.css uses to tighten the text
export default function FontCheck() {
  useEffect(() => {
    if (hasRoobert()) {
      document.documentElement.classList.add("roobert");
    }
  }, []);

  return null;
}
