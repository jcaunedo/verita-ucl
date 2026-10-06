import * as React from "react";

/**
 * Docs-only blocks for the Foundations/Colors page. They read `theme.css` itself (passed in as raw text by the MDX
 * page), so every color token appears here as soon as it's added to the `@theme inline` block — nothing to keep in sync.
 */

interface ColorToken {
  /** Tailwind color name, e.g. `tone-brand` → `bg-tone-brand`, `text-tone-brand`, `border-tone-brand`. */
  name: string;
  /** The CSS value behind it, e.g. `var(--tone-brand)`. */
  value: string;
  /** The comment written just above the token in `theme.css`, if any. */
  description?: string;
}

interface ColorSection {
  title: string;
  tokens: ColorToken[];
}

/** The `--color-*` tokens of `theme.css`'s `@theme inline` block, grouped under its `/* ---------- Section ---------- *\/` headings. */
function parseColorSections(css: string): ColorSection[] {
  const start = css.indexOf("@theme inline {");
  if (start === -1) return [];
  const end = css.indexOf("\n}", start);
  const lines = css.slice(start, end).split("\n");

  const sections: ColorSection[] = [];
  let current: ColorSection | undefined;
  let pendingComment: string[] = [];
  let inComment = false;

  for (const raw of lines) {
    const line = raw.trim();
    const heading = line.match(/^\/\*\s*-{3,}\s*(.+?)\s*-{3,}\s*\*\/$/);
    if (heading) {
      current = { title: heading[1], tokens: [] };
      sections.push(current);
      pendingComment = [];
      continue;
    }
    if (line.startsWith("/*") || inComment) {
      inComment = !line.endsWith("*/");
      pendingComment.push(line.replace(/^\/\*\s?|\s?\*\/$/g, "").replace(/^\*\s?/, ""));
      continue;
    }
    const declaration = line.match(/^--color-([\w-]+):\s*(.+?);$/);
    if (declaration && current) {
      const description = pendingComment.join(" ").replace(/\s+/g, " ").trim();
      current.tokens.push({ name: declaration[1], value: declaration[2], description: description || undefined });
    }
    if (line && !line.startsWith("/*")) pendingComment = [];
  }
  return sections.filter((section) => section.tokens.length > 0);
}

/** `rgb(34, 42, 52)` / `rgba(34, 42, 52, 0.18)` → `#222a34` / `#222a34 · 18%`. Other formats are shown as given. */
function toHex(color: string) {
  const match = color.match(/rgba?\(\s*(\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\s*\)/);
  if (!match) return color;
  const hex = `#${[match[1], match[2], match[3]].map((n) => Number(n).toString(16).padStart(2, "0")).join("")}`;
  const alpha = match[4] === undefined ? 1 : Number(match[4]);
  return alpha < 1 ? `${hex} · ${Math.round(alpha * 100)}%` : hex;
}

/** Renders `backticked` names in a comment as inline code. */
function Description({ text }: { text: string }) {
  return (
    <div className="mt-1 text-xs text-foreground-muted">
      {text.split(/`([^`]+)`/).map((part, index) =>
        index % 2 ? (
          <code key={index} className="font-mono text-foreground">
            {part}
          </code>
        ) : (
          part
        ),
      )}
    </div>
  );
}

/** A swatch that measures its own rendered color, so the hex shown is what the token resolves to right now. */
function useResolvedColor(value: string) {
  const ref = React.useRef<HTMLDivElement>(null);
  const [resolved, setResolved] = React.useState("");
  React.useEffect(() => {
    if (ref.current) setResolved(toHex(getComputedStyle(ref.current).backgroundColor));
  }, [value]);
  return [ref, resolved] as const;
}

function Swatch({ token }: { token: ColorToken }) {
  const [ref, resolved] = useResolvedColor(token.value);
  return (
    <div className="flex items-start gap-3">
      <div ref={ref} className="size-12 shrink-0 rounded-md border border-border" style={{ background: token.value }} />
      <div className="min-w-0">
        <div className="font-mono text-sm font-medium text-foreground">{token.name}</div>
        <div className="font-mono text-xs text-foreground-muted">{resolved}</div>
        {token.description && <Description text={token.description} />}
      </div>
    </div>
  );
}

function RampStep({ token, step }: { token: ColorToken; step: string }) {
  const [ref, resolved] = useResolvedColor(token.value);
  return (
    <div className="min-w-0 flex-1 text-center">
      <div ref={ref} className="h-10 rounded-sm border border-border" style={{ background: token.value }} />
      <div className="mt-1 font-mono text-xs text-foreground">{step}</div>
      <div className="font-mono text-[10px] text-foreground-muted">{resolved}</div>
    </div>
  );
}

/** Tokens named `<family>-<step>` (e.g. `rosewood-50`) drawn as one horizontal ramp per family. */
function Ramps({ tokens }: { tokens: ColorToken[] }) {
  const families = new Map<string, { step: string; token: ColorToken }[]>();
  for (const token of tokens) {
    const match = token.name.match(/^(.*)-(\d+)$/);
    if (!match) continue;
    families.set(match[1], [...(families.get(match[1]) ?? []), { step: match[2], token }]);
  }
  return (
    <div className="flex flex-col gap-5">
      {[...families].map(([family, steps]) => (
        <div key={family}>
          <div className="mb-2 font-mono text-sm font-medium text-foreground">{family}</div>
          <div className="flex gap-1">
            {steps.map(({ step, token }) => (
              <RampStep key={token.name} token={token} step={step} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

/** Every color section of `theme.css`, in file order. Sections whose tokens are numbered steps render as ramps. */
function ColorTokens({ css }: { css: string }) {
  const sections = parseColorSections(css);
  return (
    <div className="sb-unstyled flex flex-col gap-10">
      {sections.map((section) => {
        const isRamp = section.tokens.every((token) => /-\d+$/.test(token.name));
        // "Tone roles (color/tone/*, Badge's 12-tone axis)" → title "Tone roles", note "color/tone/*, Badge's 12-tone axis".
        const [, title, note] = section.title.match(/^(.*?)(?:\s*\((.*)\))?$/) ?? [];
        return (
          <section key={section.title}>
            <h3 className="text-lg font-semibold text-foreground">{title}</h3>
            {note && <div className="font-mono text-xs text-foreground-muted">{note}</div>}
            <div className="mb-4" />
            {isRamp ? (
              <Ramps tokens={section.tokens} />
            ) : (
              <div className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2 lg:grid-cols-3">
                {section.tokens.map((token) => (
                  <Swatch key={token.name} token={token} />
                ))}
              </div>
            )}
          </section>
        );
      })}
    </div>
  );
}

export { ColorTokens };
