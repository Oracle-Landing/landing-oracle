import { atom } from "nanostores";

export type FilterMode = "live" | "all";

const STORAGE_KEY = "landing-oracle-filter";

export const $filter = atom<FilterMode>("live");

export function initFilter(): void {
  const saved = localStorage.getItem(STORAGE_KEY) as FilterMode | null;
  if (saved === "live" || saved === "all") {
    $filter.set(saved);
  }
}

export function setFilter(mode: FilterMode): void {
  $filter.set(mode);
  localStorage.setItem(STORAGE_KEY, mode);
}
