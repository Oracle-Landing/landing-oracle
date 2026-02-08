import { atom } from "nanostores";

export type Palette = "clarity" | "royal" | "nature";

const PALETTES: Palette[] = ["clarity", "royal", "nature"];
const STORAGE_KEY = "landing-oracle-palette";
const ROTATE_KEY = "landing-oracle-rotate";
const ROTATE_INTERVAL = 6000; // 6 seconds per palette

export const $palette = atom<Palette>("clarity");
export const $rotating = atom<boolean>(true);

let rotateTimer: ReturnType<typeof setInterval> | null = null;

export function initPalette(): void {
  const saved = localStorage.getItem(STORAGE_KEY) as Palette | null;
  const palette = saved && PALETTES.includes(saved) ? saved : "clarity";
  $palette.set(palette);
  applyPalette(palette);

  // Auto-rotate is on by default, off if user explicitly disabled
  const rotateOff = localStorage.getItem(ROTATE_KEY) === "off";
  if (!rotateOff) {
    startRotation();
  } else {
    $rotating.set(false);
  }
}

export function cyclePalette(): void {
  // Manual click stops auto-rotate
  stopRotation();
  localStorage.setItem(ROTATE_KEY, "off");
  $rotating.set(false);
  advance();
}

export function toggleRotation(): void {
  if ($rotating.get()) {
    stopRotation();
    localStorage.setItem(ROTATE_KEY, "off");
    $rotating.set(false);
  } else {
    startRotation();
    localStorage.removeItem(ROTATE_KEY);
    $rotating.set(true);
  }
}

function advance(): void {
  const current = $palette.get();
  const idx = PALETTES.indexOf(current);
  const next = PALETTES[(idx + 1) % PALETTES.length];
  $palette.set(next);
  localStorage.setItem(STORAGE_KEY, next);
  applyPalette(next);
}

function startRotation(): void {
  stopRotation();
  $rotating.set(true);
  rotateTimer = setInterval(advance, ROTATE_INTERVAL);
}

function stopRotation(): void {
  if (rotateTimer) {
    clearInterval(rotateTimer);
    rotateTimer = null;
  }
}

function applyPalette(palette: Palette): void {
  document.documentElement.setAttribute("data-palette", palette);
}
