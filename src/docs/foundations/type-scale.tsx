import * as React from "react";

import { typographyVariants } from "@/components/typography";

/**
 * Docs-only blocks for the Foundations/Typography page. Sizes and weights come from `theme.css` (passed in as raw text
 * by the MDX page); whether `Typography` accepts each one is checked against `typographyVariants` itself.
 */

/** `name: value` pairs for every `--<prefix>-*` declaration in `css`, e.g. `text-sm` → `0.875rem`. */
function readTokens(css: string, prefix: string) {
  const tokens = new Map<string, string>();
  for (const match of css.matchAll(new RegExp(`--${prefix}-([\\w-]+):\\s*([^;]+);`, "g"))) {
    tokens.set(match[1], match[2].trim());
  }
  return tokens;
}

const toPx = (rem: string) => (rem.endsWith("rem") ? `${parseFloat(rem) * 16}px` : rem);

/** Whether `typographyVariants` has this value for the axis: an unknown value adds no class. */
function isTypographyValue(axis: "size" | "weight", value: string, expectedClass: string) {
  const classes = typographyVariants({ [axis]: value } as Parameters<typeof typographyVariants>[0]).split(" ");
  return classes.includes(expectedClass);
}

function Available({ yes }: { yes: boolean }) {
  return yes ? (
    <span className="text-tone-success">Yes</span>
  ) : (
    <span className="text-foreground-muted">
      Not in <code>Typography</code>
    </span>
  );
}

const cell = "border-b border-border py-3 pr-4 align-middle";

/** One row per `--text-*` size: its token, px size / line height, whether `Typography`'s `size` accepts it, and a sample. */
function TypeScale({ css }: { css: string }) {
  const text = readTokens(css, "text");
  const sizes = [...text].filter(([name]) => !name.includes("--"));
  return (
    <table className="sb-unstyled w-full border-collapse text-left text-sm" style={{ tableLayout: "fixed" }}>
      <colgroup>
        <col style={{ width: 80 }} />
        <col style={{ width: 176 }} />
        <col style={{ width: 176 }} />
        <col />
      </colgroup>
      <thead>
        <tr className="text-xs text-foreground-muted">
          <th className={cell}>Size</th>
          <th className={cell}>Font size / line height</th>
          <th className={cell}>
            <code>Typography</code> size
          </th>
          <th className={cell}>Sample</th>
        </tr>
      </thead>
      <tbody>
        {sizes.map(([name, size]) => (
          <tr key={name}>
            <td className={`${cell} font-mono`}>{name}</td>
            <td className={`${cell} font-mono whitespace-nowrap text-foreground-muted`}>
              {toPx(size)} / {toPx(text.get(`${name}--line-height`) ?? "")}
            </td>
            <td className={cell}>
              <Available yes={isTypographyValue("size", name, `text-${name}`)} />
            </td>
            <td className={`${cell} text-foreground`}>
              <span
                className="block truncate"
                // The `--text-*` tokens live in `@theme inline`, so they aren't runtime CSS variables; use the values read from the file.
                style={{ fontSize: size, lineHeight: text.get(`${name}--line-height`) }}
              >
                Verita connects experts
              </span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

/** One row per `--font-weight-*` token, with whether `Typography`'s `weight` accepts it. */
function FontWeights({ css }: { css: string }) {
  const weights = readTokens(css, "font-weight");
  return (
    <table className="sb-unstyled w-full border-collapse text-left text-sm">
      <thead>
        <tr className="text-xs text-foreground-muted">
          <th className={cell}>Weight</th>
          <th className={cell}>Value</th>
          <th className={cell}>
            <code>Typography</code> weight
          </th>
          <th className={cell}>Sample</th>
        </tr>
      </thead>
      <tbody>
        {[...weights].map(([name, value]) => {
          // `regular` maps to Tailwind's `font-normal`; every other weight keeps its name.
          const utility = name === "regular" ? "font-normal" : `font-${name}`;
          return (
            <tr key={name}>
              <td className={`${cell} font-mono`}>{name}</td>
              <td className={`${cell} font-mono text-foreground-muted`}>{value}</td>
              <td className={cell}>
                <Available yes={isTypographyValue("weight", name, utility)} />
              </td>
              <td className={`${cell} text-base text-foreground`} style={{ fontWeight: Number(value) }}>
                Verita connects experts
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

/** The font stack from `--font-sans`, e.g. `"Inter", ui-sans-serif, …`. */
function FontFamily({ css }: { css: string }) {
  const stack = css.match(/--font-sans:\s*([^;]+);/)?.[1] ?? "";
  return <code>{stack}</code>;
}

export { TypeScale, FontWeights, FontFamily };
