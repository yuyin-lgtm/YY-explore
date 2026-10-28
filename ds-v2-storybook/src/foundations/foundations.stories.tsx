import type { Meta, StoryObj } from "@storybook/react-vite";
import { motion, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState, type RefObject } from "react";
import { motionTokens, reducedFade } from "../lib/motion";

const meta = {
  title: "Foundations",
  parameters: { layout: "fullscreen" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const groups = [
  {
    name: "Accent",
    items: [
      ["accent", "--accent", "#3559E9"],
      ["accent-strong", "--accent-strong", "#2547D0"],
      ["accent-pressed", "--accent-pressed", "#1F3BAD"],
      ["accent-subtle", "--accent-subtle", "#EBF1FF"],
      ["accent-border", "--accent-border", "#97BAFF"],
      ["accent-text", "--accent-text", "#2547D0"],
      ["accent-foreground", "--accent-foreground", "#FFFFFF"],
    ],
  },
  {
    name: "Neutrals",
    items: [
      ["foreground", "--foreground", "#27272A"],
      ["text-secondary", "--text-secondary", "#6B6B73"],
      ["text-muted", "--text-muted", "#767676"],
      ["border", "--border", "#E9E9E9"],
      ["border-subtle", "--border-subtle", "#F3F3F3"],
      ["border-strong", "--border-strong", "#C4C4C4"],
      ["background", "--background", "#FFFFFF"],
      ["surface-muted", "--surface-muted", "#F8F8F8"],
      ["disabled-bg", "--disabled-bg", "#F2F4F7"],
      ["disabled-fg", "--disabled-fg", "#98A2B3"],
    ],
  },
  {
    name: "Status",
    items: [
      ["success-fg", "--success-fg", "#067647"],
      ["success-bg", "--success-bg", "#ECFDF3"],
      ["success-border", "--success-border", "#ABEFC6"],
      ["warning-fg", "--warning-fg", "#B54708"],
      ["warning-bg", "--warning-bg", "#FFFAEB"],
      ["warning-border", "--warning-border", "#FEDF89"],
      ["error-fg", "--error-fg", "#B42318"],
      ["error-bg", "--error-bg", "#FEF3F2"],
      ["error-border", "--error-border", "#FECDCA"],
      ["danger", "--danger", "#D92D20"],
      ["info-fg", "--info-fg", "#2547D0"],
      ["info-bg", "--info-bg", "#EBF1FF"],
    ],
  },
] as const;

function Swatch({ name, variable, hex }: { name: string; variable: string; hex: string }) {
  return (
    <div className="overflow-hidden rounded-panel border border-border bg-raised shadow-resting">
      <div className="h-16 border-b border-border-subtle" style={{ background: `var(${variable})` }} />
      <div className="px-3 py-2">
        <p className="font-body-strong">{name}</p>
        <p className="font-caption">{variable}</p>
        <p className="font-caption">{hex}</p>
      </div>
    </div>
  );
}

export const Colors: Story = {
  render: () => (
    <div className="mx-auto flex max-w-[960px] flex-col gap-8 px-6 py-8">
      <header>
        <h1 className="font-title">Colors</h1>
        <p className="mt-1 font-subtitle">UI Arc neutrals with the Reacher accent. Hover is a 4% foreground tint and pressed is 6%.</p>
      </header>
      {groups.map((group) => (
        <section key={group.name}>
          <h2 className="font-heading">{group.name}</h2>
          <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {group.items.map(([name, variable, hex]) => (
              <Swatch key={variable} name={name} variable={variable} hex={hex} />
            ))}
          </div>
        </section>
      ))}
      <section className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-panel border border-border p-4">
          <div className="h-10 rounded-control bg-hover" />
          <p className="mt-2 font-body-strong">surface-hover</p>
          <p className="font-caption">foreground at 4%</p>
        </div>
        <div className="rounded-panel border border-border p-4">
          <div className="h-10 rounded-control bg-pressed" />
          <p className="mt-2 font-body-strong">surface-pressed</p>
          <p className="font-caption">foreground at 6%</p>
        </div>
      </section>
    </div>
  ),
};

export const Typography: Story = {
  name: "Typography",
  render: () => (
    <div className="mx-auto flex max-w-[720px] flex-col gap-6 px-6 py-8">
      <header>
        <h1 className="font-title">Typography</h1>
        <p className="mt-1 font-subtitle">Inter. Sizes 12, 14, 16, and 24. Weights 400, 500, and 600.</p>
      </header>
      {[
        ["title", "font-title text-foreground", "Sample requests"],
        ["heading", "font-heading text-foreground", "Top creators this week"],
        ["subtitle", "font-subtitle", "Approve or decline sample requests from creators."],
        ["body", "font-body text-foreground", "Everything else on the page uses body."],
        ["body-strong", "font-body-strong text-foreground", "@glowwithmaya"],
        ["caption", "font-caption", "Updated 5 min ago · Data from TikTok Shop"],
        ["caption-strong", "font-caption-strong text-foreground", "Badge, chip, small button"],
        ["label", "font-label", "Last 30 days"],
        ["number", "font-number text-foreground", "$128,406"],
      ].map(([name, className, sample]) => (
        <div key={name} className="border-b border-border-subtle pb-4">
          <p className="font-label">{name}</p>
          <p className={`mt-1 ${className}`}>{sample}</p>
        </div>
      ))}
    </div>
  ),
};

const steps = [
  ["none", "0"],
  ["tight", "4px"],
  ["condensed", "8px"],
  ["cozy", "12px"],
  ["normal", "16px"],
  ["spacious", "24px"],
];

export const Spacing: Story = {
  render: () => (
    <div className="mx-auto flex max-w-[720px] flex-col gap-6 px-6 py-8">
      <header>
        <h1 className="font-title">Spacing</h1>
        <p className="mt-1 font-subtitle">Page layout uses six steps. Nothing above 24. Phone spacious is 16.</p>
      </header>
      <ul className="flex flex-col gap-3">
        {steps.map(([name, size]) => (
          <li key={name} className="flex items-center gap-4">
            <span className="w-28 font-body-strong">{name}</span>
            <span className="h-4 rounded-pill bg-accent" style={{ width: size === "0" ? 2 : size }} />
            <span className="font-caption">{size}</span>
          </li>
        ))}
      </ul>
      <p className="font-caption">2, 6, 20, and 32 stay as component-internal primitives only. They are not page gaps.</p>
    </div>
  ),
};

export const RadiusAndShadow: Story = {
  name: "Radius and shadow",
  render: () => (
    <div className="mx-auto flex max-w-[960px] flex-col gap-8 px-6 py-8">
      <header>
        <h1 className="font-title">Radius and shadow</h1>
        <p className="mt-1 font-subtitle">Cards are 26. Metric tiles are 34. Buttons are pills. Menu rows stay 8.</p>
      </header>
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
        {[
          ["control 14", "var(--radius-control)", "var(--shadow-resting)"],
          ["item 12", "var(--radius-item)", "var(--shadow-resting)"],
          ["menu 8", "var(--radius-menu)", "var(--shadow-raised)"],
          ["panel 26", "var(--radius-panel)", "var(--shadow-raised)"],
          ["surface 34", "var(--radius-surface)", "var(--shadow-floating)"],
          ["pill", "var(--radius-pill)", "var(--shadow-resting)"],
        ].map(([name, radius, shadow]) => (
          <div key={name} className="flex h-28 items-end border border-border bg-raised p-3" style={{ borderRadius: radius, boxShadow: shadow }}>
            <span className="font-body-strong">{name}</span>
          </div>
        ))}
      </div>
    </div>
  ),
};

function useColumns(ref: RefObject<HTMLDivElement | null>) {
  const [mode, setMode] = useState({ name: "Desktop", columns: 12, gutter: 24, edge: 24 });
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const apply = (width: number) => {
      if (width < 768) setMode({ name: "Phone", columns: 4, gutter: 16, edge: 16 });
      else if (width < 1280) setMode({ name: "Tablet", columns: 8, gutter: 24, edge: 24 });
      else setMode({ name: "Desktop", columns: 12, gutter: 24, edge: 24 });
    };
    apply(node.clientWidth);
    const observer = new ResizeObserver(([entry]) => apply(entry.contentRect.width));
    observer.observe(node);
    return () => observer.disconnect();
  }, [ref]);
  return mode;
}

