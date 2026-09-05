/**
 * The way in.
 *
 * Console mode is an easter egg, so there is no button advertising it. The
 * Konami code is the right key for this particular door: it is the oldest
 * gamepad reference there is, and anyone who would enjoy the console already
 * knows it by heart.
 *
 * Matching ignores case and ignores anything typed in a field, so it cannot
 * fire while someone is filling in a form somewhere on a future version of
 * this page.
 */
const CODE = [
  "ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown",
  "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight",
  "b", "a",
];

export function watchKonami(onMatch: () => void): () => void {
  let at = 0;

  const onKey = (e: KeyboardEvent) => {
    const target = e.target as HTMLElement | null;
    if (target && /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName)) return;
    if (target?.isContentEditable) return;

    const want = CODE[at];
    const got = e.key.length === 1 ? e.key.toLowerCase() : e.key;

    if (got === want) {
      at += 1;
      if (at === CODE.length) {
        at = 0;
        onMatch();
      }
      return;
    }
    /* A wrong key restarts, but still counts if it is a valid first key —
       otherwise a stray press means starting the whole sequence over. */
    at = got === CODE[0] ? 1 : 0;
  };

  window.addEventListener("keydown", onKey);
  return () => window.removeEventListener("keydown", onKey);
}
