/**
 * Partner logo fixtures for Storybook stories and reference layouts only —
 * never import these from library component code. `src/index.ts` doesn't
 * reach this module, so the trademarked images stay out of `dist/`
 * (`AvatarCompanies` deliberately bundles no partner logos).
 *
 * Exported from verita.ds' `avatar-companies` set (`node-id=5912-1676`,
 * 2026-09-22 revision): 400×400 PNGs with the glyph's padding built in,
 * sized for `AvatarCompanies`' shared 40px partner logo box — the same 40px
 * frame Figma now uses for every partner. Adjustments from the raw exports:
 * - `amazon.png`, `apple.png` — glyph re-centered on the canvas (Figma's
 *   exports sit ~1px low / ~1.4px high); size and proportions unchanged.
 * - `bank-of-america.png` — downscaled from Figma's 1200px export to the
 *   same 400px canvas; opaque white background, full-width flag mark.
 */
const partnerLogos = {
  google: new URL("./google.png", import.meta.url).href,
  amazon: new URL("./amazon.png", import.meta.url).href,
  apple: new URL("./apple.png", import.meta.url).href,
  bankOfAmerica: new URL("./bank-of-america.png", import.meta.url).href,
};

export { partnerLogos };