export const LayoutAndGrid: Story = {
  name: "Layout and grid",
  render: () => {
    const ref = useRef<HTMLDivElement>(null);
    const mode = useColumns(ref);
    return (
      <div className="px-6 py-8">
        <h1 className="font-title">Layout and grid</h1>
        <p className="mt-1 max-w-[640px] font-subtitle">Drag the frame. Phone is 4 columns, tablet 8, desktop 12. Content maxes out at 1440.</p>
        <div ref={ref} className="mt-6 resize overflow-auto rounded-panel border border-border bg-muted-surface p-4" style={{ width: "100%", maxWidth: 1440, minWidth: 280 }}>
          <p className="font-body-strong">
            {mode.name} · {mode.columns} columns · gutter {mode.gutter} · edge {mode.edge}
          </p>
          <div className="mt-3 grid" style={{ gridTemplateColumns: `repeat(${mode.columns}, minmax(0, 1fr))`, gap: mode.gutter }}>
            {Array.from({ length: mode.columns }, (_, index) => (
              <div key={index} className="flex h-16 items-center justify-center rounded-control bg-accent-subtle font-caption-strong text-accent-text">
                {index + 1}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  },
};

function MotionBox({ playKey }: { playKey: number }) {
  const reduce = useReducedMotion();
  const transition = reduce ? reducedFade : { duration: motionTokens.duration.standard, ease: motionTokens.ease.enter };
  return (
    <motion.div
      key={playKey}
      className="size-10 rounded-control bg-accent"
      initial={reduce ? { opacity: 0 } : { opacity: 0, x: 0 }}
      animate={reduce ? { opacity: 1 } : { opacity: 1, x: 120 }}
      transition={transition}
    />
  );
}

export const Motion: Story = {
  render: () => {
    const [playKey, setPlayKey] = useState(0);
    const reduce = useReducedMotion();
    const rows = [
      ["instant", motionTokens.duration.instant],
      ["fast", motionTokens.duration.fast],
      ["exit", motionTokens.duration.exit],
      ["standard", motionTokens.duration.standard],
      ["considered", motionTokens.duration.considered],
    ] as const;
    return (
      <div className="mx-auto flex max-w-[760px] flex-col gap-8 px-6 py-8">
        <header className="flex items-end justify-between gap-3">
          <div>
            <h1 className="font-title">Motion</h1>
            <p className="mt-1 font-subtitle">UI Arc durations, easings, and springs. Reduced motion fades in 150ms and out in 100ms, with no travel.</p>
          </div>
          <button type="button" className="h-control rounded-pill bg-accent px-3.5 font-body-strong text-accent-foreground" onClick={() => setPlayKey((value) => value + 1)}>
            Replay
          </button>
        </header>
        <section>
          <h2 className="font-heading">Durations</h2>
          <div className="mt-3 flex flex-col gap-3">
            {rows.map(([name, duration]) => (
              <div key={name} className="grid grid-cols-[120px_1fr] items-center gap-3">
                <span className="font-caption">{name} · {Math.round(duration * 1000)}ms</span>
                <div className="relative h-8 rounded-pill bg-muted-surface">
                  <motion.div
                    key={`${name}-${playKey}`}
                    className="absolute top-1 left-1 size-6 rounded-pill bg-accent"
                    initial={{ x: 0 }}
                    animate={{ x: reduce ? 0 : 180 }}
                    transition={reduce ? reducedFade : { duration, ease: motionTokens.ease.standard }}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>
        <section>
          <h2 className="font-heading">Easings</h2>
          <div className="mt-3 flex flex-col gap-3">
            {(["enter", "standard", "exit", "inOut"] as const).map((name) => (
              <div key={name} className="grid grid-cols-[120px_1fr] items-center gap-3">
                <span className="font-caption">{name}</span>
                <motion.div
                  key={`${name}-${playKey}`}
                  className="h-8 w-24 rounded-control bg-accent"
                  initial={{ x: 0 }}
                  animate={{ x: reduce ? 0 : 160 }}
                  transition={reduce ? reducedFade : { duration: motionTokens.duration.considered, ease: motionTokens.ease[name] }}
                />
              </div>
            ))}
          </div>
        </section>
        <section>
          <h2 className="font-heading">Springs</h2>
          <div className="mt-3 flex flex-wrap gap-6">
            {(["snappy", "smooth", "morph", "responsive", "gentle"] as const).map((name) => (
              <div key={name} className="w-28">
                <motion.div
                  key={`${name}-${playKey}`}
                  className="size-12 rounded-panel bg-accent"
                  initial={reduce ? { opacity: 0.4 } : { scale: 0.7, y: 12 }}
                  animate={reduce ? { opacity: 1 } : { scale: 1, y: 0 }}
                  transition={reduce ? reducedFade : motionTokens.spring[name]}
                />
                <p className="mt-2 font-caption">{name}</p>
              </div>
            ))}
          </div>
        </section>
        <section>
          <h2 className="font-heading">Stagger and blur</h2>
          <div className="mt-3 flex gap-2">
            {["One", "Two", "Three", "Four"].map((label, index) => (
              <motion.span
                key={`${label}-${playKey}`}
                className="inline-flex h-8 items-center rounded-pill bg-accent-subtle px-3 font-caption-strong text-accent-text"
                initial={reduce ? { opacity: 0 } : { opacity: 0, y: 8, filter: "blur(8px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={reduce ? reducedFade : { ...motionTokens.spring.smooth, delay: index * motionTokens.stagger.item }}
              >
                {label}
              </motion.span>
            ))}
          </div>
          <MotionBox playKey={playKey} />
        </section>
      </div>
    );
  },
};
