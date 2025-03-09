/*
 * Copyright (c) 2019-2025 by xcube team and contributors
 * Permissions are hereby granted under the terms of the MIT License:
 * https://opensource.org/licenses/MIT.
 */

const choice1 = Array.from("aaaeeeeeiiioouuy");
const choice2 = Array.from(
  "bbbbccdddddfffffgggggghhhhhhjjjkkllllllmmnnnpqrrrssssttvwxyz",
);
const choice3 = [
  "ch",
  "st",
  "sh",
  "br",
  "dr",
  "fr",
  "gr",
  "kr",
  "pr",
  "tr",
  "wr",
  "tz",
];

const choices = [choice1, choice2, choice1, choice3];

function getRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function generateWord(length?: number): string {
  length = length || getRandomInt(1, 10);
  const n = choices.length;
  const i0 = getRandomInt(0, n - 1);
  return Array.from({ length })
    .map((_, i) => {
      const choice = choices[(i0 + i) % n];
      return choice[getRandomInt(0, choice.length - 1)];
    })
    .join("");
}

export function generateSentence(length?: number): string {
  length = length || getRandomInt(3, 10);
  const s =
    Array.from({ length })
      .map(() => generateWord())
      .join(" ") + ".";
  return s[0].toUpperCase() + s.slice(1);
}

export function generateParagraph(length?: number): string {
  length = length || getRandomInt(2, 5);
  return Array.from({ length })
    .map(() => generateSentence())
    .join(" ");
}

export function generateText(length?: number): string {
  length = length || getRandomInt(2, 5);
  return Array.from({ length })
    .map(() => generateParagraph())
    .join("\n");
}
