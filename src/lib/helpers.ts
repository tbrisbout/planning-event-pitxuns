import type { Spot } from "./types";

const toKebabCase = (input: string): string =>
  input.toLowerCase().trim().replace(/\s/g, "-");

const range = (from: number, to: number): ReadonlyArray<number> =>
  Array.from({ length: to - from + 1 }, (_, i) => from + i);

const NON_SPOT_COLUMNS = ["email", "commentaires"];
const spotPattern = /^(.+)\s+\(min (\d+) pers\)(?:\s+Référent\s+)?(.*)?/i;

const DEFAULT_HOURS = [14, 15, 16, 17, 18, 19, 20, 21];

// TODO update sheet column names to store this
const SPOT_SPECIFIC_HOURS: Record<string, { start: number; end: number }> = {
  "Mise en place": { start: 14, end: 16 },
  "Securité": { start: 16, end: 21 },
  Caisse: { start: 16, end: 21 },
  "Stand Bar": { start: 16, end: 21 },
  "Stand Talo": { start: 16, end: 20 },
  DJ: { start: 16, end: 21 },
  "Stand Barbapapa": { start: 16, end: 20 },
  "Stand Maquillage": { start: 16, end: 19 },
  Rangement: { start: 20, end: 21 },
};

export const parseSpot = (spot: string): Spot => {
  const isSpot = !NON_SPOT_COLUMNS.includes(spot.toLowerCase());
  const matches = spot.match(spotPattern);

  const name = matches?.[1] ?? spot;
  const minPersons = parseInt(matches?.[2] ?? "0", 10);
  const owner = matches?.[3];
  const hash = toKebabCase(name);

  const { start, end } = SPOT_SPECIFIC_HOURS[name] ?? {};
  const hours = start ? range(start, end) : DEFAULT_HOURS;

  return { isSpot, originalName: spot, name, minPersons, owner, hash, hours };
};

export const pluralize = (input: string, len = 0) =>
  len > 1 ? `${input}s` : input;

export const toTitleCase = (input: string): string =>
  input
    .split(/\s/)
    .map((s) => s.substring(0, 1).toUpperCase() + s.substring(1).toLowerCase())
    .join(" ");
